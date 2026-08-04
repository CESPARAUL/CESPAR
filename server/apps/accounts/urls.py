from django.urls import path

from apps.accounts.views import (
    LoginView,
    MeView,
    RegisterView,
    ResendOtpView,
    VerifyEmailView,
)

urlpatterns = [
    path("/register", RegisterView.as_view(), name="auth-register"),
    path("/verify-email", VerifyEmailView.as_view(), name="auth-verify-email"),
    path("/resend-otp", ResendOtpView.as_view(), name="auth-resend-otp"),
    path("/login", LoginView.as_view(), name="auth-login"),
    path("/me", MeView.as_view(), name="auth-me"),
]
