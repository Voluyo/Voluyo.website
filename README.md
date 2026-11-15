# voluyo

*Travel with purpose, stay with impact.*

voluyo connects adult travelers (18+) with hosts — NGOs, aid and community projects, hotels, hostels,
educational and other organizations, private individuals and families — for voluntary,
non-monetary skill and cultural exchange.

**Status:** Slice 01 (foundation & discovery). Not launched, not deployed. There is no authentication,
no database and no real host data yet. See [`docs/architecture.md`](docs/architecture.md).

## Requirements

- Node.js ≥ 20.9 (developed with Node 22)
- npm

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000 → redirects to /en or /de
```

Production build:

```bash
npm run build
npm start          # http://localhost:3000
```

No environment variables or secrets are needed.

## Demo data

- `npm run dev` shows **fictional demo hosts and opportunities**, labelled “Demo” everywhere,
  plus a site-wide development-preview banner.
- Production builds (`npm run build && npm start`) show **no demo records** — Explore and the home page
  show honest empty states until real, approved data exists.

## What works today

- EN/DE pages under `/en/...` and `/de/...` (language switch keeps the current page and filters)
- Home page with hero search (country, city, check-in, check-out)
- Explore with URL-persisted filters: country, city, dates, host type, project category, skill
- Host detail pages for demo hosts
- How it works, Become a Host, Help Center
- Login / Sign up and legal pages as clearly marked placeholders

## Project layout

```
src/
  app/[locale]/        routes (home, explore, hosts/[slug], content & placeholder pages)
  proxy.ts             locale redirect for paths without /en or /de
  components/          layout shell, search forms, discovery cards, UI primitives
  domain/              minimal discovery types and taxonomies
  features/discovery/  URL params, date validation, filtering, data access, demo data
  i18n/                locale config, EN/DE dictionaries, Intl formatting
docs/architecture.md   current frontend and planned MVP boundaries
```

## Scripts

| Script              | Purpose                          |
| ------------------- | -------------------------------- |
| `npm run dev`       | Development server (demo data)   |
| `npm run build`     | Type-checked production build    |
| `npm start`         | Serve the production build       |
| `npm run typecheck` | TypeScript only (`tsc --noEmit`) |
