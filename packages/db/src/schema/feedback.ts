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
    authorId: uuid("author_id")
      .notNull()
      .references(() => usersTable.id),
    subjectId: uuid("subject_id").references(() => usersTable.id),
    projectId: uuid("project_id").references(() => projectsTable.id),
    reviewedById: uuid("reviewed_by_id").references(() => usersTable.id),
    isAnonymous: boolean("is_anonymous").notNull().default(false),
    visibility: feedbackVisibilityEnum().notNull().default("pending_review"),
    content: text().notNull(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizationsTable.id),
    ...timestamps,
  },
  (table) => [
    check(
      "subject_or_project_required",
      sql`${table.subjectId} IS NOT NULL OR ${table.projectId} IS NOT NULL`,
    ),
  ],
);
