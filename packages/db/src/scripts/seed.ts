import { drizzle } from "drizzle-orm/node-postgres";
import {
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
} from "./seed.generator";

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  // Clear in FK-safe order (leaf tables first) before re-seeding
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
  console.log("Tables cleared.");

  // Must exist before users
  const [org] = await db
    .insert(organizationsTable)
    .values({ name: "Demo Consultancy" })
    .returning();

  const mockUsers = generateUsers(10, org.id);
  await db.insert(usersTable).values(mockUsers);
  console.log("10 users created!");

  await db.insert(projectsTable).values(SEED_PROJECTS);
  console.log(`${SEED_PROJECTS.length} projects created!`);

  const skills = await db
    .insert(skillsTable)
    .values(generateSkills())
    .returning();
  console.log(`${skills.length} skills created!`);

  for (const skill of skills) {
    const levels = generateSkillLevels(skill.name, skill.id);
    await db.insert(skillsLevelTable).values(levels);
  }
  console.log("Skill levels created!");
}

main();
