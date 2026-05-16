import { and, eq, isNull, gt, or } from "drizzle-orm";
import { db } from "..";
import { userRelationshipsTable } from "../schema";

/**
 * Returns true if an active relationship exists between the two users in
 * either direction (actor→target or target→actor).
 */
export const hasActiveRelationship = async (
  userAId: string,
  userBId: string,
): Promise<boolean> => {
  const today = new Date().toISOString().split("T")[0];

  const [rel] = await db
    .select({ id: userRelationshipsTable.id })
    .from(userRelationshipsTable)
    .where(
      and(
        or(
          and(
            eq(userRelationshipsTable.actorId, userAId),
            eq(userRelationshipsTable.targetId, userBId),
          ),
          and(
            eq(userRelationshipsTable.actorId, userBId),
            eq(userRelationshipsTable.targetId, userAId),
          ),
        ),
        or(
          isNull(userRelationshipsTable.endDate),
          gt(userRelationshipsTable.endDate, today),
        ),
      ),
    )
    .limit(1);

  return !!rel;
};
