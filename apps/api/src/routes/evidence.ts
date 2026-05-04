import { Hono, type Context } from "hono";
import {
  createEvidence,
  getEvidenceByUser,
  getUserByAuthId,
  createEndorsements,
  getSuggestedEndorsers,
  getEvidenceById,
  updateDraftEvidence,
  upsertPrimaryEvidenceSkill,
  createEvidenceRevision,
  deleteEvidence,
  softDeleteEvidence,
  replaceEndorsementsForEvidence,
  getEndorsementsForEvidence,
  getPendingEvidenceByUser,
} from "@consultancy/db";
import type { HonoVariables } from "../lib";

const evidence = new Hono<{ Variables: HonoVariables }>();

const getCurrentUserOrNotFound = async (
  context: Context<{ Variables: HonoVariables }>,
) => {
  const session = context.get("session");
  const user = await getUserByAuthId(session.userId);

  if (!user) {
    return {
      user: null,
      response: context.json({ ok: false, error: "User not found" }, 404),
    };
  }

  return { user, response: null };
};

const VALID_LEVELS = [
  "associate",
  "junior",
  "mid",
  "senior",
  "lead",
  "principal",
] as const;

const VALID_CLASSIFICATIONS = [
  "public",
  "official",
  "official_sensitive",
  "secret",
] as const;

type FrameworkLevel = (typeof VALID_LEVELS)[number];
type DataClassification = (typeof VALID_CLASSIFICATIONS)[number];

function parseEvidenceBody(body: Record<string, unknown>) {
  const {
    situation,
    task,
    action,
    result,
    project_id,
    data_classification,
    endorser_ids,
    main_skill_id,
    level_claimed,
    status,
  } = body;

  return {
    situation: situation as string | undefined,
    task: task as string | undefined,
    action: action as string | undefined,
    result: result as string | undefined,
    project_id: (project_id as string | null) ?? null,
    data_classification: VALID_CLASSIFICATIONS.includes(
      data_classification as DataClassification,
    )
      ? (data_classification as DataClassification)
      : undefined,
    endorser_ids: Array.isArray(endorser_ids)
      ? (endorser_ids as string[])
      : undefined,
    main_skill_id: (main_skill_id as string | undefined) ?? null,
    level_claimed: VALID_LEVELS.includes(level_claimed as FrameworkLevel)
      ? (level_claimed as FrameworkLevel)
      : null,
    status: status as string | undefined,
  };
}

// TODO: Think about whether there should be limitations on the creation of evidence related to projects if there is no record of the user being a member of the project.
evidence.post("/", async (context) => {
  const { user, response } = await getCurrentUserOrNotFound(context);
  if (!user) return response;

  let body: Record<string, unknown>;
  try {
    body = await context.req.json();
  } catch {
    return context.json(
      { ok: false, error: "Request body must be valid JSON" },
      400,
    );
  }

  const parsed = parseEvidenceBody(body);

  if (!parsed.situation || !parsed.task || !parsed.action || !parsed.result) {
    return context.json(
      { ok: false, error: "situation, task, action, and result are required" },
      400,
    );
  }

  if (
    (parsed.main_skill_id && !parsed.level_claimed) ||
    (!parsed.main_skill_id && parsed.level_claimed)
  ) {
    return context.json(
      {
        ok: false,
        error: "main_skill_id and level_claimed must be provided together",
      },
      400,
    );
  }

  if (!user.organization_id) {
    return context.json(
      { ok: false, error: "User is not assigned to an organisation" },
      403,
    );
  }

  const status =
    parsed.status === "submitted" || parsed.status === "draft"
      ? parsed.status
      : "draft";

  const entry = await createEvidence({
    user_id: user.id,
    situation: parsed.situation,
    task: parsed.task,
    action: parsed.action,
    result: parsed.result,
    status,
    ...(parsed.project_id ? { project_id: parsed.project_id } : {}),
    ...(parsed.data_classification
      ? { data_classification: parsed.data_classification }
      : {}),
  });

  const suggestedIds = await getSuggestedEndorsers(
    user.id,
    user.organization_id,
    parsed.project_id ?? undefined,
  );
  const suggestedEndorserIds = suggestedIds.map((e) => e.id);
  const suggestedSet = new Set(suggestedEndorserIds);

  const finalEndorserIds =
    parsed.endorser_ids && parsed.endorser_ids.length > 0
      ? parsed.endorser_ids
      : suggestedEndorserIds;

  if (finalEndorserIds.length > 0) {
    await createEndorsements(
      finalEndorserIds.map((endorser_id) => ({
        evidence_id: entry.id,
        endorser_id,
        is_suggested: suggestedSet.has(endorser_id),
      })),
    );
  }

  await upsertPrimaryEvidenceSkill({
    evidenceId: entry.id,
    skillId: parsed.main_skill_id,
    levelClaimed: parsed.level_claimed,
  });

  return context.json({ ok: true, data: entry }, 201);
});

evidence.get("/", async (context) => {
  const { user, response } = await getCurrentUserOrNotFound(context);
  if (!user) return response;

  const evidence = await getEvidenceByUser(user.id);
  return context.json({ ok: true, data: evidence });
});

evidence.get("/pending", async (context) => {
  const { user, response } = await getCurrentUserOrNotFound(context);
  if (!user) return response;

  const pending = await getPendingEvidenceByUser(user.id);
  return context.json({ ok: true, data: pending });
});

