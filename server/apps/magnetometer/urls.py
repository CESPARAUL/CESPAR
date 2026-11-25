from django.urls import path

from apps.magnetometer.station import StationManifestView, StationUploadView

from apps.magnetometer.views import (
    MagnetometerDownloadView,
    MagnetometerLatestView,
    MagnetometerPreviewView,
    MagnetometerStatusView,
)

urlpatterns = [
    path("/station/manifest", StationManifestView.as_view(), name="magnetometer-station-manifest"),
    path("/station/upload", StationUploadView.as_view(), name="magnetometer-station-upload"),
    path("/latest", MagnetometerLatestView.as_view(), name="magnetometer-latest"),
    path("/status", MagnetometerStatusView.as_view(), name="magnetometer-status"),
    path("/preview", MagnetometerPreviewView.as_view(), name="magnetometer-preview"),
    path("/download", MagnetometerDownloadView.as_view(), name="magnetometer-download"),
]
