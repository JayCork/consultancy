import {
  count,
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
  "id" | "createdAt" | "updatedAt" | "deletedAt"
>;

type UpdateDraftEvidence = Pick<
  InferInsertModel<typeof evidenceTable>,
  | "situation"
  | "task"
  | "action"
  | "result"
  | "projectId"
  | "dataClassification"
  | "status"
>;

const evidenceWithPrimarySkillSelection = {
  ...getTableColumns(evidenceTable),
  main_skill_id: evidenceSkillsTable.skillId,
  skill_name: skillsTable.name,
  level_claimed: evidenceSkillsTable.levelClaimed,
};

const buildEvidenceWithPrimarySkillQuery = () =>
  db
    .select(evidenceWithPrimarySkillSelection)
    .from(evidenceTable)
    .leftJoin(
      evidenceSkillsTable,
      and(
        eq(evidenceSkillsTable.evidenceId, evidenceTable.id),
        eq(evidenceSkillsTable.isPrimary, true),
      ),
    )
    .leftJoin(skillsTable, eq(evidenceSkillsTable.skillId, skillsTable.id));

// "Active latest" means not soft-deleted. parentId is not used as a filter here
// because revisions soft-delete the previous version, so deleted_at alone is
// sufficient to exclude superseded entries.
const byUserActiveLatestEvidence = (userId: string) =>
  and(eq(evidenceTable.userId, userId), isNull(evidenceTable.deletedAt));

export const createEvidence = async (data: NewEvidence) => {
  const [entry] = await db.insert(evidenceTable).values(data).returning();
  return entry;
};

export const getEvidenceByUser = async (userId: string) => {
  return buildEvidenceWithPrimarySkillQuery()
    .where(byUserActiveLatestEvidence(userId))
    .orderBy(desc(evidenceTable.createdAt));
};

export const getPendingEvidenceByUser = async (userId: string) => {
  return buildEvidenceWithPrimarySkillQuery()
    .leftJoin(
      endorsementsTable,
      eq(endorsementsTable.evidenceId, evidenceTable.id),
    )
    .where(
      and(
        byUserActiveLatestEvidence(userId),
        eq(evidenceTable.status, "submitted"),
      ),
    )
    .orderBy(desc(evidenceTable.createdAt));
};

export const getEvidenceById = async (id: string) => {
  return buildEvidenceWithPrimarySkillQuery()
    .where(and(eq(evidenceTable.id, id), isNull(evidenceTable.deletedAt)))
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
        isNull(evidenceTable.deletedAt),
      ),
    )
    .returning();

  return updated ?? null;
};

// Creates a new version of submitted evidence. The old row is soft-deleted so
// it is excluded from list queries but remains in the database for audit.
export const createEvidenceRevision = async (
  oldEvidence: { id: string; version: number; userId: string },
  data: Omit<NewEvidence, "parentId" | "version" | "userId" | "status">,
) => {
  return db.transaction(async (tx) => {
    await tx
      .update(evidenceTable)
      .set({ deletedAt: new Date() })
      .where(eq(evidenceTable.id, oldEvidence.id));

    const [newEntry] = await tx
      .insert(evidenceTable)
      .values({
        ...data,
        userId: oldEvidence.userId,
        parentId: oldEvidence.id,
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
    .set({ deletedAt: new Date() })
    .where(
      and(
        eq(evidenceTable.id, id),
        eq(evidenceTable.status, "verified"),
        isNull(evidenceTable.deletedAt),
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
        eq(evidenceSkillsTable.evidenceId, evidenceId),
        eq(evidenceSkillsTable.isPrimary, true),
      ),
    );

  if (!skillId || !levelClaimed) {
    return null;
  }

  const [created] = await db
    .insert(evidenceSkillsTable)
    .values({
      evidenceId,
      skillId,
      levelClaimed,
      isPrimary: true,
    })
    .returning();

  return created ?? null;
};

// Returns evidence counts by status for a given user (active/latest only)
export const getEvidenceStatsByUser = async (userId: string) => {
  // Drizzle ORM: count() must be aliased for correct result
  const rows = await db
    .select({ status: evidenceTable.status, count: count().as("count") })
    .from(evidenceTable)
    .where(byUserActiveLatestEvidence(userId))
    .groupBy(evidenceTable.status);

  const initial = { total: 0, draft: 0, submitted: 0, verified: 0 };
  const result = rows.reduce((acc, row) => {
    const count = Number(row.count);
    acc.total += count;
    if (row.status === "draft") acc.draft = count;
    else if (row.status === "submitted") acc.submitted = count;
    else if (row.status === "verified") acc.verified = count;
    return acc;
  }, initial);
  return result;
};
