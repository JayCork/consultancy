import {
  pgTable,
  uuid,
  text,
  date,
  uniqueIndex,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { organizationsTable } from "./organizations";
import { clearanceLevelsTable } from "./reference";

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  organization_id: uuid().notNull().references(() => organizationsTable.id),
  name: text().notNull(),
  email: text().notNull().unique(),
  // Denormalised for fast clearance checks. Forward ref resolved via AnyPgColumn.
  current_clearance_id: uuid().references((): AnyPgColumn => userClearancesTable.id),
  external_id: text(),
  external_source: text(),
}, (table) => [
  uniqueIndex("users_org_external_unique").on(
    table.organization_id,
    table.external_source,
    table.external_id,
  ),
]);

export const userClearancesTable = pgTable("user_clearances", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid().notNull().references(() => usersTable.id),
  clearance_level_id: uuid().notNull().references(() => clearanceLevelsTable.id),
  granted_at: date().notNull(),
  expires_at: date(),
});
