/**
 * Standalone endorsement batch seeder.
 *
 * Creates a small set of evidence entries in "submitted" status with pending endorsements
 * routed to two reviewers. Run this when you want fresh data to test the endorsement
 * UI or API without re-seeding the entire dev dataset.
 *
 * Usage:
 *   ORG_ID=<uuid> tsx src/scripts/dev/seed-endorsement-batch.ts
 *   ORG_ID=<uuid> SUBJECT_EMAIL=priya.sharma@dev-seed.com tsx src/scripts/dev/seed-endorsement-batch.ts
 *
 * Env vars:
 *   ORG_ID        (required) — org the evidence will be created in
 *   SUBJECT_EMAIL (optional) — which seed user's evidence to create (defaults to tom.bradley@dev-seed.com)
 *   ENDORSER_1_EMAIL (optional) — first endorser (defaults to james.okafor@dev-seed.com)
 *   ENDORSER_2_EMAIL (optional) — second endorser (defaults to rachel.torres@dev-seed.com)
 *
 * The evidence entries created are intentionally generic so they work regardless of
 * which seed users you point at. Each entry demonstrates a different skill area.
 *
 * Output: prints the created evidence IDs to stdout so you can navigate to them directly.
 */

import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import {
  endorsementsTable,
  evidenceSkillsTable,
  evidenceTable,
  organizationsTable,
  projectsTable,
  skillsTable,
  usersTable,
} from "../../schema";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

const db = drizzle(process.env.DATABASE_URL);

