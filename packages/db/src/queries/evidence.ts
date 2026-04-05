import {
  InferInsertModel,
  InferSelectModel,
  eq,
  and,
  or,
  isNull,
  gt,
  inArray,
  ne,
  desc,
  asc,
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
  projectsTable,
} from "../schema";

type NewEvidence = Omit<
  InferInsertModel<typeof evidenceTable>,
  "id" | "created_at" | "updated_at" | "deleted_at"
>;
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
    .innerJoin(
      skillsLevelTable,
      eq(evidenceTable.level_id, skillsLevelTable.id),
    )
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

export const updateEvidenceStatus = async (
  id: string,
  status: EvidenceStatus,
) => {
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

  // Resolve both users and confirm they share the same organization
  const [author, verifier] = await Promise.all([
    db
      .select({ organization_id: usersTable.organization_id })
      .from(usersTable)
      .where(eq(usersTable.id, evidence.author_id))
      .limit(1)
      .then((r) => r[0]),
    db
      .select({ organization_id: usersTable.organization_id })
      .from(usersTable)
      .where(eq(usersTable.id, verifierId))
      .limit(1)
      .then((r) => r[0]),
  ]);

  if (!author || !verifier) return { allowed: false, reason: "User not found" };
  if (author.organization_id !== verifier.organization_id)
    return { allowed: false, reason: "Not in the same organization" };

  const [org] = await db
    .select({ verification_policy: organizationsTable.verification_policy })
    .from(organizationsTable)
    .where(eq(organizationsTable.id, author.organization_id))
    .limit(1);

  if (!org) return { allowed: false, reason: "organization not found" };

  const policy = org.verification_policy;

  if (policy === "any_member") {
    return {
      allowed: true,
      reason: "organization permits any member to verify",
    };
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
          or(
            isNull(verifierUpr.end_date),
            gt(verifierUpr.end_date, new Date()),
          ),
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

export const getPendingEvidenceForReviewer = async (reviewerId: string) => {
  const [reviewer] = await db
    .select({ organization_id: usersTable.organization_id })
    .from(usersTable)
    .where(eq(usersTable.id, reviewerId))
    .limit(1);

  if (!reviewer) return [];

  const [org] = await db
    .select({ verification_policy: organizationsTable.verification_policy })
    .from(organizationsTable)
    .where(eq(organizationsTable.id, reviewer.organization_id))
    .limit(1);

  if (!org) return [];

  const policy = org.verification_policy;
  let authorIds: string[] = [];

  if (policy === "any_member") {
    const orgUsers = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(
        and(
          eq(usersTable.organization_id, reviewer.organization_id),
          ne(usersTable.id, reviewerId),
        ),
      );
    authorIds = orgUsers.map((u) => u.id);
  } else if (policy === "same_project") {
    const verifierUpr = alias(userProjectRolesTable, "verifier_upr");
    const sharedProjectUsers = await db
      .selectDistinct({ user_id: userProjectRolesTable.user_id })
      .from(userProjectRolesTable)
      .innerJoin(
        verifierUpr,
        eq(userProjectRolesTable.project_id, verifierUpr.project_id),
      )
      .where(
        and(
          eq(verifierUpr.user_id, reviewerId),
          ne(userProjectRolesTable.user_id, reviewerId),
          or(
            isNull(userProjectRolesTable.end_date),
            gt(userProjectRolesTable.end_date, new Date()),
          ),
          or(
            isNull(verifierUpr.end_date),
            gt(verifierUpr.end_date, new Date()),
          ),
        ),
      );
    authorIds = sharedProjectUsers.map((u) => u.user_id);
  } else {
    const allowedRoles: Array<"mentor" | "manager" | "peer" | "colleague"> =
      policy === "relationship_only"
        ? ["mentor", "manager"]
        : ["mentor", "manager", "peer", "colleague"];

    const relatedUsers = await db
      .selectDistinct({ subject_id: userRelationshipsTable.subject_id })
      .from(userRelationshipsTable)
      .innerJoin(
        relationshipRolesTable,
        eq(userRelationshipsTable.id, relationshipRolesTable.relationship_id),
      )
      .where(
        and(
          eq(userRelationshipsTable.actor_id, reviewerId),
          inArray(relationshipRolesTable.role, allowedRoles),
          or(
            isNull(userRelationshipsTable.end_date),
            gt(userRelationshipsTable.end_date, new Date()),
          ),
        ),
      );
    authorIds = relatedUsers.map((u) => u.subject_id);
  }

  if (authorIds.length === 0) return [];

  const authorAlias = alias(usersTable, "author");

  return db
    .select({
      id: evidenceTable.id,
      situation: evidenceTable.situation,
      task: evidenceTable.task,
      action: evidenceTable.action,
      result: evidenceTable.result,
      sector: evidenceTable.sector,
      security_context: evidenceTable.security_context,
      project_id: evidenceTable.project_id,
      status: evidenceTable.status,
      created_at: evidenceTable.created_at,
      skill_name: skillsTable.name,
      level_number: skillsLevelTable.level_number,
      author_id: authorAlias.id,
      author_name: authorAlias.name,
      project_name: projectsTable.name,
    })
    .from(evidenceTable)
    .innerJoin(skillsTable, eq(evidenceTable.skill_id, skillsTable.id))
    .innerJoin(
      skillsLevelTable,
      eq(evidenceTable.level_id, skillsLevelTable.id),
    )
    .innerJoin(authorAlias, eq(evidenceTable.author_id, authorAlias.id))
    .leftJoin(projectsTable, eq(evidenceTable.project_id, projectsTable.id))
    .where(
      and(
        eq(evidenceTable.status, "pending_verification"),
        inArray(evidenceTable.author_id, authorIds),
      ),
    )
    .orderBy(asc(evidenceTable.created_at));
};

export const getEvidenceWithDetails = async (evidenceId: string) => {
  const authorAlias = alias(usersTable, "author");

  const [entry] = await db
    .select({
      id: evidenceTable.id,
      situation: evidenceTable.situation,
      task: evidenceTable.task,
      action: evidenceTable.action,
      result: evidenceTable.result,
      sector: evidenceTable.sector,
      security_context: evidenceTable.security_context,
      project_id: evidenceTable.project_id,
      status: evidenceTable.status,
      created_at: evidenceTable.created_at,
      skill_name: skillsTable.name,
      level_number: skillsLevelTable.level_number,
      author_id: authorAlias.id,
      author_name: authorAlias.name,
      project_name: projectsTable.name,
    })
    .from(evidenceTable)
    .innerJoin(skillsTable, eq(evidenceTable.skill_id, skillsTable.id))
    .innerJoin(
      skillsLevelTable,
      eq(evidenceTable.level_id, skillsLevelTable.id),
    )
    .innerJoin(authorAlias, eq(evidenceTable.author_id, authorAlias.id))
    .leftJoin(projectsTable, eq(evidenceTable.project_id, projectsTable.id))
    .where(eq(evidenceTable.id, evidenceId))
    .limit(1);

  return entry ?? null;
};
