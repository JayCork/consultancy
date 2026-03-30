import {
  InferInsertModel,
  InferSelectModel,
  eq,
  and,
  or,
  isNull,
  gt,
  inArray,
  desc,
} from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "..";
import {
  evidenceTable,
  skillsTable,
  skillsLevelTable,
  usersTable,
  organizationsTable,
  userRelationshipsTable,
  relationshipRolesTable,
  userProjectRolesTable,
} from "../schema";

type NewEvidence = Omit<InferInsertModel<typeof evidenceTable>, "id" | "created_at" | "updated_at" | "deleted_at">;
type EvidenceStatus = InferSelectModel<typeof evidenceTable>["status"];

export const createEvidence = async (data: NewEvidence) => {
  const [entry] = await db.insert(evidenceTable).values(data).returning();
  return entry;
};

export const getEvidenceByUser = async (userId: string) => {
  return db
    .select({
      id: evidenceTable.id,
      situation: evidenceTable.situation,
      task: evidenceTable.task,
      action: evidenceTable.action,
      result: evidenceTable.result,
      status: evidenceTable.status,
      sector: evidenceTable.sector,
      security_context: evidenceTable.security_context,
      project_id: evidenceTable.project_id,
      created_at: evidenceTable.created_at,
      skill_name: skillsTable.name,
      level_number: skillsLevelTable.level_number,
    })
    .from(evidenceTable)
    .innerJoin(skillsTable, eq(evidenceTable.skill_id, skillsTable.id))
    .innerJoin(skillsLevelTable, eq(evidenceTable.level_id, skillsLevelTable.id))
    .where(eq(evidenceTable.author_id, userId))
    .orderBy(desc(evidenceTable.created_at));
};

export const getEvidenceById = async (id: string) => {
  const [entry] = await db
    .select()
    .from(evidenceTable)
    .where(eq(evidenceTable.id, id))
    .limit(1);
  return entry ?? null;
};

export const updateEvidenceStatus = async (id: string, status: EvidenceStatus) => {
  const [updated] = await db
    .update(evidenceTable)
    .set({ status })
    .where(eq(evidenceTable.id, id))
    .returning();
  return updated;
};

export const canUserVerifyEvidence = async (
  verifierId: string,
  evidenceId: string,
): Promise<{ allowed: boolean; reason: string }> => {
  const evidence = await getEvidenceById(evidenceId);
  if (!evidence) return { allowed: false, reason: "Evidence not found" };
  if (evidence.status === "draft")
    return { allowed: false, reason: "Draft evidence cannot be verified" };
  if (evidence.status === "verified")
    return { allowed: false, reason: "Evidence is already verified" };
  if (evidence.author_id === verifierId)
    return { allowed: false, reason: "You cannot verify your own evidence" };

  // Resolve both users and confirm they share the same organisation
  const [author, verifier] = await Promise.all([
    db
      .select({ organisation_id: usersTable.organisation_id })
      .from(usersTable)
      .where(eq(usersTable.id, evidence.author_id))
      .limit(1)
      .then((r) => r[0]),
    db
      .select({ organisation_id: usersTable.organisation_id })
      .from(usersTable)
      .where(eq(usersTable.id, verifierId))
      .limit(1)
      .then((r) => r[0]),
  ]);

  if (!author || !verifier) return { allowed: false, reason: "User not found" };
  if (author.organisation_id !== verifier.organisation_id)
    return { allowed: false, reason: "Not in the same organisation" };

  const [org] = await db
    .select({ verification_policy: organizationsTable.verification_policy })
    .from(organizationsTable)
    .where(eq(organizationsTable.id, author.organisation_id))
    .limit(1);

  if (!org) return { allowed: false, reason: "Organisation not found" };

  const policy = org.verification_policy;

  if (policy === "any_member") {
    return { allowed: true, reason: "Organisation permits any member to verify" };
  }

  if (policy === "same_project") {
    // Both users must have an active (no end_date, or end_date in future) assignment
    // on at least one common project.
    const verifierUpr = alias(userProjectRolesTable, "verifier_upr");
    const [shared] = await db
      .select({ project_id: userProjectRolesTable.project_id })
      .from(userProjectRolesTable)
      .innerJoin(
        verifierUpr,
        eq(userProjectRolesTable.project_id, verifierUpr.project_id),
      )
      .where(
        and(
          eq(userProjectRolesTable.user_id, evidence.author_id),
          eq(verifierUpr.user_id, verifierId),
          or(
            isNull(userProjectRolesTable.end_date),
            gt(userProjectRolesTable.end_date, new Date()),
          ),
          or(isNull(verifierUpr.end_date), gt(verifierUpr.end_date, new Date())),
        ),
      )
      .limit(1);

    if (shared) return { allowed: true, reason: "Shared active project" };
    return { allowed: false, reason: "No shared active project found" };
  }

  // "relationship_only" — verifier must be an active mentor or manager of the author.
  // "peers_and_above"   — also permits peers and colleagues.
  const allowedRoles: Array<"mentor" | "manager" | "peer" | "colleague"> =
    policy === "relationship_only"
      ? ["mentor", "manager"]
      : ["mentor", "manager", "peer", "colleague"];

  const [rel] = await db
    .select({ id: userRelationshipsTable.id })
    .from(userRelationshipsTable)
    .innerJoin(
      relationshipRolesTable,
      eq(userRelationshipsTable.id, relationshipRolesTable.relationship_id),
    )
    .where(
      and(
        eq(userRelationshipsTable.actor_id, verifierId),
        eq(userRelationshipsTable.subject_id, evidence.author_id),
        inArray(relationshipRolesTable.role, allowedRoles),
        or(
          isNull(userRelationshipsTable.end_date),
          gt(userRelationshipsTable.end_date, new Date()),
        ),
      ),
    )
    .limit(1);

  if (rel) return { allowed: true, reason: "Active qualifying relationship" };
  return { allowed: false, reason: "No active qualifying relationship found" };
};
