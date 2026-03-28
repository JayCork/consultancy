import { uuid, pgTable, varchar, integer } from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helpers";

// Multitenancy support
export const organizationsTable = pgTable("organizations", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  // Career progression settings
  promotion_readiness_threshold: integer().notNull().default(80),
  evidence_required_per_skill: integer().notNull().default(3),
  ...timestamps,
});
