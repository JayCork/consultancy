
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
