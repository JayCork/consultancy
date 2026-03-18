import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@consultancy/db";
import * as schema from "@consultancy/db";
import { env } from "./env";

export const auth = betterAuth({
  baseURL: env.betterAuthUrl,
  secret: env.betterAuthSecret,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    // Okta is an OIDC provider — configured per-organisation at runtime
    // We'll add this when onboarding the first real customer
  },
  trustedOrigins: [env.webUrl],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
