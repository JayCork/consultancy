# Scripts

```
pnpm gen:ui atoms InputField
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
