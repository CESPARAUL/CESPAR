from apps.core.email import send_branded_email

GENERIC_APPROVAL_MESSAGE = (
    "Your request has been reviewed and approved. You'll be contacted with next steps shortly."
)


def send_request_submitted_email(instance):
    send_branded_email(
        instance.user.email,
        "We've received your CESPAR data request",
        "data_requests/email/request_submitted.html",
        {"user": instance.user, "data_request": instance},
    )


def send_request_approved_email(instance):
    send_branded_email(
        instance.user.email,
        "Your CESPAR data request has been approved",
        "data_requests/email/request_approved.html",
        {"user": instance.user, "data_request": instance},
    )
