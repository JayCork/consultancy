/**
 * Zaizi dev seed — representative data for a small consultancy (~6 months of use).
 *
 * Self-contained: creates the Zaizi organisation, clubs, users, projects and
 * a representative set of evidence. No ORG_ID env var required.
 *
 * Idempotent: safe to re-run. Uses onConflictDoNothing() where unique constraints
 * exist; checks for existing data before inserting rows without a natural key.
 *
 * All users can sign in with password "Password123!".
 * Emails follow the pattern firstname@zaizi.com.
 *
 * Run via:
 *   pnpm --filter @consultancy/db db:seed-dev
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
} from "../../schema";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

const db = drizzle(process.env.DATABASE_URL);

// ── Types ─────────────────────────────────────────────────────────────────────

type UserKey =
  | "gordon" | "nikki" | "seyed" | "jaie"
  | "beth" | "louis" | "amy" | "zuleikha"
  | "john" | "bradley" | "sam" | "helen" | "molly"
  | "jay" | "shamaran" | "joeE" | "joeK"
  | "robert" | "imran" | "karwan" | "krishna" | "lucian" | "sumithra"
  | "ade" | "martins" | "asha" | "troy"
  | "andrew" | "dave" | "mani"
  | "dan" | "colin" | "will" | "arafat"
  | "jim" | "rahat" | "bala" | "fawaz" | "zaryab" | "hasitha" | "ross" | "sunny"
  | "sayed" | "ginnie" | "ali" | "jesse" | "trusha" | "aaron"
  | "rumLead" | "islayLead" | "juraLead" | "aiLead";

type UserMap = Record<UserKey, string>; // key → usersTable.id

// ── User definitions ──────────────────────────────────────────────────────────

interface UserDef {
  key: UserKey;
  slug: string;
  name: string;
  email: string;
  family: string;
  level: "associate" | "junior" | "mid" | "senior" | "lead" | "principal";
  gradeName: string;
  club: "arran" | "rum" | "islay" | "jura" | "ai";
  platformRole?: "member" | "leadership_team" | "admin";
}

const USERS: UserDef[] = [
  // ── Club Arran leadership ───────────────────────────────────────────────────
  { key: "gordon",   slug: "zaizi-seed-gordon-c",    name: "Gordon C",     email: "gordon@zaizi.com",   family: "Digital Service Manager", level: "principal", gradeName: "Club Executive",           club: "arran", platformRole: "leadership_team" },
  { key: "nikki",    slug: "zaizi-seed-nikki-p",     name: "Nikki P",      email: "nikki@zaizi.com",    family: "Product Manager",          level: "principal", gradeName: "Head of Product",          club: "arran", platformRole: "leadership_team" },
  { key: "seyed",    slug: "zaizi-seed-seyed-r",     name: "Seyed R",      email: "seyed@zaizi.com",    family: "Solution Architect",       level: "principal", gradeName: "Head of Engineering",      club: "arran", platformRole: "leadership_team" },
  { key: "jaie",     slug: "zaizi-seed-jaie-s",      name: "Jaie S",       email: "jaie@zaizi.com",     family: "Agile Delivery Manager",   level: "principal", gradeName: "Head of Delivery",         club: "arran", platformRole: "leadership_team" },
  // ── Product & UX ───────────────────────────────────────────────────────────
  { key: "beth",     slug: "zaizi-seed-beth-k",      name: "Beth K",       email: "beth@zaizi.com",     family: "Product Manager",          level: "lead",      gradeName: "Lead Product Manager",     club: "arran" },
  { key: "louis",    slug: "zaizi-seed-louis-p",     name: "Louis P",      email: "louis@zaizi.com",    family: "UX Designer",              level: "lead",      gradeName: "Lead UX Designer",         club: "arran" },
  { key: "amy",      slug: "zaizi-seed-amy-r",       name: "Amy R",        email: "amy@zaizi.com",      family: "UX Designer",              level: "senior",    gradeName: "Senior UX Designer",       club: "arran" },
  { key: "zuleikha", slug: "zaizi-seed-zuleikha-t",  name: "Zuleikha T",   email: "zuleikha@zaizi.com", family: "UX Designer",              level: "senior",    gradeName: "Senior UX Designer",       club: "arran" },
  { key: "sam",      slug: "zaizi-seed-sam-s",       name: "Sam S",        email: "sam@zaizi.com",      family: "Product Manager",          level: "lead",      gradeName: "Lead Product Manager",     club: "arran" },
  // ── Business analysis ──────────────────────────────────────────────────────
  { key: "john",     slug: "zaizi-seed-john-s",      name: "John S",       email: "john@zaizi.com",     family: "Business Analyst",         level: "lead",      gradeName: "Lead Business Analyst",    club: "arran" },
  { key: "bradley",  slug: "zaizi-seed-bradley-r",   name: "Bradley R",    email: "bradley@zaizi.com",  family: "Business Analyst",         level: "senior",    gradeName: "Senior Business Analyst",  club: "arran" },
  { key: "helen",    slug: "zaizi-seed-helen-hill",  name: "Helen Hill",   email: "helen@zaizi.com",    family: "Business Analyst",         level: "lead",      gradeName: "Lead Business Analyst",    club: "arran" },
  { key: "molly",    slug: "zaizi-seed-molly-h",     name: "Molly H",      email: "molly@zaizi.com",    family: "Business Analyst",         level: "senior",    gradeName: "Senior Business Analyst",  club: "arran" },
  // ── Software delivery ──────────────────────────────────────────────────────
  { key: "jay",      slug: "zaizi-seed-jay-c",       name: "Jay C",        email: "jay@zaizi.com",      family: "Software Developer",       level: "lead",      gradeName: "Lead Software Developer",  club: "arran" },
  { key: "shamaran", slug: "zaizi-seed-shamaran-s",  name: "Shamaran S",   email: "shamaran@zaizi.com", family: "Software Developer",       level: "lead",      gradeName: "Lead Software Developer",  club: "arran" },
  { key: "joeE",     slug: "zaizi-seed-joe-e",       name: "Joe E",        email: "joee@zaizi.com",     family: "Software Developer",       level: "senior",    gradeName: "Senior Software Developer", club: "arran" },
  { key: "joeK",     slug: "zaizi-seed-joe-k",       name: "Joe K",        email: "joek@zaizi.com",     family: "Software Developer",       level: "mid",       gradeName: "Software Developer",       club: "arran" },
  { key: "robert",   slug: "zaizi-seed-robert-a",    name: "Robert A",     email: "robert@zaizi.com",   family: "Software Developer",       level: "lead",      gradeName: "Lead Software Developer",  club: "arran" },
  { key: "imran",    slug: "zaizi-seed-imran-s",     name: "Imran S",      email: "imran@zaizi.com",    family: "Software Developer",       level: "senior",    gradeName: "Senior Software Developer", club: "arran" },
  { key: "karwan",   slug: "zaizi-seed-karwan-i",    name: "Karwan I",     email: "karwan@zaizi.com",   family: "Software Developer",       level: "mid",       gradeName: "Software Developer",       club: "arran" },
  { key: "krishna",  slug: "zaizi-seed-krishna-s",   name: "Krishna S",    email: "krishna@zaizi.com",  family: "Software Developer",       level: "lead",      gradeName: "Lead Software Developer",  club: "arran" },
  { key: "lucian",   slug: "zaizi-seed-lucian-t",    name: "Lucian T",     email: "lucian@zaizi.com",   family: "Software Developer",       level: "senior",    gradeName: "Senior Software Developer", club: "arran" },
  { key: "sumithra", slug: "zaizi-seed-sumithra-s",  name: "Sumithra S",   email: "sumithra@zaizi.com", family: "Software Developer",       level: "mid",       gradeName: "Software Developer",       club: "arran" },
  // ── Data & test ────────────────────────────────────────────────────────────
  { key: "ade",      slug: "zaizi-seed-ade-d",       name: "Ade D",        email: "ade@zaizi.com",      family: "Data Scientist",           level: "lead",      gradeName: "Data Architect",           club: "arran" },
  { key: "arafat",   slug: "zaizi-seed-arafat-r",    name: "Arafat R",     email: "arafat@zaizi.com",   family: "Data Scientist",           level: "senior",    gradeName: "Data Engineer",            club: "arran" },
  { key: "martins",  slug: "zaizi-seed-martins-i",   name: "Martins I",    email: "martins@zaizi.com",  family: "Test Engineer",            level: "senior",    gradeName: "Senior Test Engineer",     club: "arran" },
  { key: "asha",     slug: "zaizi-seed-asha-a",      name: "Asha A",       email: "asha@zaizi.com",     family: "Test Engineer",            level: "junior",    gradeName: "Test Engineer (Junior)",   club: "arran" },
  { key: "troy",     slug: "zaizi-seed-troy-p",      name: "Troy P",       email: "troy@zaizi.com",     family: "Test Engineer",            level: "mid",       gradeName: "Test Engineer",            club: "arran" },
  // ── Architecture ───────────────────────────────────────────────────────────
  { key: "andrew",   slug: "zaizi-seed-andrew-m",    name: "Andrew M",     email: "andrew@zaizi.com",   family: "Solution Architect",       level: "lead",      gradeName: "Lead Solution Architect",  club: "arran" },
  { key: "dave",     slug: "zaizi-seed-dave-m",      name: "Dave M",       email: "dave@zaizi.com",     family: "Solution Architect",       level: "lead",      gradeName: "Lead Solution Architect",  club: "arran" },
  { key: "mani",     slug: "zaizi-seed-mani-o",      name: "Mani O",       email: "mani@zaizi.com",     family: "Solution Architect",       level: "lead",      gradeName: "Lead Solution Architect",  club: "arran" },
  // ── Engineering (non-cloud) ────────────────────────────────────────────────
  { key: "dan",      slug: "zaizi-seed-dan-r",       name: "Dan R",        email: "dan@zaizi.com",      family: "Software Developer",       level: "senior",    gradeName: "Senior Software Developer", club: "arran" },
  { key: "colin",    slug: "zaizi-seed-colin-b",     name: "Colin B",      email: "colin@zaizi.com",    family: "Software Developer",       level: "mid",       gradeName: "Software Developer",       club: "arran" },
  { key: "will",     slug: "zaizi-seed-will-f",      name: "Will F",       email: "will@zaizi.com",     family: "Software Developer",       level: "mid",       gradeName: "Software Developer",       club: "arran" },
  // ── Cloud engineering ──────────────────────────────────────────────────────
  { key: "jim",      slug: "zaizi-seed-jim-r",       name: "Jim R",        email: "jim@zaizi.com",      family: "Cloud Engineer",           level: "principal", gradeName: "Principal Cloud Engineer", club: "arran" },
  { key: "rahat",    slug: "zaizi-seed-rahat-a",     name: "Rahat A",      email: "rahat@zaizi.com",    family: "Cloud Engineer",           level: "mid",       gradeName: "Cloud Engineer",           club: "arran" },
  { key: "bala",     slug: "zaizi-seed-bala-h",      name: "Bala H",       email: "bala@zaizi.com",     family: "Cloud Engineer",           level: "senior",    gradeName: "Senior Cloud Engineer",    club: "arran" },
  { key: "fawaz",    slug: "zaizi-seed-fawaz-g",     name: "Fawaz G",      email: "fawaz@zaizi.com",    family: "Cloud Engineer",           level: "senior",    gradeName: "Senior Cloud Engineer",    club: "arran" },
  { key: "zaryab",   slug: "zaizi-seed-zaryab-k",    name: "Zaryab K",     email: "zaryab@zaizi.com",   family: "Cloud Engineer",           level: "junior",    gradeName: "Cloud Engineer (Junior)",  club: "arran" },
  { key: "hasitha",  slug: "zaizi-seed-hasitha-h",   name: "Hasitha H",    email: "hasitha@zaizi.com",  family: "Cloud Engineer",           level: "lead",      gradeName: "Lead Cloud Engineer",      club: "arran" },
  { key: "ross",     slug: "zaizi-seed-ross-b",      name: "Ross B",       email: "ross@zaizi.com",     family: "Cloud Engineer",           level: "mid",       gradeName: "Cloud Engineer",           club: "arran" },
  { key: "sunny",    slug: "zaizi-seed-sunny-t",     name: "Sunny T",      email: "sunny@zaizi.com",    family: "Cloud Engineer",           level: "senior",    gradeName: "Senior Cloud Engineer",    club: "arran" },
  { key: "aaron",    slug: "zaizi-seed-aaron-b",     name: "Aaron B",      email: "aaron@zaizi.com",    family: "Cloud Engineer",           level: "mid",       gradeName: "Cloud Engineer",           club: "arran" },
  // ── Agile delivery ─────────────────────────────────────────────────────────
  { key: "sayed",    slug: "zaizi-seed-sayed-a",     name: "Sayed A",      email: "sayed@zaizi.com",    family: "Agile Delivery Manager",   level: "lead",      gradeName: "Lead Delivery Manager",    club: "arran" },
  { key: "ginnie",   slug: "zaizi-seed-ginnie-g",    name: "Ginnie G",     email: "ginnie@zaizi.com",   family: "Agile Delivery Manager",   level: "principal", gradeName: "Head of Delivery",         club: "arran", platformRole: "leadership_team" },
  { key: "ali",      slug: "zaizi-seed-ali-a",       name: "Ali A",        email: "ali@zaizi.com",      family: "Agile Delivery Manager",   level: "lead",      gradeName: "Lead Delivery Manager",    club: "arran" },
  { key: "jesse",    slug: "zaizi-seed-jesse-m",     name: "Jesse M",      email: "jesse@zaizi.com",    family: "Agile Delivery Manager",   level: "senior",    gradeName: "Delivery Manager",         club: "arran" },
  { key: "trusha",   slug: "zaizi-seed-trusha-d",    name: "Trusha D",     email: "trusha@zaizi.com",   family: "Agile Delivery Manager",   level: "lead",      gradeName: "Lead Delivery Manager",    club: "arran" },
  // ── Other clubs (minimal placeholders) ─────────────────────────────────────
  { key: "rumLead",  slug: "zaizi-seed-rum-lead",    name: "Club Rum Lead", email: "club-rum-lead@zaizi.com",      family: "Digital Service Manager", level: "mid", gradeName: "Club Lead", club: "rum"   },
  { key: "islayLead",slug: "zaizi-seed-islay-lead",  name: "Club Islay Lead",email: "club-islay-lead@zaizi.com",  family: "Digital Service Manager", level: "mid", gradeName: "Club Lead", club: "islay" },
  { key: "juraLead", slug: "zaizi-seed-jura-lead",   name: "Club Jura Lead", email: "club-jura-lead@zaizi.com",   family: "Digital Service Manager", level: "mid", gradeName: "Club Lead", club: "jura"  },
  { key: "aiLead",   slug: "zaizi-seed-ai-lead",     name: "Club AI Lead",   email: "club-appliedai-lead@zaizi.com", family: "Digital Service Manager", level: "mid", gradeName: "Club Lead", club: "ai" },
];

// ── Line management relationships ─────────────────────────────────────────────

const LINE_MANAGER_RELATIONSHIPS: Array<[UserKey, UserKey]> = [
  ["gordon",   "nikki"],
  ["gordon",   "seyed"],
  ["gordon",   "jaie"],
  ["nikki",    "beth"],
  ["nikki",    "louis"],
  ["nikki",    "john"],
  ["nikki",    "sam"],
  ["nikki",    "helen"],
  ["louis",    "amy"],
  ["louis",    "zuleikha"],
  ["john",     "bradley"],
  ["helen",    "molly"],
  ["seyed",    "jay"],
  ["seyed",    "ade"],
  ["seyed",    "martins"],
  ["seyed",    "andrew"],
  ["seyed",    "dave"],
  ["seyed",    "mani"],
  ["seyed",    "dan"],
  ["seyed",    "jim"],
  ["jay",      "shamaran"],
  ["jay",      "sumithra"],
  ["shamaran", "joeE"],
  ["shamaran", "robert"],
  ["joeE",     "joeK"],
  ["robert",   "imran"],
  ["robert",   "krishna"],
  ["imran",    "karwan"],
  ["krishna",  "lucian"],
  ["dan",      "colin"],
  ["dan",      "arafat"],
  ["colin",    "will"],
  ["jim",      "rahat"],
  ["jim",      "bala"],
  ["jim",      "fawaz"],
  ["jim",      "hasitha"],
  ["jim",      "sunny"],
  ["fawaz",    "zaryab"],
  ["hasitha",  "ross"],
  ["martins",  "asha"],
  ["martins",  "troy"],
  ["jaie",     "sayed"],
  ["jaie",     "ginnie"],
  ["jaie",     "trusha"],
  ["ginnie",   "ali"],
  ["ali",      "jesse"],
];

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

// ── 1. Organisation & clubs ───────────────────────────────────────────────────

async function seedOrg() {
  console.log("  Seeding Zaizi organisation and clubs...");

  await db.insert(organizationsTable).values({ name: "Zaizi" }).onConflictDoNothing();

  const [org] = await db
    .select({ id: organizationsTable.id })
    .from(organizationsTable)
    .where(eq(organizationsTable.name, "Zaizi"));

  if (!org) throw new Error("Could not resolve Zaizi org after insert");
  const orgId = org.id;

  const clubs = ["Club Arran", "Club Rum", "Club Islay", "Club Jura", "Club Applied AI"];

  await db
    .insert(organizationUnitsTable)
    .values(clubs.map((name) => ({ organizationId: orgId, name, unitType: "club" })))
    .onConflictDoNothing();

  const units = await db
    .select({ id: organizationUnitsTable.id, name: organizationUnitsTable.name })
    .from(organizationUnitsTable)
    .where(eq(organizationUnitsTable.organizationId, orgId));

  const unitByName = Object.fromEntries(units.map((u) => [u.name, u.id]));

  console.log(`    ✓ Zaizi org + ${units.length} clubs`);
  return {
    orgId,
    clubs: {
      arran: unitByName["Club Arran"],
      rum:   unitByName["Club Rum"],
      islay: unitByName["Club Islay"],
      jura:  unitByName["Club Jura"],
      ai:    unitByName["Club Applied AI"],
    },
  };
}

// ── 2. Users ──────────────────────────────────────────────────────────────────

async function seedUsers(
  orgId: string,
  hashedPassword: string,
): Promise<UserMap> {
  console.log("  Seeding auth accounts and users...");

  // bauth_users
  await db
    .insert(bauthUsersTable)
    .values(USERS.map((u) => ({ id: u.slug, name: u.name, email: u.email, emailVerified: true })))
    .onConflictDoNothing();

  // bauth_accounts (credential provider with hashed password)
  await db
    .insert(bauthAccountsTable)
    .values(
      USERS.map((u) => ({
        id: `${u.slug}-cred`,
        accountId: u.slug,
        providerId: "credential",
        userId: u.slug,
        password: hashedPassword,
      })),
    )
    .onConflictDoNothing();

  // app users
  await db
    .insert(usersTable)
    .values(
      USERS.map((u) => ({
        name: u.name,
        email: u.email,
        status: "active" as const,
        betterAuthId: u.slug,
        organizationId: orgId,
        platformRole: u.platformRole ?? "member",
      })),
    )
    .onConflictDoNothing();

  const rows = await db
    .select({ id: usersTable.id, email: usersTable.email })
    .from(usersTable)
    .where(eq(usersTable.organizationId, orgId));

  const idByEmail = Object.fromEntries(rows.map((r) => [r.email, r.id]));

  const userMap = Object.fromEntries(
    USERS.map((u) => [u.key, idByEmail[u.email]]),
  ) as UserMap;

  console.log(`    ✓ ${rows.length} users created`);
  return userMap;
}

// ── 3. Job grades ─────────────────────────────────────────────────────────────

async function seedGrades(orgId: string): Promise<Map<string, string>> {
  console.log("  Seeding job grades...");

  // Collect unique (gradeName, family, level) combos used by the team
  const gradeSet = new Map<string, { family: string; level: string }>();
  for (const u of USERS) {
    if (!gradeSet.has(u.gradeName)) {
      gradeSet.set(u.gradeName, { family: u.family, level: u.level });
    }
  }

  const existing = await db
    .select({ id: jobGradesTable.id, name: jobGradesTable.name })
    .from(jobGradesTable)
    .where(eq(jobGradesTable.organizationId, orgId));

  if (existing.length > 0) {
    console.log(`    ↩ ${existing.length} grades already exist, skipping`);
    return new Map(existing.map((g) => [g.name, g.id]));
  }

  for (const [gradeName, { family, level }] of gradeSet) {
    const frameworkRoleId = await getFrameworkRoleId(family, level);
    if (!frameworkRoleId) {
      console.warn(`    ⚠ Framework role not found: ${family} / ${level} (grade "${gradeName}" skipped)`);
      continue;
    }
    await db
      .insert(jobGradesTable)
      .values({ organizationId: orgId, frameworkRoleId, name: gradeName })
      .onConflictDoNothing();
  }

  const allGrades = await db
    .select({ id: jobGradesTable.id, name: jobGradesTable.name })
    .from(jobGradesTable)
    .where(eq(jobGradesTable.organizationId, orgId));

  console.log(`    ✓ ${allGrades.length} job grades`);
  return new Map(allGrades.map((g) => [g.name, g.id]));
}

// ── 4. Grade assignments ──────────────────────────────────────────────────────

async function seedGradeAssignments(
  orgId: string,
  users: UserMap,
  gradeByName: Map<string, string>,
) {
  console.log("  Seeding grade assignments...");

  const existing = await db
    .select({ id: userGradeAssignmentsTable.id })
    .from(userGradeAssignmentsTable)
    .innerJoin(usersTable, eq(userGradeAssignmentsTable.userId, usersTable.id))
    .where(eq(usersTable.organizationId, orgId))
    .limit(1);

  if (existing.length > 0) {
    console.log("    ↩ Grade assignments already exist, skipping");
    return;
  }

  const assignments = USERS
    .filter((u) => users[u.key] && gradeByName.has(u.gradeName))
    .map((u) => ({
      userId: users[u.key],
      jobGradeId: gradeByName.get(u.gradeName)!,
      startDate: "2025-01-01",
    }));

  await db.insert(userGradeAssignmentsTable).values(assignments).onConflictDoNothing();
  console.log(`    ✓ ${assignments.length} grade assignments`);
}

// ── 5. Line management relationships ─────────────────────────────────────────

async function seedRelationships(orgId: string, users: UserMap) {
  console.log("  Seeding line management relationships...");

  const existing = await db
    .select({ id: userRelationshipsTable.id })
    .from(userRelationshipsTable)
    .where(eq(userRelationshipsTable.organizationId, orgId))
    .limit(1);

  if (existing.length > 0) {
    console.log("    ↩ Relationships already exist, skipping");
    return;
  }

  const values = LINE_MANAGER_RELATIONSHIPS
    .filter(([actor, target]) => users[actor] && users[target])
    .map(([actor, target]) => ({
      actorId: users[actor],
      targetId: users[target],
      relationshipType: "line_manager" as const,
      startDate: "2025-01-01",
      organizationId: orgId,
    }));

  await db.insert(userRelationshipsTable).values(values).onConflictDoNothing();
  console.log(`    ✓ ${values.length} line management relationships`);
}

// ── 6. Projects ───────────────────────────────────────────────────────────────

async function seedProjects(orgId: string, clubArranId: string, users: UserMap) {
  console.log("  Seeding Club Arran projects...");

  await db
    .insert(projectsTable)
    .values([
      {
        organizationId: orgId,
        organizationUnitId: clubArranId,
        leadId: users.ali,
        name: "Supplier Portal",
        shortName: "Supply",
        codeName: "SUPPLY",
        status: "support",
        fundingModel: "fixed_price",
        contractedValue: "360000.00",
        startDate: new Date("2023-04-01"),
        endDate: new Date("2027-03-31"),
      },
      {
        organizationId: orgId,
        organizationUnitId: clubArranId,
        leadId: users.trusha,
        name: "Access Your Records",
        shortName: "AYR",
        codeName: "AYR",
        status: "in_delivery",
        fundingModel: "time_and_materials",
        contractedValue: "250000.00",
        startDate: new Date("2025-09-01"),
        endDate: new Date("2026-09-30"),
      },
      {
        organizationId: orgId,
        organizationUnitId: clubArranId,
        leadId: users.sayed,
        name: "Procat/SAR Replacement",
        shortName: "Procat",
        codeName: "PROCAT",
        status: "in_delivery",
        fundingModel: "capped_time_and_materials",
        contractedValue: "140000.00",
        startDate: new Date("2025-10-01"),
        endDate: new Date("2026-07-31"),
      },
      {
        organizationId: orgId,
        organizationUnitId: clubArranId,
        leadId: users.trusha,
        name: "ONS Census Task Force",
        shortName: "Census",
        codeName: "CENSUS",
        status: "in_delivery",
        fundingModel: "time_and_materials",
        contractedValue: "100000.00",
        startDate: new Date("2026-04-01"),
        endDate: new Date("2026-06-30"),
      },
      {
        organizationId: orgId,
        organizationUnitId: clubArranId,
        leadId: users.trusha,
        name: "SCU",
        shortName: "SCU",
        codeName: "SCU",
        status: "bidding",
        fundingModel: "time_and_materials",
        contractedValue: "200000.00",
        startDate: new Date("2026-09-01"),
        endDate: new Date("2027-03-31"),
      },
      {
        organizationId: orgId,
        organizationUnitId: clubArranId,
        leadId: users.seyed,
        name: "Asylum",
        shortName: "Asylum",
        codeName: "ASYLUM",
        status: "bid_submitted",
        fundingModel: "time_and_materials",
        contractedValue: "150000.00",
        startDate: new Date("2026-02-01"),
      },
    ])
    .onConflictDoNothing();

  const projects = await db
    .select({ id: projectsTable.id, codeName: projectsTable.codeName })
    .from(projectsTable)
    .where(eq(projectsTable.organizationId, orgId));

  const byCode = Object.fromEntries(projects.map((p) => [p.codeName, p.id]));
  console.log(`    ✓ ${projects.length} projects`);
  return byCode as Record<string, string>;
}

// ── 7. Project members ────────────────────────────────────────────────────────

async function seedProjectMembers(
  projects: Record<string, string>,
  users: UserMap,
  gradeByName: Map<string, string>,
) {
  console.log("  Seeding project members...");

  const existing = await db
    .select({ id: projectMembersTable.id })
    .from(projectMembersTable)
    .where(eq(projectMembersTable.projectId, projects["SUPPLY"] ?? ""))
    .limit(1);

  if (existing.length > 0) {
    console.log("    ↩ Project members already exist, skipping");
    return;
  }

  // Build userId → jobGradeId lookup from the USERS definitions
  const gradeIdByUserId: Record<string, string | undefined> = {};
  for (const u of USERS) {
    const userId = users[u.key];
    const gradeId = gradeByName.get(u.gradeName);
    if (!gradeId) console.warn(`    ⚠ No grade ID for "${u.gradeName}" — jobGradeId omitted for ${u.key}`);
    if (userId && gradeId) gradeIdByUserId[userId] = gradeId;
  }

  type ProjectRole = "developer" | "tech_lead" | "delivery_manager" | "analyst" | "designer" | "project_manager";
  type Member = { projectId: string; userId: string; projectRole: ProjectRole; allocatedHoursPerWeek: string; startDate: Date; endDate?: Date; jobGradeId?: string };
  const members = ([
    // Supplier Portal (SUPPLY) — sustaining
    { projectId: projects["SUPPLY"], userId: users.ali,      projectRole: "project_manager", allocatedHoursPerWeek: "10", startDate: new Date("2023-04-01") },
    { projectId: projects["SUPPLY"], userId: users.jay,      projectRole: "tech_lead",       allocatedHoursPerWeek: "20", startDate: new Date("2023-04-01") },
    { projectId: projects["SUPPLY"], userId: users.sumithra, projectRole: "developer",       allocatedHoursPerWeek: "20", startDate: new Date("2023-04-01") },
    { projectId: projects["SUPPLY"], userId: users.aaron,    projectRole: "developer",       allocatedHoursPerWeek: "20", startDate: new Date("2023-04-01") },
    { projectId: projects["SUPPLY"], userId: users.joeE,     projectRole: "developer",       allocatedHoursPerWeek: "20", startDate: new Date("2023-04-01") },
    { projectId: projects["SUPPLY"], userId: users.asha,     projectRole: "developer",       allocatedHoursPerWeek: "5",  startDate: new Date("2023-04-01") },
    // Access Your Records (AYR)
    { projectId: projects["AYR"],    userId: users.trusha,   projectRole: "project_manager", allocatedHoursPerWeek: "40", startDate: new Date("2025-09-01") },
    { projectId: projects["AYR"],    userId: users.rahat,    projectRole: "developer",       allocatedHoursPerWeek: "40", startDate: new Date("2025-09-01") },
    { projectId: projects["AYR"],    userId: users.colin,    projectRole: "developer",       allocatedHoursPerWeek: "40", startDate: new Date("2025-09-01") },
    { projectId: projects["AYR"],    userId: users.karwan,   projectRole: "developer",       allocatedHoursPerWeek: "40", startDate: new Date("2025-09-01") },
    { projectId: projects["AYR"],    userId: users.bradley,  projectRole: "analyst",         allocatedHoursPerWeek: "40", startDate: new Date("2025-09-01") },
    // Procat/SAR Replacement (PROCAT)
    { projectId: projects["PROCAT"], userId: users.sayed,    projectRole: "project_manager", allocatedHoursPerWeek: "40", startDate: new Date("2025-10-01") },
    { projectId: projects["PROCAT"], userId: users.john,     projectRole: "analyst",         allocatedHoursPerWeek: "20", startDate: new Date("2025-10-01") },
    { projectId: projects["PROCAT"], userId: users.lucian,   projectRole: "developer",       allocatedHoursPerWeek: "24", startDate: new Date("2025-10-01") },
    { projectId: projects["PROCAT"], userId: users.seyed,    projectRole: "tech_lead",       allocatedHoursPerWeek: "10", startDate: new Date("2025-10-01") },
    { projectId: projects["PROCAT"], userId: users.shamaran, projectRole: "tech_lead",       allocatedHoursPerWeek: "40", startDate: new Date("2025-10-01") },
    { projectId: projects["PROCAT"], userId: users.ross,     projectRole: "developer",       allocatedHoursPerWeek: "18", startDate: new Date("2025-10-01") },
    // ONS Census Task Force (CENSUS)
    { projectId: projects["CENSUS"], userId: users.trusha,   projectRole: "project_manager", allocatedHoursPerWeek: "20", startDate: new Date("2026-04-01") },
    { projectId: projects["CENSUS"], userId: users.dave,     projectRole: "tech_lead",       allocatedHoursPerWeek: "40", startDate: new Date("2026-04-01") },
    { projectId: projects["CENSUS"], userId: users.mani,     projectRole: "tech_lead",       allocatedHoursPerWeek: "40", startDate: new Date("2026-04-01") },
    { projectId: projects["CENSUS"], userId: users.andrew,   projectRole: "tech_lead",       allocatedHoursPerWeek: "40", startDate: new Date("2026-04-01") },
    // SCU (bidding — potential team, future start)
    { projectId: projects["SCU"],    userId: users.trusha,   projectRole: "project_manager", allocatedHoursPerWeek: "40", startDate: new Date("2026-09-01") },
    { projectId: projects["SCU"],    userId: users.dave,     projectRole: "tech_lead",       allocatedHoursPerWeek: "40", startDate: new Date("2026-09-01") },
    { projectId: projects["SCU"],    userId: users.jay,      projectRole: "developer",       allocatedHoursPerWeek: "20", startDate: new Date("2026-09-01") },
    { projectId: projects["SCU"],    userId: users.shamaran, projectRole: "tech_lead",       allocatedHoursPerWeek: "20", startDate: new Date("2026-09-01") },
    { projectId: projects["SCU"],    userId: users.aaron,    projectRole: "developer",       allocatedHoursPerWeek: "20", startDate: new Date("2026-09-01") },
  ] as Member[]).filter((m) => m.projectId && m.userId);

  await db
    .insert(projectMembersTable)
    .values(members.map((m) => ({ ...m, jobGradeId: gradeIdByUserId[m.userId] })))
    .onConflictDoNothing();
  console.log(`    ✓ ${members.length} project members`);
}

// ── 8. Evidence & endorsements ────────────────────────────────────────────────

async function seedEvidence(
  projects: Record<string, string>,
  users: UserMap,
) {
  console.log("  Seeding evidence and endorsements...");

  // Check if evidence already exists for any of the Zaizi users
  const existing = await db
    .select({ id: evidenceTable.id })
    .from(evidenceTable)
    .where(eq(evidenceTable.userId, users.jay))
    .limit(1);

  if (existing.length > 0) {
    console.log("    ↩ Evidence already exists, skipping");
    return;
  }

  const swDevSkillId  = await getSkillId("Software Development");
  const cloudSkillId  = await getSkillId("Cloud Engineering");
  const deliverySkillId = await getSkillId("Agile Delivery");
  const stakeholderSkillId = await getSkillId("Stakeholder Management");
  const solutionArchSkillId = await getSkillId("Solution Architecture");
  const reqsSkillId   = await getSkillId("Requirements Analysis");
  const testSkillId   = await getSkillId("Test Engineering");

  const evidenceRows = await db
    .insert(evidenceTable)
    .values([
      // ── Jay C (Lead Software Developer) ─────────────────────────────────
      {
        userId: users.jay,
        projectId: projects["SUPPLY"],
        version: 1,
        status: "verified",
        dataClassification: "official",
        situation: "The Supplier Portal had grown organically over three years and lacked a consistent API contract. New developers were spending significant time understanding undocumented endpoints, and minor changes regularly caused regressions in consuming services.",
        task: "Define and enforce a structured API contract across all Supplier Portal endpoints to reduce onboarding friction and regression risk.",
        action: "Introduced OpenAPI 3.1 specifications for all endpoints, set up automated contract validation in CI using Spectral, added Swagger UI to the developer environment, and ran three pairing sessions to bring the team up to speed. Established a PR checklist item to update specs before merging API changes.",
        result: "New developer onboarding time for the API layer dropped from two weeks to three days. Zero API-related regressions in the two months following rollout. The approach was adopted by two other Zaizi projects after a show-and-tell session.",
      },
      {
        userId: users.jay,
        projectId: projects["PROCAT"],
        version: 1,
        status: "submitted",
        dataClassification: "official",
        situation: "The Procat/SAR replacement project needed to integrate with three legacy government systems, each with different authentication schemes and rate limits. Integration risk was the biggest threat to the July delivery deadline.",
        task: "Design and deliver a resilient integration layer that abstracting the complexity of each legacy system behind a consistent internal interface.",
        action: "Designed an adapter pattern in TypeScript with circuit breaker logic using opossum. Implemented retry policies with exponential back-off, structured logging for all outbound calls, and a health-check dashboard so the team could monitor integration status in real time. Led code reviews across all three adapters.",
        result: "All three integrations delivered within the sprint. Zero integration failures in the first four weeks of UAT. The circuit breaker pattern prevented two legacy system outages from cascading into the Procat UI.",
      },
      {
        userId: users.jay,
        projectId: projects["SCU"],
        version: 1,
        status: "draft",
        dataClassification: "official",
        situation: "In preparation for the SCU bid, the architecture team needed technical input on feasibility for a proposed microservices decomposition of the client's existing monolith.",
        task: "Provide a structured technical assessment of the decomposition approach including risks, sequencing, and estimated effort.",
        action: "Reviewed the client's existing architecture documentation, ran a decomposition workshop with the solution architects, and drafted an ADR covering the proposed bounded contexts, migration sequencing, and key unknowns. Identified three high-risk integration points requiring further discovery.",
        result: "Draft assessment completed — still refining estimates before attaching to the bid. Flagged potential issues that changed the proposed phasing in the bid narrative.",
      },
      // ── Shamaran S (Lead Software Developer) ────────────────────────────
      {
        userId: users.shamaran,
        projectId: projects["PROCAT"],
        version: 1,
        status: "verified",
        dataClassification: "official",
        situation: "The Procat/SAR replacement system needed to process and migrate data from a 15-year-old Oracle database with inconsistent data quality, including duplicate records and missing mandatory fields.",
        task: "Lead the data migration strategy and implement the ETL pipeline that would safely move existing records into the new system.",
        action: "Built a TypeScript ETL pipeline with a three-phase approach: extraction with validation rules, transformation with a rules engine for deduplication and field normalisation, and a reconciliation step that compared record counts and checksums between source and target. Implemented idempotent runs so the migration could be re-run safely. Wrote comprehensive runbooks for the ops team.",
        result: "Migrated 340,000 records with a 99.94% success rate. The 200 records that failed were all genuine data quality issues that were logged for manual review. Migration completed over a weekend with no downtime to the existing system.",
      },
      {
        userId: users.shamaran,
        projectId: projects["PROCAT"],
        version: 1,
        status: "submitted",
        dataClassification: "official",
        situation: "The delivery team was struggling with inconsistent code quality across pull requests, leading to lengthy reviews and technical debt accumulating faster than it could be addressed.",
        task: "Establish and embed a code quality standard that the team would own and maintain, rather than one imposed top-down.",
        action: "Facilitated a team session to define quality principles, then configured ESLint, Prettier, and Husky pre-commit hooks to automate enforcement. Introduced a lightweight PR template with a quality checklist. Ran weekly code quality reviews for the first month to build the habit, then stepped back once the team was self-sustaining.",
        result: "PR review cycle time reduced by 30% within six weeks. Team-reported confidence in the codebase increased noticeably in the next retrospective. Zero linting or formatting comments in PRs after the first month.",
      },
      // ── Trusha D (Lead Delivery Manager) ────────────────────────────────
      {
        userId: users.trusha,
        projectId: projects["AYR"],
        version: 1,
        status: "verified",
        dataClassification: "official",
        situation: "Access Your Records launched with a client team that had no prior experience of agile delivery. Decision-making was slow, sprint reviews became status updates rather than feedback sessions, and the backlog was growing faster than it was being cleared.",
        task: "Build the client team's agile capability while maintaining delivery momentum on a contract with a fixed end date.",
        action: "Set up a parallel client enablement track alongside delivery: ran fortnightly retrospectives in a format the client team could take ownership of, coached the product owner on backlog management through paired grooming sessions, introduced working agreements to structure ceremonies, and created a delivery dashboard that gave the client real-time visibility without needing to attend every standup.",
        result: "By month three, the client product owner was independently running grooming sessions. Sprint velocity increased 25% as decision latency dropped. The client cited improved confidence in the delivery process in the quarterly review.",
      },
      {
        userId: users.trusha,
        projectId: projects["CENSUS"],
        version: 1,
        status: "submitted",
        dataClassification: "official",
        situation: "The ONS Census Task Force had a hard deadline driven by parliamentary reporting requirements. With three solution architects from Zaizi joining an existing ONS team, there were real risks around integration, duplication of effort, and conflicting priorities.",
        task: "Establish a clear working model between the Zaizi team and the ONS delivery leads to ensure the engagement delivered maximum value within its two-month window.",
        action: "Agreed a RACI with the ONS delivery team in the first week, set up a shared Kanban board with clear swimlanes for Zaizi and ONS work, introduced a weekly three-way sync between Zaizi leads, ONS leads, and the programme manager. Proactively escalated two emerging scope creep risks before they became blockers.",
        result: "Both agreed deliverables — the data quality framework and the migration assessment — were completed within the window. The ONS programme manager commended the collaboration model in the closing retrospective.",
      },
      {
        userId: users.trusha,
        projectId: projects["SCU"],
        version: 1,
        status: "draft",
        dataClassification: "official",
        situation: "Zaizi is bidding for the SCU digital transformation programme. As potential delivery lead I've been asked to write the delivery approach section of the bid narrative.",
        task: "Produce a compelling and credible delivery approach narrative that demonstrates Zaizi's agile credentials and addresses the client's stated concerns around governance and transparency.",
        action: "Researching the client's existing delivery culture based on the ITT and recent case studies. Drafting an approach that balances agile iteration with the reporting cadence required by a public sector programme board. Still working through the governance section.",
        result: "Draft in progress — planning to complete before the bid review on 15 June.",
      },
      // ── Dave M (Lead Solution Architect) ────────────────────────────────
      {
        userId: users.dave,
        projectId: projects["CENSUS"],
        version: 1,
        status: "verified",
        dataClassification: "official",
        situation: "ONS needed an architectural assessment of their existing data processing infrastructure ahead of the next census. The current system relied on a set of fragile batch processes that had never been formally documented.",
        task: "Produce an as-is architectural assessment and a set of prioritised recommendations for modernisation, within a two-week sprint.",
        action: "Ran a three-day discovery with ONS technical leads covering the existing batch architecture, data flows, failure modes, and operational constraints. Produced a C4 model of the current state, documented the ten most significant technical risks, and drafted a modernisation roadmap with three phased options (incremental, hybrid, full re-platform) with cost and risk profiles for each.",
        result: "Assessment delivered on time. ONS leadership used the roadmap to inform their business case for the follow-on programme. The risk register was adopted directly into the programme risk log.",
      },
      {
        userId: users.dave,
        projectId: projects["SCU"],
        version: 1,
        status: "submitted",
        dataClassification: "official",
        situation: "For the SCU bid, the client had asked for a technical architecture outline as part of the ITT response. The solution needed to demonstrate alignment with GDS principles and the client's existing technology landscape.",
        task: "Author the technical architecture section of the bid, proposing a cloud-native solution that would meet the client's interoperability and security requirements.",
        action: "Reviewed the client's existing technology estate from publicly available sources and the ITT documentation. Proposed a modular architecture based on a shared API gateway, event-driven integration for downstream systems, and a data mesh approach for the client's fragmented reporting requirements. Mapped each architectural decision to a GDS service standard point.",
        result: "Technical architecture section submitted as part of the bid response. Awaiting client feedback — the narrative was described by the bid lead as the strongest technical response the team had produced.",
      },
      // ── Bradley R (Senior Business Analyst) ─────────────────────────────
      {
        userId: users.bradley,
        projectId: projects["AYR"],
        version: 1,
        status: "verified",
        dataClassification: "official",
        situation: "The Access Your Records team had a backlog of 60 user stories inherited from an earlier discovery, many of which were poorly defined and lacked acceptance criteria. Sprint planning sessions were running over time and the team regularly carried stories across sprints because the definitions were unclear.",
        task: "Conduct a backlog refinement programme to bring stories up to a consistently high standard before the first delivery sprint.",
        action: "Introduced a story definition standard with a three-point acceptance criteria format, ran a workshop with the team to apply it retrospectively to the top 30 stories, introduced a refinement ceremony as a standing weekly slot, and paired with developers during the first two sprints to catch ambiguities early.",
        result: "Story rejection rate in sprint planning dropped from 40% to under 5% within a month. Planning sessions returned to their allotted time. The three-point AC format was adopted as standard across the project.",
      },
      {
        userId: users.bradley,
        projectId: projects["AYR"],
        version: 1,
        status: "submitted",
        dataClassification: "official",
        situation: "Several users in the research cohort were vulnerable adults accessing sensitive personal health records. The user research plan needed to account for safeguarding requirements that were more stringent than standard GDS guidance.",
        task: "Design a research protocol for vulnerable user groups that met both the client's safeguarding policy and GDS accessibility standards.",
        action: "Consulted the client's safeguarding lead and GDS accessibility guidance, then drafted a participant screening questionnaire, a researcher briefing pack, and a debrief protocol. Ran the protocol past the client legal team and iterated based on their feedback. Trained two junior researchers on the protocol before the first sessions.",
        result: "Six research sessions completed with zero safeguarding incidents. The protocol was shared with the GDS research community as a reusable template. One participant thanked the team specifically for the care taken in the debrief.",
      },
      // ── Martins I (Senior Test Engineer) ────────────────────────────────
      {
        userId: users.martins,
        projectId: projects["SUPPLY"],
        version: 1,
        status: "submitted",
        dataClassification: "official",
        situation: "The Supplier Portal's test coverage had degraded over three years. End-to-end tests were flaky, failing on roughly one in five CI runs for reasons unrelated to the code under test, which had eroded team trust in the suite.",
        task: "Diagnose and resolve the root causes of test flakiness, and establish a quality bar to prevent regression.",
        action: "Audited the 200 existing E2E tests and categorised failures by cause: timing issues (45%), environment dependencies (35%), and test data conflicts (20%). Refactored the timing-sensitive tests to use explicit wait strategies, containerised test dependencies using Docker Compose, and introduced a test data factory pattern to eliminate shared state. Added a flakiness tracking metric to the CI dashboard.",
        result: "Flaky test rate dropped from 20% to under 2% within six weeks. Team confidence in the suite recovered — the first time a new feature was blocked by the suite catching a real regression, the team celebrated. CI pipeline reliability improved noticeably.",
      },
    ])
    .returning({ id: evidenceTable.id, userId: evidenceTable.userId });

  console.log(`    ✓ ${evidenceRows.length} evidence entries`);

  // ── Evidence skill tags ──────────────────────────────────────────────────────

  const jayEv   = evidenceRows.filter((e) => e.userId === users.jay);
  const shamaranEv = evidenceRows.filter((e) => e.userId === users.shamaran);
  const trushaEv = evidenceRows.filter((e) => e.userId === users.trusha);
  const daveEv  = evidenceRows.filter((e) => e.userId === users.dave);
  const bradleyEv = evidenceRows.filter((e) => e.userId === users.bradley);
  const martinsEv = evidenceRows.filter((e) => e.userId === users.martins);

  const skillLinks: Array<{ evidenceId: string; skillId: string; levelClaimed: string; isPrimary: boolean }> = [];

  const push = (ev: { id: string } | undefined, skillId: string | null, level: string, primary = false) => {
    if (ev && skillId) skillLinks.push({ evidenceId: ev.id, skillId, levelClaimed: level, isPrimary: primary });
  };

  push(jayEv[0], swDevSkillId, "lead", true);
  push(jayEv[1], swDevSkillId, "lead", true);
  push(jayEv[2], swDevSkillId, "lead", true);
  push(shamaranEv[0], swDevSkillId, "lead", true);
  push(shamaranEv[1], swDevSkillId, "lead", true);
  push(trushaEv[0], deliverySkillId, "lead", true);
  push(trushaEv[0], stakeholderSkillId, "lead", false);
  push(trushaEv[1], deliverySkillId, "lead", true);
  push(trushaEv[1], stakeholderSkillId, "lead", false);
  push(trushaEv[2], deliverySkillId, "lead", true);
  push(daveEv[0], solutionArchSkillId, "lead", true);
  push(daveEv[1], solutionArchSkillId, "lead", true);
  push(bradleyEv[0], reqsSkillId, "senior", true);
  push(bradleyEv[1], reqsSkillId, "senior", true);
  push(martinsEv[0], testSkillId, "senior", true);

  if (skillLinks.length > 0) {
    await db
      .insert(evidenceSkillsTable)
      .values(skillLinks.map((l) => ({
        evidenceId: l.evidenceId,
        skillId: l.skillId,
        levelClaimed: l.levelClaimed as any,
        isPrimary: l.isPrimary,
      })))
      .onConflictDoNothing();
  }

  // ── Endorsements ─────────────────────────────────────────────────────────────

  const endorsements: Array<{
    evidenceId: string;
    endorserId: string;
    isSuggested: boolean;
    status: "pending" | "endorsed" | "skipped" | "flagged";
    note?: string;
    respondedAt?: Date;
  }> = [];

  const addEndorsement = (
    ev: { id: string } | undefined,
    endorserId: string,
    status: "pending" | "endorsed" | "skipped" | "flagged",
    note?: string,
    respondedAt?: Date,
  ) => {
    if (!ev || !endorserId) return;
    endorsements.push({ evidenceId: ev.id, endorserId, isSuggested: true, status, note, respondedAt });
  };

  // Jay's verified evidence — both endorsed
  addEndorsement(jayEv[0], users.seyed, "endorsed", "Jay's API contract work on Supplier Portal set a standard that the whole team adopted. Clear example of technical leadership at lead level.", new Date("2026-01-15"));
  addEndorsement(jayEv[0], users.shamaran, "endorsed", "I reviewed the OpenAPI specs as they were written — thorough, well-structured, and immediately useful. Strongly endorsed.", new Date("2026-01-17"));
  // Jay's submitted — one pending, one endorsed
  addEndorsement(jayEv[1], users.seyed, "endorsed", "The integration adapters Jay built are some of the most robust code in the codebase. The circuit breaker saved us twice already.", new Date("2026-03-10"));
  addEndorsement(jayEv[1], users.trusha, "pending");
  // Shamaran's verified — both endorsed
  addEndorsement(shamaranEv[0], users.jay, "endorsed", "Shamaran's ETL pipeline was a textbook example of how to approach a high-stakes migration safely. The reconciliation step was particularly well thought through.", new Date("2026-02-20"));
  addEndorsement(shamaranEv[0], users.sayed, "endorsed", "Delivered a complex migration over a weekend with no downtime and near-perfect accuracy. Outstanding work.", new Date("2026-02-22"));
  // Shamaran's submitted — pending
  addEndorsement(shamaranEv[1], users.jay, "pending");
  addEndorsement(shamaranEv[1], users.joeE, "pending");
  // Trusha's verified — both endorsed
  addEndorsement(trushaEv[0], users.jaie, "endorsed", "Trusha's approach to building client capability on AYR has been a model for how we should run agile enablement. The client team can now run their own ceremonies independently.", new Date("2026-04-05"));
  addEndorsement(trushaEv[0], users.sayed, "endorsed", "I saw the difference in how the client product owner engaged in planning meetings before and after Trusha's coaching. Night and day.", new Date("2026-04-08"));
  // Trusha's submitted — pending
  addEndorsement(trushaEv[1], users.jaie, "pending");
  addEndorsement(trushaEv[1], users.gordon, "pending");
  // Dave's verified — endorsed + skipped
  addEndorsement(daveEv[0], users.seyed, "endorsed", "Dave's as-is assessment was exactly what ONS needed — clear, structured, and actionable. The C4 model became the reference diagram for the programme.", new Date("2026-05-01"));
  addEndorsement(daveEv[0], users.mani, "endorsed", "The three-option roadmap gave the client a real choice rather than a single recommendation. That's how architecture advice should be given.", new Date("2026-05-02"));
  // Bradley's verified — both endorsed
  addEndorsement(bradleyEv[0], users.trusha, "endorsed", "Bradley transformed a messy backlog into something the whole team could work from confidently. The story refinement ceremony he introduced is now part of how we kick off all projects.", new Date("2026-03-20"));
  addEndorsement(bradleyEv[0], users.john, "endorsed", "The three-point AC format Bradley introduced on AYR is the clearest I've seen. Strongly recommended as a standard practice.", new Date("2026-03-22"));
  // Bradley's submitted — pending
  addEndorsement(bradleyEv[1], users.trusha, "pending");
  // Martins' submitted — pending + flagged
  addEndorsement(martinsEv[0], users.jay, "pending");
  addEndorsement(martinsEv[0], users.joeE, "flagged", "I wasn't directly involved in the test suite work on Supplier Portal — you'd be better asking Jay or Asha for this one.", new Date("2026-04-15"));

  if (endorsements.length > 0) {
    await db.insert(endorsementsTable).values(endorsements).onConflictDoNothing();
  }

  console.log(`    ✓ ${skillLinks.length} skill links, ${endorsements.length} endorsements`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding Zaizi dev data...\n");

  try {
    const hashedPassword = await hashPassword("Password123!");

    const { orgId, clubs } = await seedOrg();
    const users = await seedUsers(orgId, hashedPassword);
    const gradeByName = await seedGrades(orgId);
    await seedGradeAssignments(orgId, users, gradeByName);
    await seedRelationships(orgId, users);
    const projects = await seedProjects(orgId, clubs.arran, users);
    await seedProjectMembers(projects, users, gradeByName);
    await seedEvidence(projects, users);

    console.log("\n✅ Zaizi dev seed complete.");
  } catch (err) {
    console.error("\n❌ Dev seed failed:", err);
    process.exit(1);
  }
}

main();
