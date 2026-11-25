"""Automatic uploads from the station's Raspberry Pi.

The logger appends to MagData_DD_Mon_YYYY.dat all day and starts a new
file after midnight. The Pi (see station/cespar_uploader.py in the repo
root) asks for the manifest - which days the archive has and how big the
copy it loaded was - and sends only files that are new or have grown, so
nothing is loaded twice. Re-loading a grown file only adds the new
readings (ingest_import skips timestamps already stored).
"""
import datetime
import hmac
import re

from django.conf import settings
from django.core.files.base import ContentFile
from rest_framework import permissions, status
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.magnetometer.models import MagnetometerImport
from apps.magnetometer.services import ingest_import

FNAME_RE = re.compile(r"^MagData_(\d{1,2})_([A-Za-z]{3})_(\d{4})\.dat$")
MONTHS = {m: i + 1 for i, m in enumerate(
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
)}
MAX_UPLOAD_BYTES = 20 * 1024 * 1024


def date_from_station_filename(name):
    match = FNAME_RE.match(name or "")
    if not match:
        return None
    day, mon, year = match.groups()
    month = MONTHS.get(mon.title())
    try:
        return datetime.date(int(year), month, int(day)) if month else None
    except ValueError:
        return None


class IsStation(permissions.BasePermission):
    def has_permission(self, request, view):
        expected = settings.STATION_UPLOAD_TOKEN
        given = request.headers.get("X-Station-Token", "")
        return bool(expected) and hmac.compare_digest(given.encode(), expected.encode())


class StationManifestView(APIView):
    """GET /api/magnetometer/station/manifest -> {"days": {"2026-11-25": bytes}}"""

    authentication_classes = []
    permission_classes = [IsStation]

    def get(self, request):
        days = {
            d.isoformat(): size
            for d, size in MagnetometerImport.objects.filter(row_count__gt=0).values_list("file_date", "source_bytes")
        }
        return Response({"days": days})


class StationUploadView(APIView):
    """POST /api/magnetometer/station/upload (multipart "file")."""

    authentication_classes = []
    permission_classes = [IsStation]
    parser_classes = [MultiPartParser]

    def post(self, request):
        upload = request.FILES.get("file")
        if not upload:
            return Response({"detail": "Send the .dat file as 'file'."}, status=status.HTTP_400_BAD_REQUEST)
        file_date = date_from_station_filename(upload.name)
        if not file_date:
            return Response({"detail": "Expected a MagData_DD_Mon_YYYY.dat file name."},
                            status=status.HTTP_400_BAD_REQUEST)
        if upload.size > MAX_UPLOAD_BYTES:
            return Response({"detail": "File too large."}, status=status.HTTP_400_BAD_REQUEST)

        import_obj, _ = MagnetometerImport.objects.get_or_create(file_date=file_date)
        if import_obj.row_count and upload.size <= import_obj.source_bytes:
            return Response({"status": "already_uploaded", "date": file_date.isoformat(),
                             "readings": import_obj.row_count})

        before = import_obj.readings.count()
        if import_obj.file:
            import_obj.file.delete(save=False)
        import_obj.file.save(upload.name, ContentFile(upload.read()), save=False)
        import_obj.source_bytes = upload.size
        import_obj.save()
        ingest_import(import_obj)
        added = import_obj.readings.count() - before
        return Response({"status": "loaded", "date": file_date.isoformat(), "readings": import_obj.row_count,
                         "new_readings": added, "skipped_lines": import_obj.skipped_row_count},
                        status=status.HTTP_201_CREATED)
