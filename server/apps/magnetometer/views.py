from datetime import date, datetime, timedelta, timezone
from statistics import median

from django.http import StreamingHttpResponse
from django.utils import timezone as dj_timezone
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.magnetometer.models import MagnetometerReading
from apps.magnetometer.permissions import HasApprovedMagnetometerAccess

MAX_LATEST_HOURS = 24 * 30
MAX_DOWNLOAD_DAYS = 90


def _despike_and_bin(readings, field_names=("x", "y", "z", "f")):
    """Group raw ~8s samples into 1-minute means for the chart, rejecting
    outliers within each minute first via a median-absolute-deviation
    threshold — the same style of despiking the station's own analysis
    scripts use, since raw samples are too spiky to plot directly."""
    buckets = {}
    for reading in readings:
        key = reading.timestamp.replace(second=0, microsecond=0)
        buckets.setdefault(key, []).append(reading)

    points = []
    for key in sorted(buckets):
        group = buckets[key]
        point = {"timestamp": key}
        for field in field_names:
            values = [getattr(r, field) for r in group]
            mid = median(values)
            mad = median([abs(v - mid) for v in values]) * 1.4826 or 1.0
            kept = [v for v in values if abs(v - mid) <= 3 * mad] or values
            point[field] = sum(kept) / len(kept)
        points.append(point)
    return points


class MagnetometerLatestView(APIView):
    """GET /api/magnetometer/latest?hours=24 — despiked, 1-minute-averaged
    readings for the live chart. Full-resolution data is only available
    via the download endpoint."""

    permission_classes = [permissions.IsAuthenticated, HasApprovedMagnetometerAccess]

    def get(self, request):
        try:
            hours = int(request.query_params.get("hours", 24))
        except ValueError:
            return Response({"message": "hours must be an integer"}, status=400)
        hours = max(1, min(hours, MAX_LATEST_HOURS))

        since = dj_timezone.now() - timedelta(hours=hours)
        readings = list(
            MagnetometerReading.objects.filter(timestamp__gte=since).order_by("timestamp")
        )
        points = _despike_and_bin(readings)

        return Response({
            "hours": hours,
            "count": len(points),
            "points": [
                {
                    "timestamp": p["timestamp"].isoformat(),
                    "x": round(p["x"], 2),
                    "y": round(p["y"], 2),
                    "z": round(p["z"], 2),
                    "f": round(p["f"], 2),
                }
                for p in points
            ],
        })


class MagnetometerStatusView(APIView):
    """GET /api/magnetometer/status — latest reading time and archive
    coverage, for a 'station is live' indicator. Deliberately left open
    to any logged-in user (not gated like /latest and /download) so
    people can see the station is active before deciding to request
    access — it reveals freshness/volume, not any actual field data."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        latest = MagnetometerReading.objects.order_by("-timestamp").first()
        earliest = MagnetometerReading.objects.order_by("timestamp").first()
        return Response({
            "latest_reading": latest.timestamp.isoformat() if latest else None,
            "earliest_reading": earliest.timestamp.isoformat() if earliest else None,
            "total_readings": MagnetometerReading.objects.count(),
        })


class MagnetometerDownloadView(APIView):
    """GET /api/magnetometer/download?from=YYYY-MM-DD&to=YYYY-MM-DD — raw,
    full-resolution CSV export for the requested UTC date range."""

    permission_classes = [permissions.IsAuthenticated, HasApprovedMagnetometerAccess]

    def get(self, request):
        from_str = request.query_params.get("from")
        to_str = request.query_params.get("to")
        if not from_str or not to_str:
            return Response({"message": "'from' and 'to' (YYYY-MM-DD) are required"}, status=400)
        try:
            start = date.fromisoformat(from_str)
            end = date.fromisoformat(to_str)
        except ValueError:
            return Response({"message": "'from' and 'to' must be YYYY-MM-DD"}, status=400)
        if end < start:
            return Response({"message": "'to' must not be before 'from'"}, status=400)
        if (end - start).days > MAX_DOWNLOAD_DAYS:
            return Response(
                {"message": f"range too large — max {MAX_DOWNLOAD_DAYS} days per request"},
                status=400,
            )

        start_dt = datetime.combine(start, datetime.min.time(), tzinfo=timezone.utc)
        end_dt = datetime.combine(end, datetime.max.time(), tzinfo=timezone.utc)

        readings = (
            MagnetometerReading.objects.filter(timestamp__gte=start_dt, timestamp__lte=end_dt)
            .order_by("timestamp")
            .values_list("timestamp", "x", "y", "z", "f")
            .iterator()
        )

        def rows():
            yield "timestamp_utc,x_nt,y_nt,z_nt,f_nt\n"
            for timestamp, x, y, z, f in readings:
                yield f"{timestamp.isoformat()},{x},{y},{z},{f}\n"

        response = StreamingHttpResponse(rows(), content_type="text/csv")
        response["Content-Disposition"] = (
            f'attachment; filename="cespar_magnetometer_{start}_{end}.csv"'
        )
        return response
