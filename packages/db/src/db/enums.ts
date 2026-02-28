import { pgEnum } from "drizzle-orm/pg-core";

export const visaTypesEnum = pgEnum("visa_types", [
  "standard visitor",
  "business visitor",
  "marraige visitor",
  "parent of a child visitor",
  "global talent",
  "skilled worker",
  "innovator founder",
  "scaleup",
  "sole representative",
  "tier 5 temporary worker",
  "global business mobility",
  "youth mobility scheme",
  "student",
  "short-term study",
  "spouse or partner",
  "dependent",
  "ancestry",
  "family reunion",
  "unmarried partner",
  "fiance",
]);

export const clearanceLevelsEnum = pgEnum("clearance_levels", [
  "baseline personnel security standard",
  "accreditation check",
  "counter terrorist check",
  "security check",
  "enhanced security check",
  "developed vetting check",
  "enhanced developed vetting check",
]);


export const citizenshipAquishitionMethodEnum = pgEnum("citizenship_aquisition_methods", [
  "birth",
  "naturalization",
  "marriage",
  "descent",
  "adoption",
]);


export const projectRoleEnum = pgEnum("project_roles", [
  "manager",
  "developer",
  "designer",
  "tester",
  "analyst",
]);


export const relationshipEnum = pgEnum("relationship_types", [
  "manager",
  "peer",
  "mentor",
  "mentee",
  "colleague",
]);

export const accessPurposeEnum = pgEnum("access_purposes", [
  "view",
  "edit",
  "delete",
  "create",
]);