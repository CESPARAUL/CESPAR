from datetime import date, datetime, timedelta, timezone
from statistics import median

from django.http import StreamingHttpResponse
from django.utils import timezone as dj_timezone
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.magnetometer.models import MagnetometerImport, MagnetometerReading
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


def _station_days():
    """Each ingested daily file = one station day (24h from 05:00 UTC,
    the logger's midnight), newest first, with its UTC span."""
    days = []
    for imp in MagnetometerImport.objects.filter(row_count__gt=0).order_by("-file_date"):
        span = imp.readings.order_by("timestamp")
        first, last = span.first(), span.last()
        if first and last:
            days.append({"date": imp.file_date.isoformat(), "start": first.timestamp, "end": last.timestamp,
                         "readings": imp.row_count, "import": imp})
    return days


class MagnetometerLatestView(APIView):
    """GET /api/magnetometer/latest?day=YYYY-MM-DD — despiked,
    1-minute-averaged readings for one station day (default: the most
    recent day on record). ?hours=N instead gives the N hours up to the
    latest reading (not up to now - the archive isn't streamed live, so
    "the last 24h from now" is usually empty). Full-resolution data is
    only available via the download endpoint."""

    permission_classes = [permissions.IsAuthenticated, HasApprovedMagnetometerAccess]

    def get(self, request):
        day = request.query_params.get("day")
        hours = None
        if day or "hours" not in request.query_params:
            days = _station_days()
            chosen = next((d for d in days if d["date"] == day), None) if day else (days[0] if days else None)
            if day and not chosen:
                return Response({"message": f"No magnetometer data for {day}"}, status=404)
            readings = list(chosen["import"].readings.order_by("timestamp")) if chosen else []
        else:
            try:
                hours = int(request.query_params.get("hours", 24))
            except ValueError:
                return Response({"message": "hours must be an integer"}, status=400)
            hours = max(1, min(hours, MAX_LATEST_HOURS))
            latest = MagnetometerReading.objects.order_by("-timestamp").first()
            until = latest.timestamp if latest else dj_timezone.now()
            readings = list(
                MagnetometerReading.objects.filter(timestamp__gt=until - timedelta(hours=hours), timestamp__lte=until)
                .order_by("timestamp")
            )
            chosen = None
        points = _despike_and_bin(readings)

        return Response({
            "day": chosen["date"] if chosen else None,
            "hours": hours,
            "start": points[0]["timestamp"].isoformat() if points else None,
            "end": points[-1]["timestamp"].isoformat() if points else None,
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
            # Station days on record, newest first - the chart's day picker.
            "days": [{"date": d["date"], "start": d["start"].isoformat(), "end": d["end"].isoformat(),
                      "readings": d["readings"]} for d in _station_days()],
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
