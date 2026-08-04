import logging
import secrets
from datetime import timedelta

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


def create_email_otp(user):
    """Invalidate any prior unused OTP and issue a fresh one. Returns the
    raw code — it only ever exists in memory here, for the caller to embed
    in the email. Only the hash is persisted."""
    EmailOTP.objects.filter(user=user, is_used=False).update(is_used=True)
    code = generate_otp_code()
    EmailOTP.objects.create(
        user=user,
        code_hash=make_password(code),
        expires_at=timezone.now() + timedelta(minutes=OTP_VALIDITY_MINUTES),
    )
    return code


def can_resend_otp(user):
    latest = EmailOTP.objects.filter(user=user).order_by("-created_at").first()
    if not latest:
        return True
    return (timezone.now() - latest.created_at).total_seconds() > OTP_RESEND_COOLDOWN_SECONDS


def verify_email_otp(user, code):
    """Raises ValueError with a user-facing message on failure, else True."""
    otp = EmailOTP.objects.filter(user=user, is_used=False).order_by("-created_at").first()
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


def send_otp_email(user, code):
    context = {"user": user, "code": code, "minutes": OTP_VALIDITY_MINUTES}
    html_content = render_to_string("accounts/email/otp_verify.html", context)
    plain_content = strip_tags(html_content)
    try:
        send_mail(
            subject=f"{code} is your CESPAR verification code",
            message=plain_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_content,
            fail_silently=True,
        )
    except Exception:
        logger.exception("Failed to send OTP email to %s", user.email)

    if settings.DEBUG:
        logger.info("[otp] Verification code for %s is: %s", user.email, code)
