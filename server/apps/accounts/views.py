from django.contrib.auth import authenticate
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import AccessToken

from apps.accounts.models import User
from apps.accounts.serializers import (
    LoginSerializer,
    RegisterSerializer,
    ResendOtpSerializer,
    UserSerializer,
    VerifyEmailSerializer,
)
from apps.accounts.utils import (
    can_resend_otp,
    create_email_otp,
    send_otp_email,
    verify_email_otp,
)


def issue_token(user):
    return str(AccessToken.for_user(user))


class RegisterView(APIView):
    """POST /api/auth/register — creates an unverified account and emails an OTP."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        code = create_email_otp(user)
        send_otp_email(user, code)

        return Response(
            {
                "message": "Account created. Check your email for a verification code.",
                "email": user.email,
            },
            status=status.HTTP_201_CREATED,
        )


class VerifyEmailView(APIView):
    """POST /api/auth/verify-email — confirms the account and logs the user in."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = VerifyEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        code = serializer.validated_data["code"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"message": "No account found for this email"}, status=404)

        if user.email_verified:
            return Response({"message": "This email is already verified"}, status=400)

        try:
            verify_email_otp(user, code)
        except ValueError as exc:
            return Response({"message": str(exc)}, status=400)

        user.email_verified = True
        user.save(update_fields=["email_verified"])

        return Response({"token": issue_token(user), "user": UserSerializer(user).data})


class ResendOtpView(APIView):
    """POST /api/auth/resend-otp"""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ResendOtpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"message": "No account found for this email"}, status=404)

        if user.email_verified:
            return Response({"message": "This email is already verified"}, status=400)

        if not can_resend_otp(user):
            return Response(
                {"message": "Please wait a moment before requesting another code"},
                status=429,
            )

        code = create_email_otp(user)
        send_otp_email(user, code)

        return Response({"message": "A new verification code has been sent."})


class LoginView(APIView):
    """POST /api/auth/login"""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        user = authenticate(request, username=email, password=password)
        if user is None:
            return Response({"message": "Invalid email or password"}, status=401)

        if not user.email_verified:
            return Response(
                {
                    "code": "EMAIL_NOT_VERIFIED",
                    "message": "Please verify your email before logging in",
                    "email": user.email,
                },
                status=403,
            )

        return Response({"token": issue_token(user), "user": UserSerializer(user).data})


class MeView(APIView):
    """GET /api/auth/me"""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({"user": UserSerializer(request.user).data})
