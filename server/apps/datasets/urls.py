from django.urls import path

from apps.datasets.views import DatasetDetailView, DatasetListView

urlpatterns = [
    path("", DatasetListView.as_view(), name="dataset-list"),
    path("/<slug:slug>", DatasetDetailView.as_view(), name="dataset-detail"),
]
