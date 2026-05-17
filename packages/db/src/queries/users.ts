import { eq } from "drizzle-orm";
import { db } from "..";
import { usersTable } from "../schema";

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

export { getAllUsers };
