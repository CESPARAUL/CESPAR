import logging
import secrets
from datetime import timedelta

import resend
from django.conf import settings
from django.contrib.auth.hashers import check_password, make_password
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.html import strip_tags

from apps.accounts.models import EmailOTP

logger = logging.getLogger(__name__)

OTP_VALIDITY_MINUTES = 10
OTP_MAX_ATTEMPTS = 5
OTP_RESEND_COOLDOWN_SECONDS = 60


def generate_otp_code():
    return "".join(secrets.choice("0123456789") for _ in range(6))


def create_email_otp(user, purpose=EmailOTP.Purpose.EMAIL_VERIFY):
    """Invalidate any prior unused OTP for this purpose and issue a fresh
    one. Returns the raw code — it only ever exists in memory here, for the
    caller to embed in the email. Only the hash is persisted."""
    EmailOTP.objects.filter(user=user, purpose=purpose, is_used=False).update(is_used=True)
    code = generate_otp_code()
    EmailOTP.objects.create(
        user=user,
        purpose=purpose,
        code_hash=make_password(code),
        expires_at=timezone.now() + timedelta(minutes=OTP_VALIDITY_MINUTES),
    )
    return code


def can_resend_otp(user, purpose=EmailOTP.Purpose.EMAIL_VERIFY):
    latest = EmailOTP.objects.filter(user=user, purpose=purpose).order_by("-created_at").first()
    if not latest:
        return True
    return (timezone.now() - latest.created_at).total_seconds() > OTP_RESEND_COOLDOWN_SECONDS


def verify_email_otp(user, code, purpose=EmailOTP.Purpose.EMAIL_VERIFY):
    """Raises ValueError with a user-facing message on failure, else True."""
    otp = EmailOTP.objects.filter(user=user, purpose=purpose, is_used=False).order_by("-created_at").first()
    if not otp or otp.expires_at < timezone.now():
        raise ValueError("This code has expired. Request a new one.")
    if otp.attempts >= OTP_MAX_ATTEMPTS:
        raise ValueError("Too many attempts. Request a new code.")
    if not check_password(code, otp.code_hash):
        otp.attempts += 1
        otp.save(update_fields=["attempts"])
        raise ValueError("Incorrect code")
    otp.is_used = True
    otp.save(update_fields=["is_used"])
    return True


def send_otp_email(user, code, purpose=EmailOTP.Purpose.EMAIL_VERIFY):
    is_reset = purpose == EmailOTP.Purpose.PASSWORD_RESET
    template = "accounts/email/password_reset.html" if is_reset else "accounts/email/otp_verify.html"
    subject_suffix = "password reset code" if is_reset else "verification code"

    context = {
        "user": user,
        "code": code,
        "minutes": OTP_VALIDITY_MINUTES,
        "logo_url": f"{settings.FRONTEND_BASE_URL}/images/logo.png",
        "year": timezone.now().year,
    }
    html_content = render_to_string(template, context)
    plain_content = strip_tags(html_content)
    subject = f"{code} is your CESPAR {subject_suffix}"

    # Resend's HTTP API is the primary transport — Render's free tier hangs
    # on outbound SMTP at the socket level rather than failing cleanly, which
    # previously took the whole gunicorn worker down mid-request. SMTP is
    # kept only as a fallback for environments without RESEND_API_KEY set
    # (e.g. local dev using EMAIL_HOST_USER/EMAIL_HOST_PASSWORD).
    if getattr(settings, "RESEND_API_KEY", ""):
        try:
            resend.api_key = settings.RESEND_API_KEY
            resend.Emails.send({
                "from": settings.DEFAULT_FROM_EMAIL,
                "to": [user.email],
                "subject": subject,
                "html": html_content,
                "text": plain_content,
            })
        except Exception:
            logger.exception("Failed to send OTP email (Resend API) to %s", user.email)
    else:
        try:
            send_mail(
                subject=subject,
                message=plain_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                html_message=html_content,
                fail_silently=True,
            )
        except Exception:
            logger.exception("Failed to send OTP email (SMTP) to %s", user.email)

    if settings.DEBUG:
        logger.info("[otp] %s code for %s is: %s", purpose, user.email, code)
