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
      name: frameworkRolesTable.displayName,
      seniority_level: frameworkRolesTable.level,
      job_grade: jobGradesTable.name,
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
    .where(
      and(
        eq(userGradeAssignmentsTable.userId, internalUserId),
        isNull(userGradeAssignmentsTable.endDate),
      ),
    )
    .limit(1);

  return row ?? null;
};
