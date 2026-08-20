from django.urls import path

from apps.accounts.views import (
    ChangePasswordView,
    ForgotPasswordView,
    LoginView,
    MeView,
    RegisterView,
    ResendOtpView,
    ResetPasswordView,
    VerifyEmailView,
)

urlpatterns = [
    path("/register", RegisterView.as_view(), name="auth-register"),
    path("/verify-email", VerifyEmailView.as_view(), name="auth-verify-email"),
    path("/resend-otp", ResendOtpView.as_view(), name="auth-resend-otp"),
    path("/login", LoginView.as_view(), name="auth-login"),
    path("/me", MeView.as_view(), name="auth-me"),
    path("/change-password", ChangePasswordView.as_view(), name="auth-change-password"),
    path("/forgot-password", ForgotPasswordView.as_view(), name="auth-forgot-password"),
    path("/reset-password", ResetPasswordView.as_view(), name="auth-reset-password"),
]
