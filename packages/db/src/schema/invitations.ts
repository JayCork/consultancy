import {
  pgTable,
  uuid,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { invitationStatusEnum } from "./enums";
import { usersTable } from "./users";
import { timestamps } from "../columns.helpers";
import { organizationsTable } from "./organizations";

export const invitationsTable = pgTable("invitations", {
  id: uuid().primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizationsTable.id),
  email: varchar().notNull(),
  token: text().notNull().unique(),
  status: invitationStatusEnum().notNull().default("pending"),
  invitedBy: uuid("invited_by")
    .notNull()
    .references(() => usersTable.id),
  expiresAt: timestamp("expires_at").notNull(),
  acceptedAt: timestamp("accepted_at"),
  ...timestamps,
});
