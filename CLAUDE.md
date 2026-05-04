# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Contractor Hub is a career progression and evidence management platform for IT consultancies. Consultants log STAR-format evidence entries, mentors verify them, and verified evidence maps to frameworks like SFIA and DDaT to feed promotion readiness scores and compliance passports.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | SolidJS + Solid Router + Vite |
| Backend | Hono v4 (Node.js) |
| Database | PostgreSQL + Drizzle ORM |
| Auth | Better Auth (email/password) |
| Monorepo | pnpm workspaces |
| Env vars | dotenvx (loads root `.env` for all services) |

## Commands

```bash
# Development
pnpm dev              # All services in parallel (web :3000, api :5173, storybook :6006, db :5432)
pnpm dev:web          # Web only
pnpm dev:api          # API only
pnpm dev:ui           # Storybook only

# Database
pnpm --filter @consultancy/db db:generate   # Generate migration from schema changes
pnpm --filter @consultancy/db db:push       # Apply schema to DB
pnpm --filter @consultancy/db db:seed       # Seed demo data (destructive — clears first)
pnpm --filter @consultancy/db db:view       # Drizzle Studio at http://localhost:4983

# Code quality
pnpm exec prettier . --write

# Scaffold UI component boilerplate
pnpm gen:ui atoms InputField
pnpm gen:ui molecules SkillCard
```

No test suite is configured yet (`vitest` is installed as a devDependency but unused).

## Environment Setup

Create `.env` at the repo root (not per-app):

```env
DATABASE_URL=postgres://basic_dev:butter_iron_knife@localhost:5432/consultancy_hub
PORT=5173
NODE_ENV=development
BETTER_AUTH_URL=http://localhost:5173
BETTER_AUTH_SECRET=<run: npx auth secret>
WEB_URL=http://localhost:3000
VITE_API_URL=http://localhost:5173
```

The database runs in Docker. On first setup: start Docker Desktop, run `db:generate` + `db:push`, then `db:seed`.

## Architecture

### Monorepo Layout

- `apps/api` — Hono REST API, deployed independently
- `apps/web` — SolidJS SPA, deployed independently
- `packages/db` — Drizzle schema, migrations, queries, seed scripts
- `packages/ui` — Shared SolidJS component library (presentational only — no data fetching, no auth, no router)
- `packages/tokens` — CSS custom property design tokens
- `packages/config` — Shared TypeScript config

Cross-package imports use `@consultancy/*` aliases defined in each `package.json`.

### API (`apps/api`)

- Base path: `/api`
- Auth handler: `/auth/*` (Better Auth)
- Versioned routes under `/v0/*` (all require auth middleware)
- CORS: trusted origin is `WEB_URL` only

Key route groups: `/v0/users`, `/v0/evidence`, `/v0/projects`, `/v0/skills`, `/v0/readiness`, `/v0/endorsements`, `/v0/admin`, `/v0/setup`, `/v0/health`

Auth hook: on user registration, the API auto-creates a domain `usersTable` row, assigns the Consultant role, and links to Demo Consultancy org.

### Web (`apps/web`)

SolidJS Router pages: `/` (dashboard), `/sign-in`, `/register`, `/evidence/add`, `/evidence/list`, `/peer-review`, `/peer-review/:id`, `/admin/config`

Web ↔ API communication uses `VITE_API_URL` with `credentials: "include"` for session cookies. Standard response shape: `{ ok: boolean, data?: T, error?: string }`.

### Database (`packages/db`)

- Schema files split by domain in `packages/db/src/schema/` (enums in `enums.ts`)
- Query files mirror the schema structure in `packages/db/src/queries/`
- UUID primary keys, `{ ...timestamps }` spread helper for `created_at`/`updated_at`
- Better Auth tables use `bauth_` prefix; managed by the Drizzle adapter
- Evidence supports versioning via `parent_id` self-reference and soft-delete via `deleted_at`

Key domain tables: users, evidence, skills, skill_levels, projects, organizations, competencies, job_roles, role_requirements, endorsements, user_relationships

## Conventions

### Database

- Add new enums to `packages/db/src/schema/enums.ts`
- Use the `timestamps` spread helper on every new table
- Column names: snake_case; TypeScript identifiers: camelCase (Drizzle handles mapping)

### UI Components

Every component in `packages/ui` requires exactly three files:
- `ComponentName.tsx`
- `ComponentName.module.css`
- `ComponentName.stories.tsx`

Export new components from `packages/ui/src/index.ts`.

### Design Tokens (mandatory)

All styling must use CSS custom properties from `packages/tokens/`. Never hardcode hex values, px/rem sizes, or border-radius values. Never use `var(--token, fallback)` — fallbacks hide missing-token bugs.

Key semantic tokens:
- `--color-primary` (amber) — CTAs, links, "Read more" controls only
- `--color-accent` (teal) — skills, data visualisation, progress indicators
- `--color-text-primary` — body text and headings (not `--color-text`)
- `--color-text-secondary` — supporting labels; `--color-text-muted` — captions/metadata
- `--color-container` — card/panel backgrounds (not `--color-surface`, which is page-level)
- `--color-success-subtle` / `--color-warning-subtle` / `--color-error-subtle` — status badge backgrounds
- `--color-on-warning` — text on warning-subtle background

If a needed value has no token, add it to the appropriate file in `packages/tokens/` rather than hardcoding it.

### Styling

Use CSS Modules (`ComponentName.module.css`). Only use inline `style={{}}` for genuinely dynamic per-instance values passed as props.

### File naming

- Files: kebab-case
- Components / classes: PascalCase
- DB columns: snake_case
