import { pgTable, uuid, text, integer, boolean, date } from "drizzle-orm/pg-core";
import { organizationsTable } from "./organizations";
import { ddatRolesTable, sfiaSkillLevelsTable } from "./reference";
import { usersTable } from "./users";

export const jobGradesTable = pgTable("job_grades", {
  id: uuid().primaryKey().defaultRandom(),
  organization_id: uuid().notNull().references(() => organizationsTable.id),
  name: text().notNull(),
  seniority_level: integer().notNull(),
  maps_to_ddat_role_id: uuid().references(() => ddatRolesTable.id),
  external_id: text(),
  external_source: text(),
});

export const jobGradeRequirementsTable = pgTable("job_grade_requirements", {
  id: uuid().primaryKey().defaultRandom(),
  job_grade_id: uuid().notNull().references(() => jobGradesTable.id),
  sfia_skill_level_id: uuid().notNull().references(() => sfiaSkillLevelsTable.id),
});

export const userGradeAssignmentsTable = pgTable("user_grade_assignments", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid().notNull().references(() => usersTable.id),
  job_grade_id: uuid().notNull().references(() => jobGradesTable.id),
  assigned_at: date().notNull(),
  is_current: boolean().notNull().default(true),
});
