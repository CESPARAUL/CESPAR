from rest_framework import serializers

from apps.datasets.models import Dataset


class DatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        fields = ["id", "slug", "title", "category", "description", "coverage", "format", "created_at"]
        read_only_fields = fields


class DatasetMiniSerializer(serializers.ModelSerializer):
    """Nested representation used inside DataRequest responses."""

    class Meta:
        model = Dataset
        fields = ["id", "title", "slug"]
        read_only_fields = fields
