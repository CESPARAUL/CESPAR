from rest_framework.permissions import BasePermission

from apps.accounts.models import User
from apps.data_requests.models import DataRequest

MAGNETOMETER_DATASET_SLUG = "magnetometer-data"


class HasApprovedMagnetometerAccess(BasePermission):
    """Admins always have access. Everyone else needs an approved (or
    fulfilled) DataRequest against the Magnetometer Data dataset — reuses
    the existing submit/review workflow rather than a second, parallel
    approval system just for this data."""

    message = (
        "Your access request for Magnetometer Data hasn't been approved "
        "yet. Submit one from the dataset page."
    )

    def has_permission(self, request, view):
        user = request.user
        if not (user and user.is_authenticated):
            return False
        if user.role == User.Role.ADMIN:
            return True
        return DataRequest.objects.filter(
            user=user,
            dataset__slug=MAGNETOMETER_DATASET_SLUG,
            status__in=[DataRequest.Status.APPROVED, DataRequest.Status.FULFILLED],
        ).exists()


class HasRequestedMagnetometerAccess(BasePermission):
    """For the preview: anyone who has asked for Magnetometer Data (pending
    or approved), and admins. Rejected requests don't get a preview."""

    message = "Request access to Magnetometer Data to see a preview."

    def has_permission(self, request, view):
        user = request.user
        if not (user and user.is_authenticated):
            return False
        if user.role == User.Role.ADMIN:
            return True
        return DataRequest.objects.filter(
            user=user,
            dataset__slug=MAGNETOMETER_DATASET_SLUG,
            status__in=[DataRequest.Status.PENDING, DataRequest.Status.APPROVED, DataRequest.Status.FULFILLED],
        ).exists()
