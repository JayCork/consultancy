import {
  pgTable,
  uuid,
  text,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { organizationsTable } from "./organizations";
import { timestamps } from "../columns.helpers";
import { frameworkLevelEnum } from "./enums";
import { referenceSkillsTable } from "./reference";

export const skillsTable = pgTable(
  "skills",
  {
    id: uuid().primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").references(() => organizationsTable.id),
    name: text().notNull(),
    description: text(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("skills_org_name_unique").on(table.organizationId, table.name),
  ],
);

export const skillsLevelsTable = pgTable(
  "skill_levels",
  {
    id: uuid().primaryKey().defaultRandom(),
    skillId: uuid("skill_id")
      .notNull()
      .references(() => skillsTable.id),
    level: frameworkLevelEnum().notNull(),
    description: text(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("skill_levels_skill_level_unique").on(
      table.skillId,
      table.level,
    ),
  ],
);

export const skillFrameworkMappingsTable = pgTable("skill_framework_mappings", {
  id: uuid().primaryKey().defaultRandom(),
  skillId: uuid("skill_id")
    .notNull()
    .references(() => skillsTable.id),
  referenceSkillId: uuid("reference_skill_id")
    .notNull()
    .references(() => referenceSkillsTable.id),
  notes: text(), // Any notes about the mapping, e.g. rationale for mapping, areas of partial alignment, etc.
  ...timestamps,
});
