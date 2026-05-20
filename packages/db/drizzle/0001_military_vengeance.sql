CREATE TYPE "public"."platform_role" AS ENUM('member', 'leadership_team', 'admin');--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "code_name" SET DATA TYPE varchar(8);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "platform_role" "platform_role" DEFAULT 'member' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "projects_code_name_unique" ON "projects" USING btree ("code_name");