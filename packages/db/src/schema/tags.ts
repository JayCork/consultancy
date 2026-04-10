import {
  pgTable,
  uuid,
  text,
  AnyPgColumn,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { organizationsTable } from "./organizations";
import { timestamps } from "../columns.helpers";
import { frameworkLevelEnum, tagTypeEnum } from "./enums";
import { table } from "console";
import { ref } from "process";
import { referenceSkillsTable } from "./reference";

export const tagsTable = pgTable(
  "tags",
  {
    id: uuid().primaryKey().defaultRandom(),
    organization_id: uuid().references(() => organizationsTable.id),
    name: text().notNull(),
    tag_type: tagTypeEnum().notNull(),
    notes: text(), // Any additional notes about the tag, e.g. definition, usage guidelines, etc.
    ...timestamps,
  },
  (table) => [
    uniqueIndex("tags_org_name_unique").on(table.organization_id, table.name),
  ],
);
