/**
 * E2E reset — wipes all data belonging to the E2E org, then re-seeds from scratch.
 *
 * Run via:
 *   pnpm --filter @consultancy/db db:reset-e2e
 */

import { drizzle } from "drizzle-orm/node-postgres";
import { eq, inArray } from "drizzle-orm";
import {
  organizationsTable,
  organizationUnitsTable,
  usersTable,
  jobGradesTable,
  userGradeAssignmentsTable,
  userRelationshipsTable,
  projectsTable,
  projectMembersTable,
  evidenceTable,
  evidenceSkillsTable,
  endorsementsTable,
} from "../schema";
import { account as bauthAccountsTable, user as bauthUsersTable } from "../schema/auth";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

const db = drizzle(process.env.DATABASE_URL);

const ORG_NAME = "Acme Consulting E2E";
const E2E_SLUGS = ["e2e-admin", "e2e-manager", "e2e-mentor", "e2e-consultant"];

async function reset() {
  console.log("🗑  Resetting E2E data...\n");

  const [org] = await db
    .select({ id: organizationsTable.id })
    .from(organizationsTable)
    .where(eq(organizationsTable.name, ORG_NAME));

  if (!org) {
    console.log("  No E2E org found — nothing to reset.");
    return;
  }

  const orgId = org.id;

  // Fetch org user IDs for cascading deletes on tables without FK cascade
  const orgUsers = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.organizationId, orgId));

  const userIds = orgUsers.map((u) => u.id);

  // Fetch project IDs
  const orgProjects = await db
    .select({ id: projectsTable.id })
    .from(projectsTable)
    .where(eq(projectsTable.organizationId, orgId));

  const projectIds = orgProjects.map((p) => p.id);

  // Delete in dependency order (children before parents)

  if (projectIds.length > 0) {
    const members = await db
      .select({ id: projectMembersTable.id })
      .from(projectMembersTable)
      .where(inArray(projectMembersTable.projectId, projectIds));

    if (members.length > 0) {
      await db.delete(projectMembersTable).where(inArray(projectMembersTable.projectId, projectIds));
    }
  }

  if (userIds.length > 0) {
    // Endorsements → evidence → evidence skills
    const userEvidence = await db
      .select({ id: evidenceTable.id })
      .from(evidenceTable)
      .where(inArray(evidenceTable.userId, userIds));

    const evidenceIds = userEvidence.map((e) => e.id);

    if (evidenceIds.length > 0) {
      await db.delete(endorsementsTable).where(inArray(endorsementsTable.evidenceId, evidenceIds));
      await db.delete(evidenceSkillsTable).where(inArray(evidenceSkillsTable.evidenceId, evidenceIds));
      await db.delete(evidenceTable).where(inArray(evidenceTable.id, evidenceIds));
    }

    await db.delete(userRelationshipsTable).where(eq(userRelationshipsTable.organizationId, orgId));

    const assignments = await db
      .select({ id: userGradeAssignmentsTable.id })
      .from(userGradeAssignmentsTable)
      .where(inArray(userGradeAssignmentsTable.userId, userIds));

    if (assignments.length > 0) {
      await db.delete(userGradeAssignmentsTable).where(inArray(userGradeAssignmentsTable.userId, userIds));
    }
  }

  if (projectIds.length > 0) {
    await db.delete(projectsTable).where(eq(projectsTable.organizationId, orgId));
  }

  await db.delete(jobGradesTable).where(eq(jobGradesTable.organizationId, orgId));
  await db.delete(organizationUnitsTable).where(eq(organizationUnitsTable.organizationId, orgId));

  if (userIds.length > 0) {
    await db.delete(usersTable).where(eq(usersTable.organizationId, orgId));
  }

  await db.delete(organizationsTable).where(eq(organizationsTable.id, orgId));

  // Remove bauth records
  await db.delete(bauthAccountsTable).where(inArray(bauthAccountsTable.userId, E2E_SLUGS));
  await db.delete(bauthUsersTable).where(inArray(bauthUsersTable.id, E2E_SLUGS));

  console.log("  ✓ E2E data cleared\n");
}

// Run reset then re-seed by importing the seed function
reset()
  .then(() => import("./seed-e2e"))
  .catch((err) => {
    console.error("\n❌ E2E reset failed:", err);
    process.exit(1);
  });
