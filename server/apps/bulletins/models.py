from django.core.validators import FileExtensionValidator
from django.db import models

from apps.core.models import TimeStampedModel, UUIDModel


class Bulletin(UUIDModel, TimeStampedModel):
    title = models.CharField(max_length=200)
    date = models.DateField()
    pdf = models.FileField(
        upload_to="bulletins/",
        validators=[FileExtensionValidator(allowed_extensions=["pdf"])],
    )

    class Meta:
        ordering = ["-date"]

    def __str__(self):
        return self.title
