import {
  uuid,
  pgTable,
  varchar,
  integer,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helpers";
import { organizationsTable } from "./organisations";
import { skillsTable, skillsLevelTable } from "./skills";
import { usersTable } from "./users";

export const jobRolesTable = pgTable("job_roles", {
  id: uuid().primaryKey().defaultRandom(),
  organisation_id: uuid()
    .notNull()
    .references(() => organizationsTable.id),
  name: varchar({ length: 255 }).notNull(),
  seniority_level: integer().notNull(),
  description: text(),
  ...timestamps,
});

export const roleSkillRequirementsTable = pgTable("role_skill_requirements", {
  id: uuid().primaryKey().defaultRandom(),
  role_id: uuid()
    .notNull()
    .references(() => jobRolesTable.id),
  skill_id: uuid()
    .notNull()
    .references(() => skillsTable.id),
  level_id: uuid()
    .notNull()
    .references(() => skillsLevelTable.id),
  ...timestamps,
});

export const userRoleAssignmentsTable = pgTable("user_role_assignments", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid()
    .notNull()
    .references(() => usersTable.id),
  role_id: uuid()
    .notNull()
    .references(() => jobRolesTable.id),
  assigned_at: timestamp({ precision: 6 }).defaultNow().notNull(),
  is_current: boolean().notNull().default(true),
  ...timestamps,
});
