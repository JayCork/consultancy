## Getting Started

### Prerequisits

- pnpm 10

# Packages

- @consultancy/ui storybook

# Scripts

## Create a story

```
pnpm gen:ui atoms InputField
```

## Start Storybook

```
pnpm --filter @consultancy/ui storybook
```

# Format

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

## API

To start the API server:

```
pnpm --filter @consultancy/api dev
```

## Structure

- `apps/` contains things that run; processes, servers, deployable units. Each app has an entry point, a runtime, and gets deployed independently.
- `packages/` contains things that are imported; shared code with no runtime of their own. They exist to be consumed by apps, not to run directly.
