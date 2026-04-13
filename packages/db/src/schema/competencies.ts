import {
  pgTable,
  uuid,
  text,
  boolean,
  date,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import {
  competencyTypeEnum,
  competencyProficiencyEnum,
  competencyDispositionEnum,
  competencySourceEnum,
} from "./enums";
import { usersTable } from "./users";
import { organizationsTable } from "./organizations";
import { timestamps } from "../columns.helpers";
import { skillsTable } from "./skills";
import { create } from "domain";

export const competenciesTable = pgTable(
  "competencies",
  {
    id: uuid().primaryKey().defaultRandom(),
    user_id: uuid()
      .notNull()
      .references(() => usersTable.id),
    skill_id: uuid()
      .notNull()
      .references(() => skillsTable.id),
    organization_id: uuid()
      .notNull()
      .references(() => organizationsTable.id),
    proficiency: competencyProficiencyEnum().notNull(),
    disposition: competencyDispositionEnum().notNull().default("neutral"),
    disposition_note: text(),
    source: competencySourceEnum().notNull().default("self_reported"),
    last_used_at: date(),
    external_id: text(),
    external_source: text(),
    created_at: timestamps.created_at,
    updated_at: timestamps.updated_at,
  },
  (table) => [
    uniqueIndex("competencies_user_skill_unique").on(
      table.user_id,
      table.skill_id,
    ),
  ],
);

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
