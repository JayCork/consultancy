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
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invited_by_users_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skill_framework_mappings" ADD CONSTRAINT "skill_framework_mappings_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skill_framework_mappings" ADD CONSTRAINT "skill_framework_mappings_reference_skill_id_reference_skills_id_fk" FOREIGN KEY ("reference_skill_id") REFERENCES "public"."reference_skills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skill_levels" ADD CONSTRAINT "skill_levels_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skills" ADD CONSTRAINT "skills_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tags" ADD CONSTRAINT "tags_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "skill_levels_skill_level_unique" ON "skill_levels" USING btree ("skill_id","level");--> statement-breakpoint
CREATE UNIQUE INDEX "skills_org_name_unique" ON "skills" USING btree ("organization_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "tags_org_name_unique" ON "tags" USING btree ("organization_id","name");