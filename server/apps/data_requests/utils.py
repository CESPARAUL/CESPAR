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


# Datasets the approved requester can open straight away on the site
# (no follow-up from the team needed), and where.
INSTANT_ACCESS_PAGES = {"magnetometer-data": "/magnetometer"}
INSTANT_ACCESS_MESSAGE = "You can now view the charts and download the raw data on the CESPAR website."


def approval_note_for(dataset):
    return INSTANT_ACCESS_MESSAGE if dataset.slug in INSTANT_ACCESS_PAGES else GENERIC_APPROVAL_MESSAGE


def send_request_approved_email(instance):
    from django.conf import settings
    page = INSTANT_ACCESS_PAGES.get(instance.dataset.slug)
    send_branded_email(
        instance.user.email,
        "Your CESPAR data request has been approved",
        "data_requests/email/request_approved.html",
        {"user": instance.user, "data_request": instance,
         "access_url": f"{settings.FRONTEND_BASE_URL}{page}" if page else None},
    )
