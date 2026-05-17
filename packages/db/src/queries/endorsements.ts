import {
  InferInsertModel,
  eq,
  and,
  isNull,
  or,
  gt,
  lte,
  gte,
  inArray,
  ne,
  getTableColumns,
} from "drizzle-orm";

import { db } from "..";
import {
  endorsementsTable,
  userRelationshipsTable,
  projectMembersTable,
  projectsTable,
  organizationsTable,
  usersTable,
  evidenceTable,
} from "../schema";

type NewEndorsement = Omit<
  InferInsertModel<typeof endorsementsTable>,
  "id" | "createdAt" | "updatedAt"
>;

export const createEndorsements = async (records: NewEndorsement[]) => {
  if (records.length === 0) return [];
  return db.insert(endorsementsTable).values(records).returning();
};

export const getEndorsementsForEvidence = async (evidenceId: string) => {
  return db
    .select({
      ...getTableColumns(endorsementsTable),
      endorser_name: usersTable.name,
      endorser_email: usersTable.email,
    })
    .from(endorsementsTable)
    .innerJoin(usersTable, eq(endorsementsTable.endorserId, usersTable.id))
    .where(eq(endorsementsTable.evidenceId, evidenceId));
};

export const getPendingEndorsementsForEndorser = async (endorserId: string) => {
  return db
    .select({
      ...getTableColumns(endorsementsTable),
      evidenceSituation: evidenceTable.situation,
      evidenceTask: evidenceTable.task,
      evidenceAction: evidenceTable.action,
      evidenceResult: evidenceTable.result,
      evidenceCreatedAt: evidenceTable.createdAt,
      subjectName: usersTable.name,
    })
    .from(endorsementsTable)
    .innerJoin(
      evidenceTable,
      eq(endorsementsTable.evidenceId, evidenceTable.id),
    )
    .innerJoin(usersTable, eq(evidenceTable.userId, usersTable.id))
    .where(
      and(
        eq(endorsementsTable.endorserId, endorserId),
        eq(endorsementsTable.status, "pending"),
        isNull(evidenceTable.deletedAt),
      ),
    );
};

export const getEndorsementById = async (id: string, endorserId: string) => {
  const [row] = await db
    .select({
      ...getTableColumns(endorsementsTable),
      evidenceSituation: evidenceTable.situation,
      evidenceTask: evidenceTable.task,
      evidenceAction: evidenceTable.action,
      evidenceResult: evidenceTable.result,
      evidenceCreatedAt: evidenceTable.createdAt,
      evidenceDataClassification: evidenceTable.dataClassification,
      subjectName: usersTable.name,
      projectName: projectsTable.name,
    })
    .from(endorsementsTable)
    .innerJoin(evidenceTable, eq(endorsementsTable.evidenceId, evidenceTable.id))
    .innerJoin(usersTable, eq(evidenceTable.userId, usersTable.id))
    .leftJoin(projectsTable, eq(evidenceTable.projectId, projectsTable.id))
    .where(
      and(
        eq(endorsementsTable.id, id),
        eq(endorsementsTable.endorserId, endorserId),
        isNull(evidenceTable.deletedAt),
      ),
    )
    .limit(1);
  return row ?? null;
};

export const updateEndorsement = async (
  id: string,
  endorserId: string,
  data: { status: "endorsed" | "skipped" | "flagged"; note?: string },
) => {
  const [updated] = await db
    .update(endorsementsTable)
    .set({
      status: data.status,
      note: data.note ?? null,
      respondedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(endorsementsTable.id, id),
        eq(endorsementsTable.endorserId, endorserId),
      ),
    )
    .returning();
  return updated ?? null;
};

