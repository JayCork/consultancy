import { clearancesTable, usersTable } from "../schema/schema";
import { eq, and, or, isNull, gt, InferSelectModel } from "drizzle-orm";
import { db } from "../../index";

type ClearanceLevel = InferSelectModel<typeof clearancesTable>["level"];
const getAllUsers = async () => {
  return db.select().from(usersTable);
};

const getUserByClearance = async (clearance: ClearanceLevel) => {
  const users = await db
    .select()
    .from(usersTable)
    .innerJoin(clearancesTable, eq(usersTable.id, clearancesTable.user_id))
    .where(
      and(
        eq(clearancesTable.level, clearance),
        or(
          isNull(clearancesTable.expires_at),
          gt(clearancesTable.expires_at, new Date()),
        ),
      ),
    );
  return users;
};

export const getUserById = async (id: string) => {
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, id))
    .limit(1);
  return user[0];
};

export { getAllUsers, getUserByClearance };
