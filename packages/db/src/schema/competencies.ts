import {
  pgTable,
  uuid,
  text,
  date,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import {
  competencyProficiencyEnum,
  competencyDispositionEnum,
  competencySourceEnum,
} from "./enums";
import { usersTable } from "./users";
import { organizationsTable } from "./organizations";
import { timestamps } from "../columns.helpers";
import { skillsTable } from "./skills";

export const competenciesTable = pgTable(
  "competencies",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id),
    skillId: uuid("skill_id")
      .notNull()
      .references(() => skillsTable.id),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizationsTable.id),
    proficiency: competencyProficiencyEnum().notNull(),
    disposition: competencyDispositionEnum().notNull().default("neutral"),
    dispositionNote: text("disposition_note"),
    source: competencySourceEnum().notNull().default("self_reported"),
    lastUsedAt: date("last_used_at"),
    externalId: text("external_id"),
    externalSource: text("external_source"),
    createdAt: timestamps.createdAt,
    updatedAt: timestamps.updatedAt,
  },
  (table) => [
    uniqueIndex("competencies_user_skill_unique").on(
      table.userId,
      table.skillId,
    ),
  ],
);

export const credentialsTable = pgTable("credentials", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),
  name: text().notNull(),
  issuer: text().notNull(),
  issuedAt: date("issued_at"),
  expiresAt: date("expires_at"),
  credentialUrl: text("credential_url"),
  externalId: text("external_id"),
  externalSource: text("external_source"),
  ...timestamps,
});
