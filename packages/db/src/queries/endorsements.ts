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
  organizationsTable,
  usersTable,
  evidenceTable,
} from "../schema";

type NewEndorsement = Omit<
  InferInsertModel<typeof endorsementsTable>,
  "id" | "created_at" | "updated_at"
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
    .innerJoin(usersTable, eq(endorsementsTable.endorser_id, usersTable.id))
    .where(eq(endorsementsTable.evidence_id, evidenceId));
};

export const getPendingEndorsementsForEndorser = async (endorserId: string) => {
  return db
    .select({
      ...getTableColumns(endorsementsTable),
      evidence_situation: evidenceTable.situation,
      evidence_task: evidenceTable.task,
      evidence_action: evidenceTable.action,
      evidence_result: evidenceTable.result,
      evidence_created_at: evidenceTable.created_at,
      subject_name: usersTable.name,
    })
    .from(endorsementsTable)
    .innerJoin(
      evidenceTable,
      eq(endorsementsTable.evidence_id, evidenceTable.id),
    )
    .innerJoin(usersTable, eq(evidenceTable.user_id, usersTable.id))
    .where(
      and(
        eq(endorsementsTable.endorser_id, endorserId),
        eq(endorsementsTable.status, "pending"),
        isNull(evidenceTable.deleted_at),
      ),
    );
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
      responded_at: new Date(),
      updated_at: new Date(),
    })
    .where(
      and(
        eq(endorsementsTable.id, id),
        eq(endorsementsTable.endorser_id, endorserId),
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
      evidence_id: endorsementsTable.evidence_id,
      endorser_id: endorsementsTable.endorser_id,
    })
    .from(endorsementsTable)
    .where(eq(endorsementsTable.id, id))
    .limit(1);

  if (!endorsement) return null;

  const [evidence] = await db
    .select({ user_id: evidenceTable.user_id })
    .from(evidenceTable)
    .where(eq(evidenceTable.id, endorsement.evidence_id))
    .limit(1);

  if (!evidence) return null;

  const isEndorser = endorsement.endorser_id === requesterId;
  const isEvidenceOwner = evidence.user_id === requesterId;

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
    .select({ user_id: evidenceTable.user_id })
    .from(evidenceTable)
    .where(eq(evidenceTable.id, evidenceId))
    .limit(1);

  if (!evidence || evidence.user_id !== ownerId) return null;

  const [created] = await db
    .insert(endorsementsTable)
    .values({
      evidence_id: evidenceId,
      endorser_id: endorserId,
      is_suggested: false,
    })
    .onConflictDoNothing()
    .returning();
  return created ?? null;
};

export const getSuggestedEndorsers = async (
  userId: string,
  orgId: string,
  projectId?: string,
): Promise<{ id: string; name: string }[]> => {
  const [org] = await db
    .select({ policy: organizationsTable.endorsement_routing_policy })
    .from(organizationsTable)
    .where(eq(organizationsTable.id, orgId))
    .limit(1);

  if (!org) return [];

  const endorserMap = new Map<string, string>();
  const today = new Date().toISOString().split("T")[0];

  if (org.policy === "managers_only" || org.policy === "project_and_managers") {
    const managers = await db
      .select({
        target_id: userRelationshipsTable.target_id,
        name: usersTable.name,
      })
      .from(userRelationshipsTable)
      .innerJoin(
        usersTable,
        eq(userRelationshipsTable.target_id, usersTable.id),
      )
      .where(
        and(
          eq(userRelationshipsTable.actor_id, userId),
          inArray(userRelationshipsTable.relationship_type, [
            "line_manager",
            "technical_manager",
          ]),
          or(
            isNull(userRelationshipsTable.end_date),
            gt(userRelationshipsTable.end_date, today),
          ),
        ),
      );
    managers.forEach((m) => endorserMap.set(m.target_id, m.name));
  }

  if (
    (org.policy === "project_only" || org.policy === "project_and_managers") &&
    projectId
  ) {
    const peers = await db
      .select({ user_id: projectMembersTable.user_id, name: usersTable.name })
      .from(projectMembersTable)
      .innerJoin(usersTable, eq(projectMembersTable.user_id, usersTable.id))
      .where(
        and(
          eq(projectMembersTable.project_id, projectId),
          ne(projectMembersTable.user_id, userId),
          lte(projectMembersTable.start_date, today),
          or(
            isNull(projectMembersTable.end_date),
            gte(projectMembersTable.end_date, today),
          ),
        ),
      );
    peers.forEach((p) => endorserMap.set(p.user_id, p.name));
  }

  return Array.from(endorserMap.entries()).map(([id, name]) => ({ id, name }));
};
