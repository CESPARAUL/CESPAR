import logging

import resend
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.html import strip_tags

logger = logging.getLogger(__name__)


def send_branded_email(to_email, subject, template, context):
    """Render `template` (extending email/_base.html) and send it via
    Resend's HTTP API, falling back to SMTP when RESEND_API_KEY isn't set."""
    context = {
        **context,
        "logo_url": f"{settings.FRONTEND_BASE_URL}/images/logo.png",
        "year": timezone.now().year,
    }
    html_content = render_to_string(template, context)
    plain_content = strip_tags(html_content)

    if getattr(settings, "RESEND_API_KEY", ""):
        try:
            resend.api_key = settings.RESEND_API_KEY
            resend.Emails.send({
                "from": settings.DEFAULT_FROM_EMAIL,
                "to": [to_email],
                "subject": subject,
                "html": html_content,
                "text": plain_content,
            })
            return
        except Exception:
            logger.exception("Failed to send email (Resend API) to %s", to_email)
    else:
        try:
            send_mail(
                subject=subject,
                message=plain_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[to_email],
                html_message=html_content,
                fail_silently=True,
            )
        except Exception:
            logger.exception("Failed to send email (SMTP) to %s", to_email)
