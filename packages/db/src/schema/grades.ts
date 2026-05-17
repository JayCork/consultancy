import { pgTable, uuid, text, date } from "drizzle-orm/pg-core";
import { organizationsTable } from "./organizations";
import { frameworkRolesTable } from "./reference";
import { usersTable } from "./users";
import { timestamps } from "../columns.helpers";

export const jobGradesTable = pgTable("job_grades", {
  id: uuid().primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizationsTable.id),
  frameworkRoleId: uuid("framework_role_id")
    .notNull()
    .references(() => frameworkRolesTable.id),
  name: text().notNull(),
  // e.g. "Senior Software Developer (Gov Frameworks)"
  // Orgs may have multiple job grades mapping to the same framework role
  // e.g. different pay bands at the same seniority level.
  externalId: text("external_id"),
  externalSource: text("external_source"),
  ...timestamps,
});

export const userGradeAssignmentsTable = pgTable("user_grade_assignments", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),
  jobGradeId: uuid("job_grade_id")
    .notNull()
    .references(() => jobGradesTable.id),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  ...timestamps,
});
