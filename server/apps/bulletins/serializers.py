from rest_framework import serializers

from apps.bulletins.models import Bulletin


class BulletinSerializer(serializers.ModelSerializer):
    pdf = serializers.SerializerMethodField()

    class Meta:
        model = Bulletin
        fields = ["id", "title", "date", "pdf", "created_at"]
        read_only_fields = fields

    def get_pdf(self, obj):
        request = self.context.get("request")
        url = obj.pdf.url
        return request.build_absolute_uri(url) if request else url
