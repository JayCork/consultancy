import {
  pgTable,
  uuid,
  text,
  date,
  uniqueIndex,
  timestamp,
} from "drizzle-orm/pg-core";
import { goalStatusEnum, goalVisibilityEnum } from "./enums";
import { evidenceTable } from "./evidence";
import { usersTable } from "./users";
import { timestamps } from "../columns.helpers";
import { frameworkRolesTable } from "./reference";

export const goalsTable = pgTable("goals", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),
  title: text().notNull(),
  description: text(),
  targetDate: date("target_date"),
  status: goalStatusEnum().notNull().default("active"),
  visibility: goalVisibilityEnum().notNull().default("private"),
  targetRoleId: uuid("target_role_id").references(() => frameworkRolesTable.id),
  ...timestamps,
});

export const goalEvidenceTable = pgTable(
  "goal_evidence",
  {
    id: uuid().primaryKey().defaultRandom(),
    goalId: uuid("goal_id")
      .notNull()
      .references(() => goalsTable.id),
    evidenceId: uuid("evidence_id")
      .notNull()
      .references(() => evidenceTable.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("goal_evidence_unique").on(table.goalId, table.evidenceId),
  ],
);
