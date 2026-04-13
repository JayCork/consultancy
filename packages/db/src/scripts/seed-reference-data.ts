/**
 * Contractor Hub — database seed script
 *
 * Seeds all platform-level reference and default data.
 * Does NOT insert any organisation, user, or transactional data.
 *
 * Safe to re-run: uses onConflictDoNothing() throughout.
 *
 * Run via:
 *   pnpm --filter @consultancy/db db:seed
 */
import { drizzle } from "drizzle-orm/node-postgres";
import {
  clearanceLevelsTable,
  frameworkRoleFamiliesTable,
  frameworkRoleMappingsTable,
  frameworkRoleSkillExpectationsTable,
  frameworkRolesTable,
  referenceFrameworksTable,
  referenceRolesTable,
  referenceSkillsTable,
  skillFrameworkMappingsTable,
  skillsLevelsTable,
  skillsTable,
  tagsTable,
} from "../schema";
import {
  ddatSkills,
  sfiaNineSkills,
  roleFamilyDefinitions,
} from "./fixtures/skills";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

const db = drizzle(process.env.DATABASE_URL);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toDdatCode(name: string): string {
  return name
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[,]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// ---------------------------------------------------------------------------
// 1. Clearance levels
// ---------------------------------------------------------------------------

async function seedClearanceLevels() {
  console.log("  Seeding clearance levels...");

  const levels = [
    // UK — https://www.gov.uk/guidance/security-vetting-and-clearance
    {
      region: "GBR" as const,
      name: "Baseline Personnel Security Standard",
      shortName: "BPSS",
      rank: 1,
      description:
        "The minimum standard for civil servants, government contractors and temporary staff. Confirms identity, employment history and right to work.",
    },
    {
      region: "GBR" as const,
      name: "Counter Terrorist Check",
      shortName: "CTC",
      rank: 2,
      description:
        "Required for roles with access to public figures or vulnerable infrastructure. Checks criminal record, security services records and financial history.",
    },
    {
      region: "GBR" as const,
      name: "Security Check",
      shortName: "SC",
      rank: 3,
      description:
        "Standard clearance for access to SECRET material and assets. Includes financial checks, security service records and references.",
    },
    {
      region: "GBR" as const,
      name: "Developed Vetting",
      shortName: "DV",
      rank: 4,
      description:
        "Highest routine clearance level. Required for regular, unsupervised access to TOP SECRET material. Includes in-depth personal interview.",
    },
    // USA — https://www.dni.gov/index.php/ncsc-how-we-work/ncsc-security-clearances
    {
      region: "USA" as const,
      name: "Confidential",
      shortName: "CONF",
      rank: 1,
      description:
        "Access to information that could damage national security if disclosed. Renewed every 15 years.",
    },
    {
      region: "USA" as const,
      name: "Secret",
      shortName: "S",
      rank: 2,
      description:
        "Access to information that could cause serious damage to national security if disclosed. Renewed every 10 years.",
    },
    {
      region: "USA" as const,
      name: "Top Secret",
      shortName: "TS",
      rank: 3,
      description:
        "Access to information that could cause exceptionally grave damage to national security if disclosed. Renewed every 5 years.",
    },
    {
      region: "USA" as const,
      name: "Top Secret / Sensitive Compartmented Information",
      shortName: "TS/SCI",
      rank: 4,
      description:
        "Access to particularly sensitive intelligence sources and methods beyond standard Top Secret clearance.",
    },
    // CAN — https://www.canada.ca/en/government/publicservice/wellness-inclusion-diversity-public-service/health-wellness-public-servants/mental-health-workplace/security-screening.html
    {
      region: "CAN" as const,
      name: "Reliability Status",
      shortName: "RS",
      rank: 1,
      description:
        "Base-level screening for government employment. Covers identity, employment and criminal record checks.",
    },
    {
      region: "CAN" as const,
      name: "Secret",
      shortName: "SECRET",
      rank: 2,
      description:
        "Required for access to Secret-classified information and assets.",
    },
    {
      region: "CAN" as const,
      name: "Top Secret",
      shortName: "TS",
      rank: 3,
      description:
        "Required for access to Top Secret-classified information and assets.",
    },
    // AUS — https://www.agsva.gov.au/security-clearances/clearance-levels
    {
      region: "AUS" as const,
      name: "Baseline Vetting",
      shortName: "BV",
      rank: 1,
      description:
        "Entry-level clearance providing access to PROTECTED and below information.",
    },
    {
      region: "AUS" as const,
      name: "Negative Vetting Level 1",
      shortName: "NV1",
      rank: 2,
      description:
        "Access to SECRET and below information without direct supervision.",
    },
    {
      region: "AUS" as const,
      name: "Negative Vetting Level 2",
      shortName: "NV2",
      rank: 3,
      description:
        "Access to TOP SECRET and below information without direct supervision.",
    },
    {
      region: "AUS" as const,
      name: "Positive Vetting",
      shortName: "PV",
      rank: 4,
      description:
        "Highest clearance level. Access to TOP SECRET and sensitive compartmented information.",
    },
    // NZL — https://www.nzsis.govt.nz/our-work/security-clearances/
    {
      region: "NZL" as const,
      name: "Confidential",
      shortName: "CONF",
      rank: 1,
      description: "Access to CONFIDENTIAL and below classified material.",
    },
    {
      region: "NZL" as const,
      name: "Secret",
      shortName: "S",
      rank: 2,
      description: "Access to SECRET and below classified material.",
    },
    {
      region: "NZL" as const,
      name: "Top Secret",
      shortName: "TS",
      rank: 3,
      description: "Access to TOP SECRET and below classified material.",
    },
    // IRL — https://www.nsai.ie/
    {
      region: "IRL" as const,
      name: "Basic Access",
      shortName: "BA",
      rank: 1,
      description:
        "Standard background checks for government and public sector roles.",
    },
    {
      region: "IRL" as const,
      name: "Secret",
      shortName: "S",
      rank: 2,
      description: "Access to Secret-classified government information.",
    },
    {
      region: "IRL" as const,
      name: "Top Secret",
      shortName: "TS",
      rank: 3,
      description: "Access to Top Secret-classified government information.",
    },
  ];

  await db.insert(clearanceLevelsTable).values(levels).onConflictDoNothing();

  console.log(`    ✓ ${levels.length} clearance levels`);
}

// ---------------------------------------------------------------------------
// 2. Reference frameworks
// ---------------------------------------------------------------------------

async function seedReferenceFrameworks() {
  console.log("  Seeding reference frameworks...");

  const [sfia, ddat] = await db
    .insert(referenceFrameworksTable)
    .values([
      {
        name: "Skills Framework for the Information Age",
        version: "9",
        url: "https://sfia-online.org/en/sfia-9",
      },
      {
        name: "Government Digital and Data Profession Capability Framework",
        version: "2024",
        url: "https://ddat-capability-framework.service.gov.uk",
      },
    ])
    .onConflictDoNothing()
    .returning();

  console.log("    ✓ SFIA 9, DDaT frameworks");
  return { sfiaId: sfia?.id, ddatId: ddat?.id };
}

// ---------------------------------------------------------------------------
// 3. Reference skills (SFIA 9 + DDaT)
// ---------------------------------------------------------------------------

async function seedReferenceSkills(sfiaId: string, ddatId: string) {
  console.log("  Seeding reference skills...");

  const sfiaValues = sfiaNineSkills.map((s) => ({
    framework_id: sfiaId,
    code: s.code,
    name: s.name,
    description: s.description ?? null,
    min_level: s.min_level ?? 0,
    max_level: s.max_level,
  }));

  const ddatValues = ddatSkills.map((s) => ({
    framework_id: ddatId,
    code: s.code ?? toDdatCode(s.name),
    name: s.name,
    description: s.description ?? null,
    min_level: 0,
    max_level: s.max_level ?? 4,
  }));

  await db
    .insert(referenceSkillsTable)
    .values([...sfiaValues, ...ddatValues])
    .onConflictDoNothing();

  console.log(
    `    ✓ ${sfiaValues.length} SFIA 9 skills, ${ddatValues.length} DDaT skills`,
  );
}

// ---------------------------------------------------------------------------
// 4. Reference roles (DDaT)
// ---------------------------------------------------------------------------

async function seedReferenceRoles(ddatId: string) {
  console.log("  Seeding reference roles (DDaT)...");

  // Canonical DDaT job roles from the capability framework
  const ddatRoles = [
    { code: "software-developer", name: "Software developer" },
    { code: "frontend-developer", name: "Frontend developer" },
    { code: "infrastructure-engineer", name: "Infrastructure engineer" },
    { code: "devops-engineer", name: "DevOps engineer" },
    { code: "platform-engineer", name: "Platform engineer" },
    { code: "site-reliability-engineer", name: "Site reliability engineer" },
    { code: "test-engineer", name: "Test engineer" },
    { code: "solution-architect", name: "Solution architect" },
    { code: "technical-architect", name: "Technical architect" },
    { code: "enterprise-architect", name: "Enterprise architect" },
    { code: "security-architect", name: "Security architect" },
    { code: "data-architect", name: "Data architect" },
    { code: "data-engineer", name: "Data engineer" },
    { code: "data-scientist", name: "Data scientist" },
    { code: "data-analyst", name: "Data analyst" },
    { code: "business-analyst", name: "Business analyst" },
    { code: "product-manager", name: "Product manager" },
    { code: "delivery-manager", name: "Delivery manager" },
    { code: "service-owner", name: "Service owner" },
    { code: "programme-delivery-manager", name: "Programme delivery manager" },
    { code: "service-designer", name: "Service designer" },
    { code: "interaction-designer", name: "Interaction designer" },
    { code: "content-designer", name: "Content designer" },
    { code: "user-researcher", name: "User researcher" },
    { code: "performance-analyst", name: "Performance analyst" },
    {
      code: "end-user-computing-engineer",
      name: "End user computing engineer",
    },
    {
      code: "end-user-computing-manager",
      name: "End user computing manager",
    },
    { code: "it-service-manager", name: "IT service manager" },
    { code: "change-and-release-manager", name: "Change and release manager" },
    {
      code: "cyber-security-analyst",
      name: "Cyber security analyst",
    },
    {
      code: "security-operations-analyst",
      name: "Security operations analyst",
    },
  ];

  await db
    .insert(referenceRolesTable)
    .values(
      ddatRoles.map((r) => ({
        framework_id: ddatId,
        code: r.code,
        name: r.name,
      })),
    )
    .onConflictDoNothing();

  console.log(`    ✓ ${ddatRoles.length} DDaT reference roles`);
}

// ---------------------------------------------------------------------------
// 5. Internal platform skills
//
// These are the tech-agnostic skills that users actually tag evidence with.
// Deliberately minimal — covers the role families in the default framework.
// organization_id IS NULL = platform default (applies to all orgs).
// ---------------------------------------------------------------------------

async function seedInternalSkills() {
  console.log("  Seeding internal platform skills...");

  const skills = [
    // Software delivery
    {
      name: "Software Design",
      description:
        "Designing software solutions that are appropriate to requirements, maintainable and aligned to architectural standards.",
    },
    {
      name: "Software Development",
      description:
        "Writing, reviewing and iterating production-quality code across the full development lifecycle.",
    },
    {
      name: "Frontend Development",
      description:
        "Building accessible, performant user interfaces using web technologies.",
    },
    {
      name: "API Design",
      description:
        "Designing and building APIs that are consistent, versioned and fit for consumption by internal and external consumers.",
    },
    {
      name: "Test Engineering",
      description:
        "Designing and implementing automated test suites and quality strategies to ensure reliable software delivery.",
    },
    {
      name: "Systems Integration",
      description:
        "Identifying and designing connections between systems, ensuring components communicate reliably.",
    },
    // Infrastructure and operations
    {
      name: "Cloud Engineering",
      description:
        "Designing, building and managing cloud infrastructure to support scalable and resilient services.",
    },
    {
      name: "Platform Engineering",
      description:
        "Building and maintaining the developer platforms and tooling that underpin software delivery.",
    },
    {
      name: "Availability and Capacity Management",
      description:
        "Ensuring services remain available with minimal disruption and that infrastructure scales to meet demand.",
    },
    {
      name: "Incident Management",
      description:
        "Detecting, responding to and learning from service incidents to minimise impact and prevent recurrence.",
    },
    // Architecture
    {
      name: "Solution Architecture",
      description:
        "Designing end-to-end technical solutions that meet business needs, balancing quality attributes and constraints.",
    },
    {
      name: "Enterprise Architecture",
      description:
        "Defining and aligning the organisation's technology landscape with its strategic objectives.",
    },
    {
      name: "Security Architecture",
      description:
        "Designing systems and processes that protect against security threats while enabling business outcomes.",
    },
    // Data
    {
      name: "Data Engineering",
      description:
        "Building pipelines, platforms and systems that make data accessible, reliable and useful.",
    },
    {
      name: "Data Analysis",
      description:
        "Examining, interpreting and communicating data to support informed decision-making.",
    },
    {
      name: "Data Modelling",
      description:
        "Producing logical and physical data models that accurately represent domain concepts and relationships.",
    },
    {
      name: "Data Governance",
      description:
        "Establishing and maintaining standards, policies and processes that ensure data quality, security and compliance.",
    },
    // Product and delivery
    {
      name: "Product Management",
      description:
        "Defining and managing a product vision, roadmap and backlog to deliver value to users and the organisation.",
    },
    {
      name: "Agile Delivery",
      description:
        "Leading and facilitating iterative delivery, removing blockers and maintaining team momentum.",
    },
    {
      name: "Stakeholder Management",
      description:
        "Building and maintaining relationships with stakeholders, managing expectations and communications.",
    },
    {
      name: "Commercial Management",
      description:
        "Managing supplier relationships, contracts and commercial decisions to deliver value for money.",
    },
    // Design and research
    {
      name: "Service Design",
      description:
        "Designing end-to-end service journeys that meet user needs across all channels and touchpoints.",
    },
    {
      name: "Interaction Design",
      description:
        "Designing clear, usable interfaces and interactions that help users complete their goals.",
    },
    {
      name: "User Research",
      description:
        "Planning and conducting research with users to understand their needs, behaviours and motivations.",
    },
    {
      name: "Content Design",
      description:
        "Creating clear, accurate content in plain English that meets user needs and organisational goals.",
    },
    {
      name: "Accessibility",
      description:
        "Ensuring services and products can be used by as many people as possible, including those with disabilities.",
    },
    // Business analysis
    {
      name: "Requirements Analysis",
      description:
        "Eliciting, analysing and documenting business and user needs to inform design and delivery decisions.",
    },
    {
      name: "Process Improvement",
      description:
        "Identifying inefficiencies in business processes and designing improved approaches.",
    },
    // Security
    {
      name: "Cyber Security",
      description:
        "Identifying, assessing and mitigating security risks across systems, processes and people.",
    },
    // Cross-cutting
    {
      name: "Technical Leadership",
      description:
        "Setting technical direction, mentoring engineers and maintaining quality standards across a team or programme.",
    },
    {
      name: "People Development",
      description:
        "Coaching, mentoring and developing the skills and capabilities of others.",
    },
    {
      name: "Strategic Planning",
      description:
        "Developing and communicating plans that align delivery with organisational strategy.",
    },
  ];

  const inserted = await db
    .insert(skillsTable)
    .values(
      skills.map((s) => ({
        organization_id: null,
        name: s.name,
        description: s.description,
      })),
    )
    .onConflictDoNothing()
    .returning();

  console.log(`    ✓ ${inserted.length} internal platform skills`);
  return inserted;
}

// ---------------------------------------------------------------------------
// 6. Skill framework mappings (internal → SFIA 9)
//
// Maps each internal skill to the closest SFIA 9 skill code.
// Intentionally kept to one primary SFIA mapping per internal skill.
// ---------------------------------------------------------------------------

async function seedSkillFrameworkMappings(
  internalSkills: Array<{ id: string; name: string }>,
) {
  console.log("  Seeding skill → SFIA 9 mappings...");

  // Fetch all SFIA reference skills indexed by code for lookup
  const sfiaSkills = await db.select().from(referenceSkillsTable);
  const sfiaByCode = Object.fromEntries(sfiaSkills.map((s) => [s.code, s.id]));
  const internalByName = Object.fromEntries(
    internalSkills.map((s) => [s.name, s.id]),
  );

  const mappings: Array<{ internal: string; sfiaCode: string }> = [
    { internal: "Software Design", sfiaCode: "SWDN" },
    { internal: "Software Development", sfiaCode: "PROG" },
    { internal: "Frontend Development", sfiaCode: "PROG" },
    { internal: "API Design", sfiaCode: "SWDN" },
    { internal: "Test Engineering", sfiaCode: "TEST" },
    { internal: "Systems Integration", sfiaCode: "SINT" },
    { internal: "Cloud Engineering", sfiaCode: "CLSL" },
    { internal: "Platform Engineering", sfiaCode: "SLEN" },
    { internal: "Availability and Capacity Management", sfiaCode: "AVMT" },
    { internal: "Incident Management", sfiaCode: "USUP" },
    { internal: "Solution Architecture", sfiaCode: "ARCH" },
    { internal: "Enterprise Architecture", sfiaCode: "STPL" },
    { internal: "Security Architecture", sfiaCode: "SANS" },
    { internal: "Data Engineering", sfiaCode: "DENG" },
    { internal: "Data Analysis", sfiaCode: "DTAN" },
    { internal: "Data Modelling", sfiaCode: "DTAN" },
    { internal: "Data Governance", sfiaCode: "DBAD" },
    { internal: "Product Management", sfiaCode: "PROD" },
    { internal: "Agile Delivery", sfiaCode: "DTSM" },
    { internal: "Stakeholder Management", sfiaCode: "RLMT" },
    { internal: "Commercial Management", sfiaCode: "SORC" },
    { internal: "Service Design", sfiaCode: "HCEV" },
    { internal: "Interaction Design", sfiaCode: "HCEV" },
    { internal: "User Research", sfiaCode: "URCH" },
    { internal: "Content Design", sfiaCode: "URCH" },
    { internal: "Accessibility", sfiaCode: "ACIN" },
    { internal: "Requirements Analysis", sfiaCode: "REQM" },
    { internal: "Process Improvement", sfiaCode: "BPRE" },
    { internal: "Cyber Security", sfiaCode: "SCTY" },
    { internal: "Technical Leadership", sfiaCode: "DLMG" },
    { internal: "People Development", sfiaCode: "PEMT" },
    { internal: "Strategic Planning", sfiaCode: "ITSP" },
  ];

  const values = mappings
    .map(({ internal, sfiaCode }) => {
      const skillId = internalByName[internal];
      const referenceSkillId = sfiaByCode[sfiaCode];
      if (!skillId || !referenceSkillId) {
        console.warn(
          `    ⚠ Mapping skipped: "${internal}" → ${sfiaCode} (not found)`,
        );
        return null;
      }
      return { skill_id: skillId, reference_skill_id: referenceSkillId };
    })
    .filter((v): v is NonNullable<typeof v> => v !== null);

  await db
    .insert(skillFrameworkMappingsTable)
    .values(values)
    .onConflictDoNothing();

  console.log(`    ✓ ${values.length} skill framework mappings`);
}

// ---------------------------------------------------------------------------
// 7. Platform default tags
// ---------------------------------------------------------------------------

async function seedTags() {
  console.log("  Seeding platform default tags...");

  const tags: Array<{
    name: string;
    tag_type: "technology" | "tool" | "practice" | "methodology" | "domain";
  }> = [
    // Technologies
    { name: "TypeScript", tag_type: "technology" },
    { name: "JavaScript", tag_type: "technology" },
    { name: "Python", tag_type: "technology" },
    { name: "Java", tag_type: "technology" },
    { name: "Go", tag_type: "technology" },
    { name: "Rust", tag_type: "technology" },
    { name: "C#", tag_type: "technology" },
    { name: "SQL", tag_type: "technology" },
    { name: "HTML", tag_type: "technology" },
    { name: "CSS", tag_type: "technology" },
    { name: "React", tag_type: "technology" },
    { name: "Next.js", tag_type: "technology" },
    { name: "Node.js", tag_type: "technology" },
    { name: "PostgreSQL", tag_type: "technology" },
    { name: "MySQL", tag_type: "technology" },
    { name: "MongoDB", tag_type: "technology" },
    { name: "Redis", tag_type: "technology" },
    { name: "GraphQL", tag_type: "technology" },
    { name: "REST API", tag_type: "technology" },
    { name: "Terraform", tag_type: "technology" },
    { name: "Docker", tag_type: "technology" },
    { name: "Kubernetes", tag_type: "technology" },
    { name: "AWS", tag_type: "technology" },
    { name: "Azure", tag_type: "technology" },
    { name: "GCP", tag_type: "technology" },
    // Tools
    { name: "GitHub", tag_type: "tool" },
    { name: "GitLab", tag_type: "tool" },
    { name: "Jira", tag_type: "tool" },
    { name: "Confluence", tag_type: "tool" },
    { name: "Figma", tag_type: "tool" },
    { name: "Miro", tag_type: "tool" },
    { name: "Postman", tag_type: "tool" },
    { name: "Datadog", tag_type: "tool" },
    { name: "Grafana", tag_type: "tool" },
    { name: "Splunk", tag_type: "tool" },
    { name: "Slack", tag_type: "tool" },
    // Practices
    { name: "Test-driven development", tag_type: "practice" },
    { name: "Pair programming", tag_type: "practice" },
    { name: "Code review", tag_type: "practice" },
    { name: "Continuous integration", tag_type: "practice" },
    { name: "Continuous delivery", tag_type: "practice" },
    { name: "Infrastructure as code", tag_type: "practice" },
    { name: "Domain-driven design", tag_type: "practice" },
    { name: "Event-driven architecture", tag_type: "practice" },
    { name: "Microservices", tag_type: "practice" },
    { name: "Accessibility testing", tag_type: "practice" },
    { name: "Security testing", tag_type: "practice" },
    { name: "Performance testing", tag_type: "practice" },
    { name: "Threat modelling", tag_type: "practice" },
    // Methodologies
    { name: "Agile", tag_type: "methodology" },
    { name: "Scrum", tag_type: "methodology" },
    { name: "Kanban", tag_type: "methodology" },
    { name: "Shape Up", tag_type: "methodology" },
    { name: "SAFe", tag_type: "methodology" },
    { name: "ITIL", tag_type: "methodology" },
    { name: "GDS Service Standard", tag_type: "methodology" },
    // Domains
    { name: "Accessibility", tag_type: "domain" },
    { name: "Security", tag_type: "domain" },
    { name: "Performance", tag_type: "domain" },
    { name: "Observability", tag_type: "domain" },
    { name: "Data privacy", tag_type: "domain" },
    { name: "Procurement", tag_type: "domain" },
    { name: "Government digital services", tag_type: "domain" },
    { name: "Open source", tag_type: "domain" },
    { name: "Machine learning", tag_type: "domain" },
    { name: "Sustainability", tag_type: "domain" },
  ];

  await db
    .insert(tagsTable)
    .values(tags.map((t) => ({ ...t, organization_id: null })))
    .onConflictDoNothing();

  console.log(`    ✓ ${tags.length} platform default tags`);
}

// ---------------------------------------------------------------------------
// 8. Internal framework — role families and roles
// ---------------------------------------------------------------------------

async function seedInternalFramework() {
  console.log("  Seeding internal framework role families and roles...");

  // Insert families — organization_id IS NULL = platform default
  const familyValues = roleFamilyDefinitions.map((f) => ({
    organization_id: null,
    name: f.name,
    description: f.description || null,
  }));

  const families = await db
    .insert(frameworkRoleFamiliesTable)
    .values(familyValues)
    .onConflictDoNothing()
    .returning();

  const familyByName = Object.fromEntries(families.map((f) => [f.name, f.id]));

  // Levels for every role family
  const levels = [
    "associate",
    "junior",
    "mid",
    "senior",
    "lead",
    "principal",
  ] as const;

  const roleValues: Array<{
    organization_id: null;
    family_id: string;
    level: (typeof levels)[number];
    display_name: string;
  }> = [];

  for (const family of roleFamilyDefinitions) {
    const familyId = familyByName[family.name];
    if (!familyId) continue;

    for (const level of levels) {
      const capitalised = level.charAt(0).toUpperCase() + level.slice(1);
      roleValues.push({
        organization_id: null,
        family_id: familyId,
        level,
        display_name: `${capitalised} ${family.name}`,
      });
    }
  }

  const roles = await db
    .insert(frameworkRolesTable)
    .values(roleValues)
    .onConflictDoNothing()
    .returning();

  console.log(
    `    ✓ ${families.length} role families, ${roles.length} framework roles`,
  );

  return { families, roles, familyByName };
}

// ---------------------------------------------------------------------------
// 9. Framework role → DDaT reference role mappings
// ---------------------------------------------------------------------------

async function seedFrameworkRoleMappings(
  families: Array<{ id: string; name: string }>,
) {
  console.log("  Seeding framework role → DDaT mappings...");

  // Fetch all DDaT reference roles indexed by code
  const refRoles = await db.select().from(referenceRolesTable);
  const refRoleByCode = Object.fromEntries(
    refRoles.map((r) => [r.code ?? "", r.id]),
  );

  // Fetch all framework roles
  const frameworkRoles = await db.select().from(frameworkRolesTable);

  // Map family name → DDaT reference role code
  const familyToDdatCode: Record<string, string> = {
    "Software Developer": "software-developer",
    "Cloud Engineer": "infrastructure-engineer",
    "Test Engineer": "test-engineer",
    "Data Scientist": "data-scientist",
    "Agile Delivery Manager": "delivery-manager",
    "Solution Architect": "solution-architect",
    "Service Designer": "service-designer",
    "Digital Service Manager": "service-owner",
    "Content Designer": "content-designer",
    "Business Analyst": "business-analyst",
    "UX Designer": "interaction-designer",
    "Product Manager": "product-manager",
    "IT Support": "end-user-computing-engineer",
    PMO: "programme-delivery-manager",
  };

  const familyById = Object.fromEntries(families.map((f) => [f.id, f.name]));

  const mappingValues: Array<{
    framework_role_id: string;
    reference_role_id: string;
  }> = [];

  for (const role of frameworkRoles) {
    const familyName = familyById[role.family_id];
    if (!familyName) continue;
    const ddatCode = familyToDdatCode[familyName];
    if (!ddatCode) continue;
    const referenceRoleId = refRoleByCode[ddatCode];
    if (!referenceRoleId) continue;
    mappingValues.push({
      framework_role_id: role.id,
      reference_role_id: referenceRoleId,
    });
  }

  await db
    .insert(frameworkRoleMappingsTable)
    .values(mappingValues)
    .onConflictDoNothing();

  console.log(`    ✓ ${mappingValues.length} role → DDaT mappings`);
}

// ---------------------------------------------------------------------------
// 10. Skill expectations per role
//
// Defines which internal skills are expected at each level for each family.
// Deliberately concise — covers the primary skills only.
// is_primary = true marks the skills that are the core competency for the role.
// ---------------------------------------------------------------------------

async function seedSkillExpectations(
  internalSkills: Array<{ id: string; name: string }>,
) {
  console.log("  Seeding framework role skill expectations...");

  const skillByName = Object.fromEntries(
    internalSkills.map((s) => [s.name, s.id]),
  );

  const families = await db.select().from(frameworkRoleFamiliesTable);
  const familyByName = Object.fromEntries(families.map((f) => [f.name, f.id]));

  const roles = await db.select().from(frameworkRolesTable);

  // family name → { skill name, is_primary, minimum_level }[]
  const expectations: Record<
    string,
    Array<{
      skill: string;
      isPrimary: boolean;
      minimumLevel:
        | "associate"
        | "junior"
        | "mid"
        | "senior"
        | "lead"
        | "principal";
    }>
  > = {
    "Software Developer": [
      {
        skill: "Software Development",
        isPrimary: true,
        minimumLevel: "associate",
      },
      { skill: "Software Design", isPrimary: true, minimumLevel: "mid" },
      { skill: "Test Engineering", isPrimary: false, minimumLevel: "junior" },
      { skill: "Systems Integration", isPrimary: false, minimumLevel: "mid" },
      {
        skill: "Technical Leadership",
        isPrimary: false,
        minimumLevel: "senior",
      },
      { skill: "Accessibility", isPrimary: false, minimumLevel: "junior" },
    ],
    "Cloud Engineer": [
      {
        skill: "Cloud Engineering",
        isPrimary: true,
        minimumLevel: "associate",
      },
      { skill: "Platform Engineering", isPrimary: true, minimumLevel: "mid" },
      {
        skill: "Availability and Capacity Management",
        isPrimary: false,
        minimumLevel: "mid",
      },
      {
        skill: "Incident Management",
        isPrimary: false,
        minimumLevel: "junior",
      },
      {
        skill: "Security Architecture",
        isPrimary: false,
        minimumLevel: "senior",
      },
    ],
    "Test Engineer": [
      { skill: "Test Engineering", isPrimary: true, minimumLevel: "associate" },
      {
        skill: "Software Development",
        isPrimary: false,
        minimumLevel: "junior",
      },
      { skill: "Requirements Analysis", isPrimary: false, minimumLevel: "mid" },
      {
        skill: "Process Improvement",
        isPrimary: false,
        minimumLevel: "senior",
      },
    ],
    "Data Scientist": [
      { skill: "Data Analysis", isPrimary: true, minimumLevel: "associate" },
      { skill: "Data Engineering", isPrimary: false, minimumLevel: "mid" },
      { skill: "Data Modelling", isPrimary: false, minimumLevel: "mid" },
      { skill: "Data Governance", isPrimary: false, minimumLevel: "senior" },
      {
        skill: "Software Development",
        isPrimary: false,
        minimumLevel: "junior",
      },
    ],
    "Agile Delivery Manager": [
      { skill: "Agile Delivery", isPrimary: true, minimumLevel: "associate" },
      { skill: "Stakeholder Management", isPrimary: true, minimumLevel: "mid" },
      {
        skill: "Commercial Management",
        isPrimary: false,
        minimumLevel: "senior",
      },
      { skill: "Strategic Planning", isPrimary: false, minimumLevel: "lead" },
      { skill: "People Development", isPrimary: false, minimumLevel: "senior" },
    ],
    "Solution Architect": [
      { skill: "Solution Architecture", isPrimary: true, minimumLevel: "mid" },
      { skill: "Software Design", isPrimary: false, minimumLevel: "mid" },
      {
        skill: "Security Architecture",
        isPrimary: false,
        minimumLevel: "senior",
      },
      {
        skill: "Stakeholder Management",
        isPrimary: false,
        minimumLevel: "senior",
      },
      {
        skill: "Technical Leadership",
        isPrimary: false,
        minimumLevel: "senior",
      },
    ],
    "Service Designer": [
      { skill: "Service Design", isPrimary: true, minimumLevel: "associate" },
      { skill: "User Research", isPrimary: false, minimumLevel: "junior" },
      { skill: "Accessibility", isPrimary: false, minimumLevel: "junior" },
      {
        skill: "Stakeholder Management",
        isPrimary: false,
        minimumLevel: "mid",
      },
    ],
    "Digital Service Manager": [
      { skill: "Product Management", isPrimary: true, minimumLevel: "mid" },
      { skill: "Stakeholder Management", isPrimary: true, minimumLevel: "mid" },
      { skill: "Agile Delivery", isPrimary: false, minimumLevel: "mid" },
      { skill: "Strategic Planning", isPrimary: false, minimumLevel: "senior" },
    ],
    "Content Designer": [
      { skill: "Content Design", isPrimary: true, minimumLevel: "associate" },
      { skill: "User Research", isPrimary: false, minimumLevel: "junior" },
      { skill: "Accessibility", isPrimary: false, minimumLevel: "junior" },
    ],
    "Business Analyst": [
      {
        skill: "Requirements Analysis",
        isPrimary: true,
        minimumLevel: "associate",
      },
      { skill: "Process Improvement", isPrimary: true, minimumLevel: "mid" },
      {
        skill: "Stakeholder Management",
        isPrimary: false,
        minimumLevel: "mid",
      },
      { skill: "Data Analysis", isPrimary: false, minimumLevel: "mid" },
    ],
    "UX Designer": [
      {
        skill: "Interaction Design",
        isPrimary: true,
        minimumLevel: "associate",
      },
      { skill: "User Research", isPrimary: false, minimumLevel: "junior" },
      { skill: "Accessibility", isPrimary: false, minimumLevel: "junior" },
      { skill: "Service Design", isPrimary: false, minimumLevel: "senior" },
    ],
    "Product Manager": [
      {
        skill: "Product Management",
        isPrimary: true,
        minimumLevel: "associate",
      },
      {
        skill: "Stakeholder Management",
        isPrimary: false,
        minimumLevel: "mid",
      },
      { skill: "Agile Delivery", isPrimary: false, minimumLevel: "junior" },
      { skill: "Data Analysis", isPrimary: false, minimumLevel: "mid" },
      { skill: "Strategic Planning", isPrimary: false, minimumLevel: "senior" },
    ],
    "IT Support": [
      {
        skill: "Incident Management",
        isPrimary: true,
        minimumLevel: "associate",
      },
      {
        skill: "Availability and Capacity Management",
        isPrimary: false,
        minimumLevel: "mid",
      },
    ],
    PMO: [
      { skill: "Agile Delivery", isPrimary: false, minimumLevel: "mid" },
      { skill: "Stakeholder Management", isPrimary: true, minimumLevel: "mid" },
      { skill: "Strategic Planning", isPrimary: true, minimumLevel: "senior" },
      {
        skill: "Commercial Management",
        isPrimary: false,
        minimumLevel: "senior",
      },
    ],
    "Talent Acquisition Specialist": [
      {
        skill: "Stakeholder Management",
        isPrimary: true,
        minimumLevel: "associate",
      },
      { skill: "People Development", isPrimary: false, minimumLevel: "mid" },
    ],
  };

  const expectationValues: Array<{
    framework_role_id: string;
    skill_id: string;
    minimum_level: "associate" | "junior" | "mid" | "senior" | "lead" | "principal";
    is_primary: boolean;
  }> = [];

  for (const role of roles) {
    const familyId = role.family_id;
    const family = families.find((f) => f.id === familyId);
    if (!family) continue;

    const familyExpectations = expectations[family.name];
    if (!familyExpectations) continue;

    for (const exp of familyExpectations) {
      const skillId = skillByName[exp.skill];
      if (!skillId) {
        console.warn(`    ⚠ Skill not found for expectation: "${exp.skill}"`);
        continue;
      }

      // Only add the expectation if the role level meets the minimum
      const levelOrder = [
        "associate",
        "junior",
        "mid",
        "senior",
        "lead",
        "principal",
      ];
      const roleLevel = levelOrder.indexOf(role.level);
      const minLevel = levelOrder.indexOf(exp.minimumLevel);

      if (roleLevel >= minLevel) {
        expectationValues.push({
          framework_role_id: role.id,
          skill_id: skillId,
          minimum_level: exp.minimumLevel,
          is_primary: exp.isPrimary,
        });
      }
    }
  }

  await db
    .insert(frameworkRoleSkillExpectationsTable)
    .values(expectationValues)
    .onConflictDoNothing();

  console.log(`    ✓ ${expectationValues.length} skill expectations`);
}

// ---------------------------------------------------------------------------
// 11. Skill levels
//
// Generic level descriptors for each internal skill.
// These describe what demonstrating that skill looks like at each level.
// descriptor IS NULL is valid — the UI falls back to the framework level default.
// ---------------------------------------------------------------------------

async function seedSkillLevels(
  internalSkills: Array<{ id: string; name: string }>,
) {
  console.log("  Seeding skill level descriptors...");

  const levels = [
    "associate",
    "junior",
    "mid",
    "senior",
    "lead",
    "principal",
  ] as const;

  const descriptors: Record<
    string,
    Partial<Record<(typeof levels)[number], string>>
  > = {
    "Software Development": {
      associate:
        "Writes code with close guidance. Contributes to small, well-defined tasks under supervision.",
      junior:
        "Independently completes well-scoped tasks. Follows team standards and seeks feedback proactively.",
      mid: "Delivers features end-to-end. Reviews others' code. Identifies and resolves technical debt.",
      senior:
        "Sets technical direction for features. Mentors junior engineers. Owns quality within an area.",
      lead: "Leads engineering across multiple teams or a programme. Defines standards. Drives architectural decisions.",
      principal:
        "Sets engineering strategy across the organisation. Recognised externally. Shapes the profession.",
    },
    "Solution Architecture": {
      mid: "Contributes to architectural decisions. Documents options and trade-offs for review.",
      senior:
        "Designs end-to-end solutions for bounded contexts. Accountable for technical quality of a system.",
      lead: "Owns architecture across a programme. Balances short-term delivery with long-term strategic fit.",
      principal:
        "Sets architectural principles for the organisation. Advises on cross-programme technical strategy.",
    },
    "Agile Delivery": {
      associate:
        "Participates in ceremonies. Understands the team's delivery cadence.",
      junior:
        "Facilitates some ceremonies. Understands blockers and escalates appropriately.",
      mid: "Accountable for a team's delivery. Removes blockers. Reports progress to stakeholders.",
      senior:
        "Leads delivery across multiple teams or a complex programme. Coaches on agile practices.",
      lead: "Sets delivery standards across the organisation. Coaches other delivery managers.",
      principal:
        "Shapes delivery strategy and methodology at programme or portfolio level.",
    },
    "Stakeholder Management": {
      associate:
        "Communicates clearly within the team. Responds to requests promptly.",
      junior:
        "Manages relationships with immediate stakeholders. Keeps them informed of progress.",
      mid: "Proactively manages expectations. Identifies and addresses stakeholder concerns.",
      senior:
        "Builds trust with senior stakeholders. Navigates complex organisational dynamics.",
      lead: "Manages executive-level relationships. Influences strategic decisions through stakeholder engagement.",
      principal:
        "Represents the organisation externally. Builds strategic partnerships.",
    },
  };

  const levelValues: Array<{
    skill_id: string;
    level: (typeof levels)[number];
    description: string | null;
  }> = [];

  for (const skill of internalSkills) {
    const skillDescriptors = descriptors[skill.name] ?? {};
    for (const level of levels) {
      levelValues.push({
        skill_id: skill.id,
        level,
        description: skillDescriptors[level] ?? null,
      });
    }
  }

  await db.insert(skillsLevelsTable).values(levelValues).onConflictDoNothing();

  console.log(`    ✓ ${levelValues.length} skill level rows`);
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

async function seed() {
  console.log("🌱 Seeding Contractor Hub...\n");

  try {
    await seedClearanceLevels();

    const { sfiaId, ddatId } = await seedReferenceFrameworks();

    if (!sfiaId || !ddatId) {
      // Already seeded — fetch the IDs
      const frameworks = await db.select().from(referenceFrameworksTable);
      const sfia = frameworks.find((f) => f.name.includes("SFIA"));
      const ddat = frameworks.find((f) => f.name.includes("Digital and Data"));
      if (!sfia || !ddat)
        throw new Error("Could not resolve framework IDs after insert");

      await seedReferenceSkills(sfia.id, ddat.id);
      await seedReferenceRoles(ddat.id);

      const internalSkills = await seedInternalSkills();
      await seedSkillFrameworkMappings(internalSkills);
      await seedTags();

      const { families } = await seedInternalFramework();
      await seedFrameworkRoleMappings(families);
      await seedSkillExpectations(internalSkills);
      await seedSkillLevels(internalSkills);
    } else {
      await seedReferenceSkills(sfiaId, ddatId);
      await seedReferenceRoles(ddatId);

      const internalSkills = await seedInternalSkills();
      await seedSkillFrameworkMappings(internalSkills);
      await seedTags();

      const { families } = await seedInternalFramework();
      await seedFrameworkRoleMappings(families);
      await seedSkillExpectations(internalSkills);
      await seedSkillLevels(internalSkills);
    }

    console.log("\n✅ Seed complete.");
  } catch (err) {
    console.error("\n❌ Seed failed:", err);
    process.exit(1);
  }
}

seed();
