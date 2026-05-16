import {
  pgTable,
  uuid,
  decimal,
  date,
  varchar,
} from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helpers";
import { organizationsTable } from "./organizations";
import { jobGradesTable } from "./grades";

export const payBandsTable = pgTable("pay_bands", {
  id: uuid().primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizationsTable.id),
  jobGradeId: uuid("job_grade_id")
    .notNull()
    .references(() => jobGradesTable.id),
  bandFloor: decimal("band_floor", { precision: 10, scale: 2 }).notNull(),
  bandCeiling: decimal("band_ceiling", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("GBP"),
  effectiveFrom: date("effective_from").notNull(),
  effectiveTo: date("effective_to"),
  ...timestamps,
});
