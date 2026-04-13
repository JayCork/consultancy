import { AnyPgTable } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm/sql/expressions/conditions";

export async function getItemIdByNameFromTable(
  database: any,
  table: AnyPgTable & { id: any; name: any },
  name: string,
): Promise<string | null> {
  const [result] = await database
    .select({ id: table.id })
    .from(table)
    .where(eq(table.name, name));
  return result ? result.id : null;
}
