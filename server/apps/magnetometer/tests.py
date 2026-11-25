import tempfile
from datetime import date

from django.core import mail
from django.core.files.base import ContentFile
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.data_requests.models import DataRequest
from apps.datasets.models import Dataset
from apps.magnetometer.models import MagnetometerImport, MagnetometerReading
from apps.magnetometer.services import ingest_import

# Three real lines in the station's MagData_*.dat format (logger time,
# X/Y swapped) - 00:00 logger time is 05:00 UTC.
DAT = (
    "2026 3 3 0 0 7 54924.32358 16658.80762 16571.52914 59739.99532 -50.00000\n"
    "2026 3 3 0 0 15 55051.05672 16800.60526 16727.67393 59939.11310 -50.00000\n"
    "2026 3 3 0 1 23 55087.88106 16836.23401 16774.30215 59995.93033 -50.00000\n"
    "not a reading\n"
)


@override_settings(RESEND_API_KEY="", EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
                   FRONTEND_BASE_URL="https://cespar.space", MEDIA_ROOT=tempfile.mkdtemp())
class MagnetometerRequestFlowTests(TestCase):
    """Request -> pending (no data) -> admin approves -> requester gets the
    charts, the day list and the CSV, and an email pointing at them."""

    def setUp(self):
        self.dataset = Dataset.objects.create(
            slug="magnetometer-data", title="Magnetometer Data", category=Dataset.Category.MAGNETOMETER,
            description="Field data", coverage="AUL station", format="CSV")
        self.researcher = User.objects.create_user(email="ada@example.com", password="x", name="Ada")
        self.admin = User.objects.create_user(email="lead@example.com", password="x", name="Lead", role=User.Role.ADMIN)
        imp = MagnetometerImport(file_date=date(2026, 3, 3))
        imp.file.save("MagData_03_Mar_2026.dat", ContentFile(DAT.encode()), save=True)
        ingest_import(imp)
        self.client = APIClient()

    def as_user(self, user):
        self.client.force_authenticate(user)
        return self.client

    def test_parse_applies_the_station_corrections(self):
        first = MagnetometerReading.objects.order_by("timestamp").first()
        self.assertEqual(first.timestamp.isoformat(), "2026-03-03T05:00:07+00:00")  # +5h to UTC
        self.assertAlmostEqual(first.x, 16658.80762)  # X/Y swapped back
        self.assertAlmostEqual(first.y, 54924.32358)
        self.assertEqual(MagnetometerImport.objects.get().skipped_row_count, 1)

    def test_request_approve_view_download(self):
        client = self.as_user(self.researcher)
        res = client.post("/api/requests", {"datasetId": str(self.dataset.id), "purpose": "Studying storm onsets over Lagos."}, format="json")
        self.assertEqual(res.status_code, 201, res.data)
        request_id = res.data["request"]["id"]

        # Pending: the day list and a coarse preview are visible; full data isn't.
        preview = client.get("/api/magnetometer/preview").data
        self.assertEqual(preview["day"], "2026-03-03")
        self.assertEqual(preview["count"], 1)  # both minutes fall in one 10-minute bin
        status = client.get("/api/magnetometer/status").data
        self.assertEqual([d["date"] for d in status["days"]], ["2026-03-03"])
        self.assertEqual(client.get("/api/magnetometer/latest").status_code, 403)
        self.assertEqual(client.get("/api/magnetometer/download?from=2026-03-03&to=2026-03-03").status_code, 403)

        # Researchers can't approve themselves.
        self.assertEqual(client.patch(f"/api/requests/{request_id}", {"status": "APPROVED"}, format="json").status_code, 403)

        mail.outbox.clear()
        res = self.as_user(self.admin).patch(f"/api/requests/{request_id}", {"status": "APPROVED"}, format="json")
        self.assertEqual(res.status_code, 200, res.data)
        self.assertIn("view the charts", res.data["request"]["admin_note"])
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn("https://cespar.space/magnetometer", mail.outbox[0].alternatives[0][0])

        client = self.as_user(self.researcher)
        chart = client.get("/api/magnetometer/latest").data  # defaults to the latest station day
        self.assertEqual(chart["day"], "2026-03-03")
        self.assertEqual(chart["count"], 2)  # 2 one-minute bins
        csv = b"".join(client.get("/api/magnetometer/download?from=2026-03-03&to=2026-03-03").streaming_content).decode()
        self.assertEqual(csv.splitlines()[0], "timestamp_utc,x_nt,y_nt,z_nt,f_nt")
        self.assertEqual(len(csv.splitlines()), 4)
        self.assertEqual(client.get("/api/magnetometer/latest?day=2020-01-01").status_code, 404)

    def test_no_preview_without_a_request(self):
        self.assertEqual(self.as_user(self.researcher).get("/api/magnetometer/preview").status_code, 403)

    def test_hours_window_ends_at_the_latest_reading_not_now(self):
        data = self.as_user(self.admin).get("/api/magnetometer/latest?hours=24").data
        self.assertEqual(data["count"], 2)

    def test_approved_user_can_preview_a_range_at_each_resolution(self):
        client = self.as_user(self.admin)
        minute = client.get("/api/magnetometer/latest?from=2026-03-03&to=2026-03-03&resolution=minute")
        hour = client.get("/api/magnetometer/latest?from=2026-03-03&to=2026-03-03&resolution=hour")
        day = client.get("/api/magnetometer/latest?from=2026-03-03&to=2026-03-03&resolution=day")
        self.assertEqual(minute.status_code, 200)
        self.assertEqual(minute.data["count"], 2)
        self.assertEqual(hour.data["count"], 1)
        self.assertEqual(day.data["count"], 1)
        self.assertEqual(day.data["resolution"], "day")

    def test_approving_on_the_django_admin_change_page_emails_the_requester(self):
        req = DataRequest.objects.create(user=self.researcher, dataset=self.dataset, purpose="Storm study for my thesis.")
        self.admin.is_staff = self.admin.is_superuser = True
        self.admin.save()
        from django.test import Client
        web = Client()
        web.force_login(self.admin)
        mail.outbox.clear()
        url = f"/admin/data_requests/datarequest/{req.pk}/change/"
        page = web.get(url)
        self.assertEqual(page.status_code, 200)
        form = page.context["adminform"].form
        data = {k: (v.pk if hasattr(v, "pk") else v) for k, v in form.initial.items() if v is not None}
        data.update({"status": "APPROVED", "purpose": req.purpose, "user": str(req.user_id), "dataset": str(req.dataset_id)})
        res = web.post(url, data)
        self.assertEqual(res.status_code, 302, res.content[:600])
        req.refresh_from_db()
        self.assertEqual(req.status, "APPROVED")
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, ["ada@example.com"])
        web.post(url, {**data, "admin_note": req.admin_note})  # saving again doesn't re-send
        self.assertEqual(len(mail.outbox), 1)

    def test_admin_upload_reads_the_date_and_loads_readings(self):
        from django.core.files.uploadedfile import SimpleUploadedFile
        from django.test import Client
        self.admin.is_staff = self.admin.is_superuser = True
        self.admin.save()
        web = Client()
        web.force_login(self.admin)
        body = DAT.replace("2026 3 3", "2025 3 1").encode()
        res = web.post("/admin/magnetometer/magnetometerimport/add/",
                       {"file": SimpleUploadedFile("MagData_01_Mar_2025.dat", body), "file_date": ""})
        self.assertEqual(res.status_code, 302)
        imp = MagnetometerImport.objects.get(file_date=date(2025, 3, 1))
        self.assertEqual(imp.row_count, 3)
        res = web.post("/admin/magnetometer/magnetometerimport/add/",
                       {"file": SimpleUploadedFile("MagData_01_Mar_2025.dat", body), "file_date": ""})
        self.assertEqual(res.status_code, 200)  # same day twice is refused


