import { pgTable, uuid, text, date } from "drizzle-orm/pg-core";
import { organizationsTable } from "./organizations";
import { frameworkRolesTable } from "./reference";
import { usersTable } from "./users";

export const jobGradesTable = pgTable("job_grades", {
  id: uuid().primaryKey().defaultRandom(),
  organization_id: uuid()
    .notNull()
    .references(() => organizationsTable.id),
  framework_role_id: uuid()
    .notNull()
    .references(() => frameworkRolesTable.id),
  name: text().notNull(),
  // e.g. "Senior Software Developer (Gov Frameworks)"
  // Orgs may have multiple job grades mapping to the same framework role
  // e.g. different pay bands at the same seniority level.
  external_id: text(),
  external_source: text(),
});

export const userGradeAssignmentsTable = pgTable("user_grade_assignments", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid()
    .notNull()
    .references(() => usersTable.id),
  job_grade_id: uuid()
    .notNull()
    .references(() => jobGradesTable.id),
  start_date: date().notNull(),
  end_date: date(),
  // Current assignment = end_date IS NULL.
  // Never use a boolean is_current — requires updating old rows on transition
  // and creates race conditions. Derive currency from end_date at query time.
});
