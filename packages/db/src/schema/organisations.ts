import { uuid, pgTable, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helpers";

// Multitenancy support
export const organizationsTable = pgTable("organizations", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  ...timestamps,
});
