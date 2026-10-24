from django.core.validators import FileExtensionValidator
from django.db import models

from apps.core.models import TimeStampedModel, UUIDModel


class MagnetometerImport(UUIDModel, TimeStampedModel):
    """One ingested MagData_DD_Mon_YYYY.dat file — the raw daily export
    is kept here so readings can be re-parsed later if a parsing bug is
    found, without depending on the station's Google Drive folder."""

    file = models.FileField(
        upload_to="magnetometer/raw/",
        validators=[FileExtensionValidator(allowed_extensions=["dat"])],
    )
    file_date = models.DateField(unique=True)
    row_count = models.PositiveIntegerField(default=0)
    skipped_row_count = models.PositiveIntegerField(default=0)
    parsed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-file_date"]

    def __str__(self):
        return f"MagData {self.file_date} ({self.row_count} rows)"


class MagnetometerReading(models.Model):
    """Single sample from the CESPAR magnetometer, corrected on ingest:
    X/Y swapped back (the logger writes them swapped) and timestamp
    shifted +5h to UTC (the logger clock isn't corrected at the source).

    Uses a plain BigAutoField PK rather than this project's usual UUID
    convention — this table holds millions of time-series rows and is
    never addressed by individual row ID, so a UUID index would only add
    overhead with no benefit.
    """

    timestamp = models.DateTimeField(unique=True, db_index=True)
    x = models.FloatField()
    y = models.FloatField()
    z = models.FloatField()
    f = models.FloatField()
    source = models.ForeignKey(MagnetometerImport, on_delete=models.CASCADE, related_name="readings")

    class Meta:
        ordering = ["timestamp"]

    def __str__(self):
        return f"{self.timestamp.isoformat()} F={self.f:.1f}"
