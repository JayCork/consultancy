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

## Design Tokens — Mandatory Usage

All visual styling **must** use CSS custom properties from `packages/tokens/`. Never use hardcoded hex colours, magic-number px/rem sizes, or raw border-radius values in component styles.

| Token file | Covers |
|---|---|
| `colors.css` | All colours — backgrounds, text, borders, semantic (success/warning/error), brand |
| `typography.css` | Font families, sizes, weights, line heights, letter spacing |
| `spacing.css` | Space scale (`--space-*`) and semantic aliases (`--space-component-*`, `--space-layout-*`) |
| `rounding.css` | Border radius (`--radius-*`) including semantic aliases (`--radius-card`, `--radius-badge`) |
| `size.css` | Icon sizes, input heights, sidebar widths |

**Token semantics to follow:**
- `--color-primary` (amber) — brand colour, CTA buttons, links, "Read more" controls only
- `--color-accent` (teal) — skills, data visualisation, progress indicators
- `--color-text-primary` — body text, headings (not `--color-text`)
- `--color-text-secondary` — supporting labels
- `--color-text-muted` — captions, metadata, overline labels
- `--color-container` — card/panel backgrounds (not `--color-surface` which is a page-level layer)
- `--color-success-subtle` / `--color-warning-subtle` / `--color-error-subtle` — tinted backgrounds for status badges
- `--color-on-warning` — text on a warning-subtle background (dark enough for contrast)

If you need a value not covered by an existing token, add the token to the appropriate file in `packages/tokens/` rather than hardcoding it. Never use `, fallback` values in `var()` calls — they hide missing-token bugs that would otherwise surface as broken dark-mode contrast.

## Component Authoring

- New UI components go in `packages/ui/src/components/` in the correct atomic tier: `atoms`, `molecules`, `organisms`, `templates`, or `pages`.
- Every component folder must contain exactly three files: `ComponentName.tsx`, `ComponentName.module.css`, and `ComponentName.stories.tsx`.
- Styling must use CSS Modules — never use inline `style={{}}` objects except for genuinely dynamic per-instance values (e.g. a colour string passed as a prop from the parent caller).
- Export every new component from `packages/ui/src/index.ts`.
- `packages/ui` must stay presentational — no data fetching, no auth imports (`useSession`, `signIn`, etc.), no router imports (`useNavigate`, `useLocation`). Those dependencies belong in `apps/web`.

## Integration Points

- **API ↔ DB**: API layer uses Drizzle ORM to access the database.
- **Web ↔ API**: Web app communicates with API via HTTP (see Vite config for proxy settings if needed).
- **UI Library**: Shared React components in `@consultancy/ui` are consumed by the web app.

## References

- [Root README.md](../README.md): General setup and scripts
- [DB README.md](../packages/db/README.md): Local Postgres setup
- [API README.md](../apps/api/README.md): API usage
- [Design tokens](../packages/tokens/colors.css): Token reference (colours, spacing, typography, radii)

## Tips for AI Agents

- Prefer updating existing patterns over introducing new ones unless justified.
- Reference the schema and helper files for DB changes.
- Use pnpm workspace commands for cross-package tasks.
- When in doubt, check for scripts in each package's `package.json`.
