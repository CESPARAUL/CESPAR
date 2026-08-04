# CESPAR

Monorepo for the new Centre for Space Research (CESPAR), Anchor University
Lagos website — replacing the legacy WordPress site at cespar.space.

```
CESPAR/
├── webapp/   ← Next.js (TypeScript, Tailwind) frontend
├── server/   ← Django + DRF backend API
├── docs/     ← Scraped content from the old WordPress site, original logo
└── README.md
```

## Current status

- **Frontend:** landing page, About, Research, Publications, Team and
  Contact pages built with a dark, space-themed UI using the CESPAR
  brand colors (red + navy, pulled from the institutional logo), a
  continuously drifting starfield background, and a NASA aurora photo in
  the hero. Login, registration (with email OTP verification) and a
  researcher dashboard are wired to the backend API. Team photos are
  placeholders until real assets are supplied.
- **Backend:** Django + DRF, JWT authentication (register → email OTP →
  login → me), a public dataset catalogue, and a data-request workflow
  (submit → admin review → approve/reject/fulfil) are built and tested.
- **Not yet built:** an admin UI for reviewing/approving requests (the
  API supports it — `PATCH /api/requests/:id` — but there's no screen
  for it yet), email notifications on request status changes, and
  payment integration (explicitly out of scope for now per the team's
  planning notes — the site runs offline/free until that changes).

## Quick start

**Backend** (http://localhost:4000):

```bash
cd server
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env      # then fill in your Gmail app password
python manage.py migrate
python manage.py seed_data # seeds the 4 datasets + an admin account
python manage.py runserver 4000
```

Seeded admin login: `admin@cespar.space` / `ChangeMe123!` (change this
before using in anything beyond local development).

**Frontend** (http://localhost:3000):

```bash
cd webapp
npm install
npm run dev
```

The frontend reads `NEXT_PUBLIC_API_URL` from `webapp/.env.local`
(defaults to `http://localhost:4000/api`).

## Content source

All copy (About, Research, Team, Publications, footer contact details)
was scraped from the live WordPress site via its REST API and is stored
in `webapp/src/data/content.ts`. The raw scrape is kept in
`docs/wordpress-content-dump.txt` for reference. The original logo is in
`docs/original-logo.png` — brand colors in the new UI were derived from it.
