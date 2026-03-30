import { drizzle } from "drizzle-orm/node-postgres";
import { hashPassword } from "better-auth/crypto";
import {
  // Auth tables
  user as authUserTable,
  account as authAccountTable,
  session as authSessionTable,
  verification as authVerificationTable,
  ssoProvider as authSsoProviderTable,
  // Domain tables
  organizationsTable,
  projectsTable,
  skillsTable,
  skillsLevelTable,
  usersTable,
  evidenceTable,
  feedbackTable,
  auditLogsTable,
  frameworkMappingsTable,
  externalSkillsTable,
  externalFrameworksTable,
  userProjectRolesTable,
  userRelationshipsTable,
  relationshipRolesTable,
  clearancesTable,
  visasTable,
  userCitizenshipTable,
  residentialAddressesTable,
  jobRolesTable,
  roleSkillRequirementsTable,
  userRoleAssignmentsTable,
} from "../schema";
import {
  SEED_PROJECTS,
  generateSkillLevels,
  generateSkills,
  generateUsers,
  generateJobRoles,
  generateRoleSkillRequirements,
} from "./seed.generator";

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  // Clear domain tables in FK-safe order (leaf first)
  await db.delete(feedbackTable);
  await db.delete(auditLogsTable);
  await db.delete(evidenceTable);
  await db.delete(userRoleAssignmentsTable);
  await db.delete(roleSkillRequirementsTable);
  await db.delete(jobRolesTable);
  await db.delete(userProjectRolesTable);
  await db.delete(relationshipRolesTable);
  await db.delete(userRelationshipsTable);
  await db.delete(clearancesTable);
  await db.delete(visasTable);
  await db.delete(userCitizenshipTable);
  await db.delete(residentialAddressesTable);
  await db.delete(frameworkMappingsTable);
  await db.delete(skillsLevelTable);
  await db.delete(externalSkillsTable);
  await db.delete(externalFrameworksTable);
  await db.delete(skillsTable);
  await db.delete(projectsTable);
  await db.delete(usersTable);
  await db.delete(organizationsTable);

  // Clear auth tables (sessions and accounts before users)
  await db.delete(authSessionTable);
  await db.delete(authAccountTable);
  await db.delete(authVerificationTable);
  await db.delete(authSsoProviderTable);
  await db.delete(authUserTable);

  console.log("Tables cleared.");

  // Organisation — must exist before users
  const [org] = await db
    .insert(organizationsTable)
    .values({ name: "Demo Consultancy" })
    .returning();

  // Demo auth user — this account can be used to sign in to the app
  const demoAuthUserId = crypto.randomUUID();
  const hashedPassword = await hashPassword("Password123!");

  await db.insert(authUserTable).values({
    id: demoAuthUserId,
    name: "Demo User",
    email: "example@demo.com",
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await db.insert(authAccountTable).values({
    id: crypto.randomUUID(),
    accountId: demoAuthUserId,
    providerId: "credential",
    userId: demoAuthUserId,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Domain user record for the demo auth user
  const demoDomainUserId = crypto.randomUUID();
  const demoUser: typeof usersTable.$inferInsert = {
    id: demoDomainUserId,
    auth_user_id: demoAuthUserId,
    organisation_id: org.id,
    name: "Demo User",
    email: "example@demo.com",
    role: "Senior Developer",
    is_contractor: false,
  };

  // 9 additional random domain users (not loginable, used for peer-review/bid data)
  const mockUsers = generateUsers(9, org.id);
  await db.insert(usersTable).values([demoUser, ...mockUsers]);
  console.log("10 users created (1 loginable demo user + 9 sample users)!");

  await db.insert(projectsTable).values(SEED_PROJECTS);
  console.log(`${SEED_PROJECTS.length} projects created!`);

  const skills = await db
    .insert(skillsTable)
    .values(generateSkills())
    .returning();
  console.log(`${skills.length} skills created!`);

  const allLevels: { id: string; skill_id: string; level_number: number }[] =
    [];
  for (const skill of skills) {
    const levels = await db
      .insert(skillsLevelTable)
      .values(generateSkillLevels(skill.name, skill.id))
      .returning();
    allLevels.push(...levels);
  }
  console.log(`${allLevels.length} skill levels created!`);

  const roles = await db
    .insert(jobRolesTable)
    .values(generateJobRoles(org.id))
    .returning();
  console.log(`${roles.length} job roles created!`);

  const requirements = generateRoleSkillRequirements(roles, skills, allLevels);
  if (requirements.length > 0) {
    await db.insert(roleSkillRequirementsTable).values(requirements);
  }
  console.log(`${requirements.length} role skill requirements created!`);

  // Assign the demo user to the Senior Developer role
  const seniorDevRole = roles.find((r) => r.name === "Senior Developer");
  if (seniorDevRole) {
    await db.insert(userRoleAssignmentsTable).values({
      user_id: demoDomainUserId,
      role_id: seniorDevRole.id,
      is_current: true,
    });
    console.log("Role assignment created for demo user (Senior Developer)!");
  }

  console.log("\n--- Demo login credentials ---");
  console.log("Email:    example@demo.com");
  console.log("Password: Password123!");
  console.log("------------------------------\n");
}

main();
