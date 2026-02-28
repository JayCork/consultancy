import { SQL, sql } from "drizzle-orm";
import {
  uuid,
  real,
  pgTable,
  varchar,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { evidenceTable } from "./evidence";

export const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
};

export const address = {
  street_address: varchar({ length: 255 }).notNull(),
  city: varchar({ length: 255 }),
  state: varchar({ length: 255 }),
  area_code: varchar({ length: 10 }).notNull(),
  country: varchar({ length: 255 }).notNull(),
};
