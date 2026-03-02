CREATE TYPE "public"."access_purposes" AS ENUM('view', 'edit', 'delete', 'create');--> statement-breakpoint
CREATE TYPE "public"."citizenship_aquisition_methods" AS ENUM('birth', 'naturalization', 'marriage', 'descent', 'adoption');--> statement-breakpoint
CREATE TYPE "public"."clearance_levels" AS ENUM('baseline personnel security standard', 'accreditation check', 'counter terrorist check', 'security check', 'enhanced security check', 'developed vetting check', 'enhanced developed vetting check');--> statement-breakpoint
CREATE TYPE "public"."project_roles" AS ENUM('manager', 'developer', 'designer', 'tester', 'analyst');--> statement-breakpoint
CREATE TYPE "public"."relationship_types" AS ENUM('manager', 'peer', 'mentor', 'mentee', 'colleague');--> statement-breakpoint
CREATE TYPE "public"."visa_types" AS ENUM('standard visitor', 'business visitor', 'marraige visitor', 'parent of a child visitor', 'global talent', 'skilled worker', 'innovator founder', 'scaleup', 'sole representative', 'tier 5 temporary worker', 'global business mobility', 'youth mobility scheme', 'student', 'short-term study', 'spouse or partner', 'dependent', 'ancestry', 'family reunion', 'unmarried partner', 'fiance');--> statement-breakpoint
CREATE TABLE "evidence_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_id" uuid NOT NULL,
	"skill_id" uuid NOT NULL,
	"situation" varchar(255) NOT NULL,
	"task" varchar(255) NOT NULL,
	"action" varchar(255) NOT NULL,
	"result" varchar(255) NOT NULL,
	"status" varchar(255) DEFAULT 'PENDING_VERIFICATION' NOT NULL,
	"project_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"viewer_id" uuid NOT NULL,
	"target_id" uuid NOT NULL,
	"data_field" varchar(255) NOT NULL,
	"timestamp" timestamp (3) DEFAULT now(),
	"access_purpose" "access_purposes" NOT NULL,
	"ip_address" varchar(255) NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "clearances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"level" "clearance_levels" NOT NULL,
	"granted_at" timestamp (3) DEFAULT now(),
	"expires_at" timestamp (3),
	"sponsoring_organization" varchar(255) NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "relationship_to_role" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"relationship_id" uuid NOT NULL,
	"role" "relationship_types" NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "residential_addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"street_address" varchar(255) NOT NULL,
	"city" varchar(255),
	"area_code" varchar(10) NOT NULL,
	"country_code" varchar(3) NOT NULL,
	"start_date" timestamp (3) DEFAULT now() NOT NULL,
	"end_date" timestamp (3),
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "skill_frameworks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"version" varchar(255) NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "skills_mapping" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"skill_id" uuid NOT NULL,
	"framework_id" uuid NOT NULL,
	"mapped_skill_name" varchar(255) NOT NULL,
	"mapped_level" varchar(50) NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user_citizenship" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"country_code" varchar(3) NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"aquisition_method" "citizenship_aquisition_methods" NOT NULL,
	"aquisition_date" timestamp (3) DEFAULT now(),
	"expiration_date" timestamp (3),
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user_project_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"project_id" uuid NOT NULL,
	"role" "project_roles" NOT NULL,
	"start_date" timestamp (3) DEFAULT now(),
	"end_date" timestamp (3),
	"is_active" boolean DEFAULT true NOT NULL,
	"allocation_percentage" real DEFAULT 100 NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user_relationships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" uuid NOT NULL,
	"subject_id" uuid NOT NULL,
	"start_date" timestamp (3) DEFAULT now(),
	"end_date" timestamp (3),
	"is_active" boolean NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" varchar(100) NOT NULL,
	"is_contractor" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "visas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"country_code" varchar(3) NOT NULL,
	"visa_type" "visa_types" NOT NULL,
	"issue_date" timestamp (3) DEFAULT now(),
	"expiration_date" timestamp (3),
	"sponsoring_organization" varchar(255) NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "evidence_entries" ADD CONSTRAINT "evidence_entries_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_entries" ADD CONSTRAINT "evidence_entries_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_entries" ADD CONSTRAINT "evidence_entries_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_viewer_id_users_id_fk" FOREIGN KEY ("viewer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_target_id_users_id_fk" FOREIGN KEY ("target_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clearances" ADD CONSTRAINT "clearances_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relationship_to_role" ADD CONSTRAINT "relationship_to_role_relationship_id_user_relationships_id_fk" FOREIGN KEY ("relationship_id") REFERENCES "public"."user_relationships"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "residential_addresses" ADD CONSTRAINT "residential_addresses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skills_mapping" ADD CONSTRAINT "skills_mapping_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skills_mapping" ADD CONSTRAINT "skills_mapping_framework_id_skill_frameworks_id_fk" FOREIGN KEY ("framework_id") REFERENCES "public"."skill_frameworks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_citizenship" ADD CONSTRAINT "user_citizenship_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_project_roles" ADD CONSTRAINT "user_project_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_project_roles" ADD CONSTRAINT "user_project_roles_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_relationships" ADD CONSTRAINT "user_relationships_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_relationships" ADD CONSTRAINT "user_relationships_subject_id_users_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visas" ADD CONSTRAINT "visas_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;