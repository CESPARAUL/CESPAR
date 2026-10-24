from django.urls import path

from apps.data_requests.views import (
    MyRequestsView,
    RequestArchiveView,
    RequestListCreateView,
    RequestStatusUpdateView,
)

urlpatterns = [
    path("", RequestListCreateView.as_view(), name="request-list-create"),
    path("/me", MyRequestsView.as_view(), name="request-mine"),
    path("/<uuid:pk>", RequestStatusUpdateView.as_view(), name="request-update-status"),
    path("/<uuid:pk>/archive", RequestArchiveView.as_view(), name="request-archive"),
]
