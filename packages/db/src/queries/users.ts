import { eq, desc } from "drizzle-orm";
import { db } from "..";
import { usersTable, userClearancesTable, clearanceLevelsTable } from "../schema";

const getAllUsers = async () => {
  return db.select().from(usersTable);
};

export const getUserById = async (id: string) => {
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, id))
    .limit(1);
  return user[0];
};

export const getUserByAuthId = async (authId: string) => {
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.betterAuthId, authId))
    .limit(1);
  return user[0];
};

export const getUserClearanceByAuthId = async (authId: string) => {
  const [row] = await db
    .select({
      shortName: clearanceLevelsTable.shortName,
      name: clearanceLevelsTable.name,
      rank: clearanceLevelsTable.rank,
      expiresAt: userClearancesTable.expiresAt,
      grantedAt: userClearancesTable.grantedAt,
    })
    .from(usersTable)
    .innerJoin(
      userClearancesTable,
      eq(userClearancesTable.userId, usersTable.id),
    )
    .innerJoin(
      clearanceLevelsTable,
      eq(userClearancesTable.clearanceLevelId, clearanceLevelsTable.id),
    )
    .where(eq(usersTable.betterAuthId, authId))
    .orderBy(desc(userClearancesTable.grantedAt))
    .limit(1);

  return row ?? null;
};

export { getAllUsers };
