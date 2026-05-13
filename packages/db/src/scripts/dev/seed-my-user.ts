/**
 * Slots your registered account into the dev seed hierarchy.
 *
 * Run this after db:seed-dev and after registering your account in the web app.
 * It creates line management, mentoring, and project membership relationships
 * between your real user and the seeded cast.
 *
 * Usage:
 *   MY_USER_EMAIL=you@example.com ORG_ID=<uuid> tsx src/scripts/dev/seed-my-user.ts
 *
 * Env vars:
 *   MY_USER_EMAIL   (required)  Your registered account email
 *   ORG_ID          (required)  Your organisation ID
 *   MY_MANAGER_EMAIL  (optional) Who line-manages you. Default: james.okafor@dev-seed.com
 *   MY_REPORT_EMAIL   (optional) Who you line-manage. Default: connor.walsh@dev-seed.com
 *                                Set to "none" to skip creating a report relationship
 *   MY_PROJECT        (optional) Short name of the project to join. Default: NPP
 *                                Options: DTP, SCAP, NPP, FCT, RAP, GDE
 *   MY_PROJECT_ROLE   (optional) Your role on the project. Default: developer
 *                                Options: developer, tech_lead, delivery_manager, analyst, designer, project_manager
 */

import { drizzle } from "drizzle-orm/node-postgres";
import { and, eq } from "drizzle-orm";
import {
  projectMembersTable,
  projectsTable,
  userRelationshipsTable,
  usersTable,
} from "../../schema";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

const db = drizzle(process.env.DATABASE_URL);

async function resolveUser(email: string, label: string): Promise<{ id: string; name: string }> {
  const [row] = await db
    .select({ id: usersTable.id, name: usersTable.name })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (!row) {
    console.error(`\n  ${label} not found: ${email}`);
    if (email.endsWith("@dev-seed.com")) {
      console.error("  Hint: run db:seed-dev first to create the seed users.");
    } else {
      console.error("  Hint: register this account via the web app first.");
    }
    process.exit(1);
  }
  return row;
}

async function main() {
  const orgId = process.env.ORG_ID;
  if (!orgId) {
    console.error("ORG_ID environment variable is required");
    process.exit(1);
  }

  const myEmail = process.env.MY_USER_EMAIL;
  if (!myEmail) {
    console.error("MY_USER_EMAIL environment variable is required");
    console.error("  Usage: MY_USER_EMAIL=you@example.com ORG_ID=<uuid> tsx seed-my-user.ts");
    process.exit(1);
  }

  const managerEmail = process.env.MY_MANAGER_EMAIL ?? "james.okafor@dev-seed.com";
  const reportEmail = process.env.MY_REPORT_EMAIL ?? "connor.walsh@dev-seed.com";
  const skipReport = reportEmail === "none";
  const projectShortName = process.env.MY_PROJECT ?? "NPP";
  const projectRole = (process.env.MY_PROJECT_ROLE ?? "developer") as any;

  // ── Resolve users ───────────────────────────────────────────────────────────

  const me = await resolveUser(myEmail, "Your user");
  const manager = await resolveUser(managerEmail, "Manager");
  const report = skipReport ? null : await resolveUser(reportEmail, "Report");

  // ── Resolve project ─────────────────────────────────────────────────────────

  const [project] = await db
    .select({ id: projectsTable.id, name: projectsTable.name })
    .from(projectsTable)
    .where(
      and(
        eq(projectsTable.organization_id, orgId),
        eq(projectsTable.short_name, projectShortName),
      ),
    );

  if (!project) {
    console.error(`Project "${projectShortName}" not found in org ${orgId}`);
    console.error("  Hint: run db:seed-dev first, or check MY_PROJECT is one of: DTP, SCAP, NPP, FCT, RAP, GDE");
    process.exit(1);
  }

  console.log(`\n🔗 Linking ${me.name} (${myEmail}) into the dev seed hierarchy\n`);

  // ── Relationships ───────────────────────────────────────────────────────────

  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

  const relationships: Array<{
    actor_id: string;
    target_id: string;
    relationship_type: "line_manager" | "mentor" | "peer";
    label: string;
  }> = [
    {
      actor_id: manager.id,
      target_id: me.id,
      relationship_type: "line_manager",
      label: `${manager.name} line-manages you`,
    },
    {
      actor_id: manager.id,
      target_id: me.id,
      relationship_type: "mentor",
      label: `${manager.name} mentors you`,
    },
  ];

  if (report) {
    relationships.push({
      actor_id: me.id,
      target_id: report.id,
      relationship_type: "line_manager",
      label: `You line-manage ${report.name}`,
    });
  }

  for (const rel of relationships) {
    // Check if relationship already exists to avoid duplicates
    const existing = await db
      .select({ id: userRelationshipsTable.id })
      .from(userRelationshipsTable)
      .where(
        and(
          eq(userRelationshipsTable.actor_id, rel.actor_id),
          eq(userRelationshipsTable.target_id, rel.target_id),
          eq(userRelationshipsTable.relationship_type, rel.relationship_type),
          eq(userRelationshipsTable.organization_id, orgId),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      console.log(`  ↳ Already exists: ${rel.label}`);
    } else {
      await db.insert(userRelationshipsTable).values({
        actor_id: rel.actor_id,
        target_id: rel.target_id,
        relationship_type: rel.relationship_type,
        start_date: today,
        organization_id: orgId,
      });
      console.log(`  ✓ ${rel.label}`);
    }
  }

  // ── Project membership ──────────────────────────────────────────────────────

  const existingMembership = await db
    .select({ id: projectMembersTable.id })
    .from(projectMembersTable)
    .where(
      and(
        eq(projectMembersTable.project_id, project.id),
        eq(projectMembersTable.user_id, me.id),
      ),
    )
    .limit(1);

  if (existingMembership.length > 0) {
    console.log(`  ↳ Already a member of ${project.name}`);
  } else {
    await db.insert(projectMembersTable).values({
      project_id: project.id,
      user_id: me.id,
      project_role: projectRole,
      start_date: today,
    });
    console.log(`  ✓ Added to ${project.name} as ${projectRole}`);
  }

  // ── Summary ─────────────────────────────────────────────────────────────────

  console.log(`
✅ Done. Your account is now linked:

  You:        ${me.name} (${myEmail})
  Manager:    ${manager.name} — line-manages and mentors you
  ${report ? `Report:     ${report.name} — you line-manage them` : "Report:     none"}
  Project:    ${project.name} (${projectShortName}) as ${projectRole}

Next: log in as yourself and you should see the full hierarchy in the app.
  `);
}

main().catch((err) => {
  console.error("seed-my-user failed:", err);
  process.exit(1);
});