async function main() {
  const orgId = process.env.ORG_ID;
  if (!orgId) {
    console.error("ORG_ID environment variable is required");
    process.exit(1);
  }

  const subjectEmail = process.env.SUBJECT_EMAIL ?? "tom.bradley@dev-seed.com";
  const endorser1Email = process.env.ENDORSER_1_EMAIL ?? "james.okafor@dev-seed.com";
  const endorser2Email = process.env.ENDORSER_2_EMAIL ?? "rachel.torres@dev-seed.com";

  // ── Resolve users ───────────────────────────────────────────────────────────

  const resolveUser = async (email: string, role: string): Promise<string> => {
    const [row] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (!row) {
      console.error(`${role} not found: ${email}`);
      console.error("  Run the full dev seed first, or set a different email via env vars.");
      process.exit(1);
    }
    return row.id;
  };

  const subjectId = await resolveUser(subjectEmail, "Subject");
  const endorser1Id = await resolveUser(endorser1Email, "Endorser 1");
  const endorser2Id = await resolveUser(endorser2Email, "Endorser 2");

  // ── Resolve a project for context ───────────────────────────────────────────

  const [project] = await db
    .select({ id: projectsTable.id, name: projectsTable.name })
    .from(projectsTable)
    .where(eq(projectsTable.organization_id, orgId))
    .limit(1);

  const projectId = project?.id ?? null;

  // ── Resolve a skill for evidence-skill links ─────────────────────────────────

  const skillRows = await db
    .select({ id: skillsTable.id, name: skillsTable.name })
    .from(skillsTable)
    .where(eq(skillsTable.organization_id, orgId));

  const skillByName = new Map(skillRows.map((s) => [s.name, s.id]));
  const findSkill = (names: string[]): string | null => {
    for (const name of names) {
      const id = skillByName.get(name);
      if (id) return id;
    }
    return null;
  };

  // ── Evidence definitions ─────────────────────────────────────────────────────

  type EvidenceDef = {
    situation: string;
    task: string;
    action: string;
    result: string;
    skillNames: string[];
    level_claimed: "associate" | "junior" | "mid" | "senior" | "lead" | "principal";
  };

  const defs: EvidenceDef[] = [
    {
      situation: "Lorem ipsum dolor sit amet, the team had no agreed coding standards for the codebase, leading to inconsistent patterns and slow code review cycles.",
      task: "Establish and document a set of coding standards and automate their enforcement in the CI pipeline.",
      action: "Proposed a coding standards document in collaboration with the team, configured ESLint and Prettier rules to enforce the agreed standards, and integrated the linting step into the CI pipeline.",
      result: "Lorem ipsum — code review cycle time reduced. Linting issues in PRs dropped to near zero within two sprints of rollout.",
      skillNames: ["TypeScript", "Code Review"],
      level_claimed: "mid",
    },
    {
      situation: "Lorem ipsum dolor sit amet, the application had no structured error handling strategy, meaning unhandled exceptions were surfacing as opaque 500 responses to users.",
      task: "Design and implement a consistent error handling approach across the API layer.",
      action: "Defined an error taxonomy for the API, implemented a global error handler with structured error responses, added correlation IDs to all responses, and wrote integration tests covering the main error scenarios.",
      result: "Lorem ipsum — support tickets relating to opaque errors dropped significantly. Engineers could identify and resolve issues faster using the structured error context.",
      skillNames: ["API Design", "TypeScript", "Node.js"],
      level_claimed: "mid",
    },
    {
      situation: "Lorem ipsum dolor sit amet, a performance regression in the application's data fetching layer was causing slow page loads that had not been caught in testing.",
      task: "Identify the root cause of the performance regression and implement a fix without introducing further risk.",
      action: "Profiled the data fetching layer using browser DevTools and server-side tracing, identified an N+1 query introduced in a recent PR, refactored the query to use a batch fetch, and added a performance test to prevent regression.",
      result: "Lorem ipsum — page load time returned to baseline. The new performance test was added to the CI suite and caught a similar regression two weeks later.",
      skillNames: ["PostgreSQL", "System Design", "TypeScript"],
      level_claimed: "mid",
    },
    {
      situation: "Lorem ipsum dolor sit amet, a new feature required integrating with a third-party API that had inconsistent response formats and occasional rate-limiting behaviour.",
      task: "Implement a resilient integration layer for the third-party API that handled errors gracefully and stayed within rate limits.",
      action: "Built a typed client wrapper for the third-party API with retry logic using exponential backoff, implemented response normalisation to handle format inconsistencies, and added circuit-breaker behaviour to prevent cascading failures.",
      result: "Lorem ipsum — the integration handled the rate-limiting and format variations correctly in production. No user-visible errors attributed to the third-party API in the first month of operation.",
      skillNames: ["TypeScript", "Node.js", "API Design"],
      level_claimed: "mid",
    },
    {
      situation: "Lorem ipsum dolor sit amet, a component in the user interface was not meeting accessibility requirements, making it unusable for keyboard-only users and screen reader users.",
      task: "Remediate the accessibility issues in the component to bring it in line with WCAG 2.1 AA standards.",
      action: "Audited the component using axe-core and manual keyboard testing, fixed focus management and ARIA labelling issues, added visible focus indicators that met contrast requirements, and tested the fixed component with VoiceOver and NVDA.",
      result: "Lorem ipsum — component passed accessibility audit with zero violations. Keyboard navigation and screen reader experience validated by a user with lived experience of visual impairment.",
      skillNames: ["Accessibility", "React"],
      level_claimed: "mid",
    },
  ];

  // ── Insert evidence ─────────────────────────────────────────────────────────

  console.log(`\n🌱 Creating endorsement batch for ${subjectEmail}\n`);

  const insertedEvidence = await db
    .insert(evidenceTable)
    .values(
      defs.map((d) => ({
        user_id: subjectId,
        project_id: projectId,
        situation: d.situation,
        task: d.task,
        action: d.action,
        result: d.result,
        status: "submitted" as const,
        data_classification: "official" as const,
        version: 1,
      })),
    )
    .returning({ id: evidenceTable.id });

  console.log(`  ✓ ${insertedEvidence.length} evidence entries created`);

  // ── Insert evidence-skill links ─────────────────────────────────────────────

  const evidenceSkillLinks: Array<{
    evidence_id: string;
    skill_id: string;
    level_claimed: "associate" | "junior" | "mid" | "senior" | "lead" | "principal";
    is_primary: boolean;
  }> = [];

  for (let i = 0; i < insertedEvidence.length; i++) {
    const ev = insertedEvidence[i];
    const def = defs[i];
    const primarySkillId = findSkill(def.skillNames);
    if (primarySkillId && ev) {
      evidenceSkillLinks.push({
        evidence_id: ev.id,
        skill_id: primarySkillId,
        level_claimed: def.level_claimed,
        is_primary: true,
      });
      // Add a secondary skill link if a second skill is available
      const secondSkillId = findSkill(def.skillNames.slice(1));
      if (secondSkillId && secondSkillId !== primarySkillId) {
        evidenceSkillLinks.push({
          evidence_id: ev.id,
          skill_id: secondSkillId,
          level_claimed: def.level_claimed,
          is_primary: false,
        });
      }
    }
  }

  if (evidenceSkillLinks.length > 0) {
    await db.insert(evidenceSkillsTable).values(evidenceSkillLinks).onConflictDoNothing();
    console.log(`  ✓ ${evidenceSkillLinks.length} evidence-skill links`);
  } else {
    console.log("  ⚠ No skill matches found — run db:seed first to create org skills, or check SUBJECT_EMAIL");
  }

  // ── Insert endorsements ─────────────────────────────────────────────────────

  const endorsementRows = insertedEvidence.flatMap((ev) => [
    {
      evidence_id: ev.id,
      endorser_id: endorser1Id,
      is_suggested: true,
      status: "pending" as const,
    },
    {
      evidence_id: ev.id,
      endorser_id: endorser2Id,
      is_suggested: true,
      status: "pending" as const,
    },
  ]);

  await db.insert(endorsementsTable).values(endorsementRows).onConflictDoNothing();
  console.log(`  ✓ ${endorsementRows.length} pending endorsements created`);

  // ── Summary ─────────────────────────────────────────────────────────────────

  console.log("\n📋 Created evidence IDs:");
  for (const ev of insertedEvidence) {
    console.log(`   ${ev.id}`);
  }

  if (project) {
    console.log(`\n   Project context: ${project.name}`);
  }

  console.log(`\n   Subject:    ${subjectEmail}`);
  console.log(`   Endorser 1: ${endorser1Email}`);
  console.log(`   Endorser 2: ${endorser2Email}`);
  console.log("\n✅ Endorsement batch ready.\n");
}

main().catch((err) => {
  console.error("Endorsement batch seed failed:", err);
  process.exit(1);
});
