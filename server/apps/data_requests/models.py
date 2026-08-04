from django.db import models

from apps.accounts.models import User
from apps.core.models import TimeStampedModel, UUIDModel
from apps.datasets.models import Dataset


class DataRequest(UUIDModel, TimeStampedModel):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"
        FULFILLED = "FULFILLED", "Fulfilled"

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="requests")
    dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE, related_name="requests")
    purpose = models.TextField()
    date_range_from = models.CharField(max_length=32, blank=True, null=True)
    date_range_to = models.CharField(max_length=32, blank=True, null=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    admin_note = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "-created_at"]),
            models.Index(fields=["dataset"]),
        ]

    def __str__(self):
        return f"{self.dataset.title} request by {self.user.email}"
