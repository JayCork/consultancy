import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db, usersTable } from "@consultancy/db";
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
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await db.insert(usersTable).values({
            betterAuthId: user.id,
            organizationId: null, // explicitly pending_org — assigned during onboarding
            name: user.name,
            email: user.email,
            status: "pending_org",
          });
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;

export type HonoVariables = {
  session: Session["session"];
};

export const requireAuth = async (
  c: import("hono").Context<{ Variables: HonoVariables }>,
  next: import("hono").Next,
) => {
  let authSession: Session | null = null;
  try {
    authSession = await auth.api.getSession({ headers: c.req.raw.headers });
  } catch {
    return c.json({ ok: false, error: "Unauthorised" }, 401);
  }
  if (!authSession) {
    return c.json({ ok: false, error: "Unauthorised" }, 401);
  }
  c.set("session", authSession.session);
  await next();
};
