import { db } from "..";
import { organizationsTable } from "../schema";

export const getOrgConfig = async () => {
  // const [org] = await db.select().from(organizationsTable).limit(1);
  // return org ?? null;
  const org = await db
    .select()
    .from(organizationsTable)
    .limit(1)
    .then((rows) => rows[0] || null);
  return org;
};
