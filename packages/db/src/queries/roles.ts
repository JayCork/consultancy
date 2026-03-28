import { eq, and } from "drizzle-orm";
import { db } from "..";
import { userRoleAssignmentsTable, jobRolesTable } from "../schema";

export const getCurrentRoleForUser = async (internalUserId: string) => {
  const [row] = await db
    .select({
      name: jobRolesTable.name,
      seniority_level: jobRolesTable.seniority_level,
    })
    .from(userRoleAssignmentsTable)
    .innerJoin(
      jobRolesTable,
      eq(userRoleAssignmentsTable.role_id, jobRolesTable.id),
    )
    .where(
      and(
        eq(userRoleAssignmentsTable.user_id, internalUserId),
        eq(userRoleAssignmentsTable.is_current, true),
      ),
    )
    .limit(1);

  return row ?? null;
};
