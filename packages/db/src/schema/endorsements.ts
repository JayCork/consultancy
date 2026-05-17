import {
  pgTable,
  uuid,
  text,
  boolean,
  uniqueIndex,
  timestamp,
} from "drizzle-orm/pg-core";
import { endorsementStatusEnum } from "./enums";
import { evidenceTable } from "./evidence";
import { usersTable } from "./users";
import { timestamps } from "../columns.helpers";

export const endorsementsTable = pgTable(
  "endorsements",
  {
    id: uuid().primaryKey().defaultRandom(),
    evidenceId: uuid("evidence_id")
      .notNull()
      .references(() => evidenceTable.id),
    endorserId: uuid("endorser_id")
      .notNull()
      .references(() => usersTable.id),
    isSuggested: boolean("is_suggested").notNull().default(true),
    status: endorsementStatusEnum().notNull().default("pending"),
    note: text(),
    respondedAt: timestamp("responded_at"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("endorsements_evidence_endorser_unique").on(
      table.evidenceId,
      table.endorserId,
    ),
  ],
);
