/**
 * Dev seed script — representative data for a small consultancy (~1 year of use).
 *
 * Usage:
 *   ORG_ID=<uuid> tsx src/scripts/dev/seed-dev-data.ts
 *   ORG_ID=<uuid> tsx src/scripts/dev/seed-dev-data.ts --only=users,projects,evidence
 *
 * Available sections: skills, users, grades, relationships, projects, members, competencies, evidence
 *
 * Each exported seeder can also be imported and called directly from other scripts.
 * The organisation must already exist — this script does not create one.
 *
 * Requires reference data (db:seed) to be seeded first for framework roles to resolve.
 */

import { drizzle } from "drizzle-orm/node-postgres";
import { and, eq, isNull } from "drizzle-orm";
import {
  user as authUserTable,
  competenciesTable,
  endorsementsTable,
  evidenceSkillsTable,
  evidenceTable,
  frameworkRoleFamiliesTable,
  frameworkRolesTable,
  jobGradesTable,
  organizationsTable,
  projectMembersTable,
  projectsTable,
  skillsTable,
  userGradeAssignmentsTable,
  userRelationshipsTable,
  usersTable,
} from "../../schema";

// ── Types ─────────────────────────────────────────────────────────────────────

type DB = ReturnType<typeof drizzle>;

export type UserMap = {
  sarah: string;
  marcus: string;
  kate: string;
  rachel: string;
  james: string;
  priya: string;
  tom: string;
  aisha: string;
  connor: string;
  elena: string;
  dev: string;
  liam: string;
};

export type ProjectMap = {
  dtp: string;
  scap: string;
  npp: string;
  fct: string;
  rap: string;
  gde: string;
};

// ── Stable auth IDs ───────────────────────────────────────────────────────────
// Text prefix makes them instantly recognisable in dev tooling.

