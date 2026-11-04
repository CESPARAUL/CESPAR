import os

from django.conf import settings
from django.core.management.base import BaseCommand

from apps.accounts.models import User
from apps.datasets.models import Dataset

DATASETS = [
    {
        "slug": "vlf-radio-waves",
        "title": "VLF Radio Waves",
        "category": Dataset.Category.RADIO,
        "description": (
            "Very Low Frequency (VLF) receiver data used to study atmospheric "
            "and ionospheric irregularities, including diurnal and seasonal changes."
        ),
        "coverage": "Anchor University Lagos station, 2019 - present",
        "format": "CSV / binary receiver logs",
    },
    {
        "slug": "weather-station",
        "title": "Weather Station Records",
        "category": Dataset.Category.WEATHER,
        "description": (
            "Ground-based weather station measurements: rainfall, temperature, "
            "humidity, wind speed, wind direction and sun intensity."
        ),
        "coverage": "Anchor University Lagos campus, continuous 24/7 logging",
        "format": "CSV",
    },
    {
        "slug": "satellite-network-data",
        "title": "Satellite & Global Network Data",
        "category": Dataset.Category.SATELLITE,
        "description": (
            "Collated satellite and space-weather data shared through CESPAR's "
            "international network of partner stations (India, Germany, UK, USA)."
        ),
        "coverage": "Varies by partner station and instrument",
        "format": "CSV / NetCDF",
    },
    {
        "slug": "magnetometer-data",
        "title": "Magnetometer Data",
        "category": Dataset.Category.MAGNETOMETER,
        "description": (
            "Ground-based measurements of Earth's magnetic field, used for "
            "geomagnetic and space weather research."
        ),
        "coverage": "Anchor University Lagos station, 2022 - present",
        "format": "CSV (UTC timestamps, nT)",
    },
    {
        "slug": "data-archive",
        "title": "Long-Term Data Archive",
        "category": Dataset.Category.ARCHIVE,
        "description": (
            "Long-term storage and management of historical space and "
            "atmospheric data collected across all CESPAR facilities."
        ),
        "coverage": "Full historical record since station commissioning",
        "format": "Mixed (CSV, binary, PDF reports)",
    },
]


class Command(BaseCommand):
    help = "Seed the dataset catalogue and an admin account for local development."

    def handle(self, *args, **options):
        for entry in DATASETS:
            dataset, created = Dataset.objects.update_or_create(
                slug=entry["slug"], defaults=entry
            )
            action = "Created" if created else "Updated"
            self.stdout.write(f"{action} dataset: {dataset.title}")

        self.seed_admins()

        self.stdout.write(self.style.SUCCESS(f"Seeded {len(DATASETS)} datasets."))

    def seed_admins(self):
        """Admin accounts. Locally: admin@cespar.space with a throwaway
        password for development. On the live server (Render, or DEBUG
        off): no usable password - each admin sets their own with Forgot
        password on the website, so no known password ever exists there."""
        on_server = bool(os.environ.get("RENDER")) or not settings.DEBUG
        emails = ["admin@cespar.space", *[
            e.strip().lower() for e in os.environ.get("SEED_ADMIN_EMAILS", "aulspacecenter@gmail.com").split(",") if e.strip()
        ]]
        for email in dict.fromkeys(emails):
            admin, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "name": "CESPAR Admin",
                    "institution": "Anchor University Lagos",
                    "role": User.Role.ADMIN,
                    "email_verified": True,
                    "is_staff": True,
                    "is_superuser": True,
                },
            )
            if created:
                if on_server:
                    admin.set_unusable_password()
                    note = "set a password with Forgot password on the website"
                else:
                    admin.set_password("ChangeMe123!")
                    note = "local password ChangeMe123!"
                admin.save()
                self.stdout.write(self.style.SUCCESS(f"Seeded admin account: {email} ({note})"))
            elif not admin.email_verified or admin.role != User.Role.ADMIN:
                admin.email_verified = True
                admin.role = User.Role.ADMIN
                admin.save(update_fields=["email_verified", "role"])
                self.stdout.write(f"Made sure {email} is a verified admin.")
