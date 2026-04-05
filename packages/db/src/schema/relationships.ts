import { pgTable, uuid, date } from "drizzle-orm/pg-core";
import { userRelationshipTypeEnum } from "./enums";
import { usersTable } from "./users";

export const userRelationshipsTable = pgTable("user_relationships", {
  id: uuid().primaryKey().defaultRandom(),
  actor_id: uuid()
    .notNull()
    .references(() => usersTable.id),
  target_id: uuid()
    .notNull()
    .references(() => usersTable.id),
  relationship_type: userRelationshipTypeEnum().notNull(),
  start_date: date().notNull(),
  end_date: date(),
});
