import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db, organizationsTable, usersTable } from "@consultancy/db";
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
    // Okta is an OIDC provider — configured per-organization at runtime
    // We'll add this when onboarding the first real customer
  },
  trustedOrigins: [env.webUrl],
  user: { modelName: "bauth_user" },
  session: { modelName: "bauth_session" },
  account: { modelName: "bauth_account" },
  verification: { modelName: "bauth_verification" },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const [org] = await db.select().from(organizationsTable).limit(1);

          await db.insert(usersTable).values({
            better_auth_id: user.id,
            organization_id: org?.id ?? null,
            name: user.name,
            email: user.email,
          });
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
