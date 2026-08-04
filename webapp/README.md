# CESPAR Webapp

Next.js (App Router, TypeScript, Tailwind CSS v4) frontend for the CESPAR
website. See the [project root README](../README.md) for the full
monorepo overview and quick-start instructions.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Requires the
`server/` API running for auth, the dataset catalogue and data requests
(see `../server/README.md`).

## Structure

```
src/
├── app/            ← routes (App Router)
├── components/
│   ├── layout/     ← Header, Footer
│   ├── home/       ← homepage sections
│   ├── auth/       ← login/register shell
│   └── ui/         ← shared primitives (Button, Container, StarField, ...)
├── data/content.ts ← site copy sourced from the legacy WordPress site
├── lib/            ← API client, auth context, utils
└── types/          ← shared TypeScript types
```
