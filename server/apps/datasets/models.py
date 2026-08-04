from django.db import models

from apps.core.models import TimeStampedModel, UUIDModel


class Dataset(UUIDModel, TimeStampedModel):
    class Category(models.TextChoices):
        ARCHIVE = "ARCHIVE", "Data Archive"
        RADIO = "RADIO", "Radio Waves"
        WEATHER = "WEATHER", "Weather Station"
        SATELLITE = "SATELLITE", "Satellite"
        MAGNETOMETER = "MAGNETOMETER", "Magnetometer"

    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=20, choices=Category.choices)
    description = models.TextField()
    coverage = models.CharField(max_length=200)
    format = models.CharField(max_length=200)

    class Meta:
        ordering = ["title"]

    def __str__(self):
        return self.title
