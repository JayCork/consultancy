# @consultancy/api

Hono REST API for Contractor Hub. Runs on `http://localhost:5173`.

See the [root README](../../README.md) for full setup and environment variable instructions.

## Running Locally

```bash
pnpm dev
```

Or from the project root:

```bash
pnpm dev:api
```

## Environment Variables

```env
DATABASE_URL=postgres://admin:mypassword@localhost:5432/mydatabase
BETTER_AUTH_URL=http://localhost:5173
BETTER_AUTH_SECRET=<generated>
WEB_URL=http://localhost:3000
```

Generate `BETTER_AUTH_SECRET`:

```bash
npx auth secret
```

## API Routes

```
GET  /api/health                  # Health check
POST /api/auth/**                 # Better-Auth endpoints (sign-up, sign-in, session)
GET  /api/v0/users                # Get current authenticated user
POST /api/v0/evidence             # Create a STAR evidence entry
GET  /api/v0/evidence?userId=...  # Get evidence entries for a user
POST /api/v0/projects             # Manage projects
GET  /api/v0/skills               # Get all skills and their levels
GET  /api/v0/readiness            # Career readiness score for current user
GET  /api/v0/admin/config         # Organisation config and job role requirements
```

## Health Check

```bash
curl http://localhost:5173/api/health
```
