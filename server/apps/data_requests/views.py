from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.data_requests.models import DataRequest
from apps.data_requests.permissions import IsAdmin
from apps.data_requests.serializers import (
    AdminDataRequestSerializer,
    ArchiveRequestSerializer,
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
    """GET /api/requests/me — active (non-archived) by default;
    ?archived=true returns only archived ones instead. Ordered newest
    request first (DataRequest.Meta.ordering)."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        show_archived = request.query_params.get("archived") == "true"
        requests = (
            DataRequest.objects.select_related("dataset")
            .filter(user=request.user, archived=show_archived)
        )
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


class RequestArchiveView(APIView):
    """PATCH /api/requests/:id/archive — the request's own owner or an
    admin can archive/unarchive it. Purely a visibility toggle for the
    dashboard list — does not touch status, so it can't be used to
    revoke or fake approval."""

    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            instance = DataRequest.objects.select_related("dataset", "user").get(pk=pk)
        except DataRequest.DoesNotExist:
            return Response({"message": "Request not found"}, status=404)

        if instance.user_id != request.user.id and request.user.role != request.user.Role.ADMIN:
            return Response({"message": "Not your request"}, status=403)

        serializer = ArchiveRequestSerializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({"request": DataRequestSerializer(instance).data})
