from django.conf import settings
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.static import serve as static_serve

from apps.core.views import HealthCheckView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health", HealthCheckView.as_view(), name="health"),
    path("api/auth", include("apps.accounts.urls")),
    path("api/datasets", include("apps.datasets.urls")),
    path("api/requests", include("apps.data_requests.urls")),
    path("api/bulletins", include("apps.bulletins.urls")),
]

if settings.DEBUG:
    # Bulletin PDFs are embedded in an <iframe> on the frontend (a different
    # origin), which Django's default X-Frame-Options: DENY would block —
    # exempt just the media route rather than the whole site.
    media_serve = xframe_options_exempt(static_serve)
    urlpatterns += [
        re_path(
            r"^media/(?P<path>.*)$",
            media_serve,
            {"document_root": settings.MEDIA_ROOT},
        ),
    ]
