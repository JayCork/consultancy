## Schema Structure

- [x] Drop evidence_competencies table
- [x] Add skills table
- [x] Add skill_levels table
- [x] Add skill_framework_mappings table
- [x] Add tags table
- [x] Add evidence_tags table
- [x] Add evidence_skills table

## Table Modifications

- [x ]competencies — add skill_id, add source (competency_source enum), remove name, remove competency_type, add timestamps
- [ z]framework_role_skill_expectations — change reference_skill_id → skill_id, change minimum_level from integer → framework_level enum, add timestamps, add unique index
- [x]evidence — add timestamps (created_at, updated_at, deleted_at), rename security_context → data_classification using new enum
- [x]endorsements — add created_at, add updated_at
- [x]feedback — add check constraint (subject_id or project_id must be non-null)
- [x]goals — add target_role_id (nullable FK to framework_roles)
- [x]projects — add start_date, end_date, add nullable region
- [x]user_relationships — add organization_id
- [x]organizations — add region
- [x]clearance_levels — add region, add timestamps, fix unique indexes
- [x]competencies — unique index on (user_id, skill_id)
- [x]tags — add updated_at
- [x] job_grades — add timestamps
- [x]user_clearances — add timestamps
- [x]user_grade_assignments — add timestamps
- [x]reference_frameworks — add timestamps
- [x]reference_roles — add timestamps
- [x]reference_skills — add timestamps

## Enums

- [x] Add tag_type enum
- [x] Add competency_source enum
- [x] Add data_classification enum
- [x] Remove competency_type enum (absorbed into tag_type)
- [x] Add region enum

## Auth Tables

- [ ] Prefix all Better Auth tables with bauth\_ via Better Auth config (not a manual schema change — done in packages/db/src/lib/auth.ts)

## Behavioural / Convention

- [ ] skills.is_active and tags.is_active — remove boolean column, derive active state from deleted_at IS NULL in queries
- [ ] skill_levels.descriptor — nullable
- [ ] framework_role_skill_expectations.minimum_level — use framework_level enum not integer
- [ ] Document organizations.promotion_threshold semantics in an ADR
