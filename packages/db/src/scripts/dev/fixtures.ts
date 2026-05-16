import { drizzle } from "drizzle-orm/node-postgres";
import { and, eq, isNull } from "drizzle-orm";
import {
  user as authUserTable,
  clearanceLevelsTable,
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
        isNull(frameworkRoleFamiliesTable.organizationId),
      ),
    );
  if (!family) return null;

  const [role] = await db
    .select({ id: frameworkRolesTable.id })
    .from(frameworkRolesTable)
    .where(
      and(
        eq(frameworkRolesTable.familyId, family.id),
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
        betterAuthId: AUTH_IDS.alice,
        organizationId: orgId,
      },
      {
        name: "Bob Johnson",
        email: "bob.johnson@demo.com",
        status: "active",
        betterAuthId: AUTH_IDS.bob,
        organizationId: orgId,
      },
      {
        name: "Charlie Brown",
        email: "charlie.brown@demo.com",
        status: "active",
        betterAuthId: AUTH_IDS.charlie,
        organizationId: orgId,
      },
      // UX designer
      {
        name: "Diana Prince",
        email: "diana.prince@demo.com",
        status: "active",
        betterAuthId: AUTH_IDS.diana,
        organizationId: orgId,
      },
      // Delivery manager
      {
        name: "Ethan Hunt",
        email: "ethan.hunt@demo.com",
        status: "active",
        betterAuthId: AUTH_IDS.ethan,
        organizationId: orgId,
      },
      // Data scientist
      {
        name: "Fiona Gallagher",
        email: "fiona.gallagher@demo.com",
        status: "active",
        betterAuthId: AUTH_IDS.fiona,
        organizationId: orgId,
      },
      // Associate developer (newest joiner, still pending approval)
      {
        name: "George Michael",
        email: "george.michael@demo.com",
        status: "pending_approval",
        betterAuthId: AUTH_IDS.george,
        organizationId: orgId,
      },
      // Test engineer
      {
        name: "Hannah Baker",
        email: "hannah.baker@demo.com",
        status: "active",
        betterAuthId: AUTH_IDS.hannah,
        organizationId: orgId,
      },
      // Business analyst
      {
        name: "Ian Fleming",
        email: "ian.fleming@demo.com",
        status: "active",
        betterAuthId: AUTH_IDS.ian,
        organizationId: orgId,
      },
      // Principal product manager (most senior)
      {
        name: "Jane Doe",
        email: "jane.doe@demo.com",
        status: "active",
        betterAuthId: AUTH_IDS.jane,
        organizationId: orgId,
      },
    ])
    .onConflictDoNothing();

  const allUsers = await db
    .select({ id: usersTable.id, email: usersTable.email })
    .from(usersTable)
    .where(eq(usersTable.organizationId, orgId));

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
          userId: U.alice,
          clearanceLevelId: bpssId,
          grantedAt: new Date("2022-03-01"),
        },
        {
          userId: U.bob,
          clearanceLevelId: bpssId,
          grantedAt: new Date("2022-06-01"),
        },
        {
          userId: U.hannah,
          clearanceLevelId: bpssId,
          grantedAt: new Date("2021-09-01"),
        },
        {
          userId: U.jane,
          clearanceLevelId: bpssId,
          grantedAt: new Date("2020-01-01"),
        },
      ])
      .onConflictDoNothing();
  }

  if (scId) {
    await db
      .insert(userClearancesTable)
      .values([
        {
          userId: U.ethan,
          clearanceLevelId: scId,
          grantedAt: new Date("2021-04-15"),
        },
        {
          userId: U.ian,
          clearanceLevelId: scId,
          grantedAt: new Date("2022-11-01"),
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
          organizationId: orgId,
          frameworkRoleId,
        })
        .onConflictDoNothing();
    }
  }

  const allGrades = await db
    .select({ id: jobGradesTable.id, name: jobGradesTable.name })
    .from(jobGradesTable)
    .where(eq(jobGradesTable.organizationId, orgId));

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
          userId: assignment.userId,
          jobGradeId: gradeId,
          startDate: assignment.startDate,
          endDate: null,
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
        codeName: "APT-ALPHA",
        shortName: "APT",
        organizationId: orgId,
        leadId: U.alice,
        organizationUnitId: orgId, // placeholder — real fixtures would use a unit ID
        startDate: new Date("2023-01-01"),
        status: "in_delivery",
        fundingModel: "time_and_materials",
      },
      {
        name: "Defence Innovation Lab",
        codeName: "DIL-BETA",
        shortName: "DIL",
        organizationId: orgId,
        leadId: U.ethan,
        organizationUnitId: orgId,
        minimumClearanceId: scClearanceId,
        startDate: new Date("2022-06-01"),
        status: "in_delivery",
        fundingModel: "fixed_price",
      },
      {
        name: "Cybersecurity for Critical Infrastructure",
        codeName: "CCI-GAMM",
        shortName: "CCI",
        organizationId: orgId,
        leadId: U.diana,
        organizationUnitId: orgId,
        startDate: new Date("2023-06-01"),
        status: "in_delivery",
        fundingModel: "time_and_materials",
      },
      {
        name: "AI-Powered Healthcare Diagnostics",
        codeName: "AHD-DELT",
        shortName: "AHD",
        organizationId: orgId,
        leadId: U.jane,
        organizationUnitId: orgId,
        startDate: new Date("2024-01-01"),
        status: "discovery",
        fundingModel: "time_and_materials",
      },
    ])
    .onConflictDoNothing();

  const allProjects = await db
    .select({ id: projectsTable.id, name: projectsTable.name })
    .from(projectsTable)
    .where(eq(projectsTable.organizationId, orgId));

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
        projectId: P.apt,
        userId: U.alice,
        projectRole: "tech_lead",
        startDate: new Date("2023-01-01"),
      },
      {
        projectId: P.apt,
        userId: U.bob,
        projectRole: "developer",
        startDate: new Date("2023-02-01"),
      },
      {
        projectId: P.apt,
        userId: U.charlie,
        projectRole: "developer",
        startDate: new Date("2024-09-01"),
      },
      {
        projectId: P.apt,
        userId: U.fiona,
        projectRole: "analyst",
        startDate: new Date("2023-03-01"),
      },
      {
        projectId: P.apt,
        userId: U.hannah,
        projectRole: "developer",
        startDate: new Date("2023-01-01"),
      },
      // Defence Innovation Lab (SC clearance required — only Ethan, Ian, Jane)
      {
        projectId: P.dil,
        userId: U.ethan,
        projectRole: "delivery_manager",
        startDate: new Date("2022-06-01"),
      },
      {
        projectId: P.dil,
        userId: U.ian,
        projectRole: "analyst",
        startDate: new Date("2022-07-01"),
      },
      {
        projectId: P.dil,
        userId: U.jane,
        projectRole: "project_manager",
        startDate: new Date("2022-06-01"),
      },
      // Cybersecurity for Critical Infrastructure
      {
        projectId: P.cci,
        userId: U.diana,
        projectRole: "designer",
        startDate: new Date("2023-06-01"),
      },
      {
        projectId: P.cci,
        userId: U.bob,
        projectRole: "developer",
        startDate: new Date("2023-06-01"),
        endDate: new Date("2024-03-01"),
      },
      {
        projectId: P.cci,
        userId: U.fiona,
        projectRole: "analyst",
        startDate: new Date("2023-07-01"),
      },
      // AI-Powered Healthcare Diagnostics
      {
        projectId: P.ahd,
        userId: U.jane,
        projectRole: "project_manager",
        startDate: new Date("2024-01-01"),
      },
      {
        projectId: P.ahd,
        userId: U.george,
        projectRole: "developer",
        startDate: new Date("2024-09-01"),
      },
      {
        projectId: P.ahd,
        userId: U.diana,
        projectRole: "designer",
        startDate: new Date("2024-02-01"),
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
        actorId: U.jane,
        targetId: U.alice,
        relationshipType: "line_manager",
        startDate: "2021-01-01",
        organizationId: orgId,
      },
      {
        actorId: U.jane,
        targetId: U.ethan,
        relationshipType: "line_manager",
        startDate: "2019-04-01",
        organizationId: orgId,
      },
      {
        actorId: U.jane,
        targetId: U.diana,
        relationshipType: "line_manager",
        startDate: "2020-06-01",
        organizationId: orgId,
      },
      // Alice line-manages Bob and Charlie
      {
        actorId: U.alice,
        targetId: U.bob,
        relationshipType: "line_manager",
        startDate: "2022-03-01",
        organizationId: orgId,
      },
      {
        actorId: U.alice,
        targetId: U.charlie,
        relationshipType: "line_manager",
        startDate: "2023-09-01",
        organizationId: orgId,
      },
      // Mentoring
      {
        actorId: U.alice,
        targetId: U.bob,
        relationshipType: "mentor",
        startDate: "2022-03-01",
        organizationId: orgId,
      },
      {
        actorId: U.hannah,
        targetId: U.george,
        relationshipType: "mentor",
        startDate: "2024-10-01",
        organizationId: orgId,
      },
      // Peers
      {
        actorId: U.alice,
        targetId: U.hannah,
        relationshipType: "peer",
        startDate: "2023-01-01",
        organizationId: orgId,
      },
    ])
    .onConflictDoNothing();

  // ── Credentials ───────────────────────────────────────────────────────────────

  await db
    .insert(credentialsTable)
    .values([
      {
        userId: U.alice,
        name: "AWS Certified Solutions Architect – Associate",
        issuer: "Amazon Web Services",
        issuedAt: "2023-05-01",
        expiresAt: "2026-05-01",
      },
      {
        userId: U.hannah,
        name: "ISTQB Advanced Level – Test Analyst",
        issuer: "ISTQB",
        issuedAt: "2022-09-01",
        expiresAt: null,
      },
      {
        userId: U.ethan,
        name: "Certified Scrum Master (CSM)",
        issuer: "Scrum Alliance",
        issuedAt: "2020-03-01",
        expiresAt: "2026-03-01",
      },
      {
        userId: U.fiona,
        name: "Google Professional Machine Learning Engineer",
        issuer: "Google Cloud",
        issuedAt: "2023-11-01",
        expiresAt: "2025-11-01",
      },
      {
        userId: U.charlie,
        name: "AWS Cloud Practitioner",
        issuer: "Amazon Web Services",
        issuedAt: "2024-01-01",
        expiresAt: "2027-01-01",
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
        userId: U.alice,
        projectId: P.apt,
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
        userId: U.alice,
        projectId: P.apt,
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
        userId: U.bob,
        projectId: P.apt,
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
        userId: U.hannah,
        projectId: P.apt,
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
        userId: U.ian,
        projectId: P.dil,
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
    .returning({ id: evidenceTable.id, userId: evidenceTable.userId });

  // Build an index into the returned evidence rows
  const evidenceByUserAndIndex: Record<string, string[]> = {};
  for (const row of evidenceInserts) {
    if (!evidenceByUserAndIndex[row.userId]) {
      evidenceByUserAndIndex[row.userId] = [];
    }
    evidenceByUserAndIndex[row.userId].push(row.id);
  }

  const aliceEvidence = evidenceByUserAndIndex[U.alice] ?? [];
  const bobEvidence = evidenceByUserAndIndex[U.bob] ?? [];
  const hannahEvidence = evidenceByUserAndIndex[U.hannah] ?? [];
  const ianEvidence = evidenceByUserAndIndex[U.ian] ?? [];

  // ── Endorsements ──────────────────────────────────────────────────────────────
  // Demonstrates the full status range: pending, endorsed, skipped.

  type EndorsementRow = {
    evidenceId: string;
    endorserId: string;
    isSuggested: boolean;
    status: "pending" | "endorsed" | "skipped" | "flagged";
    note?: string;
    respondedAt?: Date;
  };

  const endorsementRows: EndorsementRow[] = [];

  if (aliceEvidence[0]) {
    // Alice evidence[0] (verified) — two endorsements, both endorsed
    endorsementRows.push(
      {
        evidenceId: aliceEvidence[0],
        endorserId: U.ethan,
        isSuggested: true,
        status: "endorsed",
        note: "I witnessed the migration first-hand on APT. Alice's approach was methodical and she brought the whole team along. Clear example of technical leadership.",
        respondedAt: new Date("2024-11-15"),
      },
      {
        evidenceId: aliceEvidence[0],
        endorserId: U.hannah,
        isSuggested: true,
        status: "endorsed",
        note: "The TypeScript migration dramatically improved the quality of code review. Strongly endorsed.",
        respondedAt: new Date("2024-11-18"),
      },
    );
  }
  if (aliceEvidence[1]) {
    // Alice evidence[1] (submitted) — one pending, one skipped
    endorsementRows.push(
      {
        evidenceId: aliceEvidence[1],
        endorserId: U.jane,
        isSuggested: true,
        status: "pending",
      },
      {
        evidenceId: aliceEvidence[1],
        endorserId: U.ethan,
        isSuggested: false,
        status: "skipped",
        note: "Not involved in observability implementation, Alice should seek endorsement from the team lead.",
        respondedAt: new Date("2025-01-10"),
      },
    );
  }
  if (hannahEvidence[0]) {
    // Hannah evidence[0] (verified) — two endorsed
    endorsementRows.push(
      {
        evidenceId: hannahEvidence[0],
        endorserId: U.alice,
        isSuggested: true,
        status: "endorsed",
        note: "The Playwright suite has already saved us multiple times in review. Well-structured and easy to extend.",
        respondedAt: new Date("2024-10-05"),
      },
      {
        evidenceId: hannahEvidence[0],
        endorserId: U.ethan,
        isSuggested: true,
        status: "endorsed",
        respondedAt: new Date("2024-10-08"),
      },
    );
  }
  if (ianEvidence[0]) {
    // Ian evidence[0] (submitted) — pending
    endorsementRows.push({
      evidenceId: ianEvidence[0],
      endorserId: U.ethan,
      isSuggested: true,
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
        authorId: U.ethan,
        subjectId: U.alice,
        projectId: P.apt,
        isAnonymous: false,
        visibility: "published",
        content:
          "Alice consistently raises the bar on technical quality across the APT team. Her TypeScript migration initiative was well-planned, inclusive, and delivered without disruption. She proactively unblocks colleagues and brings a calm, structured approach to complex problems. I would welcome her involvement on any future project.",
        organizationId: orgId,
      },
      {
        authorId: U.jane,
        subjectId: U.diana,
        projectId: P.cci,
        isAnonymous: false,
        visibility: "published",
        content:
          "Diana brings exceptional user empathy to everything she works on. Her accessibility audit on CCI surfaced issues the team hadn't considered, and she handled the stakeholder pushback with professionalism. One area to develop: sharing work-in-progress earlier to create more opportunities for team input.",
        organizationId: orgId,
      },
      {
        authorId: U.hannah,
        subjectId: U.bob,
        projectId: P.apt,
        isAnonymous: false,
        visibility: "pending_review",
        content:
          "Bob has grown significantly this quarter. His pagination work was solid and well-tested. He's started asking more architectural questions in review, which is exactly the growth I'd expect at his level. Keen to see him take on more end-to-end ownership of features.",
        organizationId: orgId,
      },
      {
        authorId: U.alice,
        subjectId: U.charlie,
        projectId: P.apt,
        isAnonymous: false,
        visibility: "pending_review",
        content:
          "Charlie has settled in well since joining. Shows strong enthusiasm and asks good questions. Focus area for next quarter: building confidence to push back on requirements and contribute ideas in planning sessions, not just in implementation.",
        organizationId: orgId,
      },
      // Anonymous feedback — author unknown to subject
      {
        authorId: U.bob,
        subjectId: U.alice,
        projectId: P.apt,
        isAnonymous: true,
        visibility: "approved",
        content:
          "Really appreciate the time spent on code reviews. The feedback is always detailed and constructive. Would be great to have slightly more time in 1:1s for longer-term career conversations.",
        organizationId: orgId,
      },
    ])
    .onConflictDoNothing();

  // ── Goals ─────────────────────────────────────────────────────────────────────

  const goalsResult = await db
    .insert(goalsTable)
    .values([
      {
        userId: U.alice,
        title: "Reach principal-level technical leadership",
        description:
          "Build a track record of cross-team technical influence, architectural decisions, and people development to make a case for principal promotion by end of year.",
        targetDate: "2026-12-31",
        status: "active",
        visibility: "shared_with_manager",
      },
      {
        userId: U.bob,
        title: "Develop system design fundamentals",
        description:
          "Work through a structured study plan covering distributed systems, API design, and database indexing strategies. Apply learnings on APT where possible.",
        targetDate: "2026-06-30",
        status: "active",
        visibility: "private",
      },
      {
        userId: U.charlie,
        title: "Obtain AWS Certified Developer certification",
        description:
          "Study and pass the AWS Certified Developer – Associate exam.",
        targetDate: "2026-09-30",
        status: "active",
        visibility: "private",
      },
      {
        userId: U.ethan,
        title: "Complete PRINCE2 Practitioner certification",
        description:
          "Supplement agile delivery experience with formal PRINCE2 qualification to support hybrid delivery engagements.",
        targetDate: "2025-03-01",
        status: "achieved",
        visibility: "shared_with_manager",
      },
      {
        userId: U.fiona,
        title: "Lead a machine learning proof-of-concept delivery",
        description:
          "Identify an opportunity within AHD or an internal workstream to take full ownership of an ML PoC from framing to demo.",
        targetDate: "2026-08-31",
        status: "active",
        visibility: "shared_with_manager",
      },
      {
        userId: U.hannah,
        title: "Establish contract testing practice across APT services",
        description:
          "Introduce Pact for consumer-driven contract testing and get buy-in from the APT tech lead and delivery manager.",
        targetDate: "2025-06-30",
        status: "active",
        visibility: "shared_with_manager",
      },
    ])
    .onConflictDoNothing()
    .returning({ id: goalsTable.id, userId: goalsTable.userId });

  // ── Goal evidence links ───────────────────────────────────────────────────────

  const goalByUser = new Map<string, string>();
  for (const goal of goalsResult) {
    if (!goalByUser.has(goal.userId)) {
      goalByUser.set(goal.userId, goal.id);
    }
  }

  const goalEvidenceLinks = [
    // Alice's goal backed by both her evidence entries
    aliceEvidence[0] &&
      goalByUser.get(U.alice) && {
        goalId: goalByUser.get(U.alice)!,
        evidenceId: aliceEvidence[0],
      },
    aliceEvidence[1] &&
      goalByUser.get(U.alice) && {
        goalId: goalByUser.get(U.alice)!,
        evidenceId: aliceEvidence[1],
      },
    // Bob's goal backed by his pagination evidence
    bobEvidence[0] &&
      goalByUser.get(U.bob) && {
        goalId: goalByUser.get(U.bob)!,
        evidenceId: bobEvidence[0],
      },
    // Hannah's goal backed by her E2E automation evidence
    hannahEvidence[0] &&
      goalByUser.get(U.hannah) && {
        goalId: goalByUser.get(U.hannah)!,
        evidenceId: hannahEvidence[0],
      },
  ].filter(Boolean) as { goalId: string; evidenceId: string }[];

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
