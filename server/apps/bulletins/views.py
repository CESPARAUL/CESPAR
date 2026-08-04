from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.bulletins.models import Bulletin
from apps.bulletins.serializers import BulletinSerializer


class BulletinListView(APIView):
    """GET /api/bulletins — public list, no pagination envelope."""

    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get(self, request):
        bulletins = Bulletin.objects.all()
        serializer = BulletinSerializer(bulletins, many=True, context={"request": request})
        return Response({"bulletins": serializer.data})
