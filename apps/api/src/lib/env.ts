const required = [
  "DATABASE_URL",
  "BETTER_AUTH_URL",
  "BETTER_AUTH_SECRET",
] as const;

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  databaseUrl: process.env.DATABASE_URL!,
  betterAuthUrl: process.env.BETTER_AUTH_URL!,
  betterAuthSecret: process.env.BETTER_AUTH_SECRET!,
  webUrl: process.env.WEB_URL ?? "http://localhost:3000",
  port: Number(process.env.PORT ?? 5173),
  nodeEnv: process.env.NODE_ENV ?? "development",
} as const;
