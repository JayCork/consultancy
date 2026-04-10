import {
  pgTable,
  uuid,
  text,
  AnyPgColumn,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { organizationsTable } from "./organizations";
import { timestamps } from "../columns.helpers";
import { frameworkLevelEnum } from "./enums";
import { table } from "console";
import { ref } from "process";
import { referenceSkillsTable } from "./reference";

export const skillsTable = pgTable(
  "skills",
  {
    id: uuid().primaryKey().defaultRandom(),
    organization_id: uuid().references(() => organizationsTable.id),
    name: text().notNull(),
    description: text(),
    parent_skill_id: uuid().references((): AnyPgColumn => skillsTable.id),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("skills_org_name_unique").on(table.organization_id, table.name),
  ],
);

export const skillsLevelsTable = pgTable(
  "skill_levels",
  {
    id: uuid().primaryKey().defaultRandom(),
    skill_id: uuid()
      .notNull()
      .references(() => skillsTable.id),
    level: frameworkLevelEnum().notNull(),
    description: text(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("skill_levels_skill_level_unique").on(
      table.skill_id,
      table.level,
    ),
  ],
);

export const skillFrameworkMappingsTable = pgTable("skill_framework_mappings", {
  id: uuid().primaryKey().defaultRandom(),
  skill_id: uuid()
    .notNull()
    .references(() => skillsTable.id),
  reference_skill_id: uuid()
    .notNull()
    .references(() => referenceSkillsTable.id),
  notes: text(), // Any notes about the mapping, e.g. rationale for mapping, areas of partial alignment, etc.
  ...timestamps,
});

export const skillFrameworkMapping = pgTable("skill_framework_mapping", {
  id: uuid().primaryKey().defaultRandom(),
  skill_id: uuid()
    .notNull()
    .references(() => skillsTable.id),
  reference_skill_id: uuid()
    .notNull()
    .references(() => referenceSkillsTable.id), // The skill ID in the framework that this skill maps to
  notes: text(), // Any notes about the mapping, e.g. rationale for mapping, areas of partial alignment, etc.
});
