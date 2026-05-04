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
    .orderBy(asc(competenciesTable.name));
};

export const getUsersFrameworkSkills = async (internalUserId: string) => {
  return db
    .select({
      skill: referenceSkillsTable,
      minimum_level: frameworkRoleSkillExpectationsTable.minimum_level,
      is_primary: frameworkRoleSkillExpectationsTable.is_primary,
    })
    .from(userGradeAssignmentsTable)
    .innerJoin(
      jobGradesTable,
      eq(userGradeAssignmentsTable.job_grade_id, jobGradesTable.id),
    )
    .innerJoin(
      frameworkRolesTable,
      eq(jobGradesTable.framework_role_id, frameworkRolesTable.id),
    )
    .innerJoin(
      frameworkRoleSkillExpectationsTable,
      eq(
        frameworkRoleSkillExpectationsTable.framework_role_id,
        frameworkRolesTable.id,
      ),
    )
    .innerJoin(
      referenceSkillsTable,
      eq(
        frameworkRoleSkillExpectationsTable.reference_skill_id,
        referenceSkillsTable.id,
      ),
    )
    .where(
      and(
        eq(userGradeAssignmentsTable.user_id, internalUserId),
        isNull(userGradeAssignmentsTable.end_date),
      ),
    )
    .orderBy(asc(referenceSkillsTable.name));
};

export const getAllOrgSkills = async (orgId: string) => {
  return db
    .select()
    .from(skillsTable)
    .where(eq(skillsTable.organization_id, orgId))
    .orderBy(asc(skillsTable.name));
};

export const getOrgSkillById = async (skillId: string, orgId: string) => {
  const [skill] = await db
    .select()
    .from(skillsTable)
    .where(and(eq(skillsTable.id, skillId), eq(skillsTable.organization_id, orgId)))
    .limit(1);
  return skill ?? null;
};

export const getSkillLevels = async (skillId: string) => {
  return db
    .select()
    .from(skillsLevelsTable)
    .where(eq(skillsLevelsTable.skill_id, skillId))
    .orderBy(asc(skillsLevelsTable.level));
};
