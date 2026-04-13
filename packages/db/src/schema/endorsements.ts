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
    evidence_id: uuid()
      .notNull()
      .references(() => evidenceTable.id),
    endorser_id: uuid()
      .notNull()
      .references(() => usersTable.id),
    is_suggested: boolean().notNull().default(true),
    status: endorsementStatusEnum().notNull().default("pending"),
    note: text(),
    responded_at: timestamp(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("endorsements_evidence_endorser_unique").on(
      table.evidence_id,
      table.endorser_id,
    ),
  ],
);
