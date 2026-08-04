from django.contrib import admin

from apps.data_requests.models import DataRequest


@admin.register(DataRequest)
class DataRequestAdmin(admin.ModelAdmin):
    list_display = ["dataset", "user", "status", "created_at"]
    list_filter = ["status", "dataset"]
    search_fields = ["user__email", "dataset__title", "purpose"]
    readonly_fields = ["created_at", "updated_at"]
    autocomplete_fields = ["user", "dataset"]