// TODO: Update so that only the evidence owner can soft delete an endorsement. Reviews can skip
export const deleteEndorsement = async (id: string, requesterId: string) => {
  // Allow removal by either the endorser or the evidence owner
  const [endorsement] = await db
    .select({
      evidenceId: endorsementsTable.evidenceId,
      endorserId: endorsementsTable.endorserId,
    })
    .from(endorsementsTable)
    .where(eq(endorsementsTable.id, id))
    .limit(1);

  if (!endorsement) return null;

  const [evidence] = await db
    .select({ userId: evidenceTable.userId })
    .from(evidenceTable)
    .where(eq(evidenceTable.id, endorsement.evidenceId))
    .limit(1);

  if (!evidence) return null;

  const isEndorser = endorsement.endorserId === requesterId;
  const isEvidenceOwner = evidence.userId === requesterId;

  if (!isEndorser && !isEvidenceOwner) return null;

  const [deleted] = await db
    .delete(endorsementsTable)
    .where(eq(endorsementsTable.id, id))
    .returning();
  return deleted ?? null;
};

export const addEndorsementToEvidence = async (
  evidenceId: string,
  ownerId: string,
  endorserId: string,
) => {
  // Verify requester owns the evidence
  const [evidence] = await db
    .select({ userId: evidenceTable.userId })
    .from(evidenceTable)
    .where(eq(evidenceTable.id, evidenceId))
    .limit(1);

  if (!evidence || evidence.userId !== ownerId) return null;

  const [created] = await db
    .insert(endorsementsTable)
    .values({
      evidenceId,
      endorserId,
      isSuggested: false,
    })
    .onConflictDoNothing()
    .returning();
  return created ?? null;
};

// Replaces all endorsements for a piece of evidence atomically. Used when
// the user edits endorser selections on a draft or creates a revision.
export const replaceEndorsementsForEvidence = async (
  evidenceId: string,
  records: Omit<NewEndorsement, "evidenceId">[],
) => {
  return db.transaction(async (tx) => {
    await tx
      .delete(endorsementsTable)
      .where(eq(endorsementsTable.evidenceId, evidenceId));

    if (records.length === 0) return [];

    return tx
      .insert(endorsementsTable)
      .values(records.map((r) => ({ ...r, evidenceId })))
      .returning();
  });
};

export const getSuggestedEndorsers = async (
  userId: string,
  orgId: string,
  projectId?: string,
): Promise<{ id: string; name: string }[]> => {
  const [org] = await db
    .select({ policy: organizationsTable.endorsementRoutingPolicy })
    .from(organizationsTable)
    .where(eq(organizationsTable.id, orgId))
    .limit(1);

  if (!org) return [];

  const endorserMap = new Map<string, string>();
  const todayStr = new Date().toISOString().split("T")[0]; // for date columns (userRelationshipsTable)
  const todayDate = new Date(); // for timestamp columns (projectMembersTable)

  if (org.policy === "managers_only" || org.policy === "project_and_managers") {
    const managers = await db
      .select({
        targetId: userRelationshipsTable.targetId,
        name: usersTable.name,
      })
      .from(userRelationshipsTable)
      .innerJoin(usersTable, eq(userRelationshipsTable.targetId, usersTable.id))
      .where(
        and(
          eq(userRelationshipsTable.actorId, userId),
          inArray(userRelationshipsTable.relationshipType, [
            "line_manager",
            "technical_manager",
          ]),
          or(
            isNull(userRelationshipsTable.endDate),
            gt(userRelationshipsTable.endDate, todayStr),
          ),
        ),
      );
    managers.forEach((m) => endorserMap.set(m.targetId, m.name));
  }

  if (
    (org.policy === "project_only" || org.policy === "project_and_managers") &&
    projectId
  ) {
    const peers = await db
      .select({ userId: projectMembersTable.userId, name: usersTable.name })
      .from(projectMembersTable)
      .innerJoin(usersTable, eq(projectMembersTable.userId, usersTable.id))
      .where(
        and(
          eq(projectMembersTable.projectId, projectId),
          ne(projectMembersTable.userId, userId),
          lte(projectMembersTable.startDate, todayDate),
          or(
            isNull(projectMembersTable.endDate),
            gte(projectMembersTable.endDate, todayDate),
          ),
        ),
      );
    peers.forEach((p) => endorserMap.set(p.userId, p.name));
  }

  return Array.from(endorserMap.entries()).map(([id, name]) => ({ id, name }));
};
