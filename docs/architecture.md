# voluyo — Architecture (Slice 01)

Status: **frontend foundation only.** Everything under "Planned MVP boundaries" is a design intent,
**not implemented**, and needs review before any provider, schema, contract or security policy is chosen.

## 0. Change-scope record

- Slice: `S01-FOUNDATION-DISCOVERY` (local work identifier, no Jira key).
- Base SHA: **none** — greenfield; the canonical repository `Voluyo/Voluyo.website` was empty.
  A commit-SHA-bound architecture reconciliation can only start from the first commit.
- Expected scope (recorded before the first write): Next.js app skeleton, `src/app/[locale]/*` routes,
  `src/proxy.ts`, `src/i18n/*`, `src/domain/*`, `src/features/discovery/*`, `src/components/*`,
  `README.md`, this document. No API, database, auth or deployment artifacts.

## 1. Current frontend

| Concern    | Choice (current) |
| ---------- | ---------------- |
| Framework  | Next.js 16 App Router, React 19, TypeScript strict (`noUncheckedIndexedAccess`) |
| Styling    | Tailwind CSS 4; all brand values are **provisional tokens** in `src/app/globals.css` |
| Fonts      | Fraunces + Figtree via `next/font` (self-hosted at build, no runtime Google requests) |
| i18n       | `/[locale]` segment (`en`, `de`); typed dictionaries, DE must match the EN shape; `Intl` for dates, plurals, country and language names |
| Locale routing | `src/proxy.ts` redirects un-prefixed paths by `Accept-Language`; no cookies |
| Data       | `features/discovery/repository.ts` (server-only) is the single read boundary |
| Brand      | Provisional text wordmark; the official logo must replace `Wordmark`, never be redrawn |

Rendering: content pages are static per locale; Explore and host detail render per request.
Client JavaScript is limited to the search forms, the mobile menu, nav state and the language switch.

### Discovery model (implemented, minimal)

- `PublicHostProfile` — WHO hosts. Has a `hostType`; `HOST_KIND` maps it to `organization | private`.
- `PublicOpportunity` — WHAT the exchange is. Belongs to one host; has its own `category`,
  `requestedSkills` and `availability` windows. A host can publish several.
- Host type, opportunity category and skills are three independent taxonomies (`src/domain/taxonomy.ts`).
- These are **public projections**, not storage schemas or API contracts.

### Search contract (implemented)

URL parameters (`features/discovery/search-params.ts`, shared by server and client):
`country` (ISO alpha-2), `city`, `checkin`, `checkout` (`YYYY-MM-DD`), `type`, `category`, `skill`.
Unknown values are dropped. Rules:

- Dates: both or neither; real calendar dates; check-out strictly after check-in; check-in not in the past.
  The client blocks navigation on invalid input; the server re-validates (using the earliest current
  date on Earth, UTC−12) and shows an error without applying the date filter.
- Host-level filters (country, city, type) apply to hosts; opportunity-level filters (category, skill,
  dates) apply to opportunities. A host is listed only if at least one opportunity matches.
- Dates use **overlap** (≥ 1 night) — discovery filtering, not matching.
- City search is case/accent-insensitive across all localized names ("Lisbon" = "Lissabon").

### Visibility today

- Development: synthetic demo records only, labelled "Demo" on every card and page plus a site banner.
- Production build: the repository returns **nothing**; pages show honest empty states.
- No verified badge exists. Demo labels are never a verification signal.

## 2. Planned MVP boundaries (not implemented)

### Public vs authenticated routes

- Public: `/[locale]`, `/explore`, `/hosts/[slug]`, content pages, legal pages.
- Authenticated (planned): `/[locale]/app/traveler/*`, `/[locale]/app/host/*` (dashboards, profile,
  trips, applications, messages), `/[locale]/app/admin/*` (moderation, role-gated).
- Every authenticated route and server action must check session and ownership on the server;
  `proxy.ts` may redirect for UX but is **never** the authorization layer.

### Authentication and sessions

- Planned methods: Google OAuth, Sign in with Apple, email/password with email verification and
  password reset. Login/Sign-up pages are placeholders today and must never simulate success.
- Undecided: auth provider/library, session strategy (cookie sessions vs JWT), account linking,
  age confirmation (18+) method. Needs security review.

### Profile ownership

