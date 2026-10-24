from rest_framework import serializers

from apps.magnetometer.models import MagnetometerReading


class MagnetometerReadingSerializer(serializers.ModelSerializer):
    class Meta:
        model = MagnetometerReading
        fields = ["timestamp", "x", "y", "z", "f"]
        read_only_fields = fields
