import { eq, isNull, asc, and, or } from "drizzle-orm";
import {
  competenciesTable,
  db,
  userGradeAssignmentsTable,
  jobGradesTable,
  frameworkRolesTable,
  frameworkRoleSkillExpectationsTable,
  skillsTable,
  skillsLevelsTable,
} from "..";

export const getAllSkills = async () => {
  return db
    .select()
    .from(competenciesTable)
    .orderBy(asc(competenciesTable.dispositionNote));
};

export const getUsersFrameworkSkills = async (internalUserId: string) => {
  return db
    .select({
      skill: skillsTable,
      minimumLevel: frameworkRoleSkillExpectationsTable.minimumLevel,
      isPrimary: frameworkRoleSkillExpectationsTable.isPrimary,
    })
    .from(userGradeAssignmentsTable)
    .innerJoin(
      jobGradesTable,
      eq(userGradeAssignmentsTable.jobGradeId, jobGradesTable.id),
    )
    .innerJoin(
      frameworkRolesTable,
      eq(jobGradesTable.frameworkRoleId, frameworkRolesTable.id),
    )
    .innerJoin(
      frameworkRoleSkillExpectationsTable,
      eq(
        frameworkRoleSkillExpectationsTable.frameworkRoleId,
        frameworkRolesTable.id,
      ),
    )
    .innerJoin(
      skillsTable,
      eq(frameworkRoleSkillExpectationsTable.skillId, skillsTable.id),
    )
    .where(
      and(
        eq(userGradeAssignmentsTable.userId, internalUserId),
        isNull(userGradeAssignmentsTable.endDate),
      ),
    )
    .orderBy(asc(skillsTable.name));
};

export const getAllOrgSkills = async (orgId: string) => {
  return db
    .select()
    .from(skillsTable)
    .where(eq(skillsTable.organizationId, orgId))
    .orderBy(asc(skillsTable.name));
};

export const getOrgSkillById = async (skillId: string, orgId: string) => {
  const [skill] = await db
    .select()
    .from(skillsTable)
    .where(and(eq(skillsTable.id, skillId), eq(skillsTable.organizationId, orgId)))
    .limit(1);
  return skill ?? null;
};

export const getSkillLevels = async (skillId: string) => {
  return db
    .select()
    .from(skillsLevelsTable)
    .where(eq(skillsLevelsTable.skillId, skillId))
    .orderBy(asc(skillsLevelsTable.level));
};

// Returns platform default skills (null org_id) plus any org-specific skills.
// Additive: org customs never replace the defaults, only extend them.
export const getSkillsForOrg = async (orgId: string) => {
  return db
    .select()
    .from(skillsTable)
    .where(or(isNull(skillsTable.organizationId), eq(skillsTable.organizationId, orgId)))
    .orderBy(asc(skillsTable.name));
};
