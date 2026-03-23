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
    // Okta is an OIDC provider — configured per-organisation at runtime
    // We'll add this when onboarding the first real customer
  },
  trustedOrigins: [env.webUrl],
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const [org] = await db
            .select()
            .from(organizationsTable)
            .limit(1);

          if (!org) return;

          await db.insert(usersTable).values({
            auth_user_id: user.id,
            organisation_id: org.id,
            name: user.name,
            email: user.email,
            role: "Consultant",
          });
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
