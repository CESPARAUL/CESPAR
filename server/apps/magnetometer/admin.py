import datetime
import re

from django import forms
from django.contrib import admin

from apps.magnetometer.models import MagnetometerImport
from apps.magnetometer.services import ingest_import

FNAME_RE = re.compile(r"MagData_(\d{1,2})_([A-Za-z]{3})_(\d{4})")
MONTHS = {m: i + 1 for i, m in enumerate(
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
)}


def date_from_filename(name):
    match = FNAME_RE.search(name or "")
    if not match:
        return None
    day, mon, year = match.groups()
    month = MONTHS.get(mon.title())
    return datetime.date(int(year), month, int(day)) if month else None


class MagnetometerImportForm(forms.ModelForm):
    class Meta:
        model = MagnetometerImport
        fields = ["file", "file_date"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["file_date"].required = False
        self.fields["file_date"].help_text = "Leave blank to read it from the file name (MagData_DD_Mon_YYYY.dat)."

    def clean(self):
        data = super().clean()
        upload = data.get("file")
        if not data.get("file_date") and upload:
            data["file_date"] = date_from_filename(getattr(upload, "name", ""))
            if not data["file_date"]:
                raise forms.ValidationError("Couldn't read the date from the file name - enter the file date.")
        if data.get("file_date") and MagnetometerImport.objects.exclude(pk=self.instance.pk).filter(file_date=data["file_date"]).exists():
            raise forms.ValidationError(f"{data['file_date']} is already in the archive.")
        return data


@admin.register(MagnetometerImport)
class MagnetometerImportAdmin(admin.ModelAdmin):
    """Upload a station MagData_*.dat file: the date is read from its name
    and its readings are loaded as it saves. (The raw files are kept out of
    the public code repo - the data is only shared through approved
    requests.) MagnetometerReading itself isn't registered - it holds
    millions of rows."""

    form = MagnetometerImportForm
    list_display = ["file_date", "row_count", "skipped_row_count", "parsed_at", "created_at"]
    ordering = ["-file_date"]
    readonly_fields = ["row_count", "skipped_row_count", "parsed_at"]
    actions = ["parse_selected"]

    def save_model(self, request, obj, form, change):
        obj.file_date = form.cleaned_data["file_date"]
        super().save_model(request, obj, form, change)
        if not change or "file" in form.changed_data:
            ingest_import(obj)
            self.message_user(request, f"Loaded {obj.row_count} readings for {obj.file_date} ({obj.skipped_row_count} lines skipped).")

    @admin.action(description="Re-parse selected file(s) into readings")
    def parse_selected(self, request, queryset):
        count = 0
        for import_obj in queryset:
            ingest_import(import_obj)
            count += 1
        self.message_user(request, f"Parsed {count} file(s).")