- One account can hold a Traveler profile and/or be a member of a Host.
- Organization hosts: multiple members with roles (owner/admin/member). Private hosts and families:
  a single owning account. Opportunities are owned by the host, edited by authorized members only.
- Traveler profiles are private by default; any public visibility requires explicit opt-in.

### Opportunities vs host profiles

- Host profile = identity, type, broad location, description, languages, media, verification state.
- Opportunity = category, skills, availability, exchange description. Applications target an
  opportunity, not a host. Already reflected in the public types.

### Search and public visibility

- A host appears publicly only if **approved by moderation AND published by its owner**; an
  opportunity only if its host is visible and the opportunity itself is published.
- The repository must project to public fields (no contact data, no exact address, no internal notes).
- Pagination, sorting and search indexing are undecided.

### Trips, availability and matching

- Travelers will keep multiple planned trips (place + date range) and availability periods.
- Matching will be explainable: skills overlap, date coverage, location fit — with the reasons shown.
  Not implemented; discovery filtering must not be presented as matching.
- Profile completeness percentage is a Traveler profile feature (planned).

### Applications and state transitions (planned)

`draft → submitted → accepted | declined | withdrawn → completed | cancelled`.
Only the traveler submits/withdraws; only authorized host members accept/decline; transitions are
audited. Each application carries a personalized message. No payments, no mandatory exchange hours.

### Messaging

- A private conversation opens **only after acceptance**, scoped to that application's participants.
- Blocking closes the channel; reports attach to messages/profiles for moderation.
- Realtime transport and retention policy are undecided.

### Reviews

- Only after an application reaches `completed`, one review per side per exchange, within a time window.
- Reviews are moderated and cannot be edited after a grace period. Display rules undecided.

### Verification and moderation

- Organizations: organization verification (e.g. registration documents, domain email).
- Private hosts and families: stronger identity checks and safeguarding rules — especially wherever
  minors live in or are part of a hosting environment.
- Moderation queue for host approval, reports, blocks and takedowns; every decision audited.
- A "verified" badge renders only from real verification state.

### Map privacy

- The map (planned) consumes the same result set as the list. Hosts are shown only as **approximate
  areas** (city/region or coarse, server-generated cells) — never exact coordinates or addresses, never
  live traveler locations. Map provider and geocoding are undecided; no coordinates exist today.

### Database and media storage

- Undecided: database, ORM, migrations, hosting region (EU data residency is likely relevant).
- Media: uploads only by authorized owners, virus/type checks, EXIF/GPS stripping, moderation before
  public display, licensed assets only. No user uploads exist today.

### Future MCP integration (external AI agents)

- Planned extension, not part of the MVP build. Agents act on behalf of a user only via explicit,
  scoped, revocable consent (OAuth-style), with read-only public discovery as the first scope.
- Every agent action is audit-logged (agent identity, user, scope, action, timestamp). Agents never
  bypass application, messaging or visibility rules.

## 3. Extension points

| Capability | Where it plugs in |
| --- | --- |
| Persistence | Replace the body of `features/discovery/repository.ts`; keep its return types |
| Auth (Google, Apple, email) | New `app/[locale]/(auth)` routes + server-side session helper; replace placeholder pages |
| Storage / images | `PublicHostProfile` gains media references; `CoverArt` stays the no-image fallback |
| Maps | `ResultsViewToggle` → map view fed by the same `HostSearchResult[]` + approximate areas |
| Matching | New module beside `search.ts`; must return reasons, not just scores |
| Applications, chat, reviews | New feature folders under `src/features/*` with server-side authorization |
| MCP | Separate server/package consuming the same domain services with consent + audit |

## 4. Risks and open decisions

1. **Legal status of non-monetary exchange** — unpaid help at commercial hosts (hotels, hostels) and
   cross-border volunteering may fall under labour, visa or tax rules depending on country. Needs legal
   review before commercial hosts can publish opportunities.
2. **Safeguarding** — private hosts/families and any contact with minors need explicit policy.
3. **Legal pages** (Impressum, privacy policy, terms) are placeholders and block any public launch.
4. **Security headers** — only a baseline is set; CSP depends on auth/map/media providers.
5. **Robots** — every page is `noindex` pre-launch; revisit at launch.
6. **Brand** — tokens, fonts and wordmark are provisional until the official guideline is in the repo.
7. **Toolchain** — TypeScript is pinned to 5.9 (TS 7 is the native compiler line); revisit with Next.js support.
