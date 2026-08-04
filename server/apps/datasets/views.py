from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.datasets.models import Dataset
from apps.datasets.serializers import DatasetSerializer


class DatasetListView(APIView):
    """GET /api/datasets — public catalogue, no pagination envelope."""

    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get(self, request):
        datasets = Dataset.objects.all()
        return Response({"datasets": DatasetSerializer(datasets, many=True).data})


class DatasetDetailView(APIView):
    """GET /api/datasets/:slug"""

    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get(self, request, slug):
        try:
            dataset = Dataset.objects.get(slug=slug)
        except Dataset.DoesNotExist:
            return Response({"message": "Dataset not found"}, status=404)
        return Response({"dataset": DatasetSerializer(dataset).data})
