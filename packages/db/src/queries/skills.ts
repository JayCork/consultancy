import { eq, isNull, asc, and } from "drizzle-orm";
import {
  competenciesTable,
  db,
  userGradeAssignmentsTable,
  jobGradesTable,
  frameworkRolesTable,
  frameworkRoleSkillExpectationsTable,
  referenceSkillsTable,
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
      skill: referenceSkillsTable,
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
      referenceSkillsTable,
      eq(
        frameworkRoleSkillExpectationsTable.referenceSkillId,
        referenceSkillsTable.id,
      ),
    )
    .where(
      and(
        eq(userGradeAssignmentsTable.userId, internalUserId),
        isNull(userGradeAssignmentsTable.endDate),
      ),
    )
    .orderBy(asc(referenceSkillsTable.name));
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
