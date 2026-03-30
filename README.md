# Contractor Hub

A career progression and evidence management platform for IT consultancies operating in government and regulated markets.

Consultants log STAR-format evidence entries, mentors verify them, and verified evidence auto-maps to frameworks like SFIA and DDaT — feeding into bid responses, promotion readiness scores, and compliance passports.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Seed Demo Data](#seed-demo-data)
- [Creating Your User Account](#creating-your-user-account)
- [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Demo Data Reference](#demo-data-reference)

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

## Quick Start

For the impatient — full setup from scratch:

```bash
# 1. Clone and install
git clone <repo-url>
cd consultancy
pnpm install

# 2. Create your .env file (see Environment Variables below)
cp .env.example .env   # or create .env manually

#3. Create and start the database container (if not using the dev script to manage it)
docker run --name drizzle-postgres \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_USER=admin \
  -d -p 5432:5432 postgres

docker exec -it drizzle-postgres psql -U admin -c "CREATE DATABASE mydatabase;"


# 4. Start Docker Desktop, then push the schema and seed demo data
pnpm --filter @consultancy/db db:push
pnpm --filter @consultancy/db db:seed

# 5. Start all services
pnpm dev

# 6. Register your account at http://localhost:3000/register
#    Your account is automatically linked to the Demo Consultancy organisation
```

---

## Environment Variables

Create a `.env` file in the project root with the following values:

```env
# Database — matches the Docker container created by the dev script
DATABASE_URL=postgres://admin:mypassword@localhost:5432/mydatabase

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

The database runs in a Docker container. The dev script manages it automatically, but you need to push the schema first.

**Step 1 — Start Docker Desktop**, then run:

```bash
# Push the Drizzle schema to the database (creates all tables)
pnpm --filter @consultancy/db db:push
```

This creates the `drizzle-postgres` container on its first run (or starts it if it already exists).

**Inspect the database** with Drizzle Studio:

```bash
pnpm --filter @consultancy/db db:view
# Opens at http://localhost:4983
```

---

## Seed Demo Data

The seed script populates the database with a realistic demo organisation, consultants, projects, and skills.

```bash
pnpm --filter @consultancy/db db:seed
```

**What gets created:**

| Entity            | Count | Details                                                                                                 |
| ----------------- | ----- | ------------------------------------------------------------------------------------------------------- |
| Organisation      | 1     | "Demo Consultancy"                                                                                      |
| Users             | 10    | Mix of developer roles: Junior, Mid, Senior, Lead, Principal, Frontend, Backend, Full Stack, DevOps, EM |
| Projects          | 8     | Government and commercial clients (see [Demo Data Reference](#demo-data-reference))                     |
| Skills            | 8     | Full-stack web developer skills across frontend, backend, and DevOps disciplines                        |
| Skill Levels      | 40    | 5 proficiency levels per skill, each with detailed criteria                                             |
| Job Roles         | 5     | Junior → Principal developer career ladder                                                              |
| Role Requirements | 38    | Skill + level requirements per role, mapping the full career progression                                |

> The seed script clears existing data before re-seeding, so it is safe to run multiple times.

---

## Creating Your User Account

After seeding, register an account through the web app. The system automatically links new accounts to the Demo Consultancy organisation.

**Demo account (created by the seed script):**

| Field        | Value              |
| ------------ | ------------------ |
| Email        | `example@demo.com` |
| Password     | `Password123!`     |
| Role         | Senior Developer   |
| Organisation | Demo Consultancy   |

Sign in at `http://localhost:3000/sign-in` with these credentials — no registration needed.

**Registering a new account:**

If you want to create your own account:

1. Start the dev servers: `pnpm dev`
2. Open `http://localhost:3000/register`
3. Enter your name, email, and a password — you are immediately signed in

When you register, a database hook in the API automatically:

- Creates your domain user profile
- Assigns you the **Consultant** role
- Associates you with **Demo Consultancy**

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
pnpm --filter @consultancy/db db:push       # Push schema changes to the database
pnpm --filter @consultancy/db db:generate   # Generate a migration file from schema changes
pnpm --filter @consultancy/db db:seed       # Seed demo data (clears existing data first)
pnpm --filter @consultancy/db db:view       # Open Drizzle Studio at http://localhost:4983
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

## Demo Data Reference

### Organisation

| Field                       | Value               |
| --------------------------- | ------------------- |
| Name                        | Demo Consultancy    |
| Promotion threshold         | 80% readiness score |
| Evidence required per skill | 3 verified entries  |

### Projects

| Project                            | Sector             |
| ---------------------------------- | ------------------ |
| Home Office Digital Platform       | Central Government |
| NHS Patient Portal                 | Health             |
| MOD Personnel System               | Defence            |
| Transport for London Data Platform | Transport          |
| Barclays Digital Banking           | Commercial         |
| HMCTS Case Management              | Justice            |
| DfE Schools Data Service           | Education          |
| Camden Council Digital Services    | Local Government   |

### Skills

| Skill                       | Levels |
| --------------------------- | ------ |
| Frontend Engineering        | 1–5    |
| Backend Engineering         | 1–5    |
| TypeScript / JavaScript     | 1–5    |
| Testing & Quality Assurance | 1–5    |
| DevOps & CI/CD              | 1–5    |
| Database Design             | 1–5    |
| API Design                  | 1–5    |
| Web Security                | 1–5    |

### Job Roles (Career Ladder)

| Role                | Seniority | Required Skills                                                                                         |
| ------------------- | --------- | ------------------------------------------------------------------------------------------------------- |
| Junior Developer    | 1         | Frontend L1, Backend L1, TypeScript L1, Testing L1                                                      |
| Mid-Level Developer | 2         | Frontend L2, Backend L2, TypeScript L2, Testing L2, DevOps L1, API Design L1                            |
| Senior Developer    | 3         | Frontend L3, Backend L3, TypeScript L2, Testing L2, DevOps L2, DB Design L2, API Design L2, Security L2 |
| Lead Developer      | 4         | Frontend L3, Backend L3, TypeScript L3, Testing L3, DevOps L3, DB Design L3, API Design L3, Security L3 |
| Principal Developer | 5         | All 8 skills at Level 4                                                                                 |

### Pages and Features to Explore

Once signed in, you can explore:

| Page          | URL              | Description                                     |
| ------------- | ---------------- | ----------------------------------------------- |
| Dashboard     | `/`              | Evidence stats and career readiness score       |
| Add Evidence  | `/evidence/add`  | Log a new STAR entry against a skill            |
| Evidence List | `/evidence/list` | View all your logged evidence                   |
| Peer Review   | `/peer-review`   | Verify evidence submitted by colleagues         |
| Admin Config  | `/admin/config`  | Organisation settings and job role requirements |
