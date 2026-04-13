import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { organizationsTable } from "./organizations";
import { frameworkLevelEnum, regionEnum } from "./enums";
import { skillsTable } from "./skills";
import { timestamps } from "../columns.helpers";

// ── Reference frameworks (SFIA, DDaT, future) ────────────────────────────────
// Global reference data — seeded at deploy time, never org-specific.

export const referenceFrameworksTable = pgTable("reference_frameworks", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(), // e.g. "SFIA", "DDaT"
  version: text(), // e.g. "9.0.0" — nullable, DDaT has no version number
  url: text(),
  ...timestamps,
});

// DDaT roles, SFIA skills — one table each, distinguished by framework_id.
// Do not add SFIA-specific or DDaT-specific tables alongside these.

export const referenceRolesTable = pgTable("reference_roles", {
  id: uuid().primaryKey().defaultRandom(),
  framework_id: uuid()
    .notNull()
    .references(() => referenceFrameworksTable.id),
  code: text(), // Framework-assigned code where applicable
  name: text().notNull(),
  description: text(),
  ...timestamps,
});

export const referenceSkillsTable = pgTable("reference_skills", {
  id: uuid().primaryKey().defaultRandom(),
  framework_id: uuid()
    .notNull()
    .references(() => referenceFrameworksTable.id),
  code: text().notNull(), // e.g. "PROG", "DESN", "TEST"
  name: text().notNull(),
  description: text(),
  min_level: integer().notNull().default(0),
  max_level: integer().notNull().default(7),
  ...timestamps,
});

// ── Internal framework ────────────────────────────────────────────────────────
// User-facing. Everything employees and managers interact with references
// these tables — never reference_roles or reference_skills directly.
//
// organization_id IS NULL     → platform default (ships with the product)
// organization_id IS NOT NULL → org-defined override or extension

export const frameworkRoleFamiliesTable = pgTable("framework_role_families", {
  id: uuid().primaryKey().defaultRandom(),
  organization_id: uuid().references(() => organizationsTable.id), // nullable = platform default
  name: text().notNull(), // e.g. "Software Developer", "User Researcher"
  description: text(),
  ...timestamps,
});

export const frameworkRolesTable = pgTable("framework_roles", {
  id: uuid().primaryKey().defaultRandom(),
  organization_id: uuid().references(() => organizationsTable.id), // nullable = platform default
  family_id: uuid()
    .notNull()
    .references(() => frameworkRoleFamiliesTable.id),
  level: frameworkLevelEnum().notNull(),
  display_name: text().notNull(), // e.g. "Senior Software Developer"
  ...timestamps,
});

// ── Mapping layer ─────────────────────────────────────────────────────────────
// The only place external framework references appear.

export const frameworkRoleMappingsTable = pgTable("framework_role_mappings", {
  id: uuid().primaryKey().defaultRandom(),
  framework_role_id: uuid()
    .notNull()
    .references(() => frameworkRolesTable.id),
  reference_role_id: uuid()
    .notNull()
    .references(() => referenceRolesTable.id),
  // Unique constraint in migration: (framework_role_id, reference_role_id)
  // One internal role maps to one DDaT role per reference framework.
  ...timestamps,
});

export const frameworkRoleSkillExpectationsTable = pgTable(
  "framework_role_skill_expectations",
  {
    id: uuid().primaryKey().defaultRandom(),
    framework_role_id: uuid()
      .notNull()
      .references(() => frameworkRolesTable.id),
    skill_id: uuid()
      .notNull()
      .references(() => skillsTable.id),
    minimum_level: frameworkLevelEnum().notNull(), // Minimum SFIA level expected at this role
    is_primary: boolean().notNull().default(false),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("frse_role_skill_unique").on(
      table.framework_role_id,
      table.skill_id,
    ),
  ],
);

// ── Clearance levels ──────────────────────────────────────────────────────────
// Global reference data. rank enforces ordering (higher = more sensitive).

export const clearanceLevelsTable = pgTable(
  "clearance_levels",
  {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    shortName: text().notNull(),
    rank: integer().notNull().unique(),
    description: text(),
    region: regionEnum().notNull().default("GBR"), // To support different clearance schemes in different regions if needed
    ...timestamps,
  },
  (table) => [
    uniqueIndex("clearance_levels_region_rank_unique").on(
      table.region,
      table.rank,
    ),
    uniqueIndex("clearance_levels_region_name_unique").on(
      table.region,
      table.name,
    ),
  ],
);
