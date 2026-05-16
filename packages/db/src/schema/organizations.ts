import { timestamps } from "../columns.helpers";
import {
  uuid,
  pgTable,
  boolean,
  text,
  integer,
  uniqueIndex,
  decimal,
  foreignKey,
} from "drizzle-orm/pg-core";
import { endorsementRoutingPolicyEnum, regionEnum } from "./enums";
import { relations } from "drizzle-orm/relations";

export const organizationsTable = pgTable(
  "organizations",
  {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    promotionThreshold: integer("promotion_threshold").notNull().default(80),
    endorsementsRequired: integer("endorsements_required").notNull().default(2),
    endorsementRoutingPolicy: endorsementRoutingPolicyEnum("endorsement_routing_policy")
      .notNull()
      .default("project_and_managers"),
    feedbackReviewRequired: boolean("feedback_review_required").notNull().default(true),
    externalId: text("external_id"),
    externalSource: text("external_source"),
    region: regionEnum().notNull().default("GBR"),
    targetMarginPct: decimal("target_margin_pct", { precision: 5, scale: 2 })
      .notNull()
      .default("30.00"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("organizations_external_source_external_id_unique").on(
      table.externalSource,
      table.externalId,
    ),
  ],
);

export const organizationUnitsTable = pgTable(
  "organization_units",
  {
    id: uuid().primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizationsTable.id),
    parentId: uuid("parent_id"), // no .references() — avoids ts(7024)
    name: text().notNull(),
    unitType: text("unit_type").notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("organization_units_organization_id_name_unique").on(
      table.organizationId,
      table.name,
    ),
    foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
      name: "organization_units_parent_id_fk",
    }),
  ],
);

export const orgUnitsRelations = relations(
  organizationUnitsTable,
  ({ one, many }) => ({
    organisation: one(organizationsTable, {
      fields: [organizationUnitsTable.organizationId],
      references: [organizationsTable.id],
    }),
    parent: one(organizationUnitsTable, {
      fields: [organizationUnitsTable.parentId],
      references: [organizationUnitsTable.id],
      relationName: "parent_child",
    }),
    children: many(organizationUnitsTable, { relationName: "parent_child" }),
  }),
);
