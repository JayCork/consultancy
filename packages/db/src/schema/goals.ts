import { pgTable, uuid, text, date, uniqueIndex } from "drizzle-orm/pg-core";
import { goalStatusEnum, goalVisibilityEnum } from "./enums";
import { evidenceTable } from "./evidence";
import { usersTable } from "./users";

export const goalsTable = pgTable("goals", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid().notNull().references(() => usersTable.id),
  title: text().notNull(),
  description: text(),
  target_date: date(),
  status: goalStatusEnum().notNull().default("active"),
  visibility: goalVisibilityEnum().notNull().default("private"),
});

export const goalEvidenceTable = pgTable("goal_evidence", {
  id: uuid().primaryKey().defaultRandom(),
  goal_id: uuid().notNull().references(() => goalsTable.id),
  evidence_id: uuid().notNull().references(() => evidenceTable.id),
}, (table) => [
  uniqueIndex("goal_evidence_unique").on(table.goal_id, table.evidence_id),
]);
