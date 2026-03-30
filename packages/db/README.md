# @consultancy/db

Drizzle ORM schema, queries, and seed scripts for Contractor Hub.

The database runs in a Docker container managed automatically by the dev script. See the [root README](../../README.md) for full setup instructions.

## Commands

```bash
# Push schema changes to the running database
pnpm db:push

# Generate a migration file from schema changes
pnpm db:generate

# Seed the database with demo data (clears existing data first)
pnpm db:seed

# Open Drizzle Studio (visual DB browser) at http://localhost:4983
pnpm db:view
```

## Manual Docker Setup

If you need to create the database container manually (the dev script normally handles this):

```bash
# Create and start the container
docker run --name drizzle-postgres \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_USER=admin \
  -d -p 5432:5432 postgres

# Create the database inside the container
docker exec -it drizzle-postgres psql -U admin -c "CREATE DATABASE mydatabase;"
```

Connection string:

```
postgres://admin:mypassword@localhost:5432/mydatabase
```

**Stopping and starting:**

```bash
docker stop drizzle-postgres
docker start drizzle-postgres
docker rm drizzle-postgres   # remove entirely
```

## Structure

```
src/
├── schema/       # Drizzle table definitions
├── queries/      # Typed query functions used by the API
├── scripts/
│   ├── seed.ts           # Seed runner (clears + re-seeds all tables)
│   └── seed.generator.ts # Faker-based data generators
└── index.ts      # Package exports
```
