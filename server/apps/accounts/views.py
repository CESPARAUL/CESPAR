from django.contrib.auth import authenticate
from djangorestframework_camel_case.parser import (
    CamelCaseFormParser,
    CamelCaseJSONParser,
    CamelCaseMultiPartParser,
)
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import AccessToken

from apps.accounts.models import EmailOTP, User
from apps.accounts.serializers import (
    ChangePasswordSerializer,
    ForgotPasswordSerializer,
    LoginSerializer,
    RegisterSerializer,
    ResendOtpSerializer,
    ResetPasswordSerializer,
    UpdateProfileSerializer,
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

        return Response({
            "token": issue_token(user),
            "user": UserSerializer(user, context={"request": request}).data,
        })


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

        return Response({
            "token": issue_token(user),
            "user": UserSerializer(user, context={"request": request}).data,
        })


class MeView(APIView):
    """GET /api/auth/me — current user's profile.

    PATCH /api/auth/me — update basic info (name, institution, avatar).
    """

    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [CamelCaseMultiPartParser, CamelCaseFormParser, CamelCaseJSONParser]

    def get(self, request):
        return Response({"user": UserSerializer(request.user, context={"request": request}).data})

    def patch(self, request):
        serializer = UpdateProfileSerializer(
            request.user, data=request.data, partial=True, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"user": UserSerializer(request.user, context={"request": request}).data})


class ChangePasswordView(APIView):
    """POST /api/auth/change-password"""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        current_password = serializer.validated_data["current_password"]
        new_password = serializer.validated_data["new_password"]

        if not request.user.check_password(current_password):
            return Response({"message": "Current password is incorrect"}, status=400)

        request.user.set_password(new_password)
        request.user.save(update_fields=["password"])
        return Response({"message": "Password updated successfully"})


_RESET_SENT_MESSAGE = "If an account exists for that email, a reset code has been sent."


class ForgotPasswordView(APIView):
    """POST /api/auth/forgot-password — always reports success, whether or
    not the email has an account, so this can't be used to enumerate users."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"message": _RESET_SENT_MESSAGE})

        if not can_resend_otp(user, purpose=EmailOTP.Purpose.PASSWORD_RESET):
            return Response(
                {"message": "Please wait a moment before requesting another code"},
                status=429,
            )

        code = create_email_otp(user, purpose=EmailOTP.Purpose.PASSWORD_RESET)
        send_otp_email(user, code, purpose=EmailOTP.Purpose.PASSWORD_RESET)

        return Response({"message": _RESET_SENT_MESSAGE})


class ResetPasswordView(APIView):
    """POST /api/auth/reset-password — confirms the code and logs the user in."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        code = serializer.validated_data["code"]
        new_password = serializer.validated_data["new_password"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"message": "Incorrect code"}, status=400)

        try:
            verify_email_otp(user, code, purpose=EmailOTP.Purpose.PASSWORD_RESET)
        except ValueError as exc:
            return Response({"message": str(exc)}, status=400)

        user.set_password(new_password)
        user.save(update_fields=["password"])

        return Response({
            "token": issue_token(user),
            "user": UserSerializer(user, context={"request": request}).data,
        })