export const AUTH_IDS = {
  sarah: "dev-seed-sarah-chen",
  marcus: "dev-seed-marcus-webb",
  kate: "dev-seed-kate-morrison",
  rachel: "dev-seed-rachel-torres",
  james: "dev-seed-james-okafor",
  priya: "dev-seed-priya-sharma",
  tom: "dev-seed-tom-bradley",
  aisha: "dev-seed-aisha-johnson",
  connor: "dev-seed-connor-walsh",
  elena: "dev-seed-elena-petrov",
  dev: "dev-seed-dev-martinez",
  liam: "dev-seed-liam-chen",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getFrameworkRoleId(
  db: DB,
  familyName: string,
  level: string,
): Promise<string | null> {
  const [family] = await db
    .select({ id: frameworkRoleFamiliesTable.id })
    .from(frameworkRoleFamiliesTable)
    .where(
      and(
        eq(frameworkRoleFamiliesTable.name, familyName),
        isNull(frameworkRoleFamiliesTable.organization_id),
      ),
    );
  if (!family) return null;

  const [role] = await db
    .select({ id: frameworkRolesTable.id })
    .from(frameworkRolesTable)
    .where(
      and(
        eq(frameworkRolesTable.family_id, family.id),
        eq(frameworkRolesTable.level, level as any),
      ),
    );
  return role?.id ?? null;
}

// ── Seeders ───────────────────────────────────────────────────────────────────

export async function seedOrgSkills(
  db: DB,
  orgId: string,
): Promise<Map<string, string>> {
  console.log("  Seeding org-specific skills...");

  const defs = [
    { name: "TypeScript", description: "Statically typed superset of JavaScript" },
    { name: "JavaScript", description: "Dynamic scripting language for web development" },
    { name: "React", description: "Component-based UI library" },
    { name: "Node.js", description: "Server-side JavaScript runtime" },
    { name: "Python", description: "General-purpose programming and data science language" },
    { name: "PostgreSQL", description: "Relational database management system" },
    { name: "AWS", description: "Amazon Web Services cloud platform" },
    { name: "Kubernetes", description: "Container orchestration platform" },
    { name: "Docker", description: "Application containerisation platform" },
    { name: "Playwright", description: "End-to-end browser testing framework" },
    { name: "Test Automation", description: "Automated test strategy and suite implementation" },
    { name: "API Design", description: "RESTful and GraphQL API design and documentation" },
    { name: "System Design", description: "Large-scale system architecture and design patterns" },
    { name: "Code Review", description: "Structured code review practice and technical mentoring" },
    { name: "Requirements Elicitation", description: "Structured requirements gathering and analysis" },
    { name: "Stakeholder Management", description: "Managing and aligning stakeholder expectations" },
    { name: "Agile Delivery", description: "Agile and Scrum delivery methodologies and ceremonies" },
    { name: "Product Strategy", description: "Product vision, roadmap, and go-to-market strategy" },
    { name: "Data Analysis", description: "Data exploration, modelling, and insight generation" },
    { name: "Accessibility", description: "WCAG compliance, inclusive design, and assistive technology testing" },
  ];

  await db
    .insert(skillsTable)
    .values(defs.map((s) => ({ ...s, organization_id: orgId })))
    .onConflictDoNothing();

  const rows = await db
    .select({ id: skillsTable.id, name: skillsTable.name })
    .from(skillsTable)
    .where(eq(skillsTable.organization_id, orgId));

  console.log(`    ✓ ${rows.length} org skills`);
  return new Map(rows.map((r) => [r.name, r.id]));
}

export async function seedUsers(db: DB, orgId: string): Promise<UserMap> {
  console.log("  Seeding auth users...");

  await db
    .insert(authUserTable)
    .values([
      { id: AUTH_IDS.sarah, name: "Sarah Chen", email: "sarah.chen@dev-seed.com", emailVerified: true },
      { id: AUTH_IDS.marcus, name: "Marcus Webb", email: "marcus.webb@dev-seed.com", emailVerified: true },
      { id: AUTH_IDS.kate, name: "Kate Morrison", email: "kate.morrison@dev-seed.com", emailVerified: true },
      { id: AUTH_IDS.rachel, name: "Rachel Torres", email: "rachel.torres@dev-seed.com", emailVerified: true },
      { id: AUTH_IDS.james, name: "James Okafor", email: "james.okafor@dev-seed.com", emailVerified: true },
      { id: AUTH_IDS.priya, name: "Priya Sharma", email: "priya.sharma@dev-seed.com", emailVerified: true },
      { id: AUTH_IDS.tom, name: "Tom Bradley", email: "tom.bradley@dev-seed.com", emailVerified: true },
      { id: AUTH_IDS.aisha, name: "Aisha Johnson", email: "aisha.johnson@dev-seed.com", emailVerified: true },
      { id: AUTH_IDS.connor, name: "Connor Walsh", email: "connor.walsh@dev-seed.com", emailVerified: true },
      { id: AUTH_IDS.elena, name: "Elena Petrov", email: "elena.petrov@dev-seed.com", emailVerified: true },
      { id: AUTH_IDS.dev, name: "Dev Martinez", email: "dev.martinez@dev-seed.com", emailVerified: true },
      { id: AUTH_IDS.liam, name: "Liam Chen", email: "liam.chen@dev-seed.com", emailVerified: true },
    ])
    .onConflictDoNothing();

  console.log("  Seeding app users...");

  await db
    .insert(usersTable)
    .values([
      { name: "Sarah Chen", email: "sarah.chen@dev-seed.com", status: "active", better_auth_id: AUTH_IDS.sarah, organization_id: orgId },
      { name: "Marcus Webb", email: "marcus.webb@dev-seed.com", status: "active", better_auth_id: AUTH_IDS.marcus, organization_id: orgId },
      { name: "Kate Morrison", email: "kate.morrison@dev-seed.com", status: "active", better_auth_id: AUTH_IDS.kate, organization_id: orgId },
      { name: "Rachel Torres", email: "rachel.torres@dev-seed.com", status: "active", better_auth_id: AUTH_IDS.rachel, organization_id: orgId },
      { name: "James Okafor", email: "james.okafor@dev-seed.com", status: "active", better_auth_id: AUTH_IDS.james, organization_id: orgId },
      { name: "Priya Sharma", email: "priya.sharma@dev-seed.com", status: "active", better_auth_id: AUTH_IDS.priya, organization_id: orgId },
      { name: "Tom Bradley", email: "tom.bradley@dev-seed.com", status: "active", better_auth_id: AUTH_IDS.tom, organization_id: orgId },
      { name: "Aisha Johnson", email: "aisha.johnson@dev-seed.com", status: "active", better_auth_id: AUTH_IDS.aisha, organization_id: orgId },
      { name: "Connor Walsh", email: "connor.walsh@dev-seed.com", status: "active", better_auth_id: AUTH_IDS.connor, organization_id: orgId },
      { name: "Elena Petrov", email: "elena.petrov@dev-seed.com", status: "active", better_auth_id: AUTH_IDS.elena, organization_id: orgId },
      { name: "Dev Martinez", email: "dev.martinez@dev-seed.com", status: "active", better_auth_id: AUTH_IDS.dev, organization_id: orgId },
      { name: "Liam Chen", email: "liam.chen@dev-seed.com", status: "active", better_auth_id: AUTH_IDS.liam, organization_id: orgId },
    ])
    .onConflictDoNothing();

  const rows = await db
    .select({ id: usersTable.id, email: usersTable.email })
    .from(usersTable)
    .where(eq(usersTable.organization_id, orgId));

  const byEmail = new Map(rows.map((r) => [r.email, r.id]));

  const resolve = (email: string, key: string): string => {
    const id = byEmail.get(email);
    if (!id) throw new Error(`User "${key}" (${email}) not found after insert`);
    return id;
  };

  const U: UserMap = {
    sarah: resolve("sarah.chen@dev-seed.com", "sarah"),
    marcus: resolve("marcus.webb@dev-seed.com", "marcus"),
    kate: resolve("kate.morrison@dev-seed.com", "kate"),
    rachel: resolve("rachel.torres@dev-seed.com", "rachel"),
    james: resolve("james.okafor@dev-seed.com", "james"),
    priya: resolve("priya.sharma@dev-seed.com", "priya"),
    tom: resolve("tom.bradley@dev-seed.com", "tom"),
    aisha: resolve("aisha.johnson@dev-seed.com", "aisha"),
    connor: resolve("connor.walsh@dev-seed.com", "connor"),
    elena: resolve("elena.petrov@dev-seed.com", "elena"),
    dev: resolve("dev.martinez@dev-seed.com", "dev"),
    liam: resolve("liam.chen@dev-seed.com", "liam"),
  };

  console.log(`    ✓ 12 users`);
  return U;
}

export async function seedJobGradesAndAssignments(
  db: DB,
  orgId: string,
  U: UserMap,
): Promise<void> {
  console.log("  Seeding job grades...");

  const gradeDefs: Array<{ name: string; family: string; level: string }> = [
    { name: "Principal Product Manager", family: "Product Manager", level: "principal" },
    { name: "Lead Product Manager", family: "Product Manager", level: "lead" },
    { name: "Lead Agile Delivery Manager", family: "Agile Delivery Manager", level: "lead" },
    { name: "Lead Software Developer", family: "Software Developer", level: "lead" },
    { name: "Senior Software Developer", family: "Software Developer", level: "senior" },
    { name: "Software Developer", family: "Software Developer", level: "mid" },
    { name: "Junior Software Developer", family: "Software Developer", level: "junior" },
    { name: "Associate Software Developer", family: "Software Developer", level: "associate" },
    { name: "Business Analyst", family: "Business Analyst", level: "mid" },
  ];

  for (const g of gradeDefs) {
    const frameworkRoleId = await getFrameworkRoleId(db, g.family, g.level);
    if (frameworkRoleId) {
      await db
        .insert(jobGradesTable)
        .values({ name: g.name, organization_id: orgId, framework_role_id: frameworkRoleId })
        .onConflictDoNothing();
    } else {
      console.warn(`    ⚠ Framework role not found: ${g.family} / ${g.level} — grade skipped`);
    }
  }

  const allGrades = await db
    .select({ id: jobGradesTable.id, name: jobGradesTable.name })
    .from(jobGradesTable)
    .where(eq(jobGradesTable.organization_id, orgId));

  const gradeByName = new Map(allGrades.map((g) => [g.name, g.id]));

  console.log("  Seeding grade assignments...");

  // Only insert grade assignments if none exist yet for these users.
  // userGradeAssignmentsTable has no unique index so we guard against re-run duplicates here.
  const existingAssignments = await db
    .select({ user_id: userGradeAssignmentsTable.user_id })
    .from(userGradeAssignmentsTable)
    .where(eq(userGradeAssignmentsTable.user_id, U.rachel));

  if (existingAssignments.length > 0) {
    console.log("    ↳ Grade assignments already present, skipping");
    return;
  }

  const assignments: Array<{ userId: string; gradeName: string; startDate: string }> = [
    { userId: U.sarah, gradeName: "Principal Product Manager", startDate: "2020-01-01" },
    { userId: U.marcus, gradeName: "Lead Product Manager", startDate: "2022-06-01" },
    { userId: U.kate, gradeName: "Lead Agile Delivery Manager", startDate: "2021-03-01" },
    { userId: U.rachel, gradeName: "Lead Software Developer", startDate: "2022-01-01" },
    { userId: U.james, gradeName: "Senior Software Developer", startDate: "2023-04-01" },
    { userId: U.priya, gradeName: "Senior Software Developer", startDate: "2023-07-01" },
    { userId: U.tom, gradeName: "Software Developer", startDate: "2024-02-01" },
    { userId: U.aisha, gradeName: "Software Developer", startDate: "2024-05-01" },
    { userId: U.connor, gradeName: "Junior Software Developer", startDate: "2024-09-01" },
    { userId: U.elena, gradeName: "Junior Software Developer", startDate: "2024-10-01" },
    { userId: U.dev, gradeName: "Associate Software Developer", startDate: "2025-02-01" },
    { userId: U.liam, gradeName: "Business Analyst", startDate: "2023-01-01" },
  ];

  for (const a of assignments) {
    const gradeId = gradeByName.get(a.gradeName);
    if (gradeId) {
      await db
        .insert(userGradeAssignmentsTable)
        .values({ user_id: a.userId, job_grade_id: gradeId, start_date: a.startDate, end_date: null })
        .onConflictDoNothing();
    }
  }

  console.log(`    ✓ ${assignments.length} grade assignments`);
}

export async function seedUserRelationships(
  db: DB,
  orgId: string,
  U: UserMap,
): Promise<void> {
  console.log("  Seeding user relationships...");

  // Guard against re-run duplicates (no unique index on this table).
  const existing = await db
    .select({ id: userRelationshipsTable.id })
    .from(userRelationshipsTable)
    .where(
      and(
        eq(userRelationshipsTable.actor_id, U.sarah),
        eq(userRelationshipsTable.organization_id, orgId),
      ),
    )
    .limit(1);

  if (existing.length > 0) {
    console.log("    ↳ Relationships already present, skipping");
    return;
  }

  await db.insert(userRelationshipsTable).values([
    // ── Line management ────────────────────────────────────────────────────────
    // Sarah (Principal PM) manages Marcus and Kate
    { actor_id: U.sarah, target_id: U.marcus, relationship_type: "line_manager", start_date: "2022-06-01", organization_id: orgId },
    { actor_id: U.sarah, target_id: U.kate, relationship_type: "line_manager", start_date: "2021-03-01", organization_id: orgId },
    // Marcus manages Rachel
    { actor_id: U.marcus, target_id: U.rachel, relationship_type: "line_manager", start_date: "2022-01-01", organization_id: orgId },
    // Rachel manages James and Priya
    { actor_id: U.rachel, target_id: U.james, relationship_type: "line_manager", start_date: "2023-04-01", organization_id: orgId },
    { actor_id: U.rachel, target_id: U.priya, relationship_type: "line_manager", start_date: "2023-07-01", organization_id: orgId },
    // James manages Tom and Connor
    { actor_id: U.james, target_id: U.tom, relationship_type: "line_manager", start_date: "2024-02-01", organization_id: orgId },
    { actor_id: U.james, target_id: U.connor, relationship_type: "line_manager", start_date: "2024-09-01", organization_id: orgId },
    // Priya manages Aisha, Elena, and Dev
    { actor_id: U.priya, target_id: U.aisha, relationship_type: "line_manager", start_date: "2024-05-01", organization_id: orgId },
    { actor_id: U.priya, target_id: U.elena, relationship_type: "line_manager", start_date: "2024-10-01", organization_id: orgId },
    { actor_id: U.priya, target_id: U.dev, relationship_type: "line_manager", start_date: "2025-02-01", organization_id: orgId },
    // Kate manages Liam
    { actor_id: U.kate, target_id: U.liam, relationship_type: "line_manager", start_date: "2023-01-01", organization_id: orgId },

    // ── Mentoring ──────────────────────────────────────────────────────────────
    { actor_id: U.rachel, target_id: U.james, relationship_type: "mentor", start_date: "2023-04-01", organization_id: orgId },
    { actor_id: U.james, target_id: U.tom, relationship_type: "mentor", start_date: "2024-02-01", organization_id: orgId },
    { actor_id: U.priya, target_id: U.elena, relationship_type: "mentor", start_date: "2024-10-01", organization_id: orgId },
    { actor_id: U.priya, target_id: U.dev, relationship_type: "mentor", start_date: "2025-02-01", organization_id: orgId },
    { actor_id: U.kate, target_id: U.liam, relationship_type: "mentor", start_date: "2023-01-01", organization_id: orgId },

    // ── Peers ──────────────────────────────────────────────────────────────────
    { actor_id: U.rachel, target_id: U.kate, relationship_type: "peer", start_date: "2022-01-01", organization_id: orgId },
    { actor_id: U.james, target_id: U.priya, relationship_type: "peer", start_date: "2023-07-01", organization_id: orgId },
    { actor_id: U.tom, target_id: U.aisha, relationship_type: "peer", start_date: "2024-05-01", organization_id: orgId },
  ]);

  console.log(`    ✓ 19 relationships`);
}

export async function seedProjects(
  db: DB,
  orgId: string,
): Promise<ProjectMap> {
  console.log("  Seeding projects...");

  await db
    .insert(projectsTable)
    .values([
      {
        name: "Digital Transformation Portal",
        short_name: "DTP",
        code_name: "Project Atlas",
        organization_id: orgId,
        status: "closed",
        start_date: new Date("2025-03-01"),
        end_date: new Date("2025-10-31"),
        region: "GBR",
      },
      {
        name: "Smart City Analytics Platform",
        short_name: "SCAP",
        code_name: "Project Meridian",
        organization_id: orgId,
        status: "closed",
        start_date: new Date("2025-07-01"),
        end_date: new Date("2026-02-28"),
        region: "GBR",
      },
      {
        name: "NHS Patient Portal",
        short_name: "NPP",
        code_name: "Project Beacon",
        organization_id: orgId,
        status: "in_delivery",
        start_date: new Date("2025-10-01"),
        region: "GBR",
      },
      {
        name: "Financial Compliance Tracker",
        short_name: "FCT",
        code_name: "Project Citadel",
        organization_id: orgId,
        status: "in_delivery",
        start_date: new Date("2026-01-01"),
        region: "GBR",
      },
      {
        name: "Retail AI Platform",
        short_name: "RAP",
        code_name: "Project Helix",
        organization_id: orgId,
        status: "mobilising",
        start_date: new Date("2026-04-01"),
        region: "GBR",
      },
      {
        name: "Government Data Exchange",
        short_name: "GDE",
        code_name: "Project Prism",
        organization_id: orgId,
        status: "bidding",
        start_date: new Date("2026-07-01"),
        region: "GBR",
      },
    ])
    .onConflictDoNothing();

  const rows = await db
    .select({ id: projectsTable.id, short_name: projectsTable.short_name })
    .from(projectsTable)
    .where(eq(projectsTable.organization_id, orgId));

  const byShortName = new Map(rows.map((r) => [r.short_name, r.id]));

  const resolve = (key: string): string => {
    const id = byShortName.get(key);
    if (!id) throw new Error(`Project ${key} not found after insert`);
    return id;
  };

  console.log(`    ✓ 6 projects`);

  return {
    dtp: resolve("DTP"),
    scap: resolve("SCAP"),
    npp: resolve("NPP"),
    fct: resolve("FCT"),
    rap: resolve("RAP"),
    gde: resolve("GDE"),
  };
}

export async function seedProjectMembers(
  db: DB,
  _orgId: string,
  U: UserMap,
  P: ProjectMap,
): Promise<void> {
  console.log("  Seeding project members...");

  await db
    .insert(projectMembersTable)
    .values([
      // ── Digital Transformation Portal (Mar–Oct 2025, closed) ──────────────────
      { project_id: P.dtp, user_id: U.sarah, project_role: "project_manager", start_date: "2025-03-01" },
      { project_id: P.dtp, user_id: U.kate, project_role: "delivery_manager", start_date: "2025-03-01" },
      { project_id: P.dtp, user_id: U.rachel, project_role: "tech_lead", start_date: "2025-03-01" },
      { project_id: P.dtp, user_id: U.james, project_role: "developer", start_date: "2025-03-01" },
      { project_id: P.dtp, user_id: U.tom, project_role: "developer", start_date: "2025-04-01" },
      { project_id: P.dtp, user_id: U.connor, project_role: "developer", start_date: "2025-06-01" },
      { project_id: P.dtp, user_id: U.liam, project_role: "analyst", start_date: "2025-03-01" },

      // ── Smart City Analytics Platform (Jul 2025–Feb 2026, closed) ─────────────
      { project_id: P.scap, user_id: U.marcus, project_role: "project_manager", start_date: "2025-07-01" },
      { project_id: P.scap, user_id: U.kate, project_role: "delivery_manager", start_date: "2025-07-01" },
      { project_id: P.scap, user_id: U.rachel, project_role: "tech_lead", start_date: "2025-07-01" },
      { project_id: P.scap, user_id: U.priya, project_role: "developer", start_date: "2025-07-01" },
      // James rolled off SCAP in Nov 2025 to join NPP
      { project_id: P.scap, user_id: U.james, project_role: "developer", start_date: "2025-08-01", end_date: "2025-11-30" },
      { project_id: P.scap, user_id: U.aisha, project_role: "developer", start_date: "2025-07-01" },
      { project_id: P.scap, user_id: U.elena, project_role: "developer", start_date: "2025-09-01" },
      { project_id: P.scap, user_id: U.liam, project_role: "analyst", start_date: "2025-07-01" },

      // ── NHS Patient Portal (Oct 2025–present, in_delivery) ────────────────────
      { project_id: P.npp, user_id: U.sarah, project_role: "project_manager", start_date: "2025-10-01" },
      { project_id: P.npp, user_id: U.rachel, project_role: "tech_lead", start_date: "2025-10-01" },
      { project_id: P.npp, user_id: U.james, project_role: "developer", start_date: "2025-12-01" },
      { project_id: P.npp, user_id: U.tom, project_role: "developer", start_date: "2025-11-01" },
      // Connor moved from DTP to NPP
      { project_id: P.npp, user_id: U.connor, project_role: "developer", start_date: "2025-11-01" },
      { project_id: P.npp, user_id: U.aisha, project_role: "developer", start_date: "2026-01-01" },

      // ── Financial Compliance Tracker (Jan 2026–present, in_delivery) ──────────
      { project_id: P.fct, user_id: U.marcus, project_role: "project_manager", start_date: "2026-01-01" },
      { project_id: P.fct, user_id: U.kate, project_role: "delivery_manager", start_date: "2026-01-01" },
      { project_id: P.fct, user_id: U.priya, project_role: "tech_lead", start_date: "2026-01-01" },
      { project_id: P.fct, user_id: U.elena, project_role: "developer", start_date: "2026-03-01" },
      { project_id: P.fct, user_id: U.liam, project_role: "analyst", start_date: "2026-01-01" },

      // ── Retail AI Platform (Apr 2026–present, mobilising) ─────────────────────
      { project_id: P.rap, user_id: U.sarah, project_role: "project_manager", start_date: "2026-04-01" },
      { project_id: P.rap, user_id: U.kate, project_role: "delivery_manager", start_date: "2026-04-01" },
      { project_id: P.rap, user_id: U.priya, project_role: "tech_lead", start_date: "2026-04-01" },
      { project_id: P.rap, user_id: U.tom, project_role: "developer", start_date: "2026-04-01" },
      { project_id: P.rap, user_id: U.dev, project_role: "developer", start_date: "2026-04-01" },

      // ── Government Data Exchange (Jul 2026, bidding) ──────────────────────────
      { project_id: P.gde, user_id: U.marcus, project_role: "project_manager", start_date: "2026-05-01" },
      { project_id: P.gde, user_id: U.james, project_role: "tech_lead", start_date: "2026-05-01" },
    ])
    .onConflictDoNothing();

  console.log(`    ✓ project members`);
}

export async function seedCompetencies(
  db: DB,
  orgId: string,
  U: UserMap,
  S: Map<string, string>,
): Promise<void> {
  console.log("  Seeding competencies...");

  const skill = (name: string) => {
    const id = S.get(name);
    if (!id) throw new Error(`Skill "${name}" not found in skill map`);
    return id;
  };

  type CompetencyRow = {
    user_id: string;
    skill_id: string;
    organization_id: string;
    proficiency: "aware" | "practising" | "confident" | "leading";
    disposition: "seeking" | "neutral" | "open" | "winding_down" | "prefer_not";
    source: "self_reported" | "verified_evidence" | "imported";
    last_used_at: string;
  };

  const rows: CompetencyRow[] = [
    // Sarah Chen — Principal PM
    { user_id: U.sarah, skill_id: skill("Product Strategy"), organization_id: orgId, proficiency: "leading", disposition: "open", source: "self_reported", last_used_at: "2026-04-01" },
    { user_id: U.sarah, skill_id: skill("Stakeholder Management"), organization_id: orgId, proficiency: "leading", disposition: "neutral", source: "self_reported", last_used_at: "2026-04-01" },
    { user_id: U.sarah, skill_id: skill("Agile Delivery"), organization_id: orgId, proficiency: "confident", disposition: "open", source: "self_reported", last_used_at: "2026-04-01" },

    // Marcus Webb — Lead PM
    { user_id: U.marcus, skill_id: skill("Product Strategy"), organization_id: orgId, proficiency: "confident", disposition: "seeking", source: "self_reported", last_used_at: "2026-04-01" },
    { user_id: U.marcus, skill_id: skill("Stakeholder Management"), organization_id: orgId, proficiency: "leading", disposition: "neutral", source: "self_reported", last_used_at: "2026-04-01" },
    { user_id: U.marcus, skill_id: skill("Agile Delivery"), organization_id: orgId, proficiency: "confident", disposition: "open", source: "self_reported", last_used_at: "2026-04-01" },

    // Kate Morrison — Lead Delivery Manager
    { user_id: U.kate, skill_id: skill("Agile Delivery"), organization_id: orgId, proficiency: "leading", disposition: "open", source: "self_reported", last_used_at: "2026-04-01" },
    { user_id: U.kate, skill_id: skill("Stakeholder Management"), organization_id: orgId, proficiency: "confident", disposition: "neutral", source: "self_reported", last_used_at: "2026-04-01" },
    { user_id: U.kate, skill_id: skill("Requirements Elicitation"), organization_id: orgId, proficiency: "confident", disposition: "open", source: "self_reported", last_used_at: "2026-03-01" },

    // Rachel Torres — Lead Developer
    { user_id: U.rachel, skill_id: skill("TypeScript"), organization_id: orgId, proficiency: "leading", disposition: "open", source: "verified_evidence", last_used_at: "2026-04-01" },
    { user_id: U.rachel, skill_id: skill("System Design"), organization_id: orgId, proficiency: "leading", disposition: "seeking", source: "verified_evidence", last_used_at: "2026-04-01" },
    { user_id: U.rachel, skill_id: skill("AWS"), organization_id: orgId, proficiency: "confident", disposition: "seeking", source: "verified_evidence", last_used_at: "2026-02-01" },
    { user_id: U.rachel, skill_id: skill("Code Review"), organization_id: orgId, proficiency: "leading", disposition: "open", source: "self_reported", last_used_at: "2026-04-01" },

    // James Okafor — Senior Developer
    { user_id: U.james, skill_id: skill("TypeScript"), organization_id: orgId, proficiency: "confident", disposition: "open", source: "verified_evidence", last_used_at: "2026-04-01" },
    { user_id: U.james, skill_id: skill("API Design"), organization_id: orgId, proficiency: "confident", disposition: "seeking", source: "verified_evidence", last_used_at: "2026-04-01" },
    { user_id: U.james, skill_id: skill("System Design"), organization_id: orgId, proficiency: "confident", disposition: "open", source: "self_reported", last_used_at: "2026-04-01" },
    { user_id: U.james, skill_id: skill("Code Review"), organization_id: orgId, proficiency: "confident", disposition: "open", source: "self_reported", last_used_at: "2026-04-01" },

    // Priya Sharma — Senior Developer
    { user_id: U.priya, skill_id: skill("TypeScript"), organization_id: orgId, proficiency: "confident", disposition: "open", source: "verified_evidence", last_used_at: "2026-04-01" },
    { user_id: U.priya, skill_id: skill("API Design"), organization_id: orgId, proficiency: "confident", disposition: "seeking", source: "verified_evidence", last_used_at: "2026-04-01" },
    { user_id: U.priya, skill_id: skill("PostgreSQL"), organization_id: orgId, proficiency: "confident", disposition: "neutral", source: "verified_evidence", last_used_at: "2026-04-01" },
    { user_id: U.priya, skill_id: skill("System Design"), organization_id: orgId, proficiency: "confident", disposition: "open", source: "self_reported", last_used_at: "2026-04-01" },

    // Tom Bradley — Mid Developer
    { user_id: U.tom, skill_id: skill("TypeScript"), organization_id: orgId, proficiency: "practising", disposition: "seeking", source: "verified_evidence", last_used_at: "2026-04-01" },
    { user_id: U.tom, skill_id: skill("React"), organization_id: orgId, proficiency: "confident", disposition: "open", source: "verified_evidence", last_used_at: "2026-04-01" },
    { user_id: U.tom, skill_id: skill("Accessibility"), organization_id: orgId, proficiency: "practising", disposition: "seeking", source: "verified_evidence", last_used_at: "2026-04-01" },

    // Aisha Johnson — Mid Developer
    { user_id: U.aisha, skill_id: skill("TypeScript"), organization_id: orgId, proficiency: "practising", disposition: "seeking", source: "verified_evidence", last_used_at: "2026-04-01" },
    { user_id: U.aisha, skill_id: skill("React"), organization_id: orgId, proficiency: "confident", disposition: "open", source: "verified_evidence", last_used_at: "2026-04-01" },
    { user_id: U.aisha, skill_id: skill("Data Analysis"), organization_id: orgId, proficiency: "practising", disposition: "seeking", source: "self_reported", last_used_at: "2026-01-01" },

    // Connor Walsh — Junior Developer
    { user_id: U.connor, skill_id: skill("TypeScript"), organization_id: orgId, proficiency: "practising", disposition: "seeking", source: "verified_evidence", last_used_at: "2026-04-01" },
    { user_id: U.connor, skill_id: skill("React"), organization_id: orgId, proficiency: "practising", disposition: "open", source: "self_reported", last_used_at: "2026-04-01" },
    { user_id: U.connor, skill_id: skill("Node.js"), organization_id: orgId, proficiency: "aware", disposition: "seeking", source: "self_reported", last_used_at: "2026-03-01" },
    { user_id: U.connor, skill_id: skill("Accessibility"), organization_id: orgId, proficiency: "practising", disposition: "open", source: "verified_evidence", last_used_at: "2025-10-01" },

    // Elena Petrov — Junior Developer
    { user_id: U.elena, skill_id: skill("TypeScript"), organization_id: orgId, proficiency: "practising", disposition: "seeking", source: "verified_evidence", last_used_at: "2026-04-01" },
    { user_id: U.elena, skill_id: skill("Node.js"), organization_id: orgId, proficiency: "practising", disposition: "open", source: "verified_evidence", last_used_at: "2026-04-01" },
    { user_id: U.elena, skill_id: skill("Test Automation"), organization_id: orgId, proficiency: "aware", disposition: "seeking", source: "self_reported", last_used_at: "2026-02-01" },

    // Dev Martinez — Associate Developer
    { user_id: U.dev, skill_id: skill("JavaScript"), organization_id: orgId, proficiency: "aware", disposition: "seeking", source: "self_reported", last_used_at: "2026-04-01" },
    { user_id: U.dev, skill_id: skill("React"), organization_id: orgId, proficiency: "aware", disposition: "seeking", source: "self_reported", last_used_at: "2026-04-01" },

    // Liam Chen — Business Analyst
    { user_id: U.liam, skill_id: skill("Requirements Elicitation"), organization_id: orgId, proficiency: "confident", disposition: "open", source: "verified_evidence", last_used_at: "2026-04-01" },
    { user_id: U.liam, skill_id: skill("Stakeholder Management"), organization_id: orgId, proficiency: "confident", disposition: "neutral", source: "verified_evidence", last_used_at: "2026-04-01" },
    { user_id: U.liam, skill_id: skill("Agile Delivery"), organization_id: orgId, proficiency: "practising", disposition: "open", source: "self_reported", last_used_at: "2026-04-01" },
  ];

  await db.insert(competenciesTable).values(rows).onConflictDoNothing();
  console.log(`    ✓ ${rows.length} competencies`);
}

export async function seedEvidence(
  db: DB,
  _orgId: string,
  U: UserMap,
  P: ProjectMap,
  S: Map<string, string>,
): Promise<void> {
  console.log("  Seeding evidence...");

  // Guard: if Rachel already has evidence skip the entire section to stay idempotent.
  // evidenceTable has no natural unique index, so onConflictDoNothing alone won't help.
  const [existing] = await db
    .select({ id: evidenceTable.id })
    .from(evidenceTable)
    .where(eq(evidenceTable.user_id, U.rachel))
    .limit(1);

  if (existing) {
    console.log("    ↳ Evidence already present, skipping");
    return;
  }

  const skill = (name: string) => {
    const id = S.get(name);
    if (!id) throw new Error(`Skill "${name}" not found in skill map`);
    return id;
  };

  // ── Evidence rows ─────────────────────────────────────────────────────────────

  type EvidenceInsert = {
    user_id: string;
    project_id: string;
    situation: string;
    task: string;
    action: string;
    result: string;
    status: "draft" | "submitted" | "verified";
    data_classification: "public" | "official" | "official_sensitive" | "secret";
    version: number;
  };

  const evidenceDefs: Array<EvidenceInsert & { _key: string }> = [
    // ── DTP evidence — all verified, all endorsed ─────────────────────────────

    {
      _key: "rachel-dtp-arch",
      user_id: U.rachel, project_id: P.dtp, status: "verified", data_classification: "official", version: 1,
      situation: "The Digital Transformation Portal inherited a tightly coupled monolith serving 200,000 users. Deployments caused 30–40 minutes of downtime and blocked multiple teams from shipping independently. Lorem ipsum dolor sit amet, the system had accumulated four years of technical debt with no clear separation of concerns.",
      task: "Lead the architectural migration to a containerised microservices approach without disrupting the live service or blocking feature delivery during the transition.",
      action: "Designed a strangler-fig migration plan with clear seams for each bounded context. Introduced Docker for containerisation and Kubernetes for orchestration, established blue-green deployments, and ran fortnightly architectural reviews with the full team. Documented decision records for each migration step.",
      result: "Deployment downtime eliminated entirely by week eight of the migration. System availability improved from 99.1% to 99.9% over the following quarter. Three feature teams could now deploy independently without coordination.",
    },
    {
      _key: "james-dtp-api",
      user_id: U.james, project_id: P.dtp, status: "verified", data_classification: "official", version: 1,
      situation: "Lorem ipsum dolor sit amet, the portal lacked a consistent API contract, causing integration failures with three downstream systems at least once per sprint. Each team had built their own client-specific wrappers around the same backend endpoints.",
      task: "Design and implement a versioned REST API to standardise integration across the portal and eliminate integration failures.",
      action: "Defined an OpenAPI 3.0 specification collaboratively with the three consuming teams, implemented the API layer in TypeScript using Hono, introduced automated contract testing, and ran two knowledge-sharing sessions to align teams on the new patterns.",
      result: "Integration failures reduced by 90% within two months. Two new downstream integrations were delivered ahead of schedule using the published spec. Onboarding time for new integrators dropped from three days to half a day.",
    },
    {
      _key: "tom-dtp-search",
      user_id: U.tom, project_id: P.dtp, status: "verified", data_classification: "official", version: 1,
      situation: "Lorem ipsum dolor sit amet, the portal had no search capability. Users had to navigate through 40 manual categories to find content, and user research showed a 62% abandonment rate on browse journeys lasting more than two minutes.",
      task: "Build a full-text search feature with filtering and faceted results to replace manual category navigation.",
      action: "Integrated PostgreSQL full-text search with tsvector indexing, built the React search component with debounced input and keyboard navigation, added filter facets for category and date, and wrote unit and integration tests for the search logic.",
      result: "Delivered in two sprints. User testing showed task completion time for common queries reduced by 65%. The abandonment rate on search journeys dropped to 18%.",
    },
    {
      _key: "connor-dtp-a11y",
      user_id: U.connor, project_id: P.dtp, status: "verified", data_classification: "official", version: 1,
      situation: "An accessibility audit ahead of the DTP go-live identified 23 WCAG 2.1 AA violations across the portal, including critical colour contrast failures and missing ARIA labels on interactive components. Lorem ipsum dolor sit amet, the issues would have prevented the portal from passing the government digital service standard.",
      task: "Address all critical and high-priority violations before the launch date, working alongside the design team.",
      action: "Worked through violations systematically starting with critical blockers: added ARIA labels to all interactive elements, fixed colour contrast ratios on 14 components, implemented focus management for modal dialogs, and tested with NVDA and VoiceOver screen readers.",
      result: "Zero critical violations at launch. 18 of 23 issues fully resolved; the remaining five low-priority issues were documented with a remediation plan. The portal passed the GDS accessibility audit.",
    },
    {
      _key: "kate-dtp-delivery",
      user_id: U.kate, project_id: P.dtp, status: "verified", data_classification: "official", version: 1,
      situation: "Lorem ipsum dolor sit amet, the DTP project launched with three competing stakeholder groups each with conflicting priorities. Sprint churn was running at 35%—roughly a third of sprint capacity was being lost to scope changes after planning.",
      task: "Establish a delivery rhythm and stakeholder alignment process that would reduce scope churn and improve sprint predictability.",
      action: "Introduced fortnightly show-and-tell sessions with all stakeholder groups, a weekly steering group summary with RAG status, and a change request process for in-sprint scope changes. Ran a retrospective specifically on stakeholder dynamics and incorporated team feedback into the governance approach.",
      result: "Sprint churn reduced from 35% to 8% over eight weeks. Stakeholder satisfaction scores in the next quarterly survey improved from 3.1 to 4.4 out of 5. The team reported meaningfully less context-switching.",
    },
    {
      _key: "liam-dtp-reqs",
      user_id: U.liam, project_id: P.dtp, status: "verified", data_classification: "official", version: 1,
      situation: "Lorem ipsum dolor sit amet, the portal scope had not been formally baselined at project start. Teams were building features without confirmed acceptance criteria, leading to frequent rework when assumptions were challenged by stakeholders.",
      task: "Facilitate a requirements workshop to baseline scope and produce agreed acceptance criteria for the five core user journeys.",
      action: "Ran a two-day requirements workshop with 12 stakeholders using event storming and MoSCoW prioritisation. Produced a signed-off backlog of 58 user stories with acceptance criteria, reviewed and approved by the product owner and steering group.",
      result: "All sprint planning sessions in the following four sprints completed on time with no scope disputes. Product owner sign-off rate on delivered features improved to 96%. Rework reduced by an estimated 40%.",
    },
    {
      _key: "sarah-dtp-strategy",
      user_id: U.sarah, project_id: P.dtp, status: "verified", data_classification: "official", version: 1,
      situation: "Lorem ipsum dolor sit amet, the DTP programme had five workstreams with separate governance structures and no unified product vision. Senior stakeholders were receiving inconsistent status updates and the programme was at risk of missing its public launch commitment.",
      task: "Establish a unified product strategy and governance model to align all workstreams under a single programme narrative.",
      action: "Facilitated a two-day programme alignment workshop, produced a shared product vision and OKR framework, restructured the governance into a single steering group with clear decision rights, and introduced a programme-level risk register with weekly review.",
      result: "Programme launched on schedule. Stakeholder confidence score improved from 2.8 to 4.1 at the next board review. The OKR framework was adopted as the standard approach for subsequent programmes in the portfolio.",
    },

    // ── SCAP evidence — mostly verified, some recent pending ──────────────────

    {
      _key: "rachel-scap-pipeline",
      user_id: U.rachel, project_id: P.scap, status: "verified", data_classification: "official", version: 1,
      situation: "Lorem ipsum dolor sit amet, the Smart City Analytics Platform needed to ingest and process 50GB of IoT sensor data daily with end-to-end latency below five minutes. The initial proof of concept used a batch approach that introduced 45-minute delays.",
      task: "Architect a scalable real-time data pipeline on AWS capable of meeting the latency SLA at full production volume.",
      action: "Designed a Lambda-based streaming ingestion pipeline with Kinesis Data Streams, S3 for durable storage, and Athena for query-time analytics. Introduced cost monitoring with AWS Cost Explorer, documented the architecture with decision records, and ran a load test at 2× expected peak volume.",
      result: "Average end-to-end pipeline latency of 3.2 minutes achieved at full volume. Infrastructure costs came in 15% under budget. The architecture was adopted as the standard pattern for event-driven workloads across the client's estate.",
    },
    {
      _key: "priya-scap-contracts",
      user_id: U.priya, project_id: P.scap, status: "verified", data_classification: "official", version: 1,
      situation: "Lorem ipsum dolor sit amet, three backend services on SCAP had no shared API contracts. Integration bugs were only surfacing in staging, adding an average of two days of rework per sprint and causing the team to lose confidence in independent deploys.",
      task: "Introduce consumer-driven contract testing across the three services to catch integration issues before they reach staging.",
      action: "Evaluated contract testing approaches and selected Pact for its multi-language support. Implemented Pact contracts across all three service boundaries, integrated tests into the CI pipeline so contracts ran on every PR, and ran a two-hour team workshop on the consumer-driven testing model.",
      result: "Integration bug escape rate to staging reduced by 70% within six weeks. The team reintroduced independent deployment cadences with confidence. Two contract violations caught in CI that would have caused production incidents.",
    },
    {
      _key: "priya-scap-perf",
      user_id: U.priya, project_id: P.scap, status: "submitted", data_classification: "official", version: 1,
      situation: "Lorem ipsum dolor sit amet, query response times on the analytics dashboard were averaging 4.2 seconds at the P95 percentile, generating user complaints and threatening SLA compliance ahead of the platform's public launch.",
      task: "Profile and optimise the query layer to bring P95 response times below 500ms without changing the data model.",
      action: "Used EXPLAIN ANALYZE to identify three missing composite indexes and two N+1 query patterns in the ORM-generated SQL. Added the indexes, rewrote the N+1 queries as batch fetches, and introduced Redis-backed query result caching with a 60-second TTL for dashboard aggregations.",
      result: "P95 query response time reduced from 4.2 seconds to 380ms. Cache hit rate stabilised at 72% within one week of rollout. No SLA breaches were recorded in the final month before launch.",
    },
    {
      _key: "aisha-scap-charts",
      user_id: U.aisha, project_id: P.scap, status: "verified", data_classification: "official", version: 1,
      situation: "Lorem ipsum dolor sit amet, the analytics platform required a suite of interactive charts handling live-updating data streams. The team had no shared component library and each dashboard view was independently styling its own visualisations.",
      task: "Build a reusable chart component library that could be composed across 14 dashboard views and handle real-time data updates.",
      action: "Created eight chart types as composable React components using Recharts, wrote Storybook stories for each component with documented props and usage guidelines, and set up Playwright visual regression tests. Ran a review session with the design team to validate the component API.",
      result: "Component library adopted across all 14 dashboard views within three weeks. Design team adopted Storybook as the primary review tool, reducing design-dev back-and-forth on chart work by approximately 50%. Visual regressions caught in CI twice during active development.",
    },
    {
      _key: "marcus-scap-delivery",
      user_id: U.marcus, project_id: P.scap, status: "verified", data_classification: "official", version: 1,
      situation: "Lorem ipsum dolor sit amet, the SCAP project was eight weeks into delivery when a mid-project stakeholder review revealed that two of the six planned analytics modules were significantly out of scope for the agreed budget.",
      task: "Renegotiate scope with the client while protecting team morale and maintaining the delivery schedule for the four in-scope modules.",
      action: "Prepared a scope impact analysis with three delivery options, facilitated a structured client workshop to agree revised scope, updated the programme plan and risk register, and communicated the outcome transparently to the full team with context on the decision.",
      result: "Revised scope agreed within one week. Four modules delivered on schedule and within budget. Client satisfaction score at project close was 4.3 out of 5. No team attrition during the scope change period.",
    },
    {
      _key: "elena-scap-export",
      user_id: U.elena, project_id: P.scap, status: "submitted", data_classification: "official", version: 1,
      situation: "Lorem ipsum dolor sit amet, a key client stakeholder required the ability to export analytics data for offline reporting. The lack of an export feature was blocking the client's finance team from using the platform and was flagged as a launch blocker.",
      task: "Implement CSV and Excel export functionality for all six dashboard views within a two-sprint window.",
      action: "Implemented streaming CSV export using Node.js Readable streams to avoid memory issues with large datasets, added Excel format support using ExcelJS, integrated export buttons into all six dashboard views, and wrote unit tests covering edge cases including empty datasets and special characters.",
      result: "Export feature delivered in one sprint, a week ahead of schedule. The finance team unblocked and began using the platform two weeks before public launch. No memory-related issues observed during load testing at 10,000 row exports.",
    },

    // ── NPP evidence — submitted, mix of pending and endorsed ─────────────────

    {
      _key: "james-npp-fhir",
      user_id: U.james, project_id: P.npp, status: "submitted", data_classification: "official_sensitive", version: 1,
      situation: "Lorem ipsum dolor sit amet, the NHS Patient Portal required integration with NHS Spine and Digital systems using the FHIR R4 standard. The team had no prior FHIR experience and the NHS Digital technical review was a hard gate on go-live.",
      task: "Design and implement a FHIR R4-compliant API layer for patient data access that would pass the NHS Digital technical review.",
      action: "Studied the FHIR R4 specification and NHS Digital integration patterns, implemented a compliant API using TypeScript with appropriate resource types and search parameters, collaborated with NHS technical advisors on three review cycles, and wrote a comprehensive test suite covering all required operations.",
      result: "API passed the NHS Digital technical review on the first submission. Integration testing with NHS Spine began two weeks ahead of schedule. The implementation patterns were documented as a reusable template for future NHS integrations.",
    },
    {
      _key: "tom-npp-registration",
      user_id: U.tom, project_id: P.npp, status: "submitted", data_classification: "official", version: 1,
      situation: "Lorem ipsum dolor sit amet, the patient registration flow had six steps and recorded a 34% drop-off rate in usability testing. Screen reader users encountered critical blockers at steps three and five that made completion impossible.",
      task: "Redesign and implement a streamlined registration flow that addressed usability and accessibility issues before clinical pilot.",
      action: "Collaborated with the UX designer to reduce the flow from six to four steps, rebuilt the multi-step form with React Hook Form and Zod validation, added a progress indicator with ARIA live regions, and addressed all accessibility blockers identified in usability testing.",
      result: "Drop-off rate reduced from 34% to 11% in post-implementation usability testing. Accessibility score improved from 62 to 94 on the Lighthouse audit. The flow passed screen reader testing with NVDA, JAWS, and VoiceOver.",
    },
    {
      _key: "connor-npp-sso",
      user_id: U.connor, project_id: P.npp, status: "submitted", data_classification: "official_sensitive", version: 1,
      situation: "Lorem ipsum dolor sit amet, the NHS Patient Portal needed to support staff single sign-on via the NHS Identity Provider using OAuth 2.0. Staff were required to authenticate with their NHS smartcard credentials, which added complexity beyond standard OAuth flows.",
      task: "Implement the NHS Identity Provider OAuth 2.0 integration including smartcard-linked authentication and session management.",
      action: "Integrated the NHS Identity Provider OAuth 2.0 flow using the existing auth library, implemented PKCE for security, built token refresh handling with automatic re-authentication on expiry, and added session expiry notifications to the UI with a 5-minute warning.",
      result: "SSO integration completed and accepted by the NHS Information Security team. No critical issues were found during the independent penetration test. Staff login time reduced from 45 seconds to 8 seconds compared to the previous system.",
    },
    {
      _key: "connor-npp-tests-draft",
      user_id: U.connor, project_id: P.npp, status: "draft", data_classification: "official", version: 1,
      situation: "Lorem ipsum dolor sit amet, the integration tests for the authentication service covered only happy-path scenarios. Edge cases including expired tokens, revoked sessions, and concurrent login attempts were untested.",
      task: "Expand the integration test suite to cover error and edge-case scenarios for the authentication service.",
      action: "Still in progress — working through the edge cases identified in the security review.",
      result: "Not yet complete.",
    },

    // ── FCT evidence — submitted, pending ─────────────────────────────────────

    {
      _key: "priya-fct-rules",
      user_id: U.priya, project_id: P.fct, status: "submitted", data_classification: "official", version: 1,
      situation: "Lorem ipsum dolor sit amet, the Financial Compliance Tracker required a configurable rule engine to evaluate financial transactions against three regulatory frameworks simultaneously. The compliance team needed to add new rules without requiring engineering involvement.",
      task: "Design and implement a rule engine that supported multiple regulatory frameworks and could be configured by the compliance team without code changes.",
      action: "Designed a YAML-based DSL for rule definition that the compliance team could author directly, implemented the evaluation engine in TypeScript with full test coverage, built a rule validation CLI to catch syntax errors before deployment, and delivered a two-hour onboarding session for the compliance team.",
      result: "Rule engine released to the compliance team in sprint five. Supports three regulatory frameworks and 47 active rules. Test coverage at 94%. Compliance team self-served two rule updates in the first week without engineering involvement.",
    },
    {
      _key: "liam-fct-reqs",
      user_id: U.liam, project_id: P.fct, status: "submitted", data_classification: "official", version: 1,
      situation: "Lorem ipsum dolor sit amet, the compliance reporting feature was blocked by misaligned requirements between the legal team and the product owner. Both had approved different interpretations of the same regulatory requirement, creating a risk of delivering a non-compliant feature.",
      task: "Facilitate alignment between legal, product, and engineering on the compliance reporting requirements and produce an agreed specification.",
      action: "Ran three focused workshops over two weeks with representatives from legal, product, and engineering. Used structured decision-making techniques to surface and resolve five key points of disagreement. Produced a requirements specification with clear rationale for each decision, reviewed by legal counsel and signed off by all parties.",
      result: "Feature specification agreed and signed off within two weeks. No scope changes were raised after sign-off. The compliance team confirmed the delivered feature met the legal requirement in their acceptance review.",
    },

    // ── RAP evidence — draft only ─────────────────────────────────────────────

    {
      _key: "dev-rap-draft",
      user_id: U.dev, project_id: P.rap, status: "draft", data_classification: "public", version: 1,
      situation: "Lorem ipsum dolor sit amet, as a new joiner on the Retail AI Platform project I was asked to contribute to the initial codebase setup and development tooling configuration.",
      task: "Configure the project's TypeScript build pipeline, ESLint ruleset, and Prettier configuration to match the team's agreed standards.",
      action: "Still working on writing this up — want to check with my manager what level of detail is expected.",
      result: "Not yet complete.",
    },
  ];

  const inserted = await db
    .insert(evidenceTable)
    .values(
      evidenceDefs.map(({ _key: _, ...row }) => row),
    )
    .returning({ id: evidenceTable.id, user_id: evidenceTable.user_id });

  // Build a key → id lookup using insertion order (evidenceDefs order matches inserted order).
  const evidenceIds = new Map<string, string>();
  for (let i = 0; i < evidenceDefs.length; i++) {
    const row = inserted[i];
    if (row) evidenceIds.set(evidenceDefs[i]._key, row.id);
  }

  const ev = (key: string): string => {
    const id = evidenceIds.get(key);
    if (!id) throw new Error(`Evidence key "${key}" not found`);
    return id;
  };

  console.log(`    ✓ ${inserted.length} evidence entries`);

  // ── Evidence skills ─────────────────────────────────────────────────────────

  console.log("  Seeding evidence skills...");

  type EvidenceSkillRow = {
    evidence_id: string;
    skill_id: string;
    level_claimed: "associate" | "junior" | "mid" | "senior" | "lead" | "principal";
    is_primary: boolean;
  };

  const evidenceSkillRows: EvidenceSkillRow[] = [
    { evidence_id: ev("rachel-dtp-arch"), skill_id: skill("System Design"), level_claimed: "lead", is_primary: true },
    { evidence_id: ev("rachel-dtp-arch"), skill_id: skill("AWS"), level_claimed: "senior", is_primary: false },
    { evidence_id: ev("james-dtp-api"), skill_id: skill("API Design"), level_claimed: "senior", is_primary: true },
    { evidence_id: ev("james-dtp-api"), skill_id: skill("TypeScript"), level_claimed: "senior", is_primary: false },
    { evidence_id: ev("tom-dtp-search"), skill_id: skill("React"), level_claimed: "mid", is_primary: true },
    { evidence_id: ev("tom-dtp-search"), skill_id: skill("TypeScript"), level_claimed: "mid", is_primary: false },
    { evidence_id: ev("tom-dtp-search"), skill_id: skill("PostgreSQL"), level_claimed: "junior", is_primary: false },
    { evidence_id: ev("connor-dtp-a11y"), skill_id: skill("Accessibility"), level_claimed: "junior", is_primary: true },
    { evidence_id: ev("connor-dtp-a11y"), skill_id: skill("React"), level_claimed: "junior", is_primary: false },
    { evidence_id: ev("kate-dtp-delivery"), skill_id: skill("Agile Delivery"), level_claimed: "lead", is_primary: true },
    { evidence_id: ev("kate-dtp-delivery"), skill_id: skill("Stakeholder Management"), level_claimed: "lead", is_primary: false },
    { evidence_id: ev("liam-dtp-reqs"), skill_id: skill("Requirements Elicitation"), level_claimed: "mid", is_primary: true },
    { evidence_id: ev("liam-dtp-reqs"), skill_id: skill("Stakeholder Management"), level_claimed: "mid", is_primary: false },
    { evidence_id: ev("sarah-dtp-strategy"), skill_id: skill("Product Strategy"), level_claimed: "principal", is_primary: true },
    { evidence_id: ev("sarah-dtp-strategy"), skill_id: skill("Stakeholder Management"), level_claimed: "principal", is_primary: false },
    { evidence_id: ev("rachel-scap-pipeline"), skill_id: skill("AWS"), level_claimed: "lead", is_primary: true },
    { evidence_id: ev("rachel-scap-pipeline"), skill_id: skill("System Design"), level_claimed: "lead", is_primary: false },
    { evidence_id: ev("priya-scap-contracts"), skill_id: skill("API Design"), level_claimed: "senior", is_primary: true },
    { evidence_id: ev("priya-scap-contracts"), skill_id: skill("TypeScript"), level_claimed: "senior", is_primary: false },
    { evidence_id: ev("priya-scap-perf"), skill_id: skill("PostgreSQL"), level_claimed: "senior", is_primary: true },
    { evidence_id: ev("priya-scap-perf"), skill_id: skill("System Design"), level_claimed: "senior", is_primary: false },
    { evidence_id: ev("aisha-scap-charts"), skill_id: skill("React"), level_claimed: "mid", is_primary: true },
    { evidence_id: ev("aisha-scap-charts"), skill_id: skill("TypeScript"), level_claimed: "mid", is_primary: false },
    { evidence_id: ev("marcus-scap-delivery"), skill_id: skill("Stakeholder Management"), level_claimed: "lead", is_primary: true },
    { evidence_id: ev("marcus-scap-delivery"), skill_id: skill("Agile Delivery"), level_claimed: "lead", is_primary: false },
    { evidence_id: ev("elena-scap-export"), skill_id: skill("Node.js"), level_claimed: "junior", is_primary: true },
    { evidence_id: ev("elena-scap-export"), skill_id: skill("TypeScript"), level_claimed: "junior", is_primary: false },
    { evidence_id: ev("james-npp-fhir"), skill_id: skill("API Design"), level_claimed: "senior", is_primary: true },
    { evidence_id: ev("james-npp-fhir"), skill_id: skill("TypeScript"), level_claimed: "senior", is_primary: false },
    { evidence_id: ev("tom-npp-registration"), skill_id: skill("React"), level_claimed: "mid", is_primary: true },
    { evidence_id: ev("tom-npp-registration"), skill_id: skill("Accessibility"), level_claimed: "mid", is_primary: false },
    { evidence_id: ev("connor-npp-sso"), skill_id: skill("TypeScript"), level_claimed: "junior", is_primary: true },
    { evidence_id: ev("connor-npp-sso"), skill_id: skill("Node.js"), level_claimed: "junior", is_primary: false },
    { evidence_id: ev("priya-fct-rules"), skill_id: skill("TypeScript"), level_claimed: "senior", is_primary: true },
    { evidence_id: ev("priya-fct-rules"), skill_id: skill("System Design"), level_claimed: "senior", is_primary: false },
    { evidence_id: ev("liam-fct-reqs"), skill_id: skill("Requirements Elicitation"), level_claimed: "mid", is_primary: true },
    { evidence_id: ev("liam-fct-reqs"), skill_id: skill("Stakeholder Management"), level_claimed: "mid", is_primary: false },
  ];

  await db.insert(evidenceSkillsTable).values(evidenceSkillRows).onConflictDoNothing();
  console.log(`    ✓ ${evidenceSkillRows.length} evidence-skill links`);

  // ── Endorsements ─────────────────────────────────────────────────────────────

  console.log("  Seeding endorsements...");

  type EndorsementRow = {
    evidence_id: string;
    endorser_id: string;
    is_suggested: boolean;
    status: "pending" | "endorsed" | "skipped" | "flagged";
    note?: string;
    responded_at?: Date;
  };

  const endorsementRows: EndorsementRow[] = [
    // DTP evidence — all fully endorsed (project closed 7 months ago)
    { evidence_id: ev("rachel-dtp-arch"), endorser_id: U.james, is_suggested: true, status: "endorsed", note: "I worked directly with Rachel on this migration. The strangler-fig approach was well-chosen and the weekly architecture reviews kept the team aligned throughout.", responded_at: new Date("2025-11-05") },
    { evidence_id: ev("rachel-dtp-arch"), endorser_id: U.kate, is_suggested: true, status: "endorsed", note: "Rachel's approach eliminated the deployment coordination overhead that had been slowing the team. Clear technical leadership throughout.", responded_at: new Date("2025-11-07") },

    { evidence_id: ev("james-dtp-api"), endorser_id: U.rachel, is_suggested: true, status: "endorsed", note: "The OpenAPI-first approach James introduced set a standard the whole team benefits from. The contract testing caught real issues before they reached downstream teams.", responded_at: new Date("2025-11-10") },
    { evidence_id: ev("james-dtp-api"), endorser_id: U.liam, is_suggested: true, status: "endorsed", note: "The knowledge-sharing sessions made a real difference for the analyst team when consuming the new API. Strongly endorsed.", responded_at: new Date("2025-11-12") },

    { evidence_id: ev("tom-dtp-search"), endorser_id: U.james, is_suggested: true, status: "endorsed", note: "Tom delivered this with minimal support — a solid piece of work for someone at this stage. The test coverage was notably thorough.", responded_at: new Date("2025-11-15") },
    { evidence_id: ev("tom-dtp-search"), endorser_id: U.rachel, is_suggested: false, status: "endorsed", note: "The full-text search implementation was well-considered and the component API is clean. Good evidence of independent feature ownership.", responded_at: new Date("2025-11-18") },

    { evidence_id: ev("connor-dtp-a11y"), endorser_id: U.tom, is_suggested: true, status: "endorsed", note: "Connor took accessibility seriously from the start of this work rather than treating it as a checkbox. The screen reader testing was particularly thorough.", responded_at: new Date("2025-11-20") },
    { evidence_id: ev("connor-dtp-a11y"), endorser_id: U.rachel, is_suggested: true, status: "endorsed", note: "Zero critical violations at launch was a significant achievement given the starting point. Connor's systematic approach was the right call.", responded_at: new Date("2025-11-22") },

    { evidence_id: ev("kate-dtp-delivery"), endorser_id: U.sarah, is_suggested: true, status: "endorsed", note: "Kate's governance changes had an immediate and measurable impact on delivery predictability. Exactly the right intervention at the right time.", responded_at: new Date("2025-11-15") },
    { evidence_id: ev("kate-dtp-delivery"), endorser_id: U.marcus, is_suggested: true, status: "endorsed", note: "The show-and-tell format Kate introduced is now a standard across our delivery practice. Strong evidence of delivery leadership.", responded_at: new Date("2025-11-17") },

    { evidence_id: ev("liam-dtp-reqs"), endorser_id: U.kate, is_suggested: true, status: "endorsed", note: "Liam ran the most effective requirements workshop I have seen on a government project. The structured approach resolved disagreements that had been festering for months.", responded_at: new Date("2025-11-20") },
    { evidence_id: ev("liam-dtp-reqs"), endorser_id: U.marcus, is_suggested: false, status: "endorsed", note: "The signed-off backlog Liam produced was referenced throughout delivery as the single source of truth. High-quality requirements work.", responded_at: new Date("2025-11-22") },

    { evidence_id: ev("sarah-dtp-strategy"), endorser_id: U.marcus, is_suggested: true, status: "endorsed", note: "Sarah's programme alignment workshop was a turning point for the DTP programme. The OKR framework she introduced is now used across the portfolio.", responded_at: new Date("2025-11-25") },
    { evidence_id: ev("sarah-dtp-strategy"), endorser_id: U.kate, is_suggested: true, status: "endorsed", note: "The governance restructure Sarah led gave the delivery team clear decision rights for the first time. Strongly endorsed as evidence of principal-level strategic impact.", responded_at: new Date("2025-11-26") },

    // SCAP evidence — mix of endorsed and pending (project closed 2 months ago)
    { evidence_id: ev("rachel-scap-pipeline"), endorser_id: U.priya, is_suggested: true, status: "endorsed", note: "Rachel's architecture choices on this pipeline were validated by the load test results and have held up in production. The documentation is also excellent.", responded_at: new Date("2026-03-10") },
    { evidence_id: ev("rachel-scap-pipeline"), endorser_id: U.marcus, is_suggested: true, status: "endorsed", note: "Delivering 15% under budget while meeting an aggressive latency SLA is a strong outcome. Rachel's technical leadership was central to this.", responded_at: new Date("2026-03-12") },

    { evidence_id: ev("priya-scap-contracts"), endorser_id: U.rachel, is_suggested: true, status: "endorsed", note: "Contract testing has meaningfully changed how this team deploys. Priya's approach of doing team education alongside implementation was the right call.", responded_at: new Date("2026-03-15") },
    { evidence_id: ev("priya-scap-contracts"), endorser_id: U.aisha, is_suggested: true, status: "endorsed", note: "The workshop Priya ran made the concepts accessible. Two bugs caught by contract tests before reaching staging in the first month alone.", responded_at: new Date("2026-03-18") },

    // priya-scap-perf: submitted recently — pending
    { evidence_id: ev("priya-scap-perf"), endorser_id: U.rachel, is_suggested: true, status: "pending" },
    { evidence_id: ev("priya-scap-perf"), endorser_id: U.james, is_suggested: true, status: "pending" },

    { evidence_id: ev("aisha-scap-charts"), endorser_id: U.priya, is_suggested: true, status: "endorsed", note: "The component API Aisha designed is clean and composable. The Storybook adoption is a lasting contribution to how the design system team works.", responded_at: new Date("2026-03-20") },
    { evidence_id: ev("aisha-scap-charts"), endorser_id: U.elena, is_suggested: false, status: "endorsed", note: "Working with these components as a consumer — the documentation made them easy to use correctly. Good evidence of thinking about developer experience.", responded_at: new Date("2026-03-22") },

    { evidence_id: ev("marcus-scap-delivery"), endorser_id: U.sarah, is_suggested: true, status: "endorsed", note: "Marcus handled a difficult scope conversation with the client professionally and transparently. The outcome was good for both sides.", responded_at: new Date("2026-03-25") },
    { evidence_id: ev("marcus-scap-delivery"), endorser_id: U.kate, is_suggested: true, status: "pending" },

    // elena-scap-export: submitted — 1 endorsed, 1 pending
    { evidence_id: ev("elena-scap-export"), endorser_id: U.aisha, is_suggested: true, status: "endorsed", note: "Elena's streaming implementation was the right technical choice and she identified it independently. Delivered ahead of schedule.", responded_at: new Date("2026-04-02") },
    { evidence_id: ev("elena-scap-export"), endorser_id: U.priya, is_suggested: true, status: "pending" },

    // NPP evidence — submitted, mix of pending and one endorsed
    { evidence_id: ev("james-npp-fhir"), endorser_id: U.rachel, is_suggested: true, status: "pending" },
    { evidence_id: ev("james-npp-fhir"), endorser_id: U.tom, is_suggested: false, status: "skipped", note: "I didn't have visibility of the FHIR implementation work — James should seek endorsement from someone with NHS integration context.", responded_at: new Date("2026-04-20") },

    { evidence_id: ev("tom-npp-registration"), endorser_id: U.james, is_suggested: true, status: "endorsed", note: "Tom's initiative on accessibility beyond what was asked for was particularly strong. The drop-off rate improvement is a real user outcome.", responded_at: new Date("2026-04-15") },
    { evidence_id: ev("tom-npp-registration"), endorser_id: U.connor, is_suggested: true, status: "pending" },

    { evidence_id: ev("connor-npp-sso"), endorser_id: U.james, is_suggested: true, status: "pending" },

    // FCT evidence — submitted, one flagged example
    { evidence_id: ev("priya-fct-rules"), endorser_id: U.rachel, is_suggested: true, status: "pending" },
    // flagged — needs more quantitative detail
    { evidence_id: ev("priya-fct-rules"), endorser_id: U.marcus, is_suggested: false, status: "flagged", note: "The rule engine work sounds solid but the evidence would benefit from specific metrics on the compliance team's productivity gain. Please add quantifiable outcomes and I will be happy to endorse.", responded_at: new Date("2026-05-02") },

    { evidence_id: ev("liam-fct-reqs"), endorser_id: U.kate, is_suggested: true, status: "pending" },
  ];

  await db.insert(endorsementsTable).values(endorsementRows).onConflictDoNothing();
  console.log(`    ✓ ${endorsementRows.length} endorsements`);
}

// ── CLI entry point ───────────────────────────────────────────────────────────

async function main() {
  const orgId = process.env.ORG_ID;
  if (!orgId) {
    console.error("ORG_ID environment variable is required");
    console.error("  Usage: ORG_ID=<uuid> tsx src/scripts/dev/seed-dev-data.ts");
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL environment variable is not set");
    process.exit(1);
  }

  const db = drizzle(process.env.DATABASE_URL);

  // Verify the org exists
  const [org] = await db
    .select({ id: organizationsTable.id, name: organizationsTable.name })
    .from(organizationsTable)
    .where(eq(organizationsTable.id, orgId));

  if (!org) {
    console.error(`Organisation not found: ${orgId}`);
    console.error("  Ensure the organisation exists before running this script.");
    process.exit(1);
  }

  console.log(`\n🌱 Seeding dev data for "${org.name}" (${orgId})\n`);

  // Parse --only=<sections> flag
  const onlyArg = process.argv.find((a) => a.startsWith("--only="));
  const only = onlyArg ? new Set(onlyArg.replace("--only=", "").split(",")) : null;

  const run = (section: string) => !only || only.has(section);

  let S: Map<string, string> = new Map();
  let U: UserMap | null = null;
  let P: ProjectMap | null = null;

  if (run("skills")) {
    S = await seedOrgSkills(db, orgId);
  } else {
    // Load existing skills even if not re-seeding, so downstream seeders can reference them
    const rows = await db
      .select({ id: skillsTable.id, name: skillsTable.name })
      .from(skillsTable)
      .where(eq(skillsTable.organization_id, orgId));
    S = new Map(rows.map((r) => [r.name, r.id]));
  }

  if (run("users")) {
    U = await seedUsers(db, orgId);
  }

  // Load user map if not seeded in this run
  if (!U) {
    const rows = await db
      .select({ id: usersTable.id, email: usersTable.email })
      .from(usersTable)
      .where(eq(usersTable.organization_id, orgId));
    const byEmail = new Map(rows.map((r) => [r.email, r.id]));
    const get = (email: string, key: string) => {
      const id = byEmail.get(email);
      if (!id) throw new Error(`User ${key} not found — run without --only, or include "users" in the section list`);
      return id;
    };
    U = {
      sarah: get("sarah.chen@dev-seed.com", "sarah"),
      marcus: get("marcus.webb@dev-seed.com", "marcus"),
      kate: get("kate.morrison@dev-seed.com", "kate"),
      rachel: get("rachel.torres@dev-seed.com", "rachel"),
      james: get("james.okafor@dev-seed.com", "james"),
      priya: get("priya.sharma@dev-seed.com", "priya"),
      tom: get("tom.bradley@dev-seed.com", "tom"),
      aisha: get("aisha.johnson@dev-seed.com", "aisha"),
      connor: get("connor.walsh@dev-seed.com", "connor"),
      elena: get("elena.petrov@dev-seed.com", "elena"),
      dev: get("dev.martinez@dev-seed.com", "dev"),
      liam: get("liam.chen@dev-seed.com", "liam"),
    };
  }

  if (run("grades")) await seedJobGradesAndAssignments(db, orgId, U);
  if (run("relationships")) await seedUserRelationships(db, orgId, U);

  if (run("projects")) {
    P = await seedProjects(db, orgId);
  }

  if (!P) {
    const rows = await db
      .select({ id: projectsTable.id, short_name: projectsTable.short_name })
      .from(projectsTable)
      .where(eq(projectsTable.organization_id, orgId));
    const byShort = new Map(rows.map((r) => [r.short_name, r.id]));
    const get = (key: string) => {
      const id = byShort.get(key);
      if (!id) throw new Error(`Project ${key} not found — run without --only, or include "projects" in the section list`);
      return id;
    };
    P = { dtp: get("DTP"), scap: get("SCAP"), npp: get("NPP"), fct: get("FCT"), rap: get("RAP"), gde: get("GDE") };
  }

  if (run("members")) await seedProjectMembers(db, orgId, U, P);
  if (run("competencies")) await seedCompetencies(db, orgId, U, S);
  if (run("evidence")) await seedEvidence(db, orgId, U, P, S);

  console.log("\n✅ Dev seed complete.\n");
  console.log("Users:    sarah.chen@dev-seed.com … dev.martinez@dev-seed.com");
  console.log("Projects: DTP (closed), SCAP (closed), NPP (in delivery), FCT (in delivery), RAP (mobilising), GDE (bidding)");
  console.log("\nTip: run with --only=evidence to re-seed evidence without touching users/projects.");
}

main().catch((err) => {
  console.error("Dev seed failed:", err);
  process.exit(1);
});
