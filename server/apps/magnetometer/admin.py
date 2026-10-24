from django.contrib import admin

from apps.magnetometer.models import MagnetometerImport
from apps.magnetometer.services import ingest_import


@admin.register(MagnetometerImport)
class MagnetometerImportAdmin(admin.ModelAdmin):
    """Upload a MagData_*.dat file here, set its file_date, then run the
    'Parse selected file(s) into readings' action. MagnetometerReading
    itself isn't registered — it holds millions of rows and the admin
    change list isn't built for that; use the API or a DB console instead."""

    list_display = ["file_date", "row_count", "skipped_row_count", "parsed_at", "created_at"]
    ordering = ["-file_date"]
    readonly_fields = ["row_count", "skipped_row_count", "parsed_at"]
    actions = ["parse_selected"]

    @admin.action(description="Parse selected file(s) into readings")
    def parse_selected(self, request, queryset):
        count = 0
        for import_obj in queryset:
            ingest_import(import_obj)
            count += 1
        self.message_user(request, f"Parsed {count} file(s).")
