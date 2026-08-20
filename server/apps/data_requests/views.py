from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.data_requests.models import DataRequest
from apps.data_requests.permissions import IsAdmin
from apps.data_requests.serializers import (
    AdminDataRequestSerializer,
    CreateRequestSerializer,
    DataRequestSerializer,
    UpdateRequestStatusSerializer,
)
from apps.data_requests.utils import send_request_approved_email, send_request_submitted_email


class RequestListCreateView(APIView):
    """POST /api/requests — any authenticated researcher.
    GET  /api/requests — admin only, every request in the system."""

    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.IsAuthenticated(), IsAdmin()]
        return [permissions.IsAuthenticated()]

    def post(self, request):
        serializer = CreateRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save(user=request.user)
        send_request_submitted_email(instance)
        return Response({"request": DataRequestSerializer(instance).data}, status=201)

    def get(self, request):
        requests = DataRequest.objects.select_related("dataset", "user").all()
        return Response({"requests": AdminDataRequestSerializer(requests, many=True).data})


class MyRequestsView(APIView):
    """GET /api/requests/me"""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        requests = DataRequest.objects.select_related("dataset").filter(user=request.user)
        return Response({"requests": DataRequestSerializer(requests, many=True).data})


class RequestStatusUpdateView(APIView):
    """PATCH /api/requests/:id — admin only."""

    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def patch(self, request, pk):
        try:
            instance = DataRequest.objects.select_related("dataset", "user").get(pk=pk)
        except DataRequest.DoesNotExist:
            return Response({"message": "Request not found"}, status=404)

        previous_status = instance.status
        serializer = UpdateRequestStatusSerializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        if instance.status == DataRequest.Status.APPROVED and previous_status != DataRequest.Status.APPROVED:
            send_request_approved_email(instance)

        return Response({"request": DataRequestSerializer(instance).data})
