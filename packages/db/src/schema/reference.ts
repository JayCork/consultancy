import { pgTable, uuid, text, integer } from "drizzle-orm/pg-core";
import { organizationsTable } from "./organizations";

export const clearanceLevelsTable = pgTable("clearance_levels", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  rank: integer().notNull().unique(),
  description: text(),
});

export const sfiaSkillsTable = pgTable("sfia_skills", {
  id: uuid().primaryKey().defaultRandom(),
  organization_id: uuid().references(() => organizationsTable.id),
  name: text().notNull(),
  code: text().notNull(),
  category: text().notNull(),
  subcategory: text(),
  description: text(),
});

export const sfiaSkillLevelsTable = pgTable("sfia_skill_levels", {
  id: uuid().primaryKey().defaultRandom(),
  sfia_skill_id: uuid().notNull().references(() => sfiaSkillsTable.id),
  organization_id: uuid().references(() => organizationsTable.id),
  level_number: integer().notNull(),
  description: text().notNull(),
});

export const ddatRolesTable = pgTable("ddat_roles", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  family: text().notNull(),
  level: integer().notNull(),
});

export const ddatRoleRequirementsTable = pgTable("ddat_role_requirements", {
  id: uuid().primaryKey().defaultRandom(),
  ddat_role_id: uuid().notNull().references(() => ddatRolesTable.id),
  sfia_skill_level_id: uuid().notNull().references(() => sfiaSkillLevelsTable.id),
});
