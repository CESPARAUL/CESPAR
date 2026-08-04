from django.urls import path

from apps.bulletins.views import BulletinListView

urlpatterns = [
    path("", BulletinListView.as_view(), name="bulletin-list"),
]
