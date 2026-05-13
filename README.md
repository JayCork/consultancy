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
- [Creating Your User Account](#creating-your-user-account)
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
VITE_API_URL=http://localhost:3000

# Organisation ID for the dev seed scripts.
# Set this after your first registration — find the ID in Drizzle Studio (db:view).
ORG_ID=your-org-uuid-here

# Your registered email — used by db:seed-my-user to link your account into the dev hierarchy.
MY_USER_EMAIL=you@example.com
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

# 6. Start all services
pnpm dev

# 7. Register your account at http://localhost:3000/register
#    This creates your org — note the org ID from Drizzle Studio (db:view)

# 8. Add ORG_ID to your .env, then seed representative dev data
ORG_ID=<your-org-id> pnpm --filter @consultancy/db db:seed-dev
```

---

## Seeding the Database

There are two separate seeding steps with different purposes.

### 1. Reference data (`db:seed`)

Seeds global, organisation-agnostic data that the application depends on:

- Clearance levels (BPSS, SC, DV — UK, US, CA, AU, NZ, IRL)
- Reference frameworks (SFIA 9, DDaT 2024) and their skill/role definitions
- Platform skill taxonomy and proficiency level descriptors
- Platform default framework role families and roles
- Default tags (technologies, tools, practices, methodologies, domains)

This is safe to run in any environment and is idempotent.

```bash
pnpm --filter @consultancy/db db:seed
```

### 2. Dev data (`db:seed-dev`)

Seeds representative data for a fictional small consultancy that has been using the platform for approximately a year. Requires an existing organisation — pass the org ID via the `ORG_ID` environment variable.

```bash
# Using an env var in .env
pnpm --filter @consultancy/db db:seed-dev

# Or inline
ORG_ID=9d193e54-74bd-40d5-ba48-bf0c338e6f8a pnpm --filter @consultancy/db db:seed-dev
```

**What gets created:**

| Entity | Count | Notes |
|--------|-------|-------|
| Users | 12 | 2 PMs, 1 delivery manager, 1 BA, 2 senior devs, 2 mid devs, 2 junior devs, 1 associate dev |
| User relationships | 19 | Full line management chain, mentoring pairs, peer links |
| Org skills | 20 | Concrete technology and practice skills scoped to the org |
| Competencies | 36 | Skill proficiency records per user |
| Projects | 6 | Two closed, two in delivery, one mobilising, one bidding |
| Project memberships | 33 | Includes staff rotations between projects |
| Evidence entries | 20 | Spread of draft / submitted / verified across the project timeline |
| Evidence–skill links | 37 | Skills claimed per evidence entry with proficiency level |
| Endorsements | 35 | All statuses represented: endorsed, pending, skipped, flagged |

The script is idempotent and can be re-run safely. Use `--only` to re-seed a specific section without touching the rest:

```bash
# Re-seed only evidence (useful when iterating on evidence features)
ORG_ID=<uuid> pnpm --filter @consultancy/db db:seed-dev -- --only=evidence

# Available sections: skills, users, grades, relationships, projects, members, competencies, evidence
```

### 3. Link your own account (`db:seed-my-user`)

After registering via the web app, run this to slot your account into the seeded hierarchy. It creates line management and mentor relationships between your real user and the seed users, and adds you to a project.

```bash
# Defaults: James Okafor manages you, you manage Connor Walsh, joined to NPP as developer
MY_USER_EMAIL=you@example.com ORG_ID=<uuid> pnpm --filter @consultancy/db db:seed-my-user

# Choose your own manager, report, project, and role
MY_USER_EMAIL=you@example.com \
MY_MANAGER_EMAIL=rachel.torres@dev-seed.com \
MY_REPORT_EMAIL=tom.bradley@dev-seed.com \
MY_PROJECT=FCT \
MY_PROJECT_ROLE=tech_lead \
ORG_ID=<uuid> pnpm --filter @consultancy/db db:seed-my-user

# No report (you're at the bottom of the chain)
MY_USER_EMAIL=you@example.com MY_REPORT_EMAIL=none ORG_ID=<uuid> pnpm --filter @consultancy/db db:seed-my-user
```

The script is safe to re-run — it checks for existing relationships before inserting.

| Env var | Default | Options |
|---------|---------|---------|
| `MY_USER_EMAIL` | — (required) | Your registered email |
| `MY_MANAGER_EMAIL` | `james.okafor@dev-seed.com` | Any seed user email |
| `MY_REPORT_EMAIL` | `connor.walsh@dev-seed.com` | Any seed user email, or `none` |
| `MY_PROJECT` | `NPP` | `DTP`, `SCAP`, `NPP`, `FCT`, `RAP`, `GDE` |
| `MY_PROJECT_ROLE` | `developer` | `developer`, `tech_lead`, `delivery_manager`, `analyst`, `designer`, `project_manager` |

### 4. Endorsement batch (`db:seed-endorsement-batch`)

Creates a small set of evidence entries in `submitted` status with `pending` endorsements, ready to walk through the endorsement review flow. Run this when developing or testing the endorsement feature without re-seeding everything.

```bash
pnpm --filter @consultancy/db db:seed-endorsement-batch
```

Configurable via environment variables:

```bash
# Use a different user as the evidence subject
SUBJECT_EMAIL=priya.sharma@dev-seed.com \
ORG_ID=<uuid> pnpm --filter @consultancy/db db:seed-endorsement-batch

# Full configuration
SUBJECT_EMAIL=priya.sharma@dev-seed.com \
ENDORSER_1_EMAIL=rachel.torres@dev-seed.com \
ENDORSER_2_EMAIL=james.okafor@dev-seed.com \
ORG_ID=<uuid> pnpm --filter @consultancy/db db:seed-endorsement-batch
```

The created evidence IDs are printed to stdout so you can navigate to them directly.

---

## Creating Your User Account

After seeding, register an account through the web app.

1. Start the dev servers: `pnpm dev`
2. Open `http://localhost:3000/register`
3. Enter your name, email, and a password

When you register, the API automatically creates your user profile and associates you with the organisation.

To sign in as a dev seed user (e.g. to see what the app looks like from a specific role), you will need to set a password for that account via the database or use the auth reset flow — the seed users are created without passwords since they represent existing platform users, not local auth accounts.

---

## Running the App

**Start everything at once** (recommended):

```bash
pnpm dev
```

This starts in parallel:

| Service   | URL                   | Description         |
| --------- | --------------------- | ------------------- |
| Web app   | http://localhost:3000 | SolidJS frontend    |
| API       | http://localhost:5173 | Hono REST API       |
| Storybook | http://localhost:6006 | Component explorer  |
| Database  | localhost:5432        | PostgreSQL (Docker) |

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
pnpm --filter @consultancy/db db:push                  # Push schema changes to the database
pnpm --filter @consultancy/db db:generate              # Generate a migration file from schema changes
pnpm --filter @consultancy/db db:apply-migrations      # Apply pending migrations
pnpm --filter @consultancy/db db:view                  # Open Drizzle Studio at http://localhost:4983
pnpm --filter @consultancy/db db:seed                  # Seed reference data (frameworks, clearances, skills)
pnpm --filter @consultancy/db db:seed-dev              # Seed representative dev data (requires ORG_ID)
pnpm --filter @consultancy/db db:seed-endorsement-batch  # Create a small endorsement test batch (requires ORG_ID)
pnpm --filter @consultancy/db db:seed-my-user           # Link your registered account into the dev hierarchy (requires MY_USER_EMAIL + ORG_ID)
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

---

## Dev Seed Reference

### Users

All dev seed users have emails in the format `{firstname}.{lastname}@dev-seed.com`.

| Name | Email | Role | Grade |
|------|-------|------|-------|
| Sarah Chen | sarah.chen@dev-seed.com | Principal PM | Principal Product Manager |
| Marcus Webb | marcus.webb@dev-seed.com | Senior PM | Lead Product Manager |
| Kate Morrison | kate.morrison@dev-seed.com | Lead Delivery Manager | Lead Agile Delivery Manager |
| Rachel Torres | rachel.torres@dev-seed.com | Lead Developer | Lead Software Developer |
| James Okafor | james.okafor@dev-seed.com | Senior Developer | Senior Software Developer |
| Priya Sharma | priya.sharma@dev-seed.com | Senior Developer | Senior Software Developer |
| Tom Bradley | tom.bradley@dev-seed.com | Mid Developer | Software Developer |
| Aisha Johnson | aisha.johnson@dev-seed.com | Mid Developer | Software Developer |
| Connor Walsh | connor.walsh@dev-seed.com | Junior Developer | Junior Software Developer |
| Elena Petrov | elena.petrov@dev-seed.com | Junior Developer | Junior Software Developer |
| Dev Martinez | dev.martinez@dev-seed.com | Associate Developer | Associate Software Developer |
| Liam Chen | liam.chen@dev-seed.com | Business Analyst | Business Analyst |

### Line Management Hierarchy

```
Sarah Chen (Principal PM)
├── Marcus Webb (Lead PM)
│   └── Rachel Torres (Lead Developer)
│       ├── James Okafor (Senior Developer)
│       │   ├── Tom Bradley (Mid Developer)
│       │   └── Connor Walsh (Junior Developer)
│       └── Priya Sharma (Senior Developer)
│           ├── Aisha Johnson (Mid Developer)
│           ├── Elena Petrov (Junior Developer)
│           └── Dev Martinez (Associate Developer)
└── Kate Morrison (Lead Delivery Manager)
    └── Liam Chen (Business Analyst)
```

### Projects

| Project | Short | Status | Period |
|---------|-------|--------|--------|
| Digital Transformation Portal | DTP | Closed | Mar 2025 – Oct 2025 |
| Smart City Analytics Platform | SCAP | Closed | Jul 2025 – Feb 2026 |
| NHS Patient Portal | NPP | In delivery | Oct 2025 – present |
| Financial Compliance Tracker | FCT | In delivery | Jan 2026 – present |
| Retail AI Platform | RAP | Mobilising | Apr 2026 – present |
| Government Data Exchange | GDE | Bidding | Jul 2026 (planned) |

### Evidence and Endorsement States

The seed data covers the full evidence lifecycle:

| Project | Evidence status | Endorsement status |
|---------|----------------|-------------------|
| DTP (closed 7 months ago) | `verified` | All `endorsed`, with notes |
| SCAP (closed 2 months ago) | `verified` and `submitted` | Mix of `endorsed` and `pending` |
| NPP / FCT (active 4–8 months) | `submitted` | Mix of `pending`, one `endorsed`, one `skipped` |
| RAP (just started) | `draft` | None |

One endorsement is set to `flagged` (on Priya's FCT rule engine evidence) — useful for testing the flagged review flow.
