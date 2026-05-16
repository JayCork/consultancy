import { and, count, eq, isNull } from "drizzle-orm";
import { organizationsTable, organizationUnitsTable } from "../schema";
import { db } from "..";

export async function getOrganisationCount(): Promise<number> {
  const result = await db.select({ count: count() }).from(organizationsTable);
  return Number(result[0].count);
}

export async function getOrganizationUnits(organizationId: string) {
  return db
    .select()
    .from(organizationUnitsTable)
    .where(
      and(
        eq(organizationUnitsTable.organizationId, organizationId),
        isNull(organizationUnitsTable.deletedAt),
      ),
    );
}
