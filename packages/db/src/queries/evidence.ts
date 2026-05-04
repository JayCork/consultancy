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

const evidenceWithPrimarySkillSelection = {
  ...getTableColumns(evidenceTable),
  main_skill_id: evidenceSkillsTable.skill_id,
  skill_name: skillsTable.name,
  level_claimed: evidenceSkillsTable.level_claimed,
};

const buildEvidenceWithPrimarySkillQuery = () =>
  db
    .select(evidenceWithPrimarySkillSelection)
    .from(evidenceTable)
    .leftJoin(
      evidenceSkillsTable,
      and(
        eq(evidenceSkillsTable.evidence_id, evidenceTable.id),
        eq(evidenceSkillsTable.is_primary, true),
      ),
    )
    .leftJoin(skillsTable, eq(evidenceSkillsTable.skill_id, skillsTable.id));

// "Active latest" means not soft-deleted. parent_id is not used as a filter here
// because revisions soft-delete the previous version, so deleted_at alone is
// sufficient to exclude superseded entries.
const byUserActiveLatestEvidence = (userId: string) =>
  and(
    eq(evidenceTable.user_id, userId),
    isNull(evidenceTable.deleted_at),
  );

export const createEvidence = async (data: NewEvidence) => {
  const [entry] = await db.insert(evidenceTable).values(data).returning();
  return entry;
};

export const getEvidenceByUser = async (userId: string) => {
  return buildEvidenceWithPrimarySkillQuery()
    .where(byUserActiveLatestEvidence(userId))
    .orderBy(desc(evidenceTable.created_at));
};

export const getPendingEvidenceByUser = async (userId: string) => {
  return buildEvidenceWithPrimarySkillQuery()
    .leftJoin(
      endorsementsTable,
      eq(endorsementsTable.evidence_id, evidenceTable.id),
    )
    .where(
      and(
        byUserActiveLatestEvidence(userId),
        eq(evidenceTable.status, "submitted"),
      ),
    )
    .orderBy(desc(evidenceTable.created_at));
};

export const getEvidenceById = async (id: string) => {
  return buildEvidenceWithPrimarySkillQuery()
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

// Creates a new version of submitted evidence. The old row is soft-deleted so
// it is excluded from list queries but remains in the database for audit.
export const createEvidenceRevision = async (
  oldEvidence: { id: string; version: number; user_id: string },
  data: Omit<NewEvidence, "parent_id" | "version" | "user_id">,
) => {
  return db.transaction(async (tx) => {
    await tx
      .update(evidenceTable)
      .set({ deleted_at: new Date() })
      .where(eq(evidenceTable.id, oldEvidence.id));

    const [newEntry] = await tx
      .insert(evidenceTable)
      .values({
        ...data,
        user_id: oldEvidence.user_id,
        parent_id: oldEvidence.id,
        version: oldEvidence.version + 1,
        status: "submitted",
      })
      .returning();

    return newEntry;
  });
};

// Hard-deletes a draft. Only valid when status is draft.
export const deleteEvidence = async (id: string) => {
  const [deleted] = await db
    .delete(evidenceTable)
    .where(and(eq(evidenceTable.id, id), eq(evidenceTable.status, "draft")))
    .returning();
  return deleted ?? null;
};

// Soft-deletes verified evidence. Only valid when status is verified.
export const softDeleteEvidence = async (id: string) => {
  const [updated] = await db
    .update(evidenceTable)
    .set({ deleted_at: new Date() })
    .where(
      and(
        eq(evidenceTable.id, id),
        eq(evidenceTable.status, "verified"),
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
