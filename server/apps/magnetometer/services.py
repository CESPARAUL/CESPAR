from django.utils import timezone as dj_timezone

from apps.magnetometer.models import MagnetometerReading
from apps.magnetometer.parser import parse_dat_file


def ingest_import(import_obj):
    """Parse an already-saved MagnetometerImport's file and bulk-load its
    readings. Safe to re-run: existing timestamps are skipped, not
    duplicated, so re-parsing after a bug fix just fills in new rows."""
    import_obj.file.open("rb")
    try:
        parsed = parse_dat_file(import_obj.file)
    finally:
        import_obj.file.close()

    readings = [MagnetometerReading(source=import_obj, **row) for row in parsed.rows]
    MagnetometerReading.objects.bulk_create(readings, ignore_conflicts=True, batch_size=2000)

    import_obj.row_count = len(parsed.rows)
    import_obj.skipped_row_count = parsed.skipped
    import_obj.parsed_at = dj_timezone.now()
    import_obj.save(update_fields=["row_count", "skipped_row_count", "parsed_at"])
    return import_obj
