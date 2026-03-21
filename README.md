## Getting Started

### Prerequisites

- pnpm 10
- Docker Desktop (must be running before `pnpm dev`)

### Development

To start everything at once (web app, API server, Storybook, and database container):

```bash
pnpm dev
```

This runs in parallel:
- **Web** — SolidJS app via Vite
- **API** — Hono server with hot reload
- **Storybook** — component explorer at http://localhost:6006
- **Database** — Postgres container (`drizzle-postgres`)

Individual services can be started separately:

```bash
pnpm dev:web   # web app only
pnpm dev:api   # API server only
pnpm dev:ui    # Storybook only
pnpm --filter @consultancy/db dev  # database container only
```

# Structure

- `apps/` contains things that run; processes, servers, deployable units. Each app has an entry point, a runtime, and gets deployed independently.
- `packages/` contains things that are imported; shared code with no runtime of their own. They exist to be consumed by apps, not to run directly.

# Scripts

## Create a UI component

```bash
pnpm gen:ui atoms InputField
```

## Format

```bash
pnpm exec prettier . --write
```

To format a specific path:

```bash
pnpm exec prettier src/components/atoms/InputField --write
```

Use glob patterns to format specific files:

```bash
pnpm exec prettier "src/components/atoms/**/*.tsx" --write
```
