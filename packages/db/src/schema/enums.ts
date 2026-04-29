import { pgEnum } from "drizzle-orm/pg-core";

// Competencies
export const competencyTypeEnum = pgEnum("competency_type", [
  "technology",
  "practice",
  "methodology",
]);

export const competencyProficiencyEnum = pgEnum("competency_proficiency", [
  "aware",
  "practising",
  "confident",
  "leading",
]);

export const competencyDispositionEnum = pgEnum("competency_disposition", [
  "seeking",
  "neutral",
  "open",
  "winding_down",
  "prefer_not",
]);

export const competencySourceEnum = pgEnum("competency_source", [
  "verified_evidence", // calculated from at least one verified evidence entry
  "self_reported", // user has asserted this without verified evidence backing
  "imported", // came in via external_id/external_source (BambooHR, Okta etc.)
]);

// Data classification for evidence
export const dataClassificationEnum = pgEnum("data_classification", [
  "public",
  "official",
  "official_sensitive",
  "secret",
]);

// organizations
export const endorsementRoutingPolicyEnum = pgEnum(
  "endorsement_routing_policy",
  ["project_and_managers", "project_only", "managers_only", "org_wide"],
);

// ISO 3166-1 alpha-3 country codes for potential future use in user profiles, project locations, etc.
export const regionEnum = pgEnum("region", [
  "GBR",
  "USA",
  "CAN",
  "AUS",
  "NZL",
  "IRL",
]);

// Users
export const userRelationshipTypeEnum = pgEnum("user_relationship_type", [
  "line_manager",
  "technical_manager",
  "mentor",
  "mentee",
  "peer",
]);

export const userStatusEnum = pgEnum("user_status", [
  "pending_org", // registered, no org yet
  "pending_approval", // org known, awaiting admin approval
  "active",
  "suspended",
]);

// Projects
export const projectRoleEnum = pgEnum("project_role", [
  "developer",
  "tech_lead",
  "delivery_manager",
  "analyst",
  "designer",
  "project_manager",
]);

// Evidence
export const evidenceStatusEnum = pgEnum("evidence_status", [
  "draft",
  "submitted",
  "verified",
]);

// Endorsements
export const endorsementStatusEnum = pgEnum("endorsement_status", [
  "pending",
  "endorsed",
  "skipped",
  "flagged",
]);

// Feedback
export const feedbackVisibilityEnum = pgEnum("feedback_visibility", [
  "pending_review",
  "approved",
  "rejected",
  "published",
]);

// Framworks
export const frameworkLevelEnum = pgEnum("framework_level", [
  "associate",
  "junior",
  "mid",
  "senior",
  "lead",
  "principal",
]);

// Goals
export const goalStatusEnum = pgEnum("goal_status", [
  "active",
  "achieved",
  "abandoned",
]);

export const goalVisibilityEnum = pgEnum("goal_visibility", [
  "private",
  "shared_with_manager",
]);

//  Invitations
export const invitationStatusEnum = pgEnum("invitation_status", [
  "pending",
  "accepted",
  "expired",
  "revoked",
]);

// Tags

export const tagTypeEnum = pgEnum("tag_type", [
  "technology",
  "tool",
  "practice",
  "methodology",
  "domain",
]);
