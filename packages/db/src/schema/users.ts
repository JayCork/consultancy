import {
  pgTable,
  uuid,
  text,
  timestamp,
  uniqueIndex,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { organizationsTable } from "./organizations";
import { clearanceLevelsTable } from "./reference";
import { user } from "./auth";

export const usersTable = pgTable(
  "users",
  {
    id: uuid().primaryKey().defaultRandom(),
    organization_id: uuid()
      .notNull()
      .references(() => organizationsTable.id),
    name: text().notNull(),
    email: text().notNull().unique(),
    external_id: text(),
    external_source: text(),
    better_auth_id: text()
      .notNull()
      .unique()
      .references(() => user.id),
  },
  (table) => [
    uniqueIndex("users_org_external_unique").on(
      table.organization_id,
      table.external_source,
      table.external_id,
    ),
  ],
);

export const userClearancesTable = pgTable("user_clearances", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid()
    .notNull()
    .references(() => usersTable.id),
  clearance_level_id: uuid()
    .notNull()
    .references(() => clearanceLevelsTable.id),
  granted_at: timestamp().notNull(),
  expires_at: timestamp(),
});
