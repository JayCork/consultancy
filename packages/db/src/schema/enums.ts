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

// Organizations
export const endorsementRoutingPolicyEnum = pgEnum(
  "endorsement_routing_policy",
  ["project_and_managers", "project_only", "managers_only", "org_wide"],
);

// Users
export const userRelationshipTypeEnum = pgEnum("user_relationship_type", [
  "line_manager",
  "technical_manager",
  "mentor",
  "mentee",
  "peer",
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
  "visible_to_subject",
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
