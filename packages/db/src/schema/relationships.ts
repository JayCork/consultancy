import { SQL, sql } from "drizzle-orm";
import { uuid, pgTable, timestamp, boolean } from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helpers";
import { relationshipEnum } from "./enums";
import { usersTable } from "./users";

export const userRelationshipsTable = pgTable("user_relationships", {
  id: uuid().primaryKey().defaultRandom(),
  actor_id: uuid()
    .notNull()
    .references(() => usersTable.id),
  subject_id: uuid()
    .notNull()
    .references(() => usersTable.id),
  start_date: timestamp({ precision: 3 }).defaultNow(),
  end_date: timestamp({ precision: 3 }),

  ...timestamps,
});

export const relationshipRolesTable = pgTable("relationship_to_role", {
  id: uuid().primaryKey().defaultRandom(),
  relationship_id: uuid()
    .notNull()
    .references(() => userRelationshipsTable.id),
  role: relationshipEnum().notNull(),
  ...timestamps,
});
