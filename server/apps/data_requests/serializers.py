from rest_framework import serializers

from apps.data_requests.models import DataRequest
from apps.datasets.models import Dataset
from apps.datasets.serializers import DatasetMiniSerializer


class CreateRequestSerializer(serializers.ModelSerializer):
    dataset_id = serializers.PrimaryKeyRelatedField(
        source="dataset", queryset=Dataset.objects.all()
    )
    purpose = serializers.CharField(min_length=10)

    class Meta:
        model = DataRequest
        fields = ["dataset_id", "purpose", "date_range_from", "date_range_to"]

    def validate_purpose(self, value):
        return value.strip()


class DataRequestSerializer(serializers.ModelSerializer):
    dataset = DatasetMiniSerializer(read_only=True)

    class Meta:
        model = DataRequest
        fields = [
            "id",
            "purpose",
            "date_range_from",
            "date_range_to",
            "status",
            "admin_note",
            "created_at",
            "dataset",
        ]
        read_only_fields = fields


class RequesterMiniSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    name = serializers.CharField()
    email = serializers.EmailField()
    institution = serializers.CharField(allow_null=True)


class AdminDataRequestSerializer(DataRequestSerializer):
    user = RequesterMiniSerializer(read_only=True)

    class Meta(DataRequestSerializer.Meta):
        fields = DataRequestSerializer.Meta.fields + ["user"]
        read_only_fields = fields


class UpdateRequestStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataRequest
        fields = ["status", "admin_note"]
