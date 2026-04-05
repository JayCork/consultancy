import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import {
  clearanceLevelsTable,
  referenceFrameworksTable,
  referenceRolesTable,
  referenceSkillsTable,
} from "../schema";
import { ddatSkills, sfiaNineSkills } from "./fixtures/skills";

function nameToCode(name: string): string {
  return name.toLowerCase().replace(/[(),]/g, "").trim().replace(/\s+/g, "-");
}

const db = drizzle(process.env.DATABASE_URL!);

await db
  .insert(clearanceLevelsTable)
  .values([
    {
      name: "Baseline Personnel Security Standard",
      shortName: "BPSS",
      level: 0,
    },
    { name: "Accreditation Check", shortName: "AC", level: 10 },
    { name: "Counter Terrorist Check", shortName: "CTC", level: 12 },
    { name: "Security Check", shortName: "SC", level: 20 },
    { name: "Enhanced Security Check", shortName: "eSC", level: 22 },
    { name: "Developed Vetting", shortName: "DV", level: 30 },
    { name: "Enhanced Developed Vetting", shortName: "eDV", level: 32 },
  ])
  .onConflictDoNothing();

await db
  .insert(referenceFrameworksTable)
  .values([
    {
      name: "SFIA 9",
      version: "9.0.0",
      url: "https://sfia-online.org/en/sfia-9",
    },
    {
      name: "DDaT",
      version: null,
      url: "https://www.gov.uk/government/organisations/digital-data-and-technology-profession",
    },
  ])
  .onConflictDoNothing();

const [ddatFramework] = await db
  .select({ id: referenceFrameworksTable.id })
  .from(referenceFrameworksTable)
  .where(eq(referenceFrameworksTable.name, "DDaT"));

if (ddatFramework) {
  await db
    .insert(referenceRolesTable)
    .values([
      // Architecture roles
      { framework_id: ddatFramework.id, name: "Business architect" },
      { framework_id: ddatFramework.id, name: "Data architect" },
      { framework_id: ddatFramework.id, name: "Enterprise architect" },
      { framework_id: ddatFramework.id, name: "Network architect" },
      { framework_id: ddatFramework.id, name: "Security architect" },
      { framework_id: ddatFramework.id, name: "Solution architect" },
      { framework_id: ddatFramework.id, name: "Technical architect" },
      // Chief digital and data roles
      { framework_id: ddatFramework.id, name: "Chief data officer" },
      {
        framework_id: ddatFramework.id,
        name: "Chief digital and information officer",
      },
      {
        framework_id: ddatFramework.id,
        name: "Chief information security officer",
      },
      { framework_id: ddatFramework.id, name: "Chief technology officer" },
      // Data roles
      { framework_id: ddatFramework.id, name: "Analytics engineer" },
      { framework_id: ddatFramework.id, name: "Data analyst" },
      { framework_id: ddatFramework.id, name: "Data engineer" },
      { framework_id: ddatFramework.id, name: "Data ethicist" },
      { framework_id: ddatFramework.id, name: "Data governance manager" },
      { framework_id: ddatFramework.id, name: "Data scientist" },
      { framework_id: ddatFramework.id, name: "Digital evaluator" },
      { framework_id: ddatFramework.id, name: "Machine learning engineer" },
      { framework_id: ddatFramework.id, name: "Performance analyst" },
      // IT operations roles
      {
        framework_id: ddatFramework.id,
        name: "Application operations engineer",
      },
      { framework_id: ddatFramework.id, name: "Business relationship manager" },
      { framework_id: ddatFramework.id, name: "Change and release manager" },
      {
        framework_id: ddatFramework.id,
        name: "Command and control centre manager",
      },
      { framework_id: ddatFramework.id, name: "End user computing engineer" },
      { framework_id: ddatFramework.id, name: "Incident manager" },
      { framework_id: ddatFramework.id, name: "Infrastructure engineer" },
      {
        framework_id: ddatFramework.id,
        name: "Infrastructure operations engineer",
      },
      { framework_id: ddatFramework.id, name: "IT service manager" },
      { framework_id: ddatFramework.id, name: "Problem manager" },
      { framework_id: ddatFramework.id, name: "Service desk manager" },
      { framework_id: ddatFramework.id, name: "Service transition manager" },
      // Product and delivery roles
      { framework_id: ddatFramework.id, name: "Business analyst" },
      { framework_id: ddatFramework.id, name: "Delivery manager" },
      { framework_id: ddatFramework.id, name: "Digital portfolio manager" },
      { framework_id: ddatFramework.id, name: "Product manager" },
      { framework_id: ddatFramework.id, name: "Programme delivery manager" },
      { framework_id: ddatFramework.id, name: "Service owner" },
      // Quality assurance testing (QAT) roles
      {
        framework_id: ddatFramework.id,
        name: "Quality assurance test analyst",
      },
      { framework_id: ddatFramework.id, name: "Test engineer" },
      { framework_id: ddatFramework.id, name: "Test manager" },
      // Software development roles
      {
        framework_id: ddatFramework.id,
        name: "Development operations (DevOps) engineer",
      },
      { framework_id: ddatFramework.id, name: "Frontend developer" },
      { framework_id: ddatFramework.id, name: "Software developer" },
      // User-centred design roles
      { framework_id: ddatFramework.id, name: "Accessibility specialist" },
      { framework_id: ddatFramework.id, name: "Content designer" },
      { framework_id: ddatFramework.id, name: "Content strategist" },
      { framework_id: ddatFramework.id, name: "Graphic designer" },
      { framework_id: ddatFramework.id, name: "Interaction designer" },
      { framework_id: ddatFramework.id, name: "Service designer" },
      { framework_id: ddatFramework.id, name: "Technical writer" },
      { framework_id: ddatFramework.id, name: "User researcher" },
    ])
    .onConflictDoNothing();

  // Skills
  await db
    .insert(referenceSkillsTable)
    .values(
      ddatSkills.map((skill) => ({
        framework_id: ddatFramework.id,
        code: nameToCode(skill.name),
        name: skill.name,
        description: skill.description,
        min_level: 1, // DDaT skills all start at level 1
        max_level: skill.max_level ?? 4,
      })),
    )
    .onConflictDoNothing();
}

const [sfiaNineFramework] = await db
  .select({ id: referenceFrameworksTable.id })
  .from(referenceFrameworksTable)
  .where(eq(referenceFrameworksTable.name, "SFIA 9"));

if (sfiaNineFramework) {
  await db
    .insert(referenceSkillsTable)
    .values(
      sfiaNineSkills.map((skill) => ({
        framework_id: sfiaNineFramework.id,
        code: skill.code,
        name: skill.name,
        description: skill.description,
        min_level: skill.min_level ?? 2,
        max_level: skill.max_level ?? 6,
      })),
    )
    .onConflictDoNothing();
}
