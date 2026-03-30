import { pgEnum } from "drizzle-orm/pg-core";

export const visaTypesArray = [
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
] as [string, ...string[]];

export const visaTypesEnum = pgEnum("visa_types", visaTypesArray);

export const clearanceLevelsEnum = pgEnum("clearance_levels", [
  "baseline personnel security standard",
  "accreditation check",
  "counter terrorist check",
  "security check",
  "enhanced security check",
  "developed vetting check",
  "enhanced developed vetting check",
]);

export const citizenshipAcquisitionMethodEnum = pgEnum(
  "citizenship_acquisition_methods",
  ["birth", "naturalization", "marriage", "descent", "adoption"],
);

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

// Controls who is permitted to verify another user's evidence submissions.
// Configurable per organisation; defaults to relationship_only.
export const verificationPolicyEnum = pgEnum("verification_policy", [
  "relationship_only", // (default) only active mentors and managers of the author
  "peers_and_above",   // mentor, manager, peer, or colleague of the author
  "same_project",      // any user sharing an active project assignment with the author
  "any_member",        // any member of the same organisation
]);

export const accessPurposeEnum = pgEnum("access_purposes", [
  "bid_preparation",
  "promotion_review",
  "security_renewal",
  "compliance_audit",
  "line_management",
  "pay_review",
]);

export const evidenceStatusArray = [
  "draft",
  "pending_verification",
  "verified",
] as const;

export type EvidenceStatus = (typeof evidenceStatusArray)[number];

export const evidenceStatusEnum = pgEnum("evidence_status", [
  ...evidenceStatusArray,
]);

export const sectorEnum = pgEnum("sectors", [
  "central_government",
  "defence",
  "health",
  "justice",
  "transport",
  "local_government",
  "education",
  "commercial",
]);

export const securityContextEnum = pgEnum("security_contexts", [
  "public_facing",
  "official",
  "official_sensitive",
  "high_side_sc",
  "high_side_dv",
]);
