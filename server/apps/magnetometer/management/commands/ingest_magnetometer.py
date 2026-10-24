import datetime
import re
from pathlib import Path

from django.core.files import File
from django.core.management.base import BaseCommand

from apps.magnetometer.models import MagnetometerImport
from apps.magnetometer.services import ingest_import

FNAME_RE = re.compile(r"MagData_(\d{1,2})_([A-Za-z]{3})_(\d{4})\.dat$")
MONTHS = {m: i + 1 for i, m in enumerate(
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
)}


class Command(BaseCommand):
    help = "Ingest MagData_DD_Mon_YYYY.dat file(s) into the magnetometer archive."

    def add_arguments(self, parser):
        parser.add_argument("paths", nargs="+", help="Path(s) to MagData_*.dat files")

    def handle(self, *args, **options):
        for path_str in options["paths"]:
            path = Path(path_str)
            match = FNAME_RE.search(path.name)
            if not match:
                self.stderr.write(f"skip {path.name}: expected MagData_DD_Mon_YYYY.dat")
                continue
            day, mon_abbr, year = match.groups()
            month = MONTHS.get(mon_abbr)
            if month is None:
                self.stderr.write(f"skip {path.name}: unrecognized month '{mon_abbr}'")
                continue
            file_date = datetime.date(int(year), month, int(day))

            import_obj, created = MagnetometerImport.objects.get_or_create(file_date=file_date)
            if not created and import_obj.row_count:
                self.stdout.write(f"skip {path.name}: already ingested ({import_obj.row_count} rows)")
                continue

            with open(path, "rb") as fh:
                import_obj.file.save(path.name, File(fh), save=True)

            ingest_import(import_obj)
            self.stdout.write(self.style.SUCCESS(
                f"{path.name}: {import_obj.row_count} rows ingested, {import_obj.skipped_row_count} skipped"
            ))
