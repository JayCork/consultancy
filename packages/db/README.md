# @consultancy/db

Drizzle ORM schema, queries, and seed scripts for Contractor Hub.

The database runs in a Docker container managed automatically by the dev script. See the [root README](../../README.md) for full setup instructions.

## Commands

```bash
# Push schema changes to the running database
pnpm db:push

# Generate a migration file from schema changes
pnpm db:generate

# Apply pending migrations
pnpm db:apply-migrations

# Seed reference data (frameworks, clearance levels, skills taxonomy)
# Safe to run in any environment — idempotent
pnpm db:seed

# Seed representative dev data for a specific organisation
# Requires ORG_ID env var — see Dev Seed below
pnpm db:seed-dev

# Create a small endorsement test batch for feature development
# Requires ORG_ID env var
pnpm db:seed-endorsement-batch

# Link your registered account into the dev seed hierarchy
# Requires MY_USER_EMAIL and ORG_ID env vars — see Link Your Account below
pnpm db:seed-my-user

# Open Drizzle Studio (visual DB browser) at http://localhost:4983
pnpm db:view
```

## Dev Seed

`db:seed-dev` populates a realistic dataset for an existing organisation — 12 users, 6 projects across a year of delivery, evidence at every status, and endorsements covering all review states.

The script targets an **existing organisation** — it does not create one. Pass the org ID via `ORG_ID`.

```bash
# Via env var in root .env
pnpm db:seed-dev

# Inline
ORG_ID=9d193e54-74bd-40d5-ba48-bf0c338e6f8a pnpm db:seed-dev

# Seed only a specific section (useful when iterating on a feature)
ORG_ID=<uuid> pnpm db:seed-dev -- --only=evidence
ORG_ID=<uuid> pnpm db:seed-dev -- --only=users,projects

# Available sections:
#   skills, users, grades, relationships, projects, members, competencies, evidence
```

The script is **idempotent** — safe to re-run. Tables with unique indexes use `onConflictDoNothing`; tables without them use an existence check.

### Link your own account

After registering via the web app, run this to wire your real account into the seeded hierarchy:

```bash
MY_USER_EMAIL=you@example.com ORG_ID=<uuid> pnpm db:seed-my-user
```

By default this puts you under James Okafor (senior dev), gives you Connor Walsh as a report, and adds you to the NPP project as a developer. Override any of it:

```bash
MY_USER_EMAIL=you@example.com \
MY_MANAGER_EMAIL=rachel.torres@dev-seed.com \
MY_REPORT_EMAIL=none \
MY_PROJECT=FCT \
MY_PROJECT_ROLE=tech_lead \
ORG_ID=<uuid> pnpm db:seed-my-user
```

The script checks for existing relationships before inserting, so re-running it is safe.

### Endorsement batch

For focused endorsement feature development, use the standalone batch script. It creates 5 `submitted` evidence entries with `pending` endorsements routed to two reviewers and prints the evidence IDs to stdout.

```bash
# Default: creates evidence for tom.bradley@dev-seed.com
ORG_ID=<uuid> pnpm db:seed-endorsement-batch

# Different subject and endorsers
SUBJECT_EMAIL=priya.sharma@dev-seed.com \
ENDORSER_1_EMAIL=rachel.torres@dev-seed.com \
ENDORSER_2_EMAIL=james.okafor@dev-seed.com \
ORG_ID=<uuid> pnpm db:seed-endorsement-batch
```

### Using seeders programmatically

Each seeder is an exported async function — import them directly into other scripts or tests:

```typescript
import { seedUsers, seedProjects, seedEvidence } from "./scripts/dev/seed-dev-data";
import { drizzle } from "drizzle-orm/node-postgres";

const db = drizzle(process.env.DATABASE_URL);
const U = await seedUsers(db, orgId);
const P = await seedProjects(db, orgId);
await seedEvidence(db, orgId, U, P, skillMap);
```

## Manual Docker Setup

If you need to create the database container manually:

```bash
docker run --name consultancy_hub \
  -e POSTGRES_PASSWORD=butter_iron_knife \
  -e POSTGRES_USER=basic_dev \
  -e POSTGRES_DB=consultancy_hub \
  -d -p 5432:5432 postgres
```

Connection string:

```
postgres://basic_dev:butter_iron_knife@localhost:5432/consultancy_hub
```

**Stopping and starting:**

```bash
docker stop consultancy_hub
docker start consultancy_hub
docker rm consultancy_hub   # remove entirely
```

## Structure

```
src/
├── schema/
│   ├── index.ts              # Re-exports all table definitions
│   ├── auth.ts               # Better-Auth tables (bauth_users, sessions, etc.)
│   ├── users.ts              # users, user_clearances
│   ├── organizations.ts      # organizations
│   ├── projects.ts           # projects, project_members, project_milestones
│   ├── evidence.ts           # evidence, evidence_skills, evidence_tags
│   ├── endorsements.ts       # endorsements
│   ├── competencies.ts       # competencies, credentials
│   ├── skills.ts             # skills, skill_levels, skill_framework_mappings
│   ├── grades.ts             # job_grades, user_grade_assignments
│   ├── relationships.ts      # user_relationships
│   ├── goals.ts              # goals, goal_evidence
│   ├── feedback.ts           # feedback
│   ├── reference.ts          # reference_frameworks, reference_skills, reference_roles,
│   │                         # clearance_levels, framework_role_families, framework_roles, etc.
│   ├── tags.ts               # tags
│   ├── invitations.ts        # invitations
│   └── enums.ts              # All pgEnum definitions
├── queries/                  # Typed query functions used by the API
├── scripts/
│   ├── seed-reference-data.ts        # Reference data seed (run via db:seed)
│   ├── fixtures/
│   │   └── skills.ts                 # SFIA 9 and DDaT skill definitions
│   └── dev/
│       ├── seed-dev-data.ts          # Representative dev dataset (run via db:seed-dev)
│       └── seed-endorsement-batch.ts # Standalone endorsement test batch
└── index.ts                  # Package exports (db instance + schema + queries)
```
