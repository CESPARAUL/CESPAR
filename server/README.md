# CESPAR Server

Django + Django REST Framework API for the CESPAR website: authentication
and the research data-request workflow. See the
[project root README](../README.md) for the full monorepo overview.

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # then fill in your Resend API key
python manage.py migrate
python manage.py seed_data     # seeds datasets + admin@cespar.space
python manage.py runserver 4000
```

The API runs on port 4000 to match `NEXT_PUBLIC_API_URL` in
`webapp/.env.local` — no frontend changes needed.

Django admin is at `http://localhost:4000/admin/` (log in with the seeded
admin account, or `python manage.py createsuperuser`).

## API

Every response is camelCase on the wire (via
`djangorestframework-camel-case`) even though the Python/Django side is
idiomatic snake_case — configured in `config/settings.py`.

| Method | Route                  | Auth        | Description |
|--------|------------------------|-------------|--------------|
| POST   | `/api/auth/register`   | —           | Create an unverified researcher account, emails an OTP |
| POST   | `/api/auth/verify-email` | —         | Confirm the OTP, returns a JWT + user |
| POST   | `/api/auth/resend-otp` | —           | Resend a verification code (60s cooldown) |
| POST   | `/api/auth/login`      | —           | Returns a JWT + user, or 403 `EMAIL_NOT_VERIFIED` |
| GET    | `/api/auth/me`         | Bearer      | Current user |
| GET    | `/api/datasets`        | —           | Public dataset catalogue |
| GET    | `/api/datasets/:slug`  | —           | Single dataset |
| POST   | `/api/requests`        | Bearer      | Submit a data request |
| GET    | `/api/requests/me`     | Bearer      | Your own requests, newest first (`?archived=true` for archived instead of active) |
| GET    | `/api/requests`        | Bearer+Admin| All requests |
| PATCH  | `/api/requests/:id`    | Bearer+Admin| Approve/reject/fulfil a request |
| PATCH  | `/api/requests/:id/archive` | Bearer | Archive/unarchive your own request (owner or admin) — visibility only, doesn't touch status |
| GET    | `/api/magnetometer/status`   | Bearer | Latest reading time + archive coverage — any logged-in user |
| GET    | `/api/magnetometer/latest`   | Bearer+Approved | Despiked, 1-min-averaged readings (`?hours=`, default 24, max 720/30d) for the live chart |
| GET    | `/api/magnetometer/download` | Bearer+Approved | Raw CSV export for a date range (`?from=&to=`, max 90 days) |

`Bearer+Approved` reuses the `/api/requests` workflow above: the user needs
an `APPROVED` (or `FULFILLED`) `DataRequest` against the "Magnetometer
Data" dataset (`apps.magnetometer.permissions.HasApprovedMagnetometerAccess`).
Admins always pass. `/status` is intentionally left open to any logged-in
user as a teaser (reveals freshness/volume, not field data) so people know
there's something worth requesting.

## Structure

```
config/           settings.py, urls.py, wsgi.py
apps/
├── core/         TimeStampedModel, UUIDModel, health check, exception handler
├── accounts/     custom email-based User, EmailOTP, auth endpoints
├── datasets/     Dataset model + public catalogue endpoints
├── data_requests/  DataRequest model + request/approval workflow
└── magnetometer/ MagnetometerImport/Reading models, .dat parser, live+download endpoints
templates/accounts/email/  OTP email template
```

Ingesting magnetometer data: `python manage.py ingest_magnetometer path/to/MagData_DD_Mon_YYYY.dat`
(also available as a "Parse selected file(s) into readings" admin action after
uploading a `.dat` file to a `MagnetometerImport` in `/admin/`).

## Notes

- Every exposed model uses a UUID primary key (`apps.core.models.UUIDModel`)
  so IDs aren't enumerable and serialize as opaque strings.
- All URL patterns are written **without** trailing slashes, and
  `APPEND_SLASH = False` is set — the frontend calls every path without a
  trailing slash, and a redirect on a mismatched POST/PATCH would drop the
  request body.
- `EMAIL_HOST_USER`/`EMAIL_HOST_PASSWORD` unset → falls back to Django's
  console email backend, and `apps.accounts.utils.send_otp_email` also
  logs the raw code (`[otp] Verification code for ... is: ...`) whenever
  `DJANGO_DEBUG=True`, so the signup flow is testable with zero SMTP setup.
- This replaces an earlier Node/Express/Prisma backend; this Django
  backend implements the exact same JSON contract, so `webapp/` needed
  zero changes.
