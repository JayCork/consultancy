import { eq, isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import {
  clearanceLevelsTable,
  frameworkLevelEnum,
  frameworkRoleFamiliesTable,
  frameworkRoleMappingsTable,
  frameworkRolesTable,
  referenceFrameworksTable,
  referenceRolesTable,
  referenceSkillsTable,
} from "../schema";
import { ddatSkills, sfiaNineSkills } from "./fixtures/skills";
import type { AnyPgTable } from "drizzle-orm/pg-core";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

const db = drizzle(process.env.DATABASE_URL);

function nameToCode(name: string): string {
  return name.toLowerCase().replace(/[(),]/g, "").trim().replace(/\s+/g, "-");
}

async function getItemIdByNameFromTable(
  table: AnyPgTable & { id: any; name: any },
  name: string,
): Promise<string | null> {
  const [result] = await db
    .select({ id: table.id })
    .from(table)
    .where(eq(table.name, name));
  return result ? result.id : null;
}

// To add a new platform-wide role family, add an entry here — all levels are seeded automatically.
// Set referenceDdatRole to the exact DDaT role name to create framework_role_mappings for all levels.
const roleFamilyDefinitions: Array<{
  name: string;
  description: string;
  referenceDdatRole?: string;
}> = [
  {
    name: "Cloud Engineer",
    description:
      "A Cloud Engineer is responsible for any technological duties associated with cloud computing, including design, planning, management, maintenance and support of cloud systems and services.",
    referenceDdatRole: "Infrastructure engineer",
  },
  { name: "Talent Acquisition Specialist", description: "" },
  {
    name: "Software Developer",
    description:
      "A software developer designs, runs and improves software that meets user needs.",
    referenceDdatRole: "Software developer",
  },
  {
    name: "IT Support",
    description: "",
    referenceDdatRole: "End user computing engineer",
  },
  {
    name: "PMO",
    description: "",
    referenceDdatRole: "Programme delivery manager",
  },
  {
    name: "Test Engineer",
    description:
      "A test engineer designs, builds, automates and executes comprehensive, robust and maintainable test suites. They apply test engineering standards, perform exploratory testing and use diverse techniques to identify risks and improve testing efficiency and quality.",
    referenceDdatRole: "Test engineer",
  },
  {
    name: "Data Scientist",
    description:
      "Data science is a broad and fast-moving field spanning maths, statistics, software engineering and communications. Data scientists will often work as part of a multidisciplinary team, using data and analytics to inform and achieve organisational goals.",
    referenceDdatRole: "Data scientist",
  },
  {
    name: "Agile Delivery Manager",
    description: "",
    referenceDdatRole: "Delivery manager",
  },
  {
    name: "Solution Architect",
    description:
      "A solution architect designs solutions for problems that affect the organisation.",
    referenceDdatRole: "Solution architect",
  },
  {
    name: "Service Designer",
    description:
      "Service designers design the end-to-end journey of a service. This helps a user complete their goal and government deliver a policy intent. In this role, your work may involve the creation of, or change to, transactions, products and content across both digital and offline channels provided by different parts of government.",
    referenceDdatRole: "Service designer",
  },
  {
    name: "Digital Service Manager",
    description: "",
    referenceDdatRole: "Service owner",
  },
  {
    name: "Content Designer",
    description: "",
    referenceDdatRole: "Content designer",
  },
  {
    name: "Business Analyst",
    description: "",
    referenceDdatRole: "Business analyst",
  },
  {
    name: "UX Designer",
    description: "",
    referenceDdatRole: "Interaction designer",
  },
  {
    name: "Product Manager",
    description: "",
    referenceDdatRole: "Product manager",
  },
];

const levelPrefixes: Record<
  (typeof frameworkLevelEnum.enumValues)[number],
  string
> = {
  associate: "Associate",
  junior: "Junior",
  mid: "Mid-Level",
  senior: "Senior",
  lead: "Lead",
  principal: "Principal",
};

async function main() {
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

  const ddatFramework = await getItemIdByNameFromTable(
    referenceFrameworksTable,
    "DDaT",
  );

  if (ddatFramework) {
    await db
      .insert(referenceRolesTable)
      .values([
        // Architecture roles
        { framework_id: ddatFramework, name: "Business architect" },
        { framework_id: ddatFramework, name: "Data architect" },
        { framework_id: ddatFramework, name: "Enterprise architect" },
        { framework_id: ddatFramework, name: "Network architect" },
        { framework_id: ddatFramework, name: "Security architect" },
        { framework_id: ddatFramework, name: "Solution architect" },
        { framework_id: ddatFramework, name: "Technical architect" },
        // Chief digital and data roles
        { framework_id: ddatFramework, name: "Chief data officer" },
        {
          framework_id: ddatFramework,
          name: "Chief digital and information officer",
        },
        {
          framework_id: ddatFramework,
          name: "Chief information security officer",
        },
        { framework_id: ddatFramework, name: "Chief technology officer" },
        // Data roles
        { framework_id: ddatFramework, name: "Analytics engineer" },
        { framework_id: ddatFramework, name: "Data analyst" },
        { framework_id: ddatFramework, name: "Data engineer" },
        { framework_id: ddatFramework, name: "Data ethicist" },
        { framework_id: ddatFramework, name: "Data governance manager" },
        { framework_id: ddatFramework, name: "Data scientist" },
        { framework_id: ddatFramework, name: "Digital evaluator" },
        { framework_id: ddatFramework, name: "Machine learning engineer" },
        { framework_id: ddatFramework, name: "Performance analyst" },
        // IT operations roles
        {
          framework_id: ddatFramework,
          name: "Application operations engineer",
        },
        { framework_id: ddatFramework, name: "Business relationship manager" },
        { framework_id: ddatFramework, name: "Change and release manager" },
        {
          framework_id: ddatFramework,
          name: "Command and control centre manager",
        },
        { framework_id: ddatFramework, name: "End user computing engineer" },
        { framework_id: ddatFramework, name: "Incident manager" },
        { framework_id: ddatFramework, name: "Infrastructure engineer" },
        {
          framework_id: ddatFramework,
          name: "Infrastructure operations engineer",
        },
        { framework_id: ddatFramework, name: "IT service manager" },
        { framework_id: ddatFramework, name: "Problem manager" },
        { framework_id: ddatFramework, name: "Service desk manager" },
        { framework_id: ddatFramework, name: "Service transition manager" },
        // Product and delivery roles
        { framework_id: ddatFramework, name: "Business analyst" },
        { framework_id: ddatFramework, name: "Delivery manager" },
        { framework_id: ddatFramework, name: "Digital portfolio manager" },
        { framework_id: ddatFramework, name: "Product manager" },
        { framework_id: ddatFramework, name: "Programme delivery manager" },
        { framework_id: ddatFramework, name: "Service owner" },
        // Quality assurance testing (QAT) roles
        {
          framework_id: ddatFramework,
          name: "Quality assurance test analyst",
        },
        { framework_id: ddatFramework, name: "Test engineer" },
        { framework_id: ddatFramework, name: "Test manager" },
        // Software development roles
        {
          framework_id: ddatFramework,
          name: "Development operations (DevOps) engineer",
        },
        { framework_id: ddatFramework, name: "Frontend developer" },
        { framework_id: ddatFramework, name: "Software developer" },
        // User-centred design roles
        { framework_id: ddatFramework, name: "Accessibility specialist" },
        { framework_id: ddatFramework, name: "Content designer" },
        { framework_id: ddatFramework, name: "Content strategist" },
        { framework_id: ddatFramework, name: "Graphic designer" },
        { framework_id: ddatFramework, name: "Interaction designer" },
        { framework_id: ddatFramework, name: "Service designer" },
        { framework_id: ddatFramework, name: "Technical writer" },
        { framework_id: ddatFramework, name: "User researcher" },
      ])
      .onConflictDoNothing();

    // Skills
    await db
      .insert(referenceSkillsTable)
      .values(
        ddatSkills.map((skill) => ({
          framework_id: ddatFramework,
          code: nameToCode(skill.name),
          name: skill.name,
          description: skill.description,
          min_level: 1, // DDaT skills all start at level 1
          max_level: skill.max_level ?? 4,
        })),
      )
      .onConflictDoNothing();
  }

  const sfiaNineFramework = await getItemIdByNameFromTable(
    referenceFrameworksTable,
    "SFIA 9",
  );

  if (sfiaNineFramework) {
    await db
      .insert(referenceSkillsTable)
      .values(
        sfiaNineSkills.map((skill) => ({
          framework_id: sfiaNineFramework,
          code: skill.code,
          name: skill.name,
          description: skill.description,
          min_level: skill.min_level ?? 2,
          max_level: skill.max_level ?? 6,
        })),
      )
      .onConflictDoNothing();
  }

  await db
    .insert(frameworkRoleFamiliesTable)
    .values(
      roleFamilyDefinitions.map((f) => ({ ...f, organization_id: null })),
    )
    .onConflictDoNothing();

  const seededFamilies = await db
    .select({
      id: frameworkRoleFamiliesTable.id,
      name: frameworkRoleFamiliesTable.name,
    })
    .from(frameworkRoleFamiliesTable)
    .where(isNull(frameworkRoleFamiliesTable.organization_id));

  await db
    .insert(frameworkRolesTable)
    .values(
      seededFamilies.flatMap((family) =>
        frameworkLevelEnum.enumValues.map((level) => ({
          organization_id: null,
          family_id: family.id,
          level,
          display_name: `${levelPrefixes[level]} ${family.name}`,
        })),
      ),
    )
    .onConflictDoNothing();

  if (ddatFramework) {
    const ddatReferenceRoles = await db
      .select({ id: referenceRolesTable.id, name: referenceRolesTable.name })
      .from(referenceRolesTable)
      .where(eq(referenceRolesTable.framework_id, ddatFramework));

    const referenceRoleByName = new Map(
      ddatReferenceRoles.map((r) => [r.name, r.id]),
    );

    const familyIdToReferenceRoleName = new Map(
      seededFamilies.flatMap((f) => {
        const def = roleFamilyDefinitions.find((d) => d.name === f.name);
        return def?.referenceDdatRole ? [[f.id, def.referenceDdatRole]] : [];
      }),
    );

    const seededRoles = await db
      .select({
        id: frameworkRolesTable.id,
        family_id: frameworkRolesTable.family_id,
      })
      .from(frameworkRolesTable)
      .where(isNull(frameworkRolesTable.organization_id));

    const mappingRows = seededRoles.flatMap((role) => {
      const refRoleName = familyIdToReferenceRoleName.get(role.family_id);
      const refRoleId = refRoleName
        ? referenceRoleByName.get(refRoleName)
        : undefined;
      return refRoleId
        ? [{ framework_role_id: role.id, reference_role_id: refRoleId }]
        : [];
    });

    if (mappingRows.length > 0) {
      await db
        .insert(frameworkRoleMappingsTable)
        .values(mappingRows)
        .onConflictDoNothing();
    }
  }
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
