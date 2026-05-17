import { varchar, timestamp } from "drizzle-orm/pg-core";

export const timestamps = {
  updatedAt: timestamp("updated_at", { precision: 6 }),
  createdAt: timestamp("created_at", { precision: 6 }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { precision: 6 }),
};

export const address = {
  streetAddress: varchar("street_address", { length: 255 }).notNull(),
  city: varchar("city", { length: 255 }),
  state: varchar("state", { length: 255 }),
  areaCode: varchar("area_code", { length: 10 }).notNull(),
  country: varchar("country", { length: 255 }).notNull(),
};
