import { varchar, timestamp } from "drizzle-orm/pg-core";

export const timestamps = {
  updated_at: timestamp({ precision: 6 }),
  created_at: timestamp({ precision: 6 }).defaultNow().notNull(),
  deleted_at: timestamp({ precision: 6 }),
};

export const address = {
  street_address: varchar({ length: 255 }).notNull(),
  city: varchar({ length: 255 }),
  state: varchar({ length: 255 }),
  area_code: varchar({ length: 10 }).notNull(),
  country: varchar({ length: 255 }).notNull(),
};
