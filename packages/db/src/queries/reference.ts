import { db } from "..";
import { clearanceLevelsTable } from "../schema";
import { asc } from "drizzle-orm";

export const getClearanceLevels = async () => {
  return db
    .select()
    .from(clearanceLevelsTable)
    .orderBy(asc(clearanceLevelsTable.rank));
};
