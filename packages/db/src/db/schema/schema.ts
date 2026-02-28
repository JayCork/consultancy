import { SQL, sql } from "drizzle-orm";
import {
  uuid,
  real,
  pgTable,
  varchar,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { evidenceTable } from "./evidence";
import { timestamps } from "../columns.helpers";
import { time } from "console";
import {
  accessPurposeEnum,
  citizenshipAquishitionMethodEnum,
  clearanceLevelsEnum,
  projectRoleEnum,
  relationshipEnum,
  visaTypesEnum,
} from "../enums";

// TODO: Add policty that stops users from being able to view sensitive information about other users (e.g. email) unless they have a relationship with that user (e.g. they are in the same project or they have a relationship in the user_relationships table)

// export const usersTable = pgTable("users", {
//   id: integer().primaryKey().generatedAlwaysAsIdentity(),
//   name: varchar({ length: 255 }).notNull(),
//   age: integer().notNull(),
//   email: varchar({ length: 255 }).notNull().unique(),
// });

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  location: varchar({ length: 255 }).notNull(),
  // Sensitive information that should only be viewable by users with a relationship to this user (e.g. they are in the same project or they have a relationship in the user_relationships table)
  citizenship: varchar({ length: 255 }).notNull(),
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
  residenitial_history: varchar({ length: 255 }).notNull(),
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
  ...timestamps,
});

export const projectsTable = pgTable("projects", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
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
  // Is active is end date is null or end date is in the future
  is_active: boolean()
    .notNull()
    .generatedAlwaysAs((): SQL => sql`end_date IS NULL OR end_date > NOW()`),
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
  roles: relationshipEnum().array().notNull(),
  start_date: timestamp({ precision: 3 }).defaultNow(),
  end_date: timestamp({ precision: 3 }),
  // Is active is end date is null or end date is in the future
  is_active: boolean()
    .notNull()
    .generatedAlwaysAs((): SQL => sql`end_date IS NULL OR end_date > NOW()`),
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
