import { SQL, sql } from "drizzle-orm";
import {
  uuid,
  real,
  pgTable,
  varchar,
  timestamp,
  boolean,
  text,
  pgEnum,
  integer,
} from "drizzle-orm/pg-core";
import { evidenceTable } from "./evidence";
import { timestamps } from "../columns.helpers";

// TODO: Add policty that stops users from being able to view sensitive information about other users (e.g. email) unless they have a relationship with that user (e.g. they are in the same project or they have a relationship in the user_relationships table)

export const visaTypesArray = [
  "standard visitor",
  "business visitor",
  "marraige visitor",
  "parent of a child visitor",
  "global talent",
  "skilled worker",
  "innovator founder",
  "scaleup",
  "sole representative",
  "tier 5 temporary worker",
  "global business mobility",
  "youth mobility scheme",
  "student",
  "short-term study",
  "spouse or partner",
  "dependent",
  "ancestry",
  "family reunion",
  "unmarried partner",
  "fiance",
] as [string, ...string[]];
export const visaTypesEnum = pgEnum("visa_types", visaTypesArray);

export const clearanceLevelsEnum = pgEnum("clearance_levels", [
  "baseline personnel security standard",
  "accreditation check",
  "counter terrorist check",
  "security check",
  "enhanced security check",
  "developed vetting check",
  "enhanced developed vetting check",
]);

export const citizenshipAquishitionMethodEnum = pgEnum(
  "citizenship_aquisition_methods",
  ["birth", "naturalization", "marriage", "descent", "adoption"],
);

export const projectRoleEnum = pgEnum("project_roles", [
  "manager",
  "developer",
  "designer",
  "tester",
  "analyst",
]);

export const relationshipEnum = pgEnum("relationship_types", [
  "manager",
  "peer",
  "mentor",
  "mentee",
  "colleague",
]);

export const accessPurposeEnum = pgEnum("access_purposes", [
  "view",
  "edit",
  "delete",
  "create",
]);

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  role: varchar({ length: 100 }).notNull(),
  // Sensitive information that should only be viewable by users with a relationship to this user (e.g. they are in the same project or they have a relationship in the user_relationships table)
  is_contractor: boolean().notNull().default(false),
  ...timestamps,
});

export const visasTable = pgTable("visas", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid()
    .notNull()
    .references(() => usersTable.id),
  country_code: varchar({ length: 3 }).notNull(),
  visa_type: visaTypesEnum().notNull(),
  issue_date: timestamp({ precision: 3 }).defaultNow(),
  expiration_date: timestamp({ precision: 3 }),
  sponsoring_organization: varchar({ length: 255 }).notNull(),
  ...timestamps,
});

export const clearancesTable = pgTable("clearances", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid()
    .notNull()
    .references(() => usersTable.id),
  level: clearanceLevelsEnum().notNull(),
  granted_at: timestamp({ precision: 3 }).defaultNow(),
  expires_at: timestamp({ precision: 3 }),
  sponsoring_organization: varchar({ length: 255 }).notNull(),
  ...timestamps,
});

export const userCitizenshipTable = pgTable("user_citizenship", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid()
    .notNull()
    .references(() => usersTable.id),
  country_code: varchar({ length: 3 }).notNull(),
  is_primary: boolean().notNull().default(false),
  aquisition_method: citizenshipAquishitionMethodEnum().notNull(),
  aquisition_date: timestamp({ precision: 3 }).defaultNow(),
  expiration_date: timestamp({ precision: 3 }),
  ...timestamps,
});

export const residentialAddressesTable = pgTable("residential_addresses", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid()
    .notNull()
    .references(() => usersTable.id),
  street_address: varchar({ length: 255 }).notNull(),
  city: varchar({ length: 255 }),
  area_code: varchar({ length: 10 }).notNull(),
  country_code: varchar({ length: 3 }).notNull(),
  start_date: timestamp({ precision: 3 }).defaultNow().notNull(),
  end_date: timestamp({ precision: 3 }),
  ...timestamps,
});

const feedbackTable = pgTable("feedback", {
  id: uuid().primaryKey().defaultRandom(),
  evidence_id: uuid()
    .notNull()
    .references(() => evidenceTable.id),
  author_id: uuid()
    .notNull()
    .references(() => usersTable.id),
  content: varchar({ length: 255 }).notNull(),

  // Is peer feedback is true if the author of the feedback has a relationship with the author of the evidence (e.g. they are in the same project or they have a relationship in the user_relationships table)
  // TODO: Replace the generated column value so that it is created either with application layer or via a sql view when querying
  is_peer_feedback: boolean()
    .notNull()
    .generatedAlwaysAs(
      (): SQL => sql`EXISTS (
      SELECT 1
      FROM user_project_roles upr1
      JOIN user_project_roles upr2 ON upr1.project_id = upr2.project_id
      WHERE upr1.user_id = evidenceTable.author_id
        AND upr2.user_id = feedbackTable.author_id
        AND upr1.is_active
        AND upr2.is_active
    )`,
    ),
  // TODO: Replace the generated column value so that it is created either with application layer or via a sql view when querying
  is_manager_feedback: boolean()
    .notNull()
    .generatedAlwaysAs(
      (): SQL => sql`EXISTS (
      SELECT 1
      FROM user_relationships ur
      WHERE ur.actor_id = feedbackTable.author_id
        AND ur.subject_id = evidenceTable.author_id
        AND ur.is_active
    )`,
    ),
  ...timestamps,
});

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

export const projectsTable = pgTable("projects", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
  category: varchar({ length: 100 }), // e.g., "Engineering", "Delivery"
  ...timestamps,
});

export const userProjectRolesTable = pgTable("user_project_roles", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid()
    .notNull()
    .references(() => usersTable.id),
  project_id: uuid()
    .notNull()
    .references(() => projectsTable.id),
  role: projectRoleEnum().notNull(),
  start_date: timestamp({ precision: 3 }).defaultNow(),
  end_date: timestamp({ precision: 3 }),
  // is_active is now a regular boolean column; set/update in app logic
  is_active: boolean().notNull().default(true),
  allocation_percentage: real().notNull().default(100),
  ...timestamps,
});

export const userRelationshipsTable = pgTable("user_relationships", {
  id: uuid().primaryKey().defaultRandom(),
  actor_id: uuid()
    .notNull()
    .references(() => usersTable.id),
  subject_id: uuid()
    .notNull()
    .references(() => usersTable.id),
  start_date: timestamp({ precision: 3 }).defaultNow(),
  end_date: timestamp({ precision: 3 }),
  // Is active is end date is null or end date is in the future
  is_active: boolean().notNull(),
  ...timestamps,
});

export const relationshipToRoleTable = pgTable("relationship_to_role", {
  id: uuid().primaryKey().defaultRandom(),
  relationship_id: uuid()
    .notNull()
    .references(() => userRelationshipsTable.id),
  role: relationshipEnum().notNull(),
  ...timestamps,
});

export const auditLogsTable = pgTable("audit_logs", {
  id: uuid().primaryKey().defaultRandom(),
  viewer_id: uuid()
    .notNull()
    .references(() => usersTable.id),
  target_id: uuid()
    .notNull()
    .references(() => usersTable.id),
  data_field: varchar({ length: 255 }).notNull(),
  timestamp: timestamp({ precision: 3 }).defaultNow(),
  access_purpose: accessPurposeEnum().notNull(),
  ip_address: varchar({ length: 255 }).notNull(),
  ...timestamps,
});

// Multitenancy support
export const organizationsTable = pgTable("organizations", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  ...timestamps,
});
