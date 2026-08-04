from django.contrib import admin

from apps.datasets.models import Dataset


@admin.register(Dataset)
class DatasetAdmin(admin.ModelAdmin):
    list_display = ["title", "slug", "category", "created_at"]
    list_filter = ["category"]
    search_fields = ["title", "slug", "description"]
    prepopulated_fields = {"slug": ("title",)}
