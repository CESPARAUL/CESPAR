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
        "format": "CSV / IAGA-2002",
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

        admin_email = "admin@cespar.space"
        admin, created = User.objects.get_or_create(
            email=admin_email,
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
            admin.set_password("ChangeMe123!")
            admin.save()
            self.stdout.write(
                self.style.SUCCESS(
                    f"Seeded admin account: {admin_email} / ChangeMe123! (change this password)"
                )
            )
        elif not admin.email_verified:
            admin.email_verified = True
            admin.save(update_fields=["email_verified"])
            self.stdout.write(f"Marked existing admin account ({admin_email}) as verified.")

        self.stdout.write(self.style.SUCCESS(f"Seeded {len(DATASETS)} datasets."))
