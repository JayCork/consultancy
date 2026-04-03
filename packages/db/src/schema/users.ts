import { timestamps } from "../columns.helpers";
import { clearancesTable, organizationsTable } from "../schema.old";
import {
  uuid,
  pgTable,
  varchar,
  timestamp,
  boolean,
  text,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  organisation_id: uuid()
    .notNull()
    .references(() => organizationsTable.id),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  current_clearance_id: uuid().references(() => clearancesTable.id),
  external_id: text(), // e.g. Auth0 user ID, Okta user ID, Azure AD user ID
  external_source: text(), // e.g. auth0, okta, azure_ad
  ...timestamps,
});
