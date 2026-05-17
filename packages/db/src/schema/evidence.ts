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
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),
  projectId: uuid("project_id").references(() => projectsTable.id), // nullable — not all evidence is project-bound
  parentId: uuid("parent_id").references((): AnyPgColumn => evidenceTable.id), // Self-referential: points to previous version when user revises. Chain reconstructed via parentId traversal, not a version integer.
  version: integer().notNull().default(1),
  situation: text().notNull(),
  task: text().notNull(),
  action: text().notNull(),
  result: text().notNull(),
  status: evidenceStatusEnum().notNull().default("draft"),
  dataClassification: dataClassificationEnum("data_classification").notNull().default("official"), // e.g. "public", "internal", "confidential" — determines where/how evidence can be shared
  ...timestamps,
});

export const evidenceTagsTable = pgTable(
  "evidence_tags",
  {
    id: uuid().primaryKey().defaultRandom(),
    evidenceId: uuid("evidence_id")
      .notNull()
      .references(() => evidenceTable.id),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tagsTable.id),
    createdAt: timestamps.createdAt,
  },
  (table) => [
    uniqueIndex("evidence_tags_unique").on(table.evidenceId, table.tagId),
  ],
);

export const evidenceSkillsTable = pgTable(
  "evidence_skills",
  {
    id: uuid().primaryKey().defaultRandom(),
    evidenceId: uuid("evidence_id")
      .notNull()
      .references(() => evidenceTable.id),
    skillId: uuid("skill_id")
      .notNull()
      .references(() => skillsTable.id),
    levelClaimed: frameworkLevelEnum("level_claimed").notNull(), // Level the user is claiming to have demonstrated in this piece of evidence
    isPrimary: boolean("is_primary").notNull().default(false), // Whether this skill is the primary focus of the evidence (users can link multiple skills to a piece of evidence, but one can be marked as primary)

    createdAt: timestamps.createdAt,
    updatedAt: timestamps.updatedAt,
  },
  (table) => [
    uniqueIndex("evidence_skills_unique").on(table.evidenceId, table.skillId),
  ],
);
