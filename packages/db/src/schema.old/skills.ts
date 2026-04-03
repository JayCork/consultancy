import { uuid, pgTable, varchar, text, integer } from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helpers";

export const skillsTable = pgTable("skills", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  ...timestamps,
});

export const skillsLevelTable = pgTable("skill_levels", {
  id: uuid().primaryKey().defaultRandom(),
  skill_id: uuid()
    .notNull()
    .references(() => skillsTable.id),
  level_number: integer().notNull(),
  criteria: text().notNull(),
  ...timestamps,
});

export const externalFrameworksTable = pgTable("external_frameworks", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  version: varchar({ length: 255 }).notNull(),
  ...timestamps,
});

export const externalSkillsTable = pgTable("external_skills", {
  id: uuid().primaryKey().defaultRandom(),
  framework_id: uuid()
    .notNull()
    .references(() => externalFrameworksTable.id),
  code: varchar({ length: 25 }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  category: varchar({ length: 255 }).notNull(),
  level_number: integer().notNull(),
  description: text().notNull(),
  ...timestamps,
});

export const frameworkMappingsTable = pgTable("framework_mappings", {
  id: uuid().primaryKey().defaultRandom(),
  level_id: uuid().references(() => skillsLevelTable.id),
  external_skill_id: uuid().references(() => externalSkillsTable.id),
  notes: text(), // "Justification for this mapping for auditors"
  ...timestamps,
});