evidence.get("/:id", async (context) => {
  const { user, response } = await getCurrentUserOrNotFound(context);
  if (!user) return response;

  const { id } = context.req.param();
  const entry = await getEvidenceById(id);
  if (!entry) {
    return context.json({ ok: false, error: "Evidence not found" }, 404);
  }
  if (entry.user_id !== user.id) {
    return context.json({ ok: false, error: "Unauthorized" }, 403);
  }
  return context.json({ ok: true, data: entry });
});

// PATCH behaviour depends on current status:
//   draft     → direct update (fields + status transition to submitted allowed)
//   submitted → creates a new version (revision); old row is soft-deleted
//   verified  → immutable; returns 409
evidence.patch("/:id", async (context) => {
  const { user, response } = await getCurrentUserOrNotFound(context);
  if (!user) return response;

  const { id } = context.req.param();
  const entry = await getEvidenceById(id);
  if (!entry) {
    return context.json({ ok: false, error: "Evidence not found" }, 404);
  }
  if (entry.user_id !== user.id) {
    return context.json({ ok: false, error: "Unauthorized" }, 403);
  }
  if (entry.status === "verified") {
    return context.json(
      { ok: false, error: "Verified evidence cannot be edited" },
      409,
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await context.req.json();
  } catch {
    return context.json(
      { ok: false, error: "Request body must be valid JSON" },
      400,
    );
  }

  const parsed = parseEvidenceBody(body);

  if (!parsed.situation || !parsed.task || !parsed.action || !parsed.result) {
    return context.json(
      { ok: false, error: "situation, task, action, and result are required" },
      400,
    );
  }

  if (
    (parsed.main_skill_id && !parsed.level_claimed) ||
    (!parsed.main_skill_id && parsed.level_claimed)
  ) {
    return context.json(
      {
        ok: false,
        error: "main_skill_id and level_claimed must be provided together",
      },
      400,
    );
  }

  if (entry.status === "draft") {
    const newStatus =
      parsed.status === "submitted" || parsed.status === "draft"
        ? parsed.status
        : "draft";

    const updated = await updateDraftEvidence(id, {
      situation: parsed.situation,
      task: parsed.task,
      action: parsed.action,
      result: parsed.result,
      project_id: parsed.project_id,
      data_classification: parsed.data_classification ?? "official",
      status: newStatus,
    });

    if (!updated) {
      return context.json(
        { ok: false, error: "Evidence could not be updated" },
        409,
      );
    }

    await upsertPrimaryEvidenceSkill({
      evidenceId: id,
      skillId: parsed.main_skill_id,
      levelClaimed: parsed.level_claimed,
    });

    if (parsed.endorser_ids !== undefined) {
      const existingEndorsements = await getEndorsementsForEvidence(id);
      const suggestedSet = new Set(
        existingEndorsements
          .filter((e) => e.is_suggested)
          .map((e) => e.endorser_id),
      );
      await replaceEndorsementsForEvidence(
        id,
        parsed.endorser_ids.map((endorser_id) => ({
          endorser_id,
          is_suggested: suggestedSet.has(endorser_id),
        })),
      );
    }

    return context.json({ ok: true, data: updated });
  }

  // submitted → create revision
  const newEntry = await createEvidenceRevision(
    { id: entry.id, version: entry.version, user_id: entry.user_id },
    {
      situation: parsed.situation,
      task: parsed.task,
      action: parsed.action,
      result: parsed.result,
      project_id: parsed.project_id,
      data_classification: parsed.data_classification ?? "official",
    },
  );

  await upsertPrimaryEvidenceSkill({
    evidenceId: newEntry.id,
    skillId: parsed.main_skill_id,
    levelClaimed: parsed.level_claimed,
  });

  // Carry endorsers forward: use the client-provided list if given, otherwise
  // copy from the superseded version.
  const sourceEndorsements = await getEndorsementsForEvidence(entry.id);
  const endorserRecords =
    parsed.endorser_ids !== undefined
      ? parsed.endorser_ids.map((endorser_id) => ({
          endorser_id,
          is_suggested: sourceEndorsements.some(
            (e) => e.endorser_id === endorser_id && e.is_suggested,
          ),
        }))
      : sourceEndorsements.map((e) => ({
          endorser_id: e.endorser_id,
          is_suggested: e.is_suggested,
        }));

  if (endorserRecords.length > 0) {
    await createEndorsements(
      endorserRecords.map((r) => ({ ...r, evidence_id: newEntry.id })),
    );
  }

  return context.json({ ok: true, data: newEntry }, 201);
});

// DELETE behaviour depends on status:
//   draft     → hard delete (removed from database)
//   submitted → 409 (evidence is under review)
//   verified  → soft delete (sets deleted_at, audit trail preserved)
evidence.delete("/:id", async (context) => {
  const { user, response } = await getCurrentUserOrNotFound(context);
  if (!user) return response;

  const { id } = context.req.param();
  const entry = await getEvidenceById(id);
  if (!entry) {
    return context.json({ ok: false, error: "Evidence not found" }, 404);
  }
  if (entry.user_id !== user.id) {
    return context.json({ ok: false, error: "Unauthorized" }, 403);
  }

  if (entry.status === "submitted") {
    return context.json(
      {
        ok: false,
        error:
          "Evidence under review cannot be deleted. Contact your reviewer if you need it withdrawn.",
      },
      409,
    );
  }

  if (entry.status === "draft") {
    await deleteEvidence(id);
    return context.json({ ok: true });
  }

  // verified
  const deleted = await softDeleteEvidence(id);
  if (!deleted) {
    return context.json({ ok: false, error: "Evidence could not be deleted" }, 409);
  }
  return context.json({ ok: true });
});

export default evidence;
