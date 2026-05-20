/**
 * E2E test seed — minimal, stable, predictable baseline for automated tests.
 *
 * Creates a fixed set of records with well-known slugs that tests can rely on.
 * Safe to re-run: uses onConflictDoNothing() throughout.
 *
 * All users sign in with password "Password123!".
 *
 * Run via:
 *   pnpm --filter @consultancy/db db:seed-e2e
 *
 * To reset to this baseline (wipes E2E org data first):
 *   pnpm --filter @consultancy/db db:reset-e2e
 */

import { drizzle } from "drizzle-orm/node-postgres";
import { and, eq, isNull } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";
import {
  user as bauthUsersTable,
  account as bauthAccountsTable,
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
  frameworkRoleFamiliesTable,
  frameworkRolesTable,
  skillsTable,
} from "../schema";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

const db = drizzle(process.env.DATABASE_URL);

// ── Constants ─────────────────────────────────────────────────────────────────

const ORG_NAME = "Acme Consulting E2E";

const E2E_USERS = [
  { slug: "e2e-admin",      name: "E2E Admin",      email: "admin@e2e.acme.com",      family: "Digital Service Manager", level: "principal" },
  { slug: "e2e-manager",    name: "E2E Manager",    email: "manager@e2e.acme.com",    family: "Software Developer",      level: "lead"      },
  { slug: "e2e-mentor",     name: "E2E Mentor",     email: "mentor@e2e.acme.com",     family: "Software Developer",      level: "senior"    },
  { slug: "e2e-consultant", name: "E2E Consultant", email: "consultant@e2e.acme.com", family: "Software Developer",      level: "junior"    },
] as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getFrameworkRoleId(familyName: string, level: string): Promise<string | null> {
  const [family] = await db
    .select({ id: frameworkRoleFamiliesTable.id })
    .from(frameworkRoleFamiliesTable)
    .where(and(eq(frameworkRoleFamiliesTable.name, familyName), isNull(frameworkRoleFamiliesTable.organizationId)));
  if (!family) return null;

  const [role] = await db
    .select({ id: frameworkRolesTable.id })
    .from(frameworkRolesTable)
    .where(and(eq(frameworkRolesTable.familyId, family.id), eq(frameworkRolesTable.level, level as any)));
  return role?.id ?? null;
}

async function getSkillId(name: string): Promise<string | null> {
  const [skill] = await db
    .select({ id: skillsTable.id })
    .from(skillsTable)
    .where(and(eq(skillsTable.name, name), isNull(skillsTable.organizationId)));
  return skill?.id ?? null;
}

// ── Seed ──────────────────────────────────────────────────────────────────────

