import {
  InferInsertModel,
  eq,
  and,
  isNull,
  desc,
  getTableColumns,
} from "drizzle-orm";

import { db } from "..";
import {
  evidenceTable,
  evidenceSkillsTable,
  skillsTable,
  endorsementsTable,
} from "../schema";

type NewEvidence = Omit<
  InferInsertModel<typeof evidenceTable>,
  "id" | "created_at" | "updated_at" | "deleted_at"
>;

type UpdateDraftEvidence = Pick<
  InferInsertModel<typeof evidenceTable>,
  | "situation"
  | "task"
  | "action"
  | "result"
  | "project_id"
  | "data_classification"
  | "status"
>;

export const createEvidence = async (data: NewEvidence) => {
  const [entry] = await db.insert(evidenceTable).values(data).returning();
  return entry;
};

// Get all the current user's evidence, ordered by creation date desc, including primary skill and level claimed for that skill (if any)
// Filter out any evidence marked as deleted (soft delete via deleted_at timestamp)
// Filter out any evidence with a parent_id (i.e. only return the latest version of each piece of evidence, not the revision history)
export const getEvidenceByUser = async (userId: string) => {
  return db
    .select({
      ...getTableColumns(evidenceTable),
      main_skill_id: evidenceSkillsTable.skill_id,
      skill_name: skillsTable.name,
      level_claimed: evidenceSkillsTable.level_claimed,
    })
    .from(evidenceTable)
    .leftJoin(
      evidenceSkillsTable,
      and(
        eq(evidenceSkillsTable.evidence_id, evidenceTable.id),
        eq(evidenceSkillsTable.is_primary, true),
      ),
    )
    .leftJoin(skillsTable, eq(evidenceSkillsTable.skill_id, skillsTable.id))
    .where(
      and(
        eq(evidenceTable.user_id, userId),
        isNull(evidenceTable.deleted_at),
        isNull(evidenceTable.parent_id),
      ),
    )
    .orderBy(desc(evidenceTable.created_at));
};

export const getPendingEvidenceByUser = async (userId: string) => {
  return db
    .select({
      ...getTableColumns(evidenceTable),
      main_skill_id: evidenceSkillsTable.skill_id,
      skill_name: skillsTable.name,
      level_claimed: evidenceSkillsTable.level_claimed,
    })
    .from(evidenceTable)
    .leftJoin(
      evidenceSkillsTable,
      and(
        eq(evidenceSkillsTable.evidence_id, evidenceTable.id),
        eq(evidenceSkillsTable.is_primary, true),
      ),
    )
    .leftJoin(skillsTable, eq(evidenceSkillsTable.skill_id, skillsTable.id))
    .leftJoin(
      endorsementsTable,
      eq(endorsementsTable.evidence_id, evidenceTable.id),
    )

    .where(
      and(
        eq(evidenceTable.user_id, userId),
        isNull(evidenceTable.deleted_at),
        isNull(evidenceTable.parent_id),
        eq(evidenceTable.status, "submitted"),
      ),
    )
    .orderBy(desc(evidenceTable.created_at));
};

export const getEvidenceById = async (id: string) => {
  return db
    .select({
      ...getTableColumns(evidenceTable),
      main_skill_id: evidenceSkillsTable.skill_id,
      skill_name: skillsTable.name,
      level_claimed: evidenceSkillsTable.level_claimed,
    })
    .from(evidenceTable)
    .leftJoin(
      evidenceSkillsTable,
      and(
        eq(evidenceSkillsTable.evidence_id, evidenceTable.id),
        eq(evidenceSkillsTable.is_primary, true),
      ),
    )
    .leftJoin(skillsTable, eq(evidenceSkillsTable.skill_id, skillsTable.id))
    .where(and(eq(evidenceTable.id, id), isNull(evidenceTable.deleted_at)))
    .limit(1)
    .then((rows) => rows[0] || null);
};

export const updateDraftEvidence = async (
  id: string,
  data: UpdateDraftEvidence,
) => {
  const [updated] = await db
    .update(evidenceTable)
    .set(data)
    .where(
      and(
        eq(evidenceTable.id, id),
        eq(evidenceTable.status, "draft"),
        isNull(evidenceTable.deleted_at),
      ),
    )
    .returning();

  return updated ?? null;
};

type UpsertPrimaryEvidenceSkillInput = {
  evidenceId: string;
  skillId: string | null;
  levelClaimed:
    | "associate"
    | "junior"
    | "mid"
    | "senior"
    | "lead"
    | "principal"
    | null;
};

export const upsertPrimaryEvidenceSkill = async ({
  evidenceId,
  skillId,
  levelClaimed,
}: UpsertPrimaryEvidenceSkillInput) => {
  await db
    .delete(evidenceSkillsTable)
    .where(
      and(
        eq(evidenceSkillsTable.evidence_id, evidenceId),
        eq(evidenceSkillsTable.is_primary, true),
      ),
    );

  if (!skillId || !levelClaimed) {
    return null;
  }

  const [created] = await db
    .insert(evidenceSkillsTable)
    .values({
      evidence_id: evidenceId,
      skill_id: skillId,
      level_claimed: levelClaimed,
      is_primary: true,
    })
    .returning();

  return created ?? null;
};
