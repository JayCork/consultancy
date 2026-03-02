# Copilot Instructions for AI Agents

## Project Overview

- **Monorepo** managed with `pnpm`, containing `apps/` (web, api) and `packages/` (db, ui, config).
- **Database**: PostgreSQL, schema managed with Drizzle ORM (see `packages/db/src/db/schema/`).
- **UI**: React (TypeScript), with Storybook for component development (`@consultancy/ui`).
- **API**: Vite-based Node.js server (`apps/api`).

## Key Workflows

- **Install dependencies**: `pnpm install` at the repo root.
- **Run web app**: `pnpm --filter @consultancy/web dev` (or `npm run dev` in `apps/web`)
- **Run API**: `pnpm --filter @consultancy/api dev` (or `npm run dev` in `apps/api`)
- **Run Storybook**: `pnpm --filter @consultancy/ui storybook`
- **Generate UI component**: `pnpm gen:ui atoms InputField`
- **Format code**: `pnpm exec prettier . --write`
- **Database (local)**: Use Docker (see `packages/db/README.md`).
- **Seed DB**: `pnpm tsx src/db/scripts/seed.ts` from `packages/db`.

## Conventions & Patterns

- **Database schema**: All tables and enums are defined in `packages/db/src/db/schema/schema.ts`. Use Drizzle ORM patterns for migrations and queries.
- **Timestamps**: Use the `timestamps` spread helper for created/updated fields.
- **Component structure**: UI components are organized by atomic design (atoms, molecules, organisms, templates, pages).
- **Naming**: Use kebab-case for files, PascalCase for components, and snake_case for DB columns.
- **Cross-package imports**: Use `@consultancy/*` aliases as defined in each `package.json`.

## Integration Points

- **API ↔ DB**: API layer uses Drizzle ORM to access the database.
- **Web ↔ API**: Web app communicates with API via HTTP (see Vite config for proxy settings if needed).
- **UI Library**: Shared React components in `@consultancy/ui` are consumed by the web app.

## References

- [Root README.md](../README.md): General setup and scripts
- [DB README.md](../packages/db/README.md): Local Postgres setup
- [UI Storybook](../packages/ui/README.md): Component development
- [API README.md](../apps/api/README.md): API usage

## Tips for AI Agents

- Prefer updating existing patterns over introducing new ones unless justified.
- Reference the schema and helper files for DB changes.
- Use pnpm workspace commands for cross-package tasks.
- When in doubt, check for scripts in each package's `package.json`.
