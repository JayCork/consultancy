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
  user_id: uuid()
    .notNull()
    .references(() => usersTable.id),
  title: text().notNull(),
  description: text(),
  target_date: date(),
  status: goalStatusEnum().notNull().default("active"),
  visibility: goalVisibilityEnum().notNull().default("private"),
  target_role_id: uuid().references(() => frameworkRolesTable.id),
  ...timestamps,
});

export const goalEvidenceTable = pgTable(
  "goal_evidence",
  {
    id: uuid().primaryKey().defaultRandom(),
    goal_id: uuid()
      .notNull()
      .references(() => goalsTable.id),
    evidence_id: uuid()
      .notNull()
      .references(() => evidenceTable.id),
    created_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("goal_evidence_unique").on(table.goal_id, table.evidence_id),
  ],
);
