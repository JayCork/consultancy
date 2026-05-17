import {
  pgTable,
  uuid,
  text,
  decimal,
  date,
  uniqueIndex,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import {
  projectFundingModelEnum,
  projectRoleEnum,
  projectStatusEnum,
  regionEnum,
} from "./enums";
import { organizationsTable, organizationUnitsTable } from "./organizations";
import { clearanceLevelsTable } from "./reference";
import { usersTable } from "./users";
import { sql } from "drizzle-orm/sql/sql";
import { timestamps } from "../columns.helpers";
import { payBandsTable } from "./pay-bands";
import { jobGradesTable } from "./grades";

export const projectsTable = pgTable(
  "projects",
  {
    id: uuid().primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizationsTable.id),
    leadId: uuid("lead_id")
      .notNull()
      .references(() => usersTable.id),
    name: text().notNull(),
    shortName: text("short_name"),
    codeName: varchar("code_name", { length: 8 }),
    organizationUnitId: uuid("organization_unit_id")
      .notNull()
      .references(() => organizationUnitsTable.id),
    minimumClearanceId: uuid("minimum_clearance_id").references(
      () => clearanceLevelsTable.id,
    ),
    fundingModel: projectFundingModelEnum("funding_model")
      .notNull()
      .default("time_and_materials"),
    contractedValue: decimal("contracted_value", { precision: 12, scale: 2 }),
    currency: varchar({ length: 3 }).notNull().default("GBP"),
    marginOverridePct: decimal("margin_override_pct", {
      precision: 5,
      scale: 2,
    }), // null = inherit from org

    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date"),
    region: regionEnum().notNull().default("GBR"),
    status: projectStatusEnum().notNull().default("opportunity"),
    ...timestamps,
  },
  (table) => [uniqueIndex("projects_code_name_unique").on(table.codeName)],
);

export const projectMilestonesTable = pgTable("project_milestones", {
  id: uuid().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id),
  label: text().notNull(),
  notes: text(),
  date: date().notNull(),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => usersTable.id),
  ...timestamps,
});

export const projectMembersTable = pgTable(
  "project_members",
  {
    id: uuid().primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projectsTable.id),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id),
    projectRole: projectRoleEnum().notNull(),
    jobGradeId: uuid("job_grade_id").references(() => jobGradesTable.id),
    allocatedHoursPerWeek: decimal("allocated_hours_per_week", {
      precision: 5,
      scale: 2,
    }),

    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date"),
  },
  (table) => [
    uniqueIndex("project_members_active_unique")
      .on(table.projectId, table.userId)
      .where(sql`${table.endDate} is null`),
  ],
);
