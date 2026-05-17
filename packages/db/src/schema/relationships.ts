import { pgTable, uuid, date } from "drizzle-orm/pg-core";
import { userRelationshipTypeEnum } from "./enums";
import { usersTable } from "./users";
import { timestamps } from "../columns.helpers";

export const userRelationshipsTable = pgTable("user_relationships", {
  id: uuid().primaryKey().defaultRandom(),
  actorId: uuid("actor_id")
    .notNull()
    .references(() => usersTable.id),
  targetId: uuid("target_id")
    .notNull()
    .references(() => usersTable.id),
  relationshipType: userRelationshipTypeEnum("relationship_type").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  organizationId: uuid("organization_id").notNull(), // to support organization-specific relationships (e.g. manager, mentor) without needing global relationship types
  ...timestamps,
});
