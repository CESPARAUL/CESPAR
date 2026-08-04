import uuid

from django.db import models


class TimeStampedModel(models.Model):
    """Abstract base providing created/updated timestamps."""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class UUIDModel(models.Model):
    """Abstract base using a UUID primary key instead of auto-increment int.

    Used for every model exposed through the API so IDs aren't easily
    enumerable and serialize as opaque strings — matching the string-typed
    `id` fields the frontend already expects.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True
