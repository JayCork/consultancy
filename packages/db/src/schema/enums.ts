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
  ["project_and_managers", "project_only", "managers_only"],
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

// Platform access roles — controls visibility of sensitive data (e.g. clearance levels)
export const platformRoleEnum = pgEnum("platform_role", [
  "member",
  "leadership_team",
  "admin",
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

export const projectStatusEnum = pgEnum("project_status", [
  // Pre-contract
  "opportunity", // Potential work identified; no formal bid started
  "qualifying", // Assessing fit, capacity, clearance requirements
  "bidding", // Formal proposal / ITT response in progress
  "bid_submitted", // Awaiting client decision
  "bid_won", // Award confirmed; contract not yet signed
  "bid_lost", // Bid unsuccessful — terminal
  // Contract / mobilisation
  "contract_review", // Legal/commercial review of terms
  "contract_signed", // Contract executed; mobilisation begins
  "mobilising", // Team assembly, accreditations, environment setup
  // Delivery
  "discovery", // Requirements gathering, stakeholder mapping
  "in_delivery", // Active development / delivery sprints
  "uat", // User Acceptance Testing — client-led validation
  "hypercare", // Intensive post-go-live support window
  // Sustain
  "support", // BAU support / long-term service management
  "contract_renewal", // Renewal negotiation underway; project still live
  // Close
  "closing", // Wind-down; knowledge transfer and handover
  "closed", // All obligations met — terminal
  "cancelled", // Stopped mid-stream by either party — terminal
]);

export const projectFundingModelEnum = pgEnum("project_funding_model", [
  "time_and_materials",
  "fixed_price",
  "capped_time_and_materials",
  "retainer",
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
