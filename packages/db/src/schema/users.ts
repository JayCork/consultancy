import {
  pgTable,
  uuid,
  text,
  timestamp,
  uniqueIndex,
  smallint,
} from "drizzle-orm/pg-core";
import { organizationsTable } from "./organizations";
import { clearanceLevelsTable } from "./reference";
import { user } from "./auth";
import { userStatusEnum, platformRoleEnum } from "./enums";
import { timestamps } from "../columns.helpers";

export const usersTable = pgTable(
  "users",
  {
    id: uuid().primaryKey().defaultRandom(),
    status: userStatusEnum("status").notNull().default("pending_org"),
    organizationId: uuid("organization_id").references(() => organizationsTable.id),
    name: text().notNull(),
    email: text().notNull().unique(),
    externalId: text("external_id"),
    externalSource: text("external_source"),
    betterAuthId: text("better_auth_id")
      .notNull()
      .unique()
      .references(() => user.id),
    contractedHoursPerWeek: smallint("contracted_hours_per_week"),
    platformRole: platformRoleEnum("platform_role").notNull().default("member"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("users_org_external_unique").on(
      table.organizationId,
      table.externalSource,
      table.externalId,
    ),
  ],
);

export const userClearancesTable = pgTable("user_clearances", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),
  clearanceLevelId: uuid("clearance_level_id")
    .notNull()
    .references(() => clearanceLevelsTable.id),
  grantedAt: timestamp("granted_at").notNull(),
  expiresAt: timestamp("expires_at"),
  ...timestamps,
});
