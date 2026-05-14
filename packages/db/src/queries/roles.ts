import { eq, and, isNull } from "drizzle-orm";
import { db } from "..";
import {
  userGradeAssignmentsTable,
  jobGradesTable,
  frameworkRolesTable,
} from "../schema";

export const getCurrentRoleForUser = async (internalUserId: string) => {
  const [row] = await db
    .select({
      name: frameworkRolesTable.display_name,
      seniority_level: frameworkRolesTable.level,
      job_grade: jobGradesTable.name,
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
    .where(
      and(
        eq(userGradeAssignmentsTable.user_id, internalUserId),
        isNull(userGradeAssignmentsTable.end_date),
      ),
    )
    .limit(1);

  return row ?? null;
};
