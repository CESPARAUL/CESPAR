from django.contrib import admin

from apps.data_requests.models import DataRequest
from apps.data_requests.utils import GENERIC_APPROVAL_MESSAGE, send_request_approved_email


@admin.register(DataRequest)
class DataRequestAdmin(admin.ModelAdmin):
    list_display = ["dataset", "user", "status", "created_at"]
    list_filter = ["status", "dataset"]
    search_fields = ["user__email", "dataset__title", "purpose"]
    readonly_fields = ["created_at", "updated_at"]
    autocomplete_fields = ["user", "dataset"]
    actions = ["approve_requests"]

    @admin.action(description="Approve selected requests")
    def approve_requests(self, request, queryset):
        pending = queryset.exclude(status=DataRequest.Status.APPROVED).select_related("user", "dataset")
        count = 0
        for data_request in pending:
            data_request.status = DataRequest.Status.APPROVED
            if not data_request.admin_note:
                data_request.admin_note = GENERIC_APPROVAL_MESSAGE
            data_request.save(update_fields=["status", "admin_note", "updated_at"])
            send_request_approved_email(data_request)
            count += 1
        self.message_user(request, f"Approved {count} request(s).")
