import { pgTable, uuid, text, boolean, date } from "drizzle-orm/pg-core";
import {
  competencyTypeEnum,
  competencyProficiencyEnum,
  competencyDispositionEnum,
} from "./enums";
import { usersTable } from "./users";
import { organizationsTable } from "./organizations";
import { timestamps } from "../columns.helpers";

export const competenciesTable = pgTable("competencies", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid()
    .notNull()
    .references(() => usersTable.id),
  name: text().notNull(),
  competency_type: competencyTypeEnum().notNull(),
  proficiency: competencyProficiencyEnum().notNull(),
  disposition: competencyDispositionEnum().notNull().default("neutral"),
  disposition_note: text(),
  last_used_at: date(),
  is_inferred: boolean().notNull().default(false),
  external_id: text(),
  external_source: text(),
  organization_id: uuid()
    .notNull()
    .references(() => organizationsTable.id),
});

export const credentialsTable = pgTable("credentials", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid()
    .notNull()
    .references(() => usersTable.id),
  name: text().notNull(),
  issuer: text().notNull(),
  issued_at: date(),
  expires_at: date(),
  credential_url: text(),
  external_id: text(),
  external_source: text(),
  ...timestamps,
});
