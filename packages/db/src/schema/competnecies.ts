import {
  uuid,
  pgTable,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helpers";
import { usersTable } from "../schema.old";
import {
  competencyProficiencyLevelEnum,
  competencyTypeEnum,
  comptenyDispositionEnum,
} from "./enums";

export const competenciesTable = pgTable("competencies", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid()
    .notNull()
    .references(() => usersTable.id),
  name: text(), // e.g. React, TDD, Stakeholder Management, SOLID Principles,  Agile Facilitation, Database Normalisation, Prompt Engineering.
  competency_type: competencyTypeEnum().notNull(),
  proficiency_level: competencyProficiencyLevelEnum().notNull(), // e.g. "aware", "practising", "confident", "leading"
  disposition: comptenyDispositionEnum().notNull(), // e.g. "seeking", "neutral", "open", "winding_down", "prefer_not"
  disposition_notes: text(), // e.g. "Pending verification", "Expired on 2024-01-01"
  last_used_at: timestamp(), // ISO date string, e.g. "2024-01-15T12:34:56Z"
  is_inferred: boolean().notNull().default(false), // Whether this competency was inferred from other data rather than explicitly added by the user
  external_id: text(), // Assessment or record ID from an external platform. e.g. Pluralsight IQ score ID, Coursera certificate ID.
  evidence_source: text(), //e.g. pluralsight, coursera, linkedin_learning
  expiration_date: timestamp(), // ISO date string, e.g. "2024-12-31T23:59:59Z"
  ...timestamps,
});
