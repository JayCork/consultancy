# Contractor Hub

A career progression and evidence management platform for IT consultancies operating in government and regulated markets.

Consultants log STAR-format evidence entries, peers verify them, and verified evidence auto-maps to frameworks like SFIA and DDaT — feeding into bid responses, promotion readiness scores, and compliance passports.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Quick Start](#quick-start)
- [Seeding the Database](#seeding-the-database)
- [Signing In](#signing-in)
- [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Dev Seed Reference](#dev-seed-reference)

---

## Tech Stack

| Layer    | Technology                   |
| -------- | ---------------------------- |
| Frontend | SolidJS + Vite               |
| Backend  | Hono (Node.js)               |
| Database | PostgreSQL (Docker)          |
| ORM      | Drizzle                      |
| Auth     | Better-Auth (email/password) |
| Monorepo | pnpm workspaces              |

---

## Prerequisites

Before you begin, install the following:

- **Node.js** v20+
- **pnpm** v10 — `npm install -g pnpm`
- **Docker Desktop** — must be running before `pnpm dev`

---

## Environment Variables

Create a `.env` file in the project root with the following values:

```env
# Database — matches the Docker container created by the dev script
DATABASE_URL=postgres://basic_dev:butter_iron_knife@localhost:5432/consultancy_hub

# API server port and environment
PORT=5173
NODE_ENV=development

# API server base URL (used by better-auth for redirects)
BETTER_AUTH_URL=http://localhost:5173

# Generate this with: npx auth secret
BETTER_AUTH_SECRET=your_secret_here

# Web app origin (used by auth for CORS)
WEB_URL=http://localhost:3000

# Tells the web app where the API lives
VITE_API_URL=http://localhost:5173
```

**Generating `BETTER_AUTH_SECRET`:**

```bash
npx auth secret
```

Copy the output into your `.env` file.

---

## Database Setup

The database runs in a Docker container. The dev script manages it automatically, but you need to create the container and push the schema on first run.

**Step 1 — Start Docker Desktop, then create the database container:**

```bash
docker run --name consultancy_hub \
  -e POSTGRES_PASSWORD=butter_iron_knife \
  -e POSTGRES_USER=basic_dev \
  -e POSTGRES_DB=consultancy_hub \
  -d -p 5432:5432 postgres
```

**Step 2 — Push the Drizzle schema to the database (creates all tables):**

```bash
pnpm --filter @consultancy/db db:push
```

**Inspect the database** at any time with Drizzle Studio:

```bash
pnpm --filter @consultancy/db db:view
# Opens at http://localhost:4983
```

---

## Quick Start

Full setup from scratch:

```bash
# 1. Clone and install
git clone <repo-url>
cd consultancy
pnpm install

# 2. Create your .env file (see Environment Variables above)

# 3. Start Docker Desktop and create the database container (see Database Setup above)

# 4. Push the schema
pnpm --filter @consultancy/db db:push

# 5. Seed reference data (frameworks, clearance levels, skills taxonomy)
pnpm --filter @consultancy/db db:seed

# 6. Seed representative dev data (Zaizi org + 48 users + projects)
pnpm --filter @consultancy/db db:seed-dev

# 7. Start all services
pnpm dev

# 8. Sign in at http://localhost:3000 using any seed user (see Signing In below)
```

---

## Seeding the Database

There are three separate seeding steps with different purposes.

### 1. Reference data (`db:seed`)

Seeds global, organisation-agnostic data that the application depends on:

- Clearance levels (BPSS, SC, DV — UK, US, CA, AU, NZ, IRL)
- Reference frameworks (SFIA 9, DDaT 2024) and their skill/role definitions
- Platform skill taxonomy and proficiency level descriptors
- Platform default framework role families and roles
- Default tags (technologies, tools, practices, methodologies, domains)

This is safe to run in any environment and is idempotent — running it multiple times will not create duplicate records.

```bash
pnpm --filter @consultancy/db db:seed
```

### 2. Dev data (`db:seed-dev`)

Seeds representative data for the Zaizi consultancy. The script is self-contained — it creates the organisation, clubs, and all users automatically. No environment variables required beyond `DATABASE_URL`.

```bash
pnpm --filter @consultancy/db db:seed-dev
```

**What gets created:**

| Entity | Count | Notes |
|--------|-------|-------|
| Organisation | 1 | Zaizi |
| Clubs (org units) | 5 | Club Arran, Rum, Islay, Jura, Applied AI |
| Users | 48 | 44 Club Arran + 4 placeholder leads for other clubs |
| Auth accounts | 48 | All sign in with `Password123!` |
| Job grades | ~25 | Zaizi grade names mapped to platform framework roles |
| Grade assignments | 48 | One per user |
| Line management relationships | 46 | Full Club Arran hierarchy |
| Projects | 6 | Across all delivery lifecycle statuses |
| Project memberships | ~25 | Current team assignments |
| Evidence entries | 11 | STAR format across 5 users, all statuses |
| Endorsements | ~18 | All statuses: endorsed, pending, skipped, flagged |

The script is idempotent — re-running it skips sections where data already exists.

### 3. E2E test baseline (`db:seed-e2e`)

Seeds a small, stable, predictable dataset for automated end-to-end tests in a separate "Acme Consulting E2E" organisation. Uses fixed auth IDs so tests can make reliable assertions.

```bash
pnpm --filter @consultancy/db db:seed-e2e
```

**What gets created:**

| Entity | Detail |
|--------|--------|
| Organisation | Acme Consulting E2E |
| Users | 4 — admin, manager, mentor, consultant |
| Projects | 2 — Alpha Project (in_delivery), Beta Project (bidding) |
| Evidence | 8 entries across draft / submitted / verified |
| Endorsements | 9 — all statuses represented |

**To reset the E2E data back to baseline** (wipes all E2E org data, then re-seeds):

```bash
pnpm --filter @consultancy/db db:reset-e2e
```

---

## Signing In

### Dev seed users

All dev seed users have emails in the format `firstname@zaizi.com` and the password `Password123!`. You can sign in as any of them to explore the app from different roles and seniority levels.

```
gordon@zaizi.com   — Club Executive (SFIA 7)
nikki@zaizi.com    — Head of Product (SFIA 7)
seyed@zaizi.com    — Head of Engineering (SFIA 6)
jay@zaizi.com      — Lead Software Developer (SFIA 5)
trusha@zaizi.com   — Lead Delivery Manager (SFIA 5)
bradley@zaizi.com  — Senior Business Analyst (SFIA 4)
joek@zaizi.com     — Software Developer (SFIA 3)
asha@zaizi.com     — Test Engineer (Junior, SFIA 2)
```

See [Dev Seed Reference](#dev-seed-reference) for the full list.

### Registering your own account

You can also register a new account via `http://localhost:3000/register`. Your account will be created in a pending state — an admin will need to assign it to an organisation, or you can update the record directly in Drizzle Studio (`db:view`).

---

## Running the App

**Start everything at once** (recommended):

```bash
pnpm dev
```

This starts in parallel:

| Service   | URL                    | Description         |
| --------- | ---------------------- | ------------------- |
| Web app   | http://localhost:3000  | SolidJS frontend    |
| API       | http://localhost:5173  | Hono REST API       |
| Storybook | http://localhost:6006  | Component explorer  |
| Database  | localhost:5432         | PostgreSQL (Docker) |

**Start services individually:**

```bash
pnpm dev:web    # Web app only
pnpm dev:api    # API only
pnpm dev:ui     # Storybook only
pnpm --filter @consultancy/db dev  # Database container only
```

**API health check:**

```bash
curl http://localhost:5173/api/health
```

---

## Project Structure

```
consultancy/
├── apps/
│   ├── api/          # Hono REST API
│   └── web/          # SolidJS frontend
├── packages/
│   ├── db/           # Drizzle schema, migrations, queries, seed scripts
│   ├── ui/           # Shared component library (Storybook)
│   ├── tokens/       # Design tokens
│   └── config/       # Shared TypeScript/tooling config
├── docs/
│   └── spec.md       # Full technical specification
├── scripts/
│   └── start-db.mjs  # Docker container management script
└── .env              # Local environment variables (not committed)
```

`apps/` contains runnable services — each has an entry point, a runtime, and would be deployed independently.

`packages/` contains shared libraries — imported by apps, not run directly.

---

## Available Scripts

Run from the project root unless noted.

### Development

```bash
pnpm dev              # Start all services
pnpm dev:web          # Web app only
pnpm dev:api          # API only
pnpm dev:ui           # Storybook only
```

### Database

```bash
pnpm --filter @consultancy/db db:push              # Push schema changes to the database
pnpm --filter @consultancy/db db:generate          # Generate a migration file from schema changes
pnpm --filter @consultancy/db db:apply-migrations  # Apply pending migrations
pnpm --filter @consultancy/db db:view              # Open Drizzle Studio at http://localhost:4983
pnpm --filter @consultancy/db db:seed              # Seed reference data (frameworks, clearances, skills)
pnpm --filter @consultancy/db db:seed-dev          # Seed Zaizi dev data (org + 48 users + projects)
pnpm --filter @consultancy/db db:seed-e2e          # Seed E2E test baseline
pnpm --filter @consultancy/db db:reset-e2e         # Wipe and re-seed E2E baseline
```

### Code Quality

```bash
pnpm exec prettier . --write                                  # Format all files
pnpm exec prettier "src/components/atoms/**/*.tsx" --write    # Format specific files
```

### UI Component Generation

Scaffold a new component with boilerplate:

```bash
pnpm gen:ui atoms InputField
pnpm gen:ui molecules SkillCard
```

