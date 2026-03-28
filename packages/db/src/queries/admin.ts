import { eq, and, count } from "drizzle-orm";
import { db } from "..";
import {
  organizationsTable,
  jobRolesTable,
  roleSkillRequirementsTable,
  skillsTable,
  skillsLevelTable,
  userRoleAssignmentsTable,
} from "../schema";

export const getOrgConfig = async () => {
  const [org] = await db.select().from(organizationsTable).limit(1);
  return org ?? null;
};

export const getJobRolesWithRequirements = async (orgId: string) => {
  const roles = await db
    .select()
    .from(jobRolesTable)
    .where(eq(jobRolesTable.organisation_id, orgId))
    .orderBy(jobRolesTable.seniority_level, jobRolesTable.name);

  return Promise.all(
    roles.map(async (role) => {
      const requirements = await db
        .select({
          skill_name: skillsTable.name,
          level_number: skillsLevelTable.level_number,
          criteria: skillsLevelTable.criteria,
        })
        .from(roleSkillRequirementsTable)
        .innerJoin(
          skillsTable,
          eq(roleSkillRequirementsTable.skill_id, skillsTable.id),
        )
        .innerJoin(
          skillsLevelTable,
          eq(roleSkillRequirementsTable.level_id, skillsLevelTable.id),
        )
        .where(eq(roleSkillRequirementsTable.role_id, role.id))
        .orderBy(skillsTable.name);

      const [{ value: user_count }] = await db
        .select({ value: count() })
        .from(userRoleAssignmentsTable)
        .where(
          and(
            eq(userRoleAssignmentsTable.role_id, role.id),
            eq(userRoleAssignmentsTable.is_current, true),
          ),
        );

      return { ...role, requirements, user_count };
    }),
  );
};
