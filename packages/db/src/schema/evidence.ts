import {
  pgTable,
  uuid,
  text,
  integer,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { evidenceStatusEnum, competencyTypeEnum } from "./enums";
import { usersTable } from "./users";
import { projectsTable } from "./projects";
import { competenciesTable } from "./competencies";
import { timestamps } from "../columns.helpers";

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
  ...timestamps,
});

export const evidenceCompetenciesTable = pgTable("evidence_competencies", {
  id: uuid().primaryKey().defaultRandom(),
  evidence_id: uuid()
    .notNull()
    .references(() => evidenceTable.id),
  competency_id: uuid()
    .notNull()
    .references(() => competenciesTable.id),
  competency_type: competencyTypeEnum().notNull(),
});
