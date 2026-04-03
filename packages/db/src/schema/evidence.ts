import {
  pgTable,
  uuid,
  text,
  integer,
  uniqueIndex,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { evidenceStatusEnum, competencyTypeEnum } from "./enums";
import { usersTable } from "./users";
import { projectsTable } from "./projects";
import { sfiaSkillLevelsTable } from "./reference";

export const evidenceTable = pgTable("evidence", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid().notNull().references(() => usersTable.id),
  project_id: uuid().references(() => projectsTable.id),
  sfia_skill_level_id: uuid().notNull().references(() => sfiaSkillLevelsTable.id),
  // Self-referential: points to the previous version when the user revises evidence.
  parent_id: uuid().references((): AnyPgColumn => evidenceTable.id),
  version: integer().notNull().default(1),
  situation: text().notNull(),
  task: text().notNull(),
  action: text().notNull(),
  result: text().notNull(),
  status: evidenceStatusEnum().notNull().default("draft"),
});

export const evidenceCompetenciesTable = pgTable("evidence_competencies", {
  id: uuid().primaryKey().defaultRandom(),
  evidence_id: uuid().notNull().references(() => evidenceTable.id),
  competency_name: text().notNull(),
  competency_type: competencyTypeEnum().notNull(),
});
