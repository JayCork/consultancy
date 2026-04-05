import { timestamps } from "../columns.helpers";
import {
  uuid,
  pgTable,
  boolean,
  text,
  integer,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { endorsementRoutingPolicyEnum } from "./enums";

export const organizationsTable = pgTable(
  "organizations",
  {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    promotion_threshold: integer().notNull().default(80),
    endorsements_required: integer().notNull().default(2),
    endorsement_routing_policy: endorsementRoutingPolicyEnum()
      .notNull()
      .default("project_and_managers"),
    feedback_review_required: boolean().notNull().default(true),
    external_id: text(),
    external_source: text(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("organizations_external_source_external_id_unique").on(
      table.external_source,
      table.external_id,
    ),
  ],
);
