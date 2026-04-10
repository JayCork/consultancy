import {
  pgTable,
  uuid,
  text,
  integer,
  type AnyPgColumn,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import {
  evidenceStatusEnum,
  competencyTypeEnum,
  invitationStatusEnum,
  projectRoleEnum,
} from "./enums";
import { usersTable } from "./users";
import { projectsTable } from "./projects";
import { competenciesTable } from "./competencies";
import { timestamps } from "../columns.helpers";
import { organizationsTable } from "./organizations";

export const invitationsTable = pgTable("invitations", {
  id: uuid().primaryKey().defaultRandom(),
  organization_id: uuid()
    .notNull()
    .references(() => organizationsTable.id),
  email: varchar().notNull(),
  token: text().notNull().unique(),
  status: invitationStatusEnum().notNull().default("pending"),
  invited_by: uuid()
    .notNull()
    .references(() => usersTable.id),
  expires_at: timestamp().notNull(),
  accepted_at: timestamp(),
  ...timestamps,
});