async function seed() {
  console.log("🌱 Seeding E2E baseline...\n");

  const hashedPassword = await hashPassword("Password123!");

  // ── Organisation ──────────────────────────────────────────────────────────

  await db.insert(organizationsTable).values({ name: ORG_NAME }).onConflictDoNothing();

  const [org] = await db
    .select({ id: organizationsTable.id })
    .from(organizationsTable)
    .where(eq(organizationsTable.name, ORG_NAME));

  if (!org) throw new Error("Could not resolve E2E org after insert");
  const orgId = org.id;

  await db
    .insert(organizationUnitsTable)
    .values({ organizationId: orgId, name: "E2E Team", unitType: "team" })
    .onConflictDoNothing();

  // ── Auth + app users ──────────────────────────────────────────────────────

  await db
    .insert(bauthUsersTable)
    .values(E2E_USERS.map((u) => ({ id: u.slug, name: u.name, email: u.email, emailVerified: true })))
    .onConflictDoNothing();

  await db
    .insert(bauthAccountsTable)
    .values(
      E2E_USERS.map((u) => ({
        id: `${u.slug}-cred`,
        accountId: u.slug,
        providerId: "credential",
        userId: u.slug,
        password: hashedPassword,
      })),
    )
    .onConflictDoNothing();

  await db
    .insert(usersTable)
    .values(
      E2E_USERS.map((u) => ({
        name: u.name,
        email: u.email,
        status: "active" as const,
        betterAuthId: u.slug,
        organizationId: orgId,
      })),
    )
    .onConflictDoNothing();

  const rows = await db
    .select({ id: usersTable.id, email: usersTable.email })
    .from(usersTable)
    .where(eq(usersTable.organizationId, orgId));

  const uid = Object.fromEntries(rows.map((r) => [r.email, r.id]));
  const U = {
    admin:      uid["admin@e2e.acme.com"],
    manager:    uid["manager@e2e.acme.com"],
    mentor:     uid["mentor@e2e.acme.com"],
    consultant: uid["consultant@e2e.acme.com"],
  };

  console.log("  ✓ 4 E2E users");

  // ── Job grades ────────────────────────────────────────────────────────────

  const existing = await db
    .select({ id: jobGradesTable.id })
    .from(jobGradesTable)
    .where(eq(jobGradesTable.organizationId, orgId))
    .limit(1);

  if (existing.length === 0) {
    const gradeDefs = [
      { name: "E2E Principal", family: "Digital Service Manager", level: "principal" },
      { name: "E2E Lead Dev",    family: "Software Developer",      level: "lead"      },
      { name: "E2E Senior Dev",  family: "Software Developer",      level: "senior"    },
      { name: "E2E Junior Dev",  family: "Software Developer",      level: "junior"    },
    ];

    for (const g of gradeDefs) {
      const frameworkRoleId = await getFrameworkRoleId(g.family, g.level);
      if (frameworkRoleId) {
        await db
          .insert(jobGradesTable)
          .values({ organizationId: orgId, frameworkRoleId, name: g.name })
          .onConflictDoNothing();
      }
    }
  }

  const grades = await db
    .select({ id: jobGradesTable.id, name: jobGradesTable.name })
    .from(jobGradesTable)
    .where(eq(jobGradesTable.organizationId, orgId));

  const gradeByName = Object.fromEntries(grades.map((g) => [g.name, g.id]));

  const gradeAssignments = [
    { userId: U.admin,      gradeName: "E2E Principal" },
    { userId: U.manager,    gradeName: "E2E Lead Dev"    },
    { userId: U.mentor,     gradeName: "E2E Senior Dev"  },
    { userId: U.consultant, gradeName: "E2E Junior Dev"  },
  ];

  const hasAssignments = await db
    .select({ id: userGradeAssignmentsTable.id })
    .from(userGradeAssignmentsTable)
    .where(eq(userGradeAssignmentsTable.userId, U.consultant))
    .limit(1);

  if (hasAssignments.length === 0) {
    await db
      .insert(userGradeAssignmentsTable)
      .values(
        gradeAssignments
          .filter((a) => a.userId && gradeByName[a.gradeName])
          .map((a) => ({ userId: a.userId, jobGradeId: gradeByName[a.gradeName], startDate: "2025-01-01" })),
      )
      .onConflictDoNothing();
  }

  console.log("  ✓ grades and assignments");

  // ── Relationships ─────────────────────────────────────────────────────────

  const hasRelationships = await db
    .select({ id: userRelationshipsTable.id })
    .from(userRelationshipsTable)
    .where(eq(userRelationshipsTable.organizationId, orgId))
    .limit(1);

  if (hasRelationships.length === 0) {
    await db
      .insert(userRelationshipsTable)
      .values([
        { actorId: U.manager, targetId: U.consultant, relationshipType: "line_manager", startDate: "2025-01-01", organizationId: orgId },
        { actorId: U.mentor,  targetId: U.consultant, relationshipType: "mentor",       startDate: "2025-01-01", organizationId: orgId },
        { actorId: U.manager, targetId: U.mentor,     relationshipType: "peer",         startDate: "2025-01-01", organizationId: orgId },
      ])
      .onConflictDoNothing();
  }

  console.log("  ✓ relationships");

  // ── Projects ──────────────────────────────────────────────────────────────

  await db
    .insert(organizationUnitsTable)
    .values({ organizationId: orgId, name: "E2E Team", unitType: "team" })
    .onConflictDoNothing();

  const [unit] = await db
    .select({ id: organizationUnitsTable.id })
    .from(organizationUnitsTable)
    .where(and(eq(organizationUnitsTable.organizationId, orgId), eq(organizationUnitsTable.name, "E2E Team")));

  await db
    .insert(projectsTable)
    .values([
      {
        organizationId: orgId,
        organizationUnitId: unit.id,
        leadId: U.manager,
        name: "Alpha Project",
        shortName: "Alpha",
        codeName: "E2EALPHA",
        status: "in_delivery",
        fundingModel: "time_and_materials",
        startDate: new Date("2025-01-01"),
      },
      {
        organizationId: orgId,
        organizationUnitId: unit.id,
        leadId: U.manager,
        name: "Beta Project",
        shortName: "Beta",
        codeName: "E2EBETA",
        status: "bidding",
        fundingModel: "time_and_materials",
        startDate: new Date("2025-06-01"),
      },
    ])
    .onConflictDoNothing();

  const projects = await db
    .select({ id: projectsTable.id, codeName: projectsTable.codeName })
    .from(projectsTable)
    .where(eq(projectsTable.organizationId, orgId));

  const P = Object.fromEntries(projects.map((p) => [p.codeName, p.id]));

  await db
    .insert(projectMembersTable)
    .values([
      { projectId: P["E2EALPHA"], userId: U.manager,    projectRole: "tech_lead",  allocatedHoursPerWeek: "40", startDate: new Date("2025-01-01") },
      { projectId: P["E2EALPHA"], userId: U.consultant, projectRole: "developer",  allocatedHoursPerWeek: "40", startDate: new Date("2025-01-01") },
      { projectId: P["E2EALPHA"], userId: U.mentor,     projectRole: "developer",  allocatedHoursPerWeek: "40", startDate: new Date("2025-01-01") },
    ])
    .onConflictDoNothing();

  console.log("  ✓ 2 projects, 3 project members");

  // ── Evidence ──────────────────────────────────────────────────────────────

  const hasEvidence = await db
    .select({ id: evidenceTable.id })
    .from(evidenceTable)
    .where(eq(evidenceTable.userId, U.consultant))
    .limit(1);

  if (hasEvidence.length > 0) {
    console.log("  ↩ Evidence already exists, skipping");
    console.log("\n✅ E2E seed complete.");
    return;
  }

  const swDevSkillId = await getSkillId("Software Development");
  const testSkillId  = await getSkillId("Test Engineering");
  const designSkillId = await getSkillId("Software Design");

  const evidenceRows = await db
    .insert(evidenceTable)
    .values([
      // 1 — draft, Software Development, with project
      {
        userId: U.consultant,
        projectId: P["E2EALPHA"],
        version: 1,
        status: "draft",
        dataClassification: "official",
        situation: "The Alpha Project frontend was not covered by any automated tests, making refactoring risky.",
        task: "Add unit test coverage for the three most critical React components before the next sprint.",
        action: "Writing unit tests using Vitest and React Testing Library. Targeting the form validation, data table, and authentication components first.",
        result: "Work in progress — 60% complete.",
      },
      // 2 — draft, Test Engineering, with project
      {
        userId: U.consultant,
        projectId: P["E2EALPHA"],
        version: 1,
        status: "draft",
        dataClassification: "official",
        situation: "Manual regression testing before each release was taking half a day and missing intermittent failures.",
        task: "Propose and prototype an automated regression test approach for the Alpha Project API.",
        action: "Drafted a test strategy document comparing Playwright and Supertest for API testing. Planning to present to the team next sprint.",
        result: "Prototype in progress.",
      },
      // 3 — draft, Software Design, no project
      {
        userId: U.consultant,
        version: 1,
        status: "draft",
        dataClassification: "official",
        situation: "A recurring pattern in code reviews was lack of separation between business logic and data access code.",
        task: "Research and propose a layered architecture pattern suitable for the team's TypeScript codebase.",
        action: "Reading up on the repository pattern and hexagonal architecture. Drafting a short internal guide.",
        result: "Draft guide not yet complete.",
      },
      // 4 — submitted, Software Development, with project
      {
        userId: U.consultant,
        projectId: P["E2EALPHA"],
        version: 1,
        status: "submitted",
        dataClassification: "official",
        situation: "The Alpha Project search feature was performing a full table scan on every keystroke, causing noticeable lag in the UI.",
        task: "Optimise the search endpoint to reduce response time to under 200ms for typical queries.",
        action: "Added a full-text search index to the database, implemented debouncing on the frontend input, and cached frequent search results in Redis with a 60-second TTL. Wrote benchmarks before and after to quantify the improvement.",
        result: "Response time dropped from 1.2s to 95ms for cached queries and 180ms for uncached. User-reported lag complaints stopped after the fix was deployed.",
      },
      // 5 — submitted, Test Engineering, with project
      {
        userId: U.consultant,
        projectId: P["E2EALPHA"],
        version: 1,
        status: "submitted",
        dataClassification: "official",
        situation: "A production bug went undetected for two weeks because the failing code path had no test coverage.",
        task: "Identify the coverage gap and write regression tests to prevent the same class of failure.",
        action: "Used Istanbul to generate a coverage report, identified 14 uncovered code paths related to error handling, wrote targeted tests for each, and added a coverage threshold to the CI configuration to prevent future drops.",
        result: "Coverage on the error-handling module increased from 12% to 94%. The CI threshold blocked two subsequent PRs that would have lowered coverage, prompting the authors to add tests.",
      },
      // 6 — submitted, Software Development, mentor as author
      {
        userId: U.mentor,
        projectId: P["E2EALPHA"],
        version: 1,
        status: "submitted",
        dataClassification: "official",
        situation: "The Alpha Project had no shared component library, leading to duplicated UI code across six different screens.",
        task: "Extract shared components into a reusable library and migrate existing screens to use them.",
        action: "Created a component library using Storybook, extracted eight components (Button, Modal, DataTable, FormField, Badge, Pagination, EmptyState, ErrorBoundary), wrote stories for each, and migrated all six screens. Ran a team walkthrough to demonstrate usage.",
        result: "Removed approximately 800 lines of duplicated code. New screens are now built three times faster. Three developers have since contributed new components to the library.",
      },
      // 7 — verified, Software Development, with project
      {
        userId: U.consultant,
        projectId: P["E2EALPHA"],
        version: 1,
        status: "verified",
        dataClassification: "official",
        situation: "The Alpha Project API had no consistent error handling, with different endpoints returning different error shapes that confused the frontend team.",
        task: "Design and implement a consistent error response standard across all API endpoints.",
        action: "Proposed an RFC-7807-aligned error format, got buy-in from the tech lead and frontend team, implemented a centralised error handler middleware, updated all existing endpoints, and wrote documentation for the pattern. Added an API test that validates error response shapes.",
        result: "All 23 API endpoints now return consistent error responses. Frontend error handling code reduced from 400 lines to 120. No error format-related bugs reported since deployment.",
      },
      // 8 — verified, Test Engineering, with project
      {
        userId: U.consultant,
        projectId: P["E2EALPHA"],
        version: 1,
        status: "verified",
        dataClassification: "official",
        situation: "Alpha Project had no automated accessibility testing. A manual audit found 12 WCAG 2.1 AA violations across the UI.",
        task: "Address the accessibility violations and introduce automated checks to prevent regressions.",
        action: "Fixed all 12 violations (colour contrast, missing ARIA labels, keyboard trap in modal), integrated axe-core into the Playwright suite to check key pages on every CI run, and wrote a short accessibility guide for the team covering the most common pitfalls.",
        result: "All 12 violations resolved. The automated checks have caught three regressions introduced by subsequent PRs before they reached review. The client's accessibility audit gave the service a clean bill of health.",
      },
    ])
    .returning({ id: evidenceTable.id, userId: evidenceTable.userId, status: evidenceTable.status });

  console.log(`  ✓ ${evidenceRows.length} evidence entries`);

  // Index by position for skill links and endorsements
  const consultantEv = evidenceRows.filter((e) => e.userId === U.consultant);
  const mentorEv     = evidenceRows.filter((e) => e.userId === U.mentor);
  const ev1 = consultantEv[0]; // draft   - sw dev
  const ev2 = consultantEv[1]; // draft   - test eng
  const ev3 = consultantEv[2]; // draft   - sw design
  const ev4 = consultantEv[3]; // submitted - sw dev
  const ev5 = consultantEv[4]; // submitted - test eng
  const ev6 = mentorEv[0];     // submitted - sw dev (mentor)
  const ev7 = consultantEv[5]; // verified - sw dev
  const ev8 = consultantEv[6]; // verified - test eng

  // ── Evidence skill links ──────────────────────────────────────────────────

  const skillLinks: Array<{ evidenceId: string; skillId: string; levelClaimed: string; isPrimary: boolean }> = [];
  const link = (ev: typeof ev1 | undefined, sid: string | null, level: string, primary = true) => {
    if (ev && sid) skillLinks.push({ evidenceId: ev.id, skillId: sid, levelClaimed: level, isPrimary: primary });
  };

  link(ev1, swDevSkillId,  "junior");
  link(ev2, testSkillId,   "junior");
  link(ev3, designSkillId, "junior");
  link(ev4, swDevSkillId,  "junior");
  link(ev5, testSkillId,   "junior");
  link(ev6, swDevSkillId,  "senior");
  link(ev7, swDevSkillId,  "junior");
  link(ev8, testSkillId,   "junior");

  if (skillLinks.length > 0) {
    await db
      .insert(evidenceSkillsTable)
      .values(skillLinks.map((l) => ({ evidenceId: l.evidenceId, skillId: l.skillId, levelClaimed: l.levelClaimed as any, isPrimary: l.isPrimary })))
      .onConflictDoNothing();
  }

  // ── Endorsements ──────────────────────────────────────────────────────────
  // Evidence #4 (submitted): pending from manager, pending from mentor
  // Evidence #5 (submitted): endorsed by manager, pending from mentor
  // Evidence #6 (submitted, mentor's): pending from consultant
  // Evidence #7 (verified): endorsed by manager, endorsed by mentor
  // Evidence #8 (verified): endorsed by manager, skipped by mentor

  const endorsements: Array<{
    evidenceId: string;
    endorserId: string;
    isSuggested: boolean;
    status: "pending" | "endorsed" | "skipped" | "flagged";
    note?: string;
    respondedAt?: Date;
  }> = [];

  const endorse = (ev: typeof ev4 | undefined, endorserId: string, status: "pending" | "endorsed" | "skipped" | "flagged", note?: string, respondedAt?: Date) => {
    if (!ev || !endorserId) return;
    endorsements.push({ evidenceId: ev.id, endorserId, isSuggested: true, status, note, respondedAt });
  };

  endorse(ev4, U.manager, "pending");
  endorse(ev4, U.mentor,  "pending");
  endorse(ev5, U.manager, "endorsed", "Good systematic approach to identifying and closing the coverage gap.", new Date("2025-11-01"));
  endorse(ev5, U.mentor,  "pending");
  endorse(ev6, U.consultant, "pending");
  endorse(ev7, U.manager, "endorsed", "Clean, well-documented standard that has already simplified the frontend integration significantly.", new Date("2025-10-15"));
  endorse(ev7, U.mentor,  "endorsed", "The RFC-7807 approach was the right call. Strongly endorsed.", new Date("2025-10-16"));
  endorse(ev8, U.manager, "endorsed", "The axe-core integration was well-implemented and caught real issues.", new Date("2025-09-20"));
  endorse(ev8, U.mentor,  "skipped", "I wasn't directly involved in the accessibility work on this one — Jay would be a better endorser.", new Date("2025-09-22"));

  if (endorsements.length > 0) {
    await db.insert(endorsementsTable).values(endorsements).onConflictDoNothing();
  }

  console.log(`  ✓ ${skillLinks.length} skill links, ${endorsements.length} endorsements`);
  console.log("\n✅ E2E seed complete.");
}

seed().catch((err) => {
  console.error("\n❌ E2E seed failed:", err);
  process.exit(1);
});
