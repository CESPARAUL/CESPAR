from django.contrib import admin

from apps.bulletins.models import Bulletin


@admin.register(Bulletin)
class BulletinAdmin(admin.ModelAdmin):
    list_display = ["title", "date", "created_at"]
    search_fields = ["title"]
