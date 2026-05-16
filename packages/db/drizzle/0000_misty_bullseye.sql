CREATE TYPE "public"."competency_disposition" AS ENUM('seeking', 'neutral', 'open', 'winding_down', 'prefer_not');--> statement-breakpoint
CREATE TYPE "public"."competency_proficiency" AS ENUM('aware', 'practising', 'confident', 'leading');--> statement-breakpoint
CREATE TYPE "public"."competency_source" AS ENUM('verified_evidence', 'self_reported', 'imported');--> statement-breakpoint
CREATE TYPE "public"."competency_type" AS ENUM('technology', 'practice', 'methodology');--> statement-breakpoint
CREATE TYPE "public"."data_classification" AS ENUM('public', 'official', 'official_sensitive', 'secret');--> statement-breakpoint
CREATE TYPE "public"."endorsement_routing_policy" AS ENUM('project_and_managers', 'project_only', 'managers_only');--> statement-breakpoint
CREATE TYPE "public"."endorsement_status" AS ENUM('pending', 'endorsed', 'skipped', 'flagged');--> statement-breakpoint
CREATE TYPE "public"."evidence_status" AS ENUM('draft', 'submitted', 'verified');--> statement-breakpoint
CREATE TYPE "public"."feedback_visibility" AS ENUM('pending_review', 'approved', 'rejected', 'published');--> statement-breakpoint
CREATE TYPE "public"."framework_level" AS ENUM('associate', 'junior', 'mid', 'senior', 'lead', 'principal');--> statement-breakpoint
CREATE TYPE "public"."goal_status" AS ENUM('active', 'achieved', 'abandoned');--> statement-breakpoint
CREATE TYPE "public"."goal_visibility" AS ENUM('private', 'shared_with_manager');--> statement-breakpoint
CREATE TYPE "public"."invitation_status" AS ENUM('pending', 'accepted', 'expired', 'revoked');--> statement-breakpoint
CREATE TYPE "public"."project_funding_model" AS ENUM('time_and_materials', 'fixed_price', 'capped_time_and_materials', 'retainer');--> statement-breakpoint
CREATE TYPE "public"."project_role" AS ENUM('developer', 'tech_lead', 'delivery_manager', 'analyst', 'designer', 'project_manager');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('opportunity', 'qualifying', 'bidding', 'bid_submitted', 'bid_won', 'bid_lost', 'contract_review', 'contract_signed', 'mobilising', 'discovery', 'in_delivery', 'uat', 'hypercare', 'support', 'contract_renewal', 'closing', 'closed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."region" AS ENUM('GBR', 'USA', 'CAN', 'AUS', 'NZL', 'IRL');--> statement-breakpoint
CREATE TYPE "public"."tag_type" AS ENUM('technology', 'tool', 'practice', 'methodology', 'domain');--> statement-breakpoint
CREATE TYPE "public"."user_relationship_type" AS ENUM('line_manager', 'technical_manager', 'mentor', 'mentee', 'peer');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('pending_org', 'pending_approval', 'active', 'suspended');--> statement-breakpoint
CREATE TABLE "bauth_accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bauth_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "bauth_sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "bauth_sso_providers" (
	"id" text PRIMARY KEY NOT NULL,
	"issuer" text NOT NULL,
	"oidc_config" text,
	"saml_config" text,
	"user_id" text,
	"provider_id" text NOT NULL,
	"organization_id" text,
	"domain" text NOT NULL,
	CONSTRAINT "bauth_sso_providers_provider_id_unique" UNIQUE("provider_id")
);
--> statement-breakpoint
CREATE TABLE "bauth_users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "bauth_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "bauth_verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "competencies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"skill_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"proficiency" "competency_proficiency" NOT NULL,
	"disposition" "competency_disposition" DEFAULT 'neutral' NOT NULL,
	"disposition_note" text,
	"source" "competency_source" DEFAULT 'self_reported' NOT NULL,
	"last_used_at" date,
	"external_id" text,
	"external_source" text,
	"created_at" timestamp (6) DEFAULT now() NOT NULL,
	"updated_at" timestamp (6)
);
--> statement-breakpoint
CREATE TABLE "credentials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"issuer" text NOT NULL,
	"issued_at" date,
	"expires_at" date,
	"credential_url" text,
	"external_id" text,
	"external_source" text,
	"updated_at" timestamp (6),
	"created_at" timestamp (6) DEFAULT now() NOT NULL,
	"deleted_at" timestamp (6)
);
--> statement-breakpoint
CREATE TABLE "endorsements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"evidence_id" uuid NOT NULL,
	"endorser_id" uuid NOT NULL,
	"is_suggested" boolean DEFAULT true NOT NULL,
	"status" "endorsement_status" DEFAULT 'pending' NOT NULL,
	"note" text,
	"responded_at" timestamp,
	"updated_at" timestamp (6),
	"created_at" timestamp (6) DEFAULT now() NOT NULL,
	"deleted_at" timestamp (6)
);
--> statement-breakpoint
CREATE TABLE "evidence_skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"evidence_id" uuid NOT NULL,
	"skill_id" uuid NOT NULL,
	"level_claimed" "framework_level" NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp (6) DEFAULT now() NOT NULL,
	"updated_at" timestamp (6)
);
--> statement-breakpoint
CREATE TABLE "evidence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"project_id" uuid,
	"parent_id" uuid,
	"version" integer DEFAULT 1 NOT NULL,
	"situation" text NOT NULL,
	"task" text NOT NULL,
	"action" text NOT NULL,
	"result" text NOT NULL,
	"status" "evidence_status" DEFAULT 'draft' NOT NULL,
	"data_classification" "data_classification" DEFAULT 'official' NOT NULL,
	"updated_at" timestamp (6),
	"created_at" timestamp (6) DEFAULT now() NOT NULL,
	"deleted_at" timestamp (6)
);
--> statement-breakpoint
CREATE TABLE "evidence_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"evidence_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	"created_at" timestamp (6) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_id" uuid NOT NULL,
	"subject_id" uuid,
	"project_id" uuid,
	"reviewed_by_id" uuid,
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"visibility" "feedback_visibility" DEFAULT 'pending_review' NOT NULL,
	"content" text NOT NULL,
	"organization_id" uuid NOT NULL,
	"updated_at" timestamp (6),
	"created_at" timestamp (6) DEFAULT now() NOT NULL,
	"deleted_at" timestamp (6),
	CONSTRAINT "subject_or_project_required" CHECK ("feedback"."subject_id" IS NOT NULL OR "feedback"."project_id" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "goal_evidence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"goal_id" uuid NOT NULL,
	"evidence_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "goals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"target_date" date,
	"status" "goal_status" DEFAULT 'active' NOT NULL,
	"visibility" "goal_visibility" DEFAULT 'private' NOT NULL,
	"target_role_id" uuid,
	"updated_at" timestamp (6),
	"created_at" timestamp (6) DEFAULT now() NOT NULL,
	"deleted_at" timestamp (6)
);
--> statement-breakpoint
CREATE TABLE "job_grades" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"framework_role_id" uuid NOT NULL,
	"name" text NOT NULL,
	"external_id" text,
	"external_source" text,
	"updated_at" timestamp (6),
	"created_at" timestamp (6) DEFAULT now() NOT NULL,
	"deleted_at" timestamp (6)
);
--> statement-breakpoint
CREATE TABLE "user_grade_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"job_grade_id" uuid NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"updated_at" timestamp (6),
	"created_at" timestamp (6) DEFAULT now() NOT NULL,
	"deleted_at" timestamp (6)
);
--> statement-breakpoint
CREATE TABLE "invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"email" varchar NOT NULL,
	"token" text NOT NULL,
	"status" "invitation_status" DEFAULT 'pending' NOT NULL,
	"invited_by" uuid NOT NULL,
	"expires_at" timestamp NOT NULL,
	"accepted_at" timestamp,
	"updated_at" timestamp (6),
	"created_at" timestamp (6) DEFAULT now() NOT NULL,
	"deleted_at" timestamp (6),
	CONSTRAINT "invitations_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "organization_units" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"parent_id" uuid,
	"name" text NOT NULL,
	"unit_type" text NOT NULL,
	"updated_at" timestamp (6),
	"created_at" timestamp (6) DEFAULT now() NOT NULL,
	"deleted_at" timestamp (6)
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"promotion_threshold" integer DEFAULT 80 NOT NULL,
	"endorsements_required" integer DEFAULT 2 NOT NULL,
	"endorsement_routing_policy" "endorsement_routing_policy" DEFAULT 'project_and_managers' NOT NULL,
	"feedback_review_required" boolean DEFAULT true NOT NULL,
	"external_id" text,
	"external_source" text,
	"region" "region" DEFAULT 'GBR' NOT NULL,
	"target_margin_pct" numeric(5, 2) DEFAULT '30.00' NOT NULL,
	"updated_at" timestamp (6),
	"created_at" timestamp (6) DEFAULT now() NOT NULL,
	"deleted_at" timestamp (6)
);
--> statement-breakpoint
CREATE TABLE "pay_bands" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"job_grade_id" uuid NOT NULL,
	"band_floor" numeric(10, 2) NOT NULL,
	"band_ceiling" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'GBP' NOT NULL,
	"effective_from" date NOT NULL,
	"effective_to" date,
	"updated_at" timestamp (6),
	"created_at" timestamp (6) DEFAULT now() NOT NULL,
	"deleted_at" timestamp (6)
);
--> statement-breakpoint
CREATE TABLE "project_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"projectRole" "project_role" NOT NULL,
	"job_grade_id" uuid,
	"allocated_hours_per_week" numeric(5, 2),
	"start_date" timestamp NOT NULL,
	"end_date" timestamp
);
--> statement-breakpoint
CREATE TABLE "project_milestones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"label" text NOT NULL,
	"notes" text,
	"date" date NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_at" timestamp (6),
	"created_at" timestamp (6) DEFAULT now() NOT NULL,
	"deleted_at" timestamp (6)
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"lead_id" uuid NOT NULL,
	"name" text NOT NULL,
	"short_name" text,
	"code_name" text,
	"organization_unit_id" uuid NOT NULL,
	"minimum_clearance_id" uuid,
	"funding_model" "project_funding_model" DEFAULT 'time_and_materials' NOT NULL,
	"contracted_value" numeric(12, 2),
	"currency" varchar(3) DEFAULT 'GBP' NOT NULL,
	"margin_override_pct" numeric(5, 2),
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"region" "region" DEFAULT 'GBR' NOT NULL,
	"status" "project_status" DEFAULT 'opportunity' NOT NULL,
	"updated_at" timestamp (6),
	"created_at" timestamp (6) DEFAULT now() NOT NULL,
	"deleted_at" timestamp (6)
);
--> statement-breakpoint
CREATE TABLE "clearance_levels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"shortName" text NOT NULL,
	"rank" integer NOT NULL,
	"description" text,
	"region" "region" DEFAULT 'GBR' NOT NULL,
	"updated_at" timestamp (6),
	"created_at" timestamp (6) DEFAULT now() NOT NULL,
	"deleted_at" timestamp (6),
	CONSTRAINT "clearance_levels_rank_unique" UNIQUE("rank")
);
--> statement-breakpoint
CREATE TABLE "framework_role_families" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid,
	"name" text NOT NULL,
	"description" text,
	"updated_at" timestamp (6),
	"created_at" timestamp (6) DEFAULT now() NOT NULL,
	"deleted_at" timestamp (6)
);
--> statement-breakpoint
CREATE TABLE "framework_role_mappings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"framework_role_id" uuid NOT NULL,
	"reference_role_id" uuid NOT NULL,
	"updated_at" timestamp (6),
	"created_at" timestamp (6) DEFAULT now() NOT NULL,
	"deleted_at" timestamp (6)
);
--> statement-breakpoint
CREATE TABLE "framework_role_skill_expectations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"framework_role_id" uuid NOT NULL,
	"skill_id" uuid NOT NULL,
	"minimum_level" "framework_level" NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp (6),
	"created_at" timestamp (6) DEFAULT now() NOT NULL,
	"deleted_at" timestamp (6)
);
--> statement-breakpoint
CREATE TABLE "framework_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid,
	"family_id" uuid NOT NULL,
	"level" "framework_level" NOT NULL,
	"display_name" text NOT NULL,
	"updated_at" timestamp (6),
	"created_at" timestamp (6) DEFAULT now() NOT NULL,
	"deleted_at" timestamp (6)
);
--> statement-breakpoint
CREATE TABLE "reference_frameworks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"version" text,
	"url" text,
	"updated_at" timestamp (6),
	"created_at" timestamp (6) DEFAULT now() NOT NULL,
	"deleted_at" timestamp (6)
);
--> statement-breakpoint
CREATE TABLE "reference_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"framework_id" uuid NOT NULL,
	"code" text,
	"name" text NOT NULL,
	"description" text,
	"updated_at" timestamp (6),
	"created_at" timestamp (6) DEFAULT now() NOT NULL,
	"deleted_at" timestamp (6)
);
--> statement-breakpoint
CREATE TABLE "reference_skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"framework_id" uuid NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"min_level" integer DEFAULT 0 NOT NULL,
	"max_level" integer DEFAULT 7 NOT NULL,
	"updated_at" timestamp (6),
	"created_at" timestamp (6) DEFAULT now() NOT NULL,
	"deleted_at" timestamp (6)
);
--> statement-breakpoint
CREATE TABLE "user_relationships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" uuid NOT NULL,
	"target_id" uuid NOT NULL,
	"relationship_type" "user_relationship_type" NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"organization_id" uuid NOT NULL,
	"updated_at" timestamp (6),
	"created_at" timestamp (6) DEFAULT now() NOT NULL,
	"deleted_at" timestamp (6)
);
--> statement-breakpoint
CREATE TABLE "resource_scenario_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scenario_id" uuid NOT NULL,
	"user_id" uuid,
	"project_role" "project_role" NOT NULL,
	"job_grade_id" uuid NOT NULL,
	"allocated_hours_per_week" numeric(5, 2) NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"notes" text,
	"updated_at" timestamp (6),
	"created_at" timestamp (6) DEFAULT now() NOT NULL,
	"deleted_at" timestamp (6)
);
--> statement-breakpoint
CREATE TABLE "resource_scenarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_by" uuid NOT NULL,
	"committed_at" timestamp with time zone,
	"updated_at" timestamp (6),
	"created_at" timestamp (6) DEFAULT now() NOT NULL,
	"deleted_at" timestamp (6)
);
--> statement-breakpoint
CREATE TABLE "skill_framework_mappings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"skill_id" uuid NOT NULL,
	"reference_skill_id" uuid NOT NULL,
	"notes" text,
	"updated_at" timestamp (6),
	"created_at" timestamp (6) DEFAULT now() NOT NULL,
	"deleted_at" timestamp (6)
);
--> statement-breakpoint
CREATE TABLE "skill_levels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"skill_id" uuid NOT NULL,
	"level" "framework_level" NOT NULL,
	"description" text,
	"updated_at" timestamp (6),
	"created_at" timestamp (6) DEFAULT now() NOT NULL,
	"deleted_at" timestamp (6)
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid,
	"name" text NOT NULL,
	"description" text,
	"updated_at" timestamp (6),
	"created_at" timestamp (6) DEFAULT now() NOT NULL,
	"deleted_at" timestamp (6)
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid,
	"name" text NOT NULL,
	"tag_type" "tag_type" NOT NULL,
	"notes" text,
	"updated_at" timestamp (6),
	"created_at" timestamp (6) DEFAULT now() NOT NULL,
	"deleted_at" timestamp (6)
);
--> statement-breakpoint
CREATE TABLE "user_clearances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"clearance_level_id" uuid NOT NULL,
	"granted_at" timestamp NOT NULL,
	"expires_at" timestamp,
	"updated_at" timestamp (6),
	"created_at" timestamp (6) DEFAULT now() NOT NULL,
	"deleted_at" timestamp (6)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" "user_status" DEFAULT 'pending_org' NOT NULL,
	"organization_id" uuid,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"external_id" text,
	"external_source" text,
	"better_auth_id" text NOT NULL,
	"contracted_hours_per_week" smallint,
	"updated_at" timestamp (6),
	"created_at" timestamp (6) DEFAULT now() NOT NULL,
	"deleted_at" timestamp (6),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_better_auth_id_unique" UNIQUE("better_auth_id")
);
--> statement-breakpoint
ALTER TABLE "bauth_accounts" ADD CONSTRAINT "bauth_accounts_user_id_bauth_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."bauth_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bauth_sessions" ADD CONSTRAINT "bauth_sessions_user_id_bauth_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."bauth_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bauth_sso_providers" ADD CONSTRAINT "bauth_sso_providers_user_id_bauth_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."bauth_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competencies" ADD CONSTRAINT "competencies_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competencies" ADD CONSTRAINT "competencies_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competencies" ADD CONSTRAINT "competencies_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "endorsements" ADD CONSTRAINT "endorsements_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "endorsements" ADD CONSTRAINT "endorsements_endorser_id_users_id_fk" FOREIGN KEY ("endorser_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_skills" ADD CONSTRAINT "evidence_skills_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_skills" ADD CONSTRAINT "evidence_skills_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_parent_id_evidence_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."evidence"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_tags" ADD CONSTRAINT "evidence_tags_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_tags" ADD CONSTRAINT "evidence_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_subject_id_users_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_reviewed_by_id_users_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goal_evidence" ADD CONSTRAINT "goal_evidence_goal_id_goals_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."goals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goal_evidence" ADD CONSTRAINT "goal_evidence_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goals" ADD CONSTRAINT "goals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goals" ADD CONSTRAINT "goals_target_role_id_framework_roles_id_fk" FOREIGN KEY ("target_role_id") REFERENCES "public"."framework_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_grades" ADD CONSTRAINT "job_grades_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_grades" ADD CONSTRAINT "job_grades_framework_role_id_framework_roles_id_fk" FOREIGN KEY ("framework_role_id") REFERENCES "public"."framework_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_grade_assignments" ADD CONSTRAINT "user_grade_assignments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_grade_assignments" ADD CONSTRAINT "user_grade_assignments_job_grade_id_job_grades_id_fk" FOREIGN KEY ("job_grade_id") REFERENCES "public"."job_grades"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invited_by_users_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_units" ADD CONSTRAINT "organization_units_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_units" ADD CONSTRAINT "organization_units_parent_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."organization_units"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pay_bands" ADD CONSTRAINT "pay_bands_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pay_bands" ADD CONSTRAINT "pay_bands_job_grade_id_job_grades_id_fk" FOREIGN KEY ("job_grade_id") REFERENCES "public"."job_grades"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_job_grade_id_job_grades_id_fk" FOREIGN KEY ("job_grade_id") REFERENCES "public"."job_grades"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_milestones" ADD CONSTRAINT "project_milestones_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_milestones" ADD CONSTRAINT "project_milestones_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_lead_id_users_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_organization_unit_id_organization_units_id_fk" FOREIGN KEY ("organization_unit_id") REFERENCES "public"."organization_units"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_minimum_clearance_id_clearance_levels_id_fk" FOREIGN KEY ("minimum_clearance_id") REFERENCES "public"."clearance_levels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "framework_role_families" ADD CONSTRAINT "framework_role_families_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "framework_role_mappings" ADD CONSTRAINT "framework_role_mappings_framework_role_id_framework_roles_id_fk" FOREIGN KEY ("framework_role_id") REFERENCES "public"."framework_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "framework_role_mappings" ADD CONSTRAINT "framework_role_mappings_reference_role_id_reference_roles_id_fk" FOREIGN KEY ("reference_role_id") REFERENCES "public"."reference_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "framework_role_skill_expectations" ADD CONSTRAINT "framework_role_skill_expectations_framework_role_id_framework_roles_id_fk" FOREIGN KEY ("framework_role_id") REFERENCES "public"."framework_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "framework_role_skill_expectations" ADD CONSTRAINT "framework_role_skill_expectations_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "framework_roles" ADD CONSTRAINT "framework_roles_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "framework_roles" ADD CONSTRAINT "framework_roles_family_id_framework_role_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."framework_role_families"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reference_roles" ADD CONSTRAINT "reference_roles_framework_id_reference_frameworks_id_fk" FOREIGN KEY ("framework_id") REFERENCES "public"."reference_frameworks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reference_skills" ADD CONSTRAINT "reference_skills_framework_id_reference_frameworks_id_fk" FOREIGN KEY ("framework_id") REFERENCES "public"."reference_frameworks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_relationships" ADD CONSTRAINT "user_relationships_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_relationships" ADD CONSTRAINT "user_relationships_target_id_users_id_fk" FOREIGN KEY ("target_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_scenario_assignments" ADD CONSTRAINT "resource_scenario_assignments_scenario_id_resource_scenarios_id_fk" FOREIGN KEY ("scenario_id") REFERENCES "public"."resource_scenarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_scenario_assignments" ADD CONSTRAINT "resource_scenario_assignments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_scenario_assignments" ADD CONSTRAINT "resource_scenario_assignments_job_grade_id_job_grades_id_fk" FOREIGN KEY ("job_grade_id") REFERENCES "public"."job_grades"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_scenarios" ADD CONSTRAINT "resource_scenarios_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_scenarios" ADD CONSTRAINT "resource_scenarios_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skill_framework_mappings" ADD CONSTRAINT "skill_framework_mappings_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skill_framework_mappings" ADD CONSTRAINT "skill_framework_mappings_reference_skill_id_reference_skills_id_fk" FOREIGN KEY ("reference_skill_id") REFERENCES "public"."reference_skills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skill_levels" ADD CONSTRAINT "skill_levels_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skills" ADD CONSTRAINT "skills_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tags" ADD CONSTRAINT "tags_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_clearances" ADD CONSTRAINT "user_clearances_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_clearances" ADD CONSTRAINT "user_clearances_clearance_level_id_clearance_levels_id_fk" FOREIGN KEY ("clearance_level_id") REFERENCES "public"."clearance_levels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_better_auth_id_bauth_users_id_fk" FOREIGN KEY ("better_auth_id") REFERENCES "public"."bauth_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "bauth_accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "bauth_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "bauth_verifications" USING btree ("identifier");--> statement-breakpoint
CREATE UNIQUE INDEX "competencies_user_skill_unique" ON "competencies" USING btree ("user_id","skill_id");--> statement-breakpoint
CREATE UNIQUE INDEX "endorsements_evidence_endorser_unique" ON "endorsements" USING btree ("evidence_id","endorser_id");--> statement-breakpoint
CREATE UNIQUE INDEX "evidence_skills_unique" ON "evidence_skills" USING btree ("evidence_id","skill_id");--> statement-breakpoint
CREATE UNIQUE INDEX "evidence_tags_unique" ON "evidence_tags" USING btree ("evidence_id","tag_id");--> statement-breakpoint
CREATE UNIQUE INDEX "goal_evidence_unique" ON "goal_evidence" USING btree ("goal_id","evidence_id");--> statement-breakpoint
CREATE UNIQUE INDEX "organization_units_organization_id_name_unique" ON "organization_units" USING btree ("organization_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "organizations_external_source_external_id_unique" ON "organizations" USING btree ("external_source","external_id");--> statement-breakpoint
CREATE UNIQUE INDEX "project_members_active_unique" ON "project_members" USING btree ("project_id","user_id") WHERE "project_members"."end_date" is null;--> statement-breakpoint
CREATE UNIQUE INDEX "clearance_levels_region_rank_unique" ON "clearance_levels" USING btree ("region","rank");--> statement-breakpoint
CREATE UNIQUE INDEX "clearance_levels_region_name_unique" ON "clearance_levels" USING btree ("region","name");--> statement-breakpoint
CREATE UNIQUE INDEX "frse_role_skill_unique" ON "framework_role_skill_expectations" USING btree ("framework_role_id","skill_id");--> statement-breakpoint
CREATE UNIQUE INDEX "skill_levels_skill_level_unique" ON "skill_levels" USING btree ("skill_id","level");--> statement-breakpoint
CREATE UNIQUE INDEX "skills_org_name_unique" ON "skills" USING btree ("organization_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "tags_org_name_unique" ON "tags" USING btree ("organization_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "users_org_external_unique" ON "users" USING btree ("organization_id","external_source","external_id");