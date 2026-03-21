import { uuid, pgTable, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helpers";
import { accessPurposeEnum } from "./enums";
import { usersTable } from "./users";

// Logs who accessed which user's data, when, for what purpose, and from which IP address, and exactly which data they accessed (e.g. which columns or which rows) for auditing purposes. This is important for compliance with data protection regulations and for internal security audits. The application layer should write to this table whenever a user accesses another user's data, and it should include the viewer's user ID, the target user's ID, the purpose of access, the IP address of the viewer, and the specific data accessed (e.g. which columns or rows).
export const auditLogsTable = pgTable("audit_logs", {
  id: uuid().primaryKey().defaultRandom(),
  viewer_id: uuid()
    .notNull()
    .references(() => usersTable.id),
  target_id: uuid()
    .notNull()
    .references(() => usersTable.id),
  data_field: jsonb().notNull(),

  timestamp: timestamp({ precision: 3 }).defaultNow(),
  access_purpose: accessPurposeEnum().notNull(),
  ip_address: varchar({ length: 255 }).notNull(),
  ...timestamps,
});
