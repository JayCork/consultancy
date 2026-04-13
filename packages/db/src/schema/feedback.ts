import { pgTable, uuid, text, boolean, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { feedbackVisibilityEnum } from "./enums";
import { projectsTable } from "./projects";
import { usersTable } from "./users";
import { organizationsTable } from "./organizations";
import { timestamps } from "../columns.helpers";

export const feedbackTable = pgTable(
  "feedback",
  {
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
    ...timestamps,
  },
  (table) => [
    check(
      "subject_or_project_required",
      sql`${table.subject_id} IS NOT NULL OR ${table.project_id} IS NOT NULL`,
    ),
  ],
);
