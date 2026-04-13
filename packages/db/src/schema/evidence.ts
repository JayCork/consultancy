import {
  boolean,
  pgTable,
  uuid,
  text,
  integer,
  type AnyPgColumn,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import {
  dataClassificationEnum,
  evidenceStatusEnum,
  frameworkLevelEnum,
} from "./enums";
import { usersTable } from "./users";
import { projectsTable } from "./projects";
import { timestamps } from "../columns.helpers";
import { tagsTable } from "./tags";
import { skillsTable } from "./skills";

export const evidenceTable = pgTable("evidence", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid()
    .notNull()
    .references(() => usersTable.id),
  project_id: uuid().references(() => projectsTable.id), // nullable — not all evidence is project-bound
  parent_id: uuid().references((): AnyPgColumn => evidenceTable.id), // Self-referential: points to previous version when user revises. Chain reconstructed via parent_id traversal, not a version integer.
  version: integer().notNull().default(1),
  situation: text().notNull(),
  task: text().notNull(),
  action: text().notNull(),
  result: text().notNull(),
  status: evidenceStatusEnum().notNull().default("draft"),
  data_classification: dataClassificationEnum().notNull().default("official"), // e.g. "public", "internal", "confidential" — determines where/how evidence can be shared
  ...timestamps,
});

export const evidenceTagsTable = pgTable(
  "evidence_tags",
  {
    id: uuid().primaryKey().defaultRandom(),
    evidence_id: uuid()
      .notNull()
      .references(() => evidenceTable.id),
    tag_id: uuid()
      .notNull()
      .references(() => tagsTable.id),
    created_at: timestamps.created_at,
  },
  (table) => [
    uniqueIndex("evidence_tags_unique").on(table.evidence_id, table.tag_id),
  ],
);

export const evidenceSkillsTable = pgTable(
  "evidence_skills",
  {
    id: uuid().primaryKey().defaultRandom(),
    evidence_id: uuid()
      .notNull()
      .references(() => evidenceTable.id),
    skill_id: uuid()
      .notNull()
      .references(() => skillsTable.id),
    level_claimed: frameworkLevelEnum().notNull(), // Level the user is claiming to have demonstrated in this piece of evidence
    is_primary: boolean().notNull().default(false), // Whether this skill is the primary focus of the evidence (users can link multiple skills to a piece of evidence, but one can be marked as primary)

    created_at: timestamps.created_at,
    updated_at: timestamps.updated_at,
  },
  (table) => [
    uniqueIndex("evidence_skills_unique").on(table.evidence_id, table.skill_id),
  ],
);
