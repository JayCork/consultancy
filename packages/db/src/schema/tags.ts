import {
  pgTable,
  uuid,
  text,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { organizationsTable } from "./organizations";
import { timestamps } from "../columns.helpers";
import { tagTypeEnum } from "./enums";

export const tagsTable = pgTable(
  "tags",
  {
    id: uuid().primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").references(() => organizationsTable.id),
    name: text().notNull(),
    tagType: tagTypeEnum("tag_type").notNull(),
    notes: text(), // Any additional notes about the tag, e.g. definition, usage guidelines, etc.
    ...timestamps,
  },
  (table) => [
    uniqueIndex("tags_org_name_unique").on(table.organizationId, table.name),
  ],
);