@override_settings(STATION_UPLOAD_TOKEN="pi-secret", MEDIA_ROOT=tempfile.mkdtemp())
class StationUploadTests(TestCase):
    """The station Pi pushes its daily files; growing files top up, and
    the same copy twice changes nothing."""

    URL = "/api/magnetometer/station/upload"

    def send(self, body, name="MagData_03_Mar_2026.dat", token="pi-secret"):
        from django.core.files.uploadedfile import SimpleUploadedFile
        client = APIClient()
        headers = {"HTTP_X_STATION_TOKEN": token} if token else {}
        return client.post(self.URL, {"file": SimpleUploadedFile(name, body.encode())}, format="multipart", **headers)

    def test_wrong_or_missing_token_is_refused(self):
        self.assertEqual(self.send(DAT, token="nope").status_code, 403)
        self.assertEqual(self.send(DAT, token=None).status_code, 403)
        self.assertFalse(MagnetometerImport.objects.exists())

    @override_settings(STATION_UPLOAD_TOKEN="")
    def test_switched_off_without_a_token_configured(self):
        self.assertEqual(self.send(DAT, token="").status_code, 403)

    def test_partial_day_then_grown_file_then_duplicate(self):
        lines = DAT.splitlines(keepends=True)
        first = "".join(lines[:2])
        res = self.send(first)
        self.assertEqual(res.status_code, 201, res.data)
        self.assertEqual(res.data["new_readings"], 2)
        res = self.send(DAT)  # the logger kept writing
        self.assertEqual(res.status_code, 201, res.data)
        self.assertEqual(res.data["new_readings"], 1)
        self.assertEqual(MagnetometerReading.objects.count(), 3)
        res = self.send(DAT)  # same copy again
        self.assertEqual(res.data["status"], "already_uploaded")
        self.assertEqual(MagnetometerReading.objects.count(), 3)

    def test_manifest_lists_days_and_sizes(self):
        self.send(DAT)
        res = APIClient().get("/api/magnetometer/station/manifest", HTTP_X_STATION_TOKEN="pi-secret")
        self.assertEqual(res.data["days"], {"2026-03-03": len(DAT.encode())})

    def test_bad_file_name_is_refused(self):
        self.assertEqual(self.send(DAT, name="notes.dat").status_code, 400)
