import {
  pgTable,
  uuid,
  text,
  decimal,
  date,
  timestamp,
} from "drizzle-orm/pg-core";
import { projectsTable } from "./projects";
import { usersTable } from "./users";
import { timestamps } from "../columns.helpers";
import { projectRoleEnum } from "./enums";
import { jobGradesTable } from "./grades";

export const resourceScenariosTable = pgTable("resource_scenarios", {
  id: uuid().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id),
  name: text().notNull(),
  description: text(),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => usersTable.id),
  committedAt: timestamp("committed_at", { withTimezone: true }),
  // null = draft; set atomically when committed alongside project_members insert
  ...timestamps,
});

export const resourceScenarioAssignmentsTable = pgTable(
  "resource_scenario_assignments",
  {
    id: uuid().primaryKey().defaultRandom(),
    scenarioId: uuid("scenario_id")
      .notNull()
      .references(() => resourceScenariosTable.id),
    userId: uuid("user_id").references(() => usersTable.id),
    // Nullable — "we need a Senior Engineer from June, person TBC"
    projectRole: projectRoleEnum("project_role").notNull(),
    jobGradeId: uuid("job_grade_id")
      .notNull()
      .references(() => jobGradesTable.id),
    allocatedHoursPerWeek: decimal("allocated_hours_per_week", {
      precision: 5,
      scale: 2,
    }).notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date"),
    notes: text(),
    ...timestamps,
  },
);
