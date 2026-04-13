import { drizzle } from "drizzle-orm/node-postgres";
import { and, eq, isNull } from "drizzle-orm";
import {
  user as authUserTable,
  clearanceLevelsTable,
  competenciesTable,
  credentialsTable,
  endorsementsTable,
  evidenceTable,
  feedbackTable,
  frameworkRoleFamiliesTable,
  frameworkRolesTable,
  goalEvidenceTable,
  goalsTable,
  jobGradesTable,
  organizationsTable,
  projectMembersTable,
  projectsTable,
  userClearancesTable,
  userGradeAssignmentsTable,
  userRelationshipsTable,
  usersTable,
} from "../../schema";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

const db = drizzle(process.env.DATABASE_URL);

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getFrameworkRoleId(
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

async function getClearanceLevelId(shortName: string): Promise<string | null> {
  const [row] = await db
    .select({ id: clearanceLevelsTable.id })
    .from(clearanceLevelsTable)
    .where(eq(clearanceLevelsTable.shortName, shortName));
  return row?.id ?? null;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  // ── Auth user records (required before usersTable — FK constraint) ────────────
  // These are better_auth user rows. We use fixed text IDs so they're stable
  // across re-runs and easy to reference in other dev tooling.

  const AUTH_IDS = {
    alice: "fixture-alice",
    bob: "fixture-bob",
    charlie: "fixture-charlie",
    diana: "fixture-diana",
    ethan: "fixture-ethan",
    fiona: "fixture-fiona",
    george: "fixture-george",
    hannah: "fixture-hannah",
    ian: "fixture-ian",
    jane: "fixture-jane",
  };

  await db
    .insert(authUserTable)
    .values([
      {
        id: AUTH_IDS.alice,
        name: "Alice Smith",
        email: "alice.smith@demo.com",
        emailVerified: true,
      },
      {
        id: AUTH_IDS.bob,
        name: "Bob Johnson",
        email: "bob.johnson@demo.com",
        emailVerified: true,
      },
      {
        id: AUTH_IDS.charlie,
        name: "Charlie Brown",
        email: "charlie.brown@demo.com",
        emailVerified: true,
      },
      {
        id: AUTH_IDS.diana,
        name: "Diana Prince",
        email: "diana.prince@demo.com",
        emailVerified: true,
      },
      {
        id: AUTH_IDS.ethan,
        name: "Ethan Hunt",
        email: "ethan.hunt@demo.com",
        emailVerified: true,
      },
      {
        id: AUTH_IDS.fiona,
        name: "Fiona Gallagher",
        email: "fiona.gallagher@demo.com",
        emailVerified: true,
      },
      {
        id: AUTH_IDS.george,
        name: "George Michael",
        email: "george.michael@demo.com",
        emailVerified: true,
      },
      {
        id: AUTH_IDS.hannah,
        name: "Hannah Baker",
        email: "hannah.baker@demo.com",
        emailVerified: true,
      },
      {
        id: AUTH_IDS.ian,
        name: "Ian Fleming",
        email: "ian.fleming@demo.com",
        emailVerified: true,
      },
      {
        id: AUTH_IDS.jane,
        name: "Jane Doe",
        email: "jane.doe@demo.com",
        emailVerified: true,
      },
    ])
    .onConflictDoNothing();

  // ── Organisation ──────────────────────────────────────────────────────────────

  await db
    .insert(organizationsTable)
    .values({ name: "Demo Organisation" })
    .onConflictDoNothing();

  const [demoOrg] = await db
    .select({ id: organizationsTable.id })
    .from(organizationsTable)
    .where(eq(organizationsTable.name as any, "Demo Organisation"));

  if (!demoOrg) throw new Error("Demo Organisation not found after insert");
  const orgId = demoOrg.id;

  // ── Users ─────────────────────────────────────────────────────────────────────
  // Ten people at different career stages covering the core role families.

  await db
    .insert(usersTable)
    .values([
      // Software developers ─ three levels
      {
        name: "Alice Smith",
        email: "alice.smith@demo.com",
        status: "active",
        better_auth_id: AUTH_IDS.alice,
        organization_id: orgId,
      },
      {
        name: "Bob Johnson",
        email: "bob.johnson@demo.com",
        status: "active",
        better_auth_id: AUTH_IDS.bob,
        organization_id: orgId,
      },
      {
        name: "Charlie Brown",
        email: "charlie.brown@demo.com",
        status: "active",
        better_auth_id: AUTH_IDS.charlie,
        organization_id: orgId,
      },
      // UX designer
      {
        name: "Diana Prince",
        email: "diana.prince@demo.com",
        status: "active",
        better_auth_id: AUTH_IDS.diana,
        organization_id: orgId,
      },
      // Delivery manager
      {
        name: "Ethan Hunt",
        email: "ethan.hunt@demo.com",
        status: "active",
        better_auth_id: AUTH_IDS.ethan,
        organization_id: orgId,
      },
      // Data scientist
      {
        name: "Fiona Gallagher",
        email: "fiona.gallagher@demo.com",
        status: "active",
        better_auth_id: AUTH_IDS.fiona,
        organization_id: orgId,
      },
      // Associate developer (newest joiner, still pending approval)
      {
        name: "George Michael",
        email: "george.michael@demo.com",
        status: "pending_approval",
        better_auth_id: AUTH_IDS.george,
        organization_id: orgId,
      },
      // Test engineer
      {
        name: "Hannah Baker",
        email: "hannah.baker@demo.com",
        status: "active",
        better_auth_id: AUTH_IDS.hannah,
        organization_id: orgId,
      },
      // Business analyst
      {
        name: "Ian Fleming",
        email: "ian.fleming@demo.com",
        status: "active",
        better_auth_id: AUTH_IDS.ian,
        organization_id: orgId,
      },
      // Principal product manager (most senior)
      {
        name: "Jane Doe",
        email: "jane.doe@demo.com",
        status: "active",
        better_auth_id: AUTH_IDS.jane,
        organization_id: orgId,
      },
    ])
    .onConflictDoNothing();

  const allUsers = await db
    .select({ id: usersTable.id, email: usersTable.email })
    .from(usersTable)
    .where(eq(usersTable.organization_id, orgId));

  const uid = Object.fromEntries(
    allUsers.map((u) => [u.email, u.id]),
  ) as Record<string, string>;

  const U = {
    alice: uid["alice.smith@demo.com"],
    bob: uid["bob.johnson@demo.com"],
    charlie: uid["charlie.brown@demo.com"],
    diana: uid["diana.prince@demo.com"],
    ethan: uid["ethan.hunt@demo.com"],
    fiona: uid["fiona.gallagher@demo.com"],
    george: uid["george.michael@demo.com"],
    hannah: uid["hannah.baker@demo.com"],
    ian: uid["ian.fleming@demo.com"],
    jane: uid["jane.doe@demo.com"],
  };

  // ── Clearances ────────────────────────────────────────────────────────────────
  // Ethan and Ian have SC clearance (required for the Defence project).
  // Alice has BPSS (baseline — everyone should have this in practice).

  const bpssId = await getClearanceLevelId("BPSS");
  const scId = await getClearanceLevelId("SC");

  if (bpssId) {
    await db
      .insert(userClearancesTable)
      .values([
        {
          user_id: U.alice,
          clearance_level_id: bpssId,
          granted_at: new Date("2022-03-01"),
        },
        {
          user_id: U.bob,
          clearance_level_id: bpssId,
          granted_at: new Date("2022-06-01"),
        },
        {
          user_id: U.hannah,
          clearance_level_id: bpssId,
          granted_at: new Date("2021-09-01"),
        },
        {
          user_id: U.jane,
          clearance_level_id: bpssId,
          granted_at: new Date("2020-01-01"),
        },
      ])
      .onConflictDoNothing();
  }

  if (scId) {
    await db
      .insert(userClearancesTable)
      .values([
        {
          user_id: U.ethan,
          clearance_level_id: scId,
          granted_at: new Date("2021-04-15"),
        },
        {
          user_id: U.ian,
          clearance_level_id: scId,
          granted_at: new Date("2022-11-01"),
        },
      ])
      .onConflictDoNothing();
  }

  // ── Job grades ────────────────────────────────────────────────────────────────
  // Org-specific grade names mapped to platform framework roles.
  // Represents how the organisation labels these levels internally.

  const gradeDefinitions: Array<{
    name: string;
    family: string;
    level: string;
  }> = [
    {
      name: "Associate Developer (Grade A)",
      family: "Software Developer",
      level: "associate",
    },
    {
      name: "Junior Developer (Grade B)",
      family: "Software Developer",
      level: "junior",
    },
    {
      name: "Software Developer (Grade C)",
      family: "Software Developer",
      level: "mid",
    },
    {
      name: "Senior Developer (Grade D)",
      family: "Software Developer",
      level: "senior",
    },
    {
      name: "Lead Developer (Grade E)",
      family: "Software Developer",
      level: "lead",
    },
    {
      name: "Senior UX Designer (Grade D)",
      family: "UX Designer",
      level: "senior",
    },
    {
      name: "Lead Delivery Manager (Grade E)",
      family: "Agile Delivery Manager",
      level: "lead",
    },
    {
      name: "Data Scientist (Grade C)",
      family: "Data Scientist",
      level: "mid",
    },
    {
      name: "Senior Test Engineer (Grade D)",
      family: "Test Engineer",
      level: "senior",
    },
    {
      name: "Business Analyst (Grade C)",
      family: "Business Analyst",
      level: "mid",
    },
    {
      name: "Principal Product Manager (Grade F)",
      family: "Product Manager",
      level: "principal",
    },
  ];

  for (const grade of gradeDefinitions) {
    const frameworkRoleId = await getFrameworkRoleId(grade.family, grade.level);
    if (frameworkRoleId) {
      await db
        .insert(jobGradesTable)
        .values({
          name: grade.name,
          organization_id: orgId,
          framework_role_id: frameworkRoleId,
        })
        .onConflictDoNothing();
    }
  }

  const allGrades = await db
    .select({ id: jobGradesTable.id, name: jobGradesTable.name })
    .from(jobGradesTable)
    .where(eq(jobGradesTable.organization_id, orgId));

  const gradeByName = new Map(allGrades.map((g) => [g.name, g.id]));

  // ── User grade assignments ─────────────────────────────────────────────────────

  const gradeAssignments: Array<{
    userId: string;
    gradeName: string;
    startDate: string;
  }> = [
    {
      userId: U.george,
      gradeName: "Associate Developer (Grade A)",
      startDate: "2024-09-01",
    },
    {
      userId: U.charlie,
      gradeName: "Junior Developer (Grade B)",
      startDate: "2023-09-01",
    },
    {
      userId: U.bob,
      gradeName: "Software Developer (Grade C)",
      startDate: "2022-03-01",
    },
    {
      userId: U.alice,
      gradeName: "Senior Developer (Grade D)",
      startDate: "2021-01-01",
    },
    {
      userId: U.diana,
      gradeName: "Senior UX Designer (Grade D)",
      startDate: "2020-06-01",
    },
    {
      userId: U.ethan,
      gradeName: "Lead Delivery Manager (Grade E)",
      startDate: "2019-04-01",
    },
    {
      userId: U.fiona,
      gradeName: "Data Scientist (Grade C)",
      startDate: "2022-07-01",
    },
    {
      userId: U.hannah,
      gradeName: "Senior Test Engineer (Grade D)",
      startDate: "2021-03-01",
    },
    {
      userId: U.ian,
      gradeName: "Business Analyst (Grade C)",
      startDate: "2022-01-01",
    },
    {
      userId: U.jane,
      gradeName: "Principal Product Manager (Grade F)",
      startDate: "2018-01-01",
    },
  ];

  for (const assignment of gradeAssignments) {
    const gradeId = gradeByName.get(assignment.gradeName);
    if (gradeId) {
      await db
        .insert(userGradeAssignmentsTable)
        .values({
          user_id: assignment.userId,
          job_grade_id: gradeId,
          start_date: assignment.startDate,
          end_date: null,
        })
        .onConflictDoNothing();
    }
  }

  // ── Projects ──────────────────────────────────────────────────────────────────

  const scClearanceId = await getClearanceLevelId("SC");

  await db
    .insert(projectsTable)
    .values([
      {
        name: "Affordable Public Transport",
        code_name: "Project Alpha",
        short_name: "APT",
        organization_id: orgId,
      },
      {
        name: "Defence Innovation Lab",
        code_name: "Project Beta",
        short_name: "DIL",
        is_name_classified: true,
        organization_id: orgId,
        minimum_clearance_id: scClearanceId,
      },
      {
        name: "Cybersecurity for Critical Infrastructure",
        code_name: "Project Gamma",
        short_name: "CCI",
        organization_id: orgId,
      },
      {
        name: "AI-Powered Healthcare Diagnostics",
        code_name: "Project Delta",
        short_name: "AHD",
        organization_id: orgId,
      },
    ])
    .onConflictDoNothing();

  const allProjects = await db
    .select({ id: projectsTable.id, name: projectsTable.name })
    .from(projectsTable)
    .where(eq(projectsTable.organization_id, orgId));

  const projectByName = new Map(allProjects.map((p) => [p.name, p.id]));
  const P = {
    apt: projectByName.get("Affordable Public Transport")!,
    dil: projectByName.get("Defence Innovation Lab")!,
    cci: projectByName.get("Cybersecurity for Critical Infrastructure")!,
    ahd: projectByName.get("AI-Powered Healthcare Diagnostics")!,
  };

  // ── Project members ───────────────────────────────────────────────────────────

  await db
    .insert(projectMembersTable)
    .values([
      // Affordable Public Transport
      {
        project_id: P.apt,
        user_id: U.alice,
        project_role: "tech_lead",
        start_date: "2023-01-01",
      },
      {
        project_id: P.apt,
        user_id: U.bob,
        project_role: "developer",
        start_date: "2023-02-01",
      },
      {
        project_id: P.apt,
        user_id: U.charlie,
        project_role: "developer",
        start_date: "2024-09-01",
      },
      {
        project_id: P.apt,
        user_id: U.fiona,
        project_role: "analyst",
        start_date: "2023-03-01",
      },
      {
        project_id: P.apt,
        user_id: U.hannah,
        project_role: "developer",
        start_date: "2023-01-01",
      },
      // Defence Innovation Lab (SC clearance required — only Ethan, Ian, Jane)
      {
        project_id: P.dil,
        user_id: U.ethan,
        project_role: "delivery_manager",
        start_date: "2022-06-01",
      },
      {
        project_id: P.dil,
        user_id: U.ian,
        project_role: "analyst",
        start_date: "2022-07-01",
      },
      {
        project_id: P.dil,
        user_id: U.jane,
        project_role: "project_manager",
        start_date: "2022-06-01",
      },
      // Cybersecurity for Critical Infrastructure
      {
        project_id: P.cci,
        user_id: U.diana,
        project_role: "designer",
        start_date: "2023-06-01",
      },
      {
        project_id: P.cci,
        user_id: U.bob,
        project_role: "developer",
        start_date: "2023-06-01",
        end_date: "2024-03-01",
      },
      {
        project_id: P.cci,
        user_id: U.fiona,
        project_role: "analyst",
        start_date: "2023-07-01",
      },
      // AI-Powered Healthcare Diagnostics
      {
        project_id: P.ahd,
        user_id: U.jane,
        project_role: "project_manager",
        start_date: "2024-01-01",
      },
      {
        project_id: P.ahd,
        user_id: U.george,
        project_role: "developer",
        start_date: "2024-09-01",
      },
      {
        project_id: P.ahd,
        user_id: U.diana,
        project_role: "designer",
        start_date: "2024-02-01",
      },
    ])
    .onConflictDoNothing();

  // ── User relationships ────────────────────────────────────────────────────────
  // Line management chain and mentoring relationships.

  await db
    .insert(userRelationshipsTable)
    .values([
      // Line management: Jane manages Alice and Ethan
      {
        actor_id: U.jane,
        target_id: U.alice,
        relationship_type: "line_manager",
        start_date: "2021-01-01",
      },
      {
        actor_id: U.jane,
        target_id: U.ethan,
        relationship_type: "line_manager",
        start_date: "2019-04-01",
      },
      {
        actor_id: U.jane,
        target_id: U.diana,
        relationship_type: "line_manager",
        start_date: "2020-06-01",
      },
      // Alice line-manages Bob and Charlie
      {
        actor_id: U.alice,
        target_id: U.bob,
        relationship_type: "line_manager",
        start_date: "2022-03-01",
      },
      {
        actor_id: U.alice,
        target_id: U.charlie,
        relationship_type: "line_manager",
        start_date: "2023-09-01",
      },
      // Mentoring
      {
        actor_id: U.alice,
        target_id: U.bob,
        relationship_type: "mentor",
        start_date: "2022-03-01",
      },
      {
        actor_id: U.hannah,
        target_id: U.george,
        relationship_type: "mentor",
        start_date: "2024-10-01",
      },
      // Peers
      {
        actor_id: U.alice,
        target_id: U.hannah,
        relationship_type: "peer",
        start_date: "2023-01-01",
      },
    ])
    .onConflictDoNothing();

  // ── Competencies ──────────────────────────────────────────────────────────────
  // A spread of technologies, practices, and methodologies across the team.
  // Dispositions show who wants more of what — useful for resourcing views.

  await db
    .insert(competenciesTable)
    .values([
      // Alice — Senior Developer
      {
        user_id: U.alice,
        organization_id: orgId,
        name: "TypeScript",
        competency_type: "technology",
        proficiency: "leading",
        disposition: "seeking",
        last_used_at: "2025-03-01",
      },
      {
        user_id: U.alice,
        organization_id: orgId,
        name: "Node.js",
        competency_type: "technology",
        proficiency: "confident",
        disposition: "open",
        last_used_at: "2025-03-01",
      },
      {
        user_id: U.alice,
        organization_id: orgId,
        name: "React",
        competency_type: "technology",
        proficiency: "confident",
        disposition: "winding_down",
        last_used_at: "2024-12-01",
      },
      {
        user_id: U.alice,
        organization_id: orgId,
        name: "Code Review",
        competency_type: "practice",
        proficiency: "leading",
        disposition: "open",
        last_used_at: "2025-03-01",
      },
      {
        user_id: U.alice,
        organization_id: orgId,
        name: "System Design",
        competency_type: "practice",
        proficiency: "confident",
        disposition: "seeking",
        last_used_at: "2025-02-01",
      },
      {
        user_id: U.alice,
        organization_id: orgId,
        name: "Agile",
        competency_type: "methodology",
        proficiency: "confident",
        disposition: "neutral",
        last_used_at: "2025-03-01",
      },
      // Bob — Mid Developer
      {
        user_id: U.bob,
        organization_id: orgId,
        name: "TypeScript",
        competency_type: "technology",
        proficiency: "practising",
        disposition: "seeking",
        last_used_at: "2025-03-01",
      },
      {
        user_id: U.bob,
        organization_id: orgId,
        name: "React",
        competency_type: "technology",
        proficiency: "practising",
        disposition: "open",
        last_used_at: "2025-03-01",
      },
      {
        user_id: U.bob,
        organization_id: orgId,
        name: "PostgreSQL",
        competency_type: "technology",
        proficiency: "aware",
        disposition: "seeking",
        last_used_at: "2024-11-01",
      },
      {
        user_id: U.bob,
        organization_id: orgId,
        name: "Unit Testing",
        competency_type: "practice",
        proficiency: "practising",
        disposition: "open",
        last_used_at: "2025-02-01",
      },
      // Charlie — Junior Developer
      {
        user_id: U.charlie,
        organization_id: orgId,
        name: "JavaScript",
        competency_type: "technology",
        proficiency: "practising",
        disposition: "seeking",
        last_used_at: "2025-03-01",
      },
      {
        user_id: U.charlie,
        organization_id: orgId,
        name: "Git",
        competency_type: "practice",
        proficiency: "practising",
        disposition: "neutral",
        last_used_at: "2025-03-01",
      },
      {
        user_id: U.charlie,
        organization_id: orgId,
        name: "Agile",
        competency_type: "methodology",
        proficiency: "aware",
        disposition: "open",
        last_used_at: "2025-03-01",
      },
      // Diana — Senior UX Designer
      {
        user_id: U.diana,
        organization_id: orgId,
        name: "Figma",
        competency_type: "technology",
        proficiency: "leading",
        disposition: "open",
        last_used_at: "2025-03-01",
      },
      {
        user_id: U.diana,
        organization_id: orgId,
        name: "User Research",
        competency_type: "practice",
        proficiency: "leading",
        disposition: "seeking",
        last_used_at: "2025-02-01",
      },
      {
        user_id: U.diana,
        organization_id: orgId,
        name: "Accessibility",
        competency_type: "practice",
        proficiency: "confident",
        disposition: "seeking",
        last_used_at: "2025-03-01",
      },
      {
        user_id: U.diana,
        organization_id: orgId,
        name: "Design Sprints",
        competency_type: "methodology",
        proficiency: "confident",
        disposition: "neutral",
        last_used_at: "2024-12-01",
      },
      // Ethan — Lead Delivery Manager
      {
        user_id: U.ethan,
        organization_id: orgId,
        name: "Risk Management",
        competency_type: "practice",
        proficiency: "leading",
        disposition: "open",
        last_used_at: "2025-03-01",
      },
      {
        user_id: U.ethan,
        organization_id: orgId,
        name: "Agile",
        competency_type: "methodology",
        proficiency: "leading",
        disposition: "open",
        last_used_at: "2025-03-01",
      },
      {
        user_id: U.ethan,
        organization_id: orgId,
        name: "JIRA",
        competency_type: "technology",
        proficiency: "confident",
        disposition: "neutral",
        last_used_at: "2025-03-01",
      },
      // Fiona — Data Scientist
      {
        user_id: U.fiona,
        organization_id: orgId,
        name: "Python",
        competency_type: "technology",
        proficiency: "confident",
        disposition: "seeking",
        last_used_at: "2025-03-01",
      },
      {
        user_id: U.fiona,
        organization_id: orgId,
        name: "Machine Learning",
        competency_type: "practice",
        proficiency: "practising",
        disposition: "seeking",
        last_used_at: "2025-02-01",
      },
      {
        user_id: U.fiona,
        organization_id: orgId,
        name: "SQL",
        competency_type: "technology",
        proficiency: "confident",
        disposition: "open",
        last_used_at: "2025-03-01",
      },
      // George — Associate Developer
      {
        user_id: U.george,
        organization_id: orgId,
        name: "JavaScript",
        competency_type: "technology",
        proficiency: "aware",
        disposition: "seeking",
        last_used_at: "2025-02-01",
      },
      {
        user_id: U.george,
        organization_id: orgId,
        name: "HTML/CSS",
        competency_type: "technology",
        proficiency: "practising",
        disposition: "neutral",
        last_used_at: "2025-03-01",
      },
      // Hannah — Senior Test Engineer
      {
        user_id: U.hannah,
        organization_id: orgId,
        name: "Playwright",
        competency_type: "technology",
        proficiency: "leading",
        disposition: "open",
        last_used_at: "2025-03-01",
      },
      {
        user_id: U.hannah,
        organization_id: orgId,
        name: "Test Automation",
        competency_type: "practice",
        proficiency: "leading",
        disposition: "seeking",
        last_used_at: "2025-03-01",
      },
      {
        user_id: U.hannah,
        organization_id: orgId,
        name: "BDD",
        competency_type: "methodology",
        proficiency: "confident",
        disposition: "open",
        last_used_at: "2025-02-01",
      },
      // Ian — Business Analyst
      {
        user_id: U.ian,
        organization_id: orgId,
        name: "Requirements Elicitation",
        competency_type: "practice",
        proficiency: "confident",
        disposition: "open",
        last_used_at: "2025-03-01",
      },
      {
        user_id: U.ian,
        organization_id: orgId,
        name: "Process Mapping",
        competency_type: "practice",
        proficiency: "confident",
        disposition: "neutral",
        last_used_at: "2025-01-01",
      },
      {
        user_id: U.ian,
        organization_id: orgId,
        name: "Agile",
        competency_type: "methodology",
        proficiency: "practising",
        disposition: "seeking",
        last_used_at: "2025-03-01",
      },
      // Jane — Principal Product Manager
      {
        user_id: U.jane,
        organization_id: orgId,
        name: "Product Strategy",
        competency_type: "practice",
        proficiency: "leading",
        disposition: "open",
        last_used_at: "2025-03-01",
      },
      {
        user_id: U.jane,
        organization_id: orgId,
        name: "Stakeholder Management",
        competency_type: "practice",
        proficiency: "leading",
        disposition: "neutral",
        last_used_at: "2025-03-01",
      },
      {
        user_id: U.jane,
        organization_id: orgId,
        name: "OKRs",
        competency_type: "methodology",
        proficiency: "confident",
        disposition: "open",
        last_used_at: "2025-02-01",
      },
    ])
    .onConflictDoNothing();

  // ── Credentials ───────────────────────────────────────────────────────────────

  await db
    .insert(credentialsTable)
    .values([
      {
        user_id: U.alice,
        name: "AWS Certified Solutions Architect – Associate",
        issuer: "Amazon Web Services",
        issued_at: "2023-05-01",
        expires_at: "2026-05-01",
      },
      {
        user_id: U.hannah,
        name: "ISTQB Advanced Level – Test Analyst",
        issuer: "ISTQB",
        issued_at: "2022-09-01",
        expires_at: null,
      },
      {
        user_id: U.ethan,
        name: "Certified Scrum Master (CSM)",
        issuer: "Scrum Alliance",
        issued_at: "2020-03-01",
        expires_at: "2026-03-01",
      },
      {
        user_id: U.fiona,
        name: "Google Professional Machine Learning Engineer",
        issuer: "Google Cloud",
        issued_at: "2023-11-01",
        expires_at: "2025-11-01",
      },
      {
        user_id: U.charlie,
        name: "AWS Cloud Practitioner",
        issuer: "Amazon Web Services",
        issued_at: "2024-01-01",
        expires_at: "2027-01-01",
      },
    ])
    .onConflictDoNothing();

  // ── Evidence ──────────────────────────────────────────────────────────────────
  // STAR-format evidence entries at various stages of the submission lifecycle.

  const evidenceInserts = await db
    .insert(evidenceTable)
    .values([
      // Alice — verified evidence ready to be endorsed
      {
        user_id: U.alice,
        project_id: P.apt,
        version: 1,
        status: "verified",
        situation:
          "The APT project had inherited a 4-year-old Express API written in plain JavaScript. Runtime type errors were causing roughly one production incident per sprint.",
        task: "Lead a migration of the core API service to TypeScript without blocking feature delivery.",
        action:
          "Introduced a gradual migration strategy: added TypeScript incrementally alongside existing JS, set up strict ESLint rules, established a shared tsconfig, and ran weekly pair-coding sessions to upskill the team. Created a migration tracker to maintain visibility.",
        result:
          "Completed the migration in three months with zero downtime. Production type-related incidents dropped to zero over the following two quarters. Team reported higher confidence in making changes to the codebase.",
      },
      // Alice — submitted evidence awaiting verification
      {
        user_id: U.alice,
        project_id: P.apt,
        version: 1,
        status: "submitted",
        situation:
          "The APT team had no structured observability. When incidents occurred, engineers were manually scanning logs with no trace correlation, leading to slow MTTR.",
        task: "Design and implement an observability strategy covering structured logging, distributed tracing, and alerting.",
        action:
          "Integrated OpenTelemetry with trace–log correlation, introduced Pino for structured JSON logging, and set up Grafana dashboards for key service metrics. Wrote runbooks for the three most common incident patterns.",
        result:
          "Mean time to resolve incidents dropped by 60% within six weeks of rollout. On-call handovers became significantly shorter due to improved context in alerts.",
      },
      // Bob — draft evidence not yet submitted
      {
        user_id: U.bob,
        project_id: P.apt,
        version: 1,
        status: "draft",
        situation:
          "The transport search page was loading the full result set (up to 2,000 records) into the browser, causing slow initial renders and high memory usage on lower-powered devices.",
        task: "Implement cursor-based pagination for the search results API and update the frontend component.",
        action:
          "Added cursor-based pagination to the API route, updated the React component to use an intersection observer for infinite scroll, and added loading/error states. Wrote unit tests for the pagination logic.",
        result:
          "Initial page load time reduced from 4.2s to 0.8s. Memory usage on a simulated low-end device dropped by 70%. Still drafting — plan to submit once I've added integration tests.",
      },
      // Hannah — verified evidence
      {
        user_id: U.hannah,
        project_id: P.apt,
        version: 1,
        status: "verified",
        situation:
          "APT had no automated end-to-end test coverage. Regression testing before each release was manual and taking two full days of team effort.",
        task: "Establish an automated E2E test suite using a modern framework that the whole team could contribute to.",
        action:
          "Evaluated Playwright vs Cypress and selected Playwright for its multi-browser support and CI integration. Wrote an initial suite of 40 critical-path tests, set up a GitHub Actions workflow to run them on every PR, and ran a team workshop on the BDD approach.",
        result:
          "Manual regression effort reduced from two days to two hours. The suite caught three regressions before they reached staging in the first month. PR cycle time improved noticeably.",
      },
      // Ian — submitted evidence from the classified project
      {
        user_id: U.ian,
        project_id: P.dil,
        version: 1,
        status: "submitted",
        situation:
          "The DIL project began without a clear set of user requirements. Stakeholders had conflicting views on scope, and the team had already spent two sprints building features that were later deprioritised.",
        task: "Facilitate a structured discovery phase to establish agreed requirements before the next sprint planning.",
        action:
          "Ran a two-day requirements workshop with nine stakeholders using event storming and MoSCoW prioritisation. Produced a prioritised backlog of 47 user stories with clear acceptance criteria, signed off by the product owner.",
        result:
          "All sprint-planning sessions in the following three sprints completed on time with no scope disputes. Stakeholder satisfaction scores in the next retrospective improved from 3.2 to 4.6 out of 5.",
      },
    ])
    .onConflictDoNothing()
    .returning({ id: evidenceTable.id, user_id: evidenceTable.user_id });

  // Build an index into the returned evidence rows
  const evidenceByUserAndIndex: Record<string, string[]> = {};
  for (const row of evidenceInserts) {
    if (!evidenceByUserAndIndex[row.user_id]) {
      evidenceByUserAndIndex[row.user_id] = [];
    }
    evidenceByUserAndIndex[row.user_id].push(row.id);
  }

  const aliceEvidence = evidenceByUserAndIndex[U.alice] ?? [];
  const bobEvidence = evidenceByUserAndIndex[U.bob] ?? [];
  const hannahEvidence = evidenceByUserAndIndex[U.hannah] ?? [];
  const ianEvidence = evidenceByUserAndIndex[U.ian] ?? [];

  // ── Evidence competency links ─────────────────────────────────────────────────
  // Fetching competency IDs to link evidence to demonstrated competencies.

  const allCompetencies = await db
    .select({
      id: competenciesTable.id,
      user_id: competenciesTable.user_id,
      name: competenciesTable.name,
    })
    .from(competenciesTable)
    .where(eq(competenciesTable.organization_id, orgId));

  const compId = (userId: string, name: string): string | undefined =>
    allCompetencies.find((c) => c.user_id === userId && c.name === name)?.id;

  const evidenceCompetencyLinks = [
    // Alice evidence[0] — TypeScript migration
    aliceEvidence[0] &&
      compId(U.alice, "TypeScript") && {
        evidence_id: aliceEvidence[0],
        competency_id: compId(U.alice, "TypeScript")!,
        competency_type: "technology" as const,
      },
    aliceEvidence[0] &&
      compId(U.alice, "Code Review") && {
        evidence_id: aliceEvidence[0],
        competency_id: compId(U.alice, "Code Review")!,
        competency_type: "practice" as const,
      },
    // Alice evidence[1] — observability
    aliceEvidence[1] &&
      compId(U.alice, "Node.js") && {
        evidence_id: aliceEvidence[1],
        competency_id: compId(U.alice, "Node.js")!,
        competency_type: "technology" as const,
      },
    aliceEvidence[1] &&
      compId(U.alice, "System Design") && {
        evidence_id: aliceEvidence[1],
        competency_id: compId(U.alice, "System Design")!,
        competency_type: "practice" as const,
      },
    // Bob evidence[0] — pagination
    bobEvidence[0] &&
      compId(U.bob, "React") && {
        evidence_id: bobEvidence[0],
        competency_id: compId(U.bob, "React")!,
        competency_type: "technology" as const,
      },
    bobEvidence[0] &&
      compId(U.bob, "TypeScript") && {
        evidence_id: bobEvidence[0],
        competency_id: compId(U.bob, "TypeScript")!,
        competency_type: "technology" as const,
      },
    // Hannah evidence[0] — test automation
    hannahEvidence[0] &&
      compId(U.hannah, "Playwright") && {
        evidence_id: hannahEvidence[0],
        competency_id: compId(U.hannah, "Playwright")!,
        competency_type: "technology" as const,
      },
    hannahEvidence[0] &&
      compId(U.hannah, "Test Automation") && {
        evidence_id: hannahEvidence[0],
        competency_id: compId(U.hannah, "Test Automation")!,
        competency_type: "practice" as const,
      },
    // Ian evidence[0] — requirements workshop
    ianEvidence[0] &&
      compId(U.ian, "Requirements Elicitation") && {
        evidence_id: ianEvidence[0],
        competency_id: compId(U.ian, "Requirements Elicitation")!,
        competency_type: "practice" as const,
      },
  ].filter(Boolean) as {
    evidence_id: string;
    competency_id: string;
    competency_type: "technology" | "practice" | "methodology";
  }[];

  // ── Endorsements ──────────────────────────────────────────────────────────────
  // Demonstrates the full status range: pending, endorsed, skipped.

  type EndorsementRow = {
    evidence_id: string;
    endorser_id: string;
    is_suggested: boolean;
    status: "pending" | "endorsed" | "skipped" | "flagged";
    note?: string;
    responded_at?: Date;
  };

  const endorsementRows: EndorsementRow[] = [];

  if (aliceEvidence[0]) {
    // Alice evidence[0] (verified) — two endorsements, both endorsed
    endorsementRows.push(
      {
        evidence_id: aliceEvidence[0],
        endorser_id: U.ethan,
        is_suggested: true,
        status: "endorsed",
        note: "I witnessed the migration first-hand on APT. Alice's approach was methodical and she brought the whole team along. Clear example of technical leadership.",
        responded_at: new Date("2024-11-15"),
      },
      {
        evidence_id: aliceEvidence[0],
        endorser_id: U.hannah,
        is_suggested: true,
        status: "endorsed",
        note: "The TypeScript migration dramatically improved the quality of code review. Strongly endorsed.",
        responded_at: new Date("2024-11-18"),
      },
    );
  }
  if (aliceEvidence[1]) {
    // Alice evidence[1] (submitted) — one pending, one skipped
    endorsementRows.push(
      {
        evidence_id: aliceEvidence[1],
        endorser_id: U.jane,
        is_suggested: true,
        status: "pending",
      },
      {
        evidence_id: aliceEvidence[1],
        endorser_id: U.ethan,
        is_suggested: false,
        status: "skipped",
        note: "Not involved in observability implementation, Alice should seek endorsement from the team lead.",
        responded_at: new Date("2025-01-10"),
      },
    );
  }
  if (hannahEvidence[0]) {
    // Hannah evidence[0] (verified) — two endorsed
    endorsementRows.push(
      {
        evidence_id: hannahEvidence[0],
        endorser_id: U.alice,
        is_suggested: true,
        status: "endorsed",
        note: "The Playwright suite has already saved us multiple times in review. Well-structured and easy to extend.",
        responded_at: new Date("2024-10-05"),
      },
      {
        evidence_id: hannahEvidence[0],
        endorser_id: U.ethan,
        is_suggested: true,
        status: "endorsed",
        responded_at: new Date("2024-10-08"),
      },
    );
  }
  if (ianEvidence[0]) {
    // Ian evidence[0] (submitted) — pending
    endorsementRows.push({
      evidence_id: ianEvidence[0],
      endorser_id: U.ethan,
      is_suggested: true,
      status: "pending",
    });
  }

  if (endorsementRows.length > 0) {
    await db
      .insert(endorsementsTable)
      .values(endorsementRows)
      .onConflictDoNothing();
  }

  // ── Feedback ──────────────────────────────────────────────────────────────────
  // Mix of published and pending_review entries, with and without a project context.

  await db
    .insert(feedbackTable)
    .values([
      {
        author_id: U.ethan,
        subject_id: U.alice,
        project_id: P.apt,
        is_anonymous: false,
        visibility: "published",
        content:
          "Alice consistently raises the bar on technical quality across the APT team. Her TypeScript migration initiative was well-planned, inclusive, and delivered without disruption. She proactively unblocks colleagues and brings a calm, structured approach to complex problems. I would welcome her involvement on any future project.",
        organization_id: orgId,
      },
      {
        author_id: U.jane,
        subject_id: U.diana,
        project_id: P.cci,
        is_anonymous: false,
        visibility: "published",
        content:
          "Diana brings exceptional user empathy to everything she works on. Her accessibility audit on CCI surfaced issues the team hadn't considered, and she handled the stakeholder pushback with professionalism. One area to develop: sharing work-in-progress earlier to create more opportunities for team input.",
        organization_id: orgId,
      },
      {
        author_id: U.hannah,
        subject_id: U.bob,
        project_id: P.apt,
        is_anonymous: false,
        visibility: "pending_review",
        content:
          "Bob has grown significantly this quarter. His pagination work was solid and well-tested. He's started asking more architectural questions in review, which is exactly the growth I'd expect at his level. Keen to see him take on more end-to-end ownership of features.",
        organization_id: orgId,
      },
      {
        author_id: U.alice,
        subject_id: U.charlie,
        project_id: P.apt,
        is_anonymous: false,
        visibility: "pending_review",
        content:
          "Charlie has settled in well since joining. Shows strong enthusiasm and asks good questions. Focus area for next quarter: building confidence to push back on requirements and contribute ideas in planning sessions, not just in implementation.",
        organization_id: orgId,
      },
      // Anonymous feedback — author unknown to subject
      {
        author_id: U.bob,
        subject_id: U.alice,
        project_id: P.apt,
        is_anonymous: true,
        visibility: "approved",
        content:
          "Really appreciate the time spent on code reviews. The feedback is always detailed and constructive. Would be great to have slightly more time in 1:1s for longer-term career conversations.",
        organization_id: orgId,
      },
    ])
    .onConflictDoNothing();

  // ── Goals ─────────────────────────────────────────────────────────────────────

  const goalsResult = await db
    .insert(goalsTable)
    .values([
      {
        user_id: U.alice,
        title: "Reach principal-level technical leadership",
        description:
          "Build a track record of cross-team technical influence, architectural decisions, and people development to make a case for principal promotion by end of year.",
        target_date: "2026-12-31",
        status: "active",
        visibility: "shared_with_manager",
      },
      {
        user_id: U.bob,
        title: "Develop system design fundamentals",
        description:
          "Work through a structured study plan covering distributed systems, API design, and database indexing strategies. Apply learnings on APT where possible.",
        target_date: "2026-06-30",
        status: "active",
        visibility: "private",
      },
      {
        user_id: U.charlie,
        title: "Obtain AWS Certified Developer certification",
        description:
          "Study and pass the AWS Certified Developer – Associate exam.",
        target_date: "2026-09-30",
        status: "active",
        visibility: "private",
      },
      {
        user_id: U.ethan,
        title: "Complete PRINCE2 Practitioner certification",
        description:
          "Supplement agile delivery experience with formal PRINCE2 qualification to support hybrid delivery engagements.",
        target_date: "2025-03-01",
        status: "achieved",
        visibility: "shared_with_manager",
      },
      {
        user_id: U.fiona,
        title: "Lead a machine learning proof-of-concept delivery",
        description:
          "Identify an opportunity within AHD or an internal workstream to take full ownership of an ML PoC from framing to demo.",
        target_date: "2026-08-31",
        status: "active",
        visibility: "shared_with_manager",
      },
      {
        user_id: U.hannah,
        title: "Establish contract testing practice across APT services",
        description:
          "Introduce Pact for consumer-driven contract testing and get buy-in from the APT tech lead and delivery manager.",
        target_date: "2025-06-30",
        status: "active",
        visibility: "shared_with_manager",
      },
    ])
    .onConflictDoNothing()
    .returning({ id: goalsTable.id, user_id: goalsTable.user_id });

  // ── Goal evidence links ───────────────────────────────────────────────────────

  const goalByUser = new Map<string, string>();
  for (const goal of goalsResult) {
    if (!goalByUser.has(goal.user_id)) {
      goalByUser.set(goal.user_id, goal.id);
    }
  }

  const goalEvidenceLinks = [
    // Alice's goal backed by both her evidence entries
    aliceEvidence[0] &&
      goalByUser.get(U.alice) && {
        goal_id: goalByUser.get(U.alice)!,
        evidence_id: aliceEvidence[0],
      },
    aliceEvidence[1] &&
      goalByUser.get(U.alice) && {
        goal_id: goalByUser.get(U.alice)!,
        evidence_id: aliceEvidence[1],
      },
    // Bob's goal backed by his pagination evidence
    bobEvidence[0] &&
      goalByUser.get(U.bob) && {
        goal_id: goalByUser.get(U.bob)!,
        evidence_id: bobEvidence[0],
      },
    // Hannah's goal backed by her E2E automation evidence
    hannahEvidence[0] &&
      goalByUser.get(U.hannah) && {
        goal_id: goalByUser.get(U.hannah)!,
        evidence_id: hannahEvidence[0],
      },
  ].filter(Boolean) as { goal_id: string; evidence_id: string }[];

  if (goalEvidenceLinks.length > 0) {
    await db
      .insert(goalEvidenceTable)
      .values(goalEvidenceLinks)
      .onConflictDoNothing();
  }

  console.log("Fixtures seeded successfully.");
}

main().catch((err) => {
  console.error("Fixtures failed:", err);
  process.exit(1);
});
