import { pgTable, uuid, text, boolean } from "drizzle-orm/pg-core";
import { feedbackVisibilityEnum } from "./enums";
import { projectsTable } from "./projects";
import { usersTable } from "./users";
import { organizationsTable } from "./organizations";

export const feedbackTable = pgTable("feedback", {
  id: uuid().primaryKey().defaultRandom(),
  author_id: uuid()
    .notNull()
    .references(() => usersTable.id),
  subject_id: uuid().references(() => usersTable.id),
  project_id: uuid().references(() => projectsTable.id),
  reviewed_by_id: uuid().references(() => usersTable.id),
  is_anonymous: boolean().notNull().default(false),
  visibility: feedbackVisibilityEnum().notNull().default("pending_review"),
  content: text().notNull(),
  organization_id: uuid()
    .notNull()
    .references(() => organizationsTable.id),
});
