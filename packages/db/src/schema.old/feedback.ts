import { uuid, pgTable, boolean, text } from "drizzle-orm/pg-core";
import { evidenceTable } from "./evidence";
import { timestamps } from "../columns.helpers";
import { usersTable } from "./users";

export const feedbackTable = pgTable("feedback", {
  id: uuid().primaryKey().defaultRandom(),
  evidence_id: uuid()
    .notNull()
    .references(() => evidenceTable.id),
  author_id: uuid()
    .notNull()
    .references(() => usersTable.id),
  content: text().notNull(),
  // Computed in application layer when querying — see queries/feedback.ts
  // is_peer_feedback: whether author shares a project with evidence author
  // is_manager_feedback: whether author has active relationship with evidence author
  ...timestamps,
});
