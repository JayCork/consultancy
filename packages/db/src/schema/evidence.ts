import { uuid, pgTable, text } from "drizzle-orm/pg-core";
import { skillsTable, skillsLevelTable } from "./skills";
import { usersTable } from "./users";
import { evidenceStatusEnum, sectorEnum, securityContextEnum } from "./enums";
import { timestamps } from "../columns.helpers";
import { projectsTable } from "./projects";

export const evidenceTable = pgTable("evidence_entries", {
  id: uuid().primaryKey().defaultRandom(),
  author_id: uuid()
    .notNull()
    .references(() => usersTable.id),
  skill_id: uuid()
    .notNull()
    .references(() => skillsTable.id),
  situation: text().notNull(),
  task: text().notNull(),
  action: text().notNull(),
  result: text().notNull(),
  status: evidenceStatusEnum().notNull().default("draft"),
  project_id: uuid()
    .notNull()
    .references(() => projectsTable.id),
  level_id: uuid()
    .notNull()
    .references(() => skillsLevelTable.id),
  sector: sectorEnum().notNull(),
  security_context: securityContextEnum().notNull(),
  ...timestamps,
});
