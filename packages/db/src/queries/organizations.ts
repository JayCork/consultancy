import { count } from "drizzle-orm";
import { organizationsTable } from "../schema";
import { db } from "..";

export async function getOrganisationCount(): Promise<number> {
  const result = await db.select({ count: count() }).from(organizationsTable);
  return Number(result[0].count);
}
