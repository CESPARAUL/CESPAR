from django.urls import path

from apps.magnetometer.views import (
    MagnetometerDownloadView,
    MagnetometerLatestView,
    MagnetometerStatusView,
)

urlpatterns = [
    path("/latest", MagnetometerLatestView.as_view(), name="magnetometer-latest"),
    path("/status", MagnetometerStatusView.as_view(), name="magnetometer-status"),
    path("/download", MagnetometerDownloadView.as_view(), name="magnetometer-download"),
]
