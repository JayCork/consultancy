import { pgTable, uuid, text, boolean, date } from "drizzle-orm/pg-core";
import { projectRoleEnum } from "./enums";
import { organizationsTable } from "./organizations";
import { clearanceLevelsTable } from "./reference";
import { usersTable } from "./users";

export const projectsTable = pgTable("projects", {
  id: uuid().primaryKey().defaultRandom(),
  organization_id: uuid().notNull().references(() => organizationsTable.id),
  name: text().notNull(),
  short_name: text(),
  code_name: text(),
  is_name_classified: boolean().notNull().default(false),
  minimum_clearance_id: uuid().references(() => clearanceLevelsTable.id),
});

export const projectMembersTable = pgTable("project_members", {
  id: uuid().primaryKey().defaultRandom(),
  project_id: uuid().notNull().references(() => projectsTable.id),
  user_id: uuid().notNull().references(() => usersTable.id),
  project_role: projectRoleEnum().notNull(),
  start_date: date().notNull(),
  end_date: date(),
});
