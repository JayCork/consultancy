import { SQL, sql } from "drizzle-orm";
import {
  uuid,
  real,
  pgTable,
  varchar,
  timestamp,
  boolean,
  text,
} from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helpers";
import { projectRoleEnum, sectorEnum } from "./enums";
import { usersTable } from "./users";

export const projectsTable = pgTable("projects", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 610 }).notNull(),
  description: text().notNull(),
  category: varchar({ length: 100 }), // e.g., "Engineering", "Delivery"
  sector: sectorEnum().notNull().default("commercial"),
  ...timestamps,
});

export const userProjectRolesTable = pgTable("user_project_roles", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid()
    .notNull()
    .references(() => usersTable.id),
  project_id: uuid()
    .notNull()
    .references(() => projectsTable.id),
  role: projectRoleEnum().notNull(),
  start_date: timestamp({ precision: 3 }).defaultNow(),
  end_date: timestamp({ precision: 3 }),
  allocation_percentage: real().notNull().default(100),
  ...timestamps,
});
