import {
  uuid,
  pgTable,
  varchar,
  timestamp,
  boolean,
  text,
} from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helpers";
import {
  citizenshipAcquisitionMethodEnum,
  clearanceLevelsEnum,
  visaTypesEnum,
} from "./enums";
import { organizationsTable } from "./organisations";

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  auth_user_id: text().notNull().unique(), // Better Auth user id
  organisation_id: uuid()
    .notNull()
    .references(() => organizationsTable.id),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  role: varchar({ length: 100 }).notNull(),

  // Sensitive information that should only be viewable by users with a relationship to this user (e.g. they are in the same project or they have a relationship in the user_relationships table)
  is_contractor: boolean().notNull().default(false),
  ...timestamps,
});

export const visasTable = pgTable("visas", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid()
    .notNull()
    .references(() => usersTable.id),
  country_code: varchar({ length: 2 }).notNull(),
  visa_type: visaTypesEnum().notNull(),
  issue_date: timestamp({ precision: 3 }).defaultNow(),
  expiration_date: timestamp({ precision: 3 }),
  sponsoring_organization: varchar({ length: 255 }).notNull(),
  ...timestamps,
});

export const clearancesTable = pgTable("clearances", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid()
    .notNull()
    .references(() => usersTable.id),
  level: clearanceLevelsEnum().notNull(),
  granted_at: timestamp({ precision: 3 }).defaultNow(),
  expires_at: timestamp({ precision: 3 }),
  sponsoring_organization: varchar({ length: 255 }).notNull(),
  ...timestamps,
});

export const userCitizenshipTable = pgTable("user_citizenship", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid()
    .notNull()
    .references(() => usersTable.id),
  country_code: varchar({ length: 2 }).notNull(),
  is_primary: boolean().notNull().default(false),
  acquisition_method: citizenshipAcquisitionMethodEnum().notNull(),
  acquisition_date: timestamp({ precision: 3 }).defaultNow(),
  expiration_date: timestamp({ precision: 3 }),
  ...timestamps,
});

export const residentialAddressesTable = pgTable("residential_addresses", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid()
    .notNull()
    .references(() => usersTable.id),
  street_address: varchar({ length: 255 }).notNull(),
  city: varchar({ length: 255 }),
  area_code: varchar({ length: 10 }).notNull(),
  country_code: varchar({ length: 2 }).notNull(),
  start_date: timestamp({ precision: 3 }).defaultNow().notNull(),
  end_date: timestamp({ precision: 3 }),
  ...timestamps,
});
