import { uuid, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";
import { projectsTable, skillsTable, usersTable } from "./schema";

export const evidenceTable = pgTable("evidence_entries ", {
  id: uuid().primaryKey().defaultRandom(),
  author_id: uuid()
    .notNull()
    .references(() => usersTable.id),
  skill_id: uuid()
    .notNull()
    .references(() => skillsTable.id),
  situation: varchar({ length: 255 }).notNull(),
  task: varchar({ length: 255 }).notNull(),
  action: varchar({ length: 255 }).notNull(),
  result: varchar({ length: 255 }).notNull(),
  status: varchar({ length: 255 }).notNull().default("PENDING_VERIFICATION"),
  project_id: uuid()
    .notNull()
    .references(() => projectsTable.id),
  created_at: timestamp().defaultNow(),
});
