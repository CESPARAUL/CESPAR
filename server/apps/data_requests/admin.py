from django.contrib import admin

from apps.data_requests.models import DataRequest
from apps.data_requests.utils import approval_note_for, send_request_approved_email


@admin.register(DataRequest)
class DataRequestAdmin(admin.ModelAdmin):
    list_display = ["dataset", "user", "status", "archived", "created_at"]
    list_filter = ["status", "archived", "dataset"]
    search_fields = ["user__email", "dataset__title", "purpose"]
    readonly_fields = ["created_at", "updated_at"]
    autocomplete_fields = ["user", "dataset"]
    actions = ["approve_requests"]

    def save_model(self, request, obj, form, change):
        # Changing Status to Approved on the request's own page emails the
        # requester too, same as the list action and the website button.
        newly_approved = (
            obj.status == DataRequest.Status.APPROVED
            and (not change or form.initial.get("status") != DataRequest.Status.APPROVED)
        )
        if newly_approved and not obj.admin_note:
            obj.admin_note = approval_note_for(obj.dataset)
        super().save_model(request, obj, form, change)
        if newly_approved:
            send_request_approved_email(obj)
            self.message_user(request, f"Approval email sent to {obj.user.email}.")

    @admin.action(description="Approve selected requests")
    def approve_requests(self, request, queryset):
        pending = queryset.exclude(status=DataRequest.Status.APPROVED).select_related("user", "dataset")
        count = 0
        for data_request in pending:
            data_request.status = DataRequest.Status.APPROVED
            if not data_request.admin_note:
                data_request.admin_note = approval_note_for(data_request.dataset)
            data_request.save(update_fields=["status", "admin_note", "updated_at"])
            send_request_approved_email(data_request)
            count += 1
        self.message_user(request, f"Approved {count} request(s).")
