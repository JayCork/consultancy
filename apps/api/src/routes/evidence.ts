import { Hono } from "hono";
import {
  createEvidence,
  getEvidenceByUser,
  getUserByAuthId,
  createEndorsements,
  getSuggestedEndorsers,
  getEvidenceById,
  updateDraftEvidence,
  upsertPrimaryEvidenceSkill,
} from "@consultancy/db";
import type { HonoVariables } from "../lib";
import { getPendingEvidenceByUser } from "packages/db/src/queries/evidence";

const evidence = new Hono<{ Variables: HonoVariables }>();

// TODO: Think about whether there should be limitations on the creation of evidence related to projects if there is no record of the user being a member of the projec.t
evidence.post("/", async (context) => {
  const session = context.get("session");
  const user = await getUserByAuthId(session.userId);

  if (!user) {
    return context.json({ ok: false, error: "User not found" }, 404);
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
  } = body;

  if (!situation || !task || !action || !result) {
    return context.json(
      { ok: false, error: "situation, task, action, and result are required" },
      400,
    );
  }

  if ((main_skill_id && !level_claimed) || (!main_skill_id && level_claimed)) {
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

  const entry = await createEvidence({
    user_id: user.id,
    situation: situation as string,
    task: task as string,
    action: action as string,
    result: result as string,
    status: "submitted",
    ...(project_id ? { project_id: project_id as string } : {}),
    ...(data_classification
      ? {
          data_classification: data_classification as
            | "public"
            | "official"
            | "official_sensitive"
            | "secret",
        }
      : {}),
  });

  // Determine the final set of endorsers: use the client-provided list if given,
  // otherwise fall back to the org routing policy defaults.
  const suggestedIds = await getSuggestedEndorsers(
    user.id,
    user.organization_id,
    project_id as string | undefined,
  );
  const suggestedEndorserIds = suggestedIds.map((endorser) => endorser.id);

  let finalEndorserIds: string[];
  if (Array.isArray(endorser_ids) && endorser_ids.length > 0) {
    finalEndorserIds = endorser_ids as string[];
  } else {
    finalEndorserIds = suggestedEndorserIds;
  }

  const suggestedSet = new Set(suggestedEndorserIds);
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
    skillId: (main_skill_id as string | undefined) ?? null,
    levelClaimed:
      (level_claimed as
        | "associate"
        | "junior"
        | "mid"
        | "senior"
        | "lead"
        | "principal"
        | undefined) ?? null,
  });

  return context.json({ ok: true, data: entry }, 201);
});

evidence.get("/", async (context) => {
  const session = context.get("session");
  const user = await getUserByAuthId(session.userId);

  if (!user) {
    return context.json({ ok: false, error: "User not found" }, 404);
  }

  const evidence = await getEvidenceByUser(user.id);

  return context.json({ ok: true, data: evidence });
});

// Get specific evidence by ID, but only if the requesting user is the owner of the evidence or an assigned endorser
evidence.get("/:id", async (context) => {
  const session = context.get("session");
  const user = await getUserByAuthId(session.userId);
  if (!user) {
    return context.json({ ok: false, error: "User not found" }, 404);
  }
  const { id } = context.req.param();
  const evidence = await getEvidenceById(id);
  if (!evidence) {
    return context.json({ ok: false, error: "Evidence not found" }, 404);
  }
  if (evidence.user_id !== user.id) {
    return context.json({ ok: false, error: "Unauthorized" }, 403);
  }
  return context.json({ ok: true, data: evidence });
});

// Update an existing draft evidence entry. Only the owner can update, and only while status is draft.
evidence.patch("/:id", async (context) => {
  const session = context.get("session");
  const user = await getUserByAuthId(session.userId);

  if (!user) {
    return context.json({ ok: false, error: "User not found" }, 404);
  }

  const { id } = context.req.param();
  const existing = await getEvidenceById(id);
  if (!existing) {
    return context.json({ ok: false, error: "Evidence not found" }, 404);
  }

  if (existing.user_id !== user.id) {
    return context.json({ ok: false, error: "Unauthorized" }, 403);
  }

  if (existing.status !== "draft") {
    return context.json(
      {
        ok: false,
        error: "Only draft evidence can be edited",
      },
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

  const {
    situation,
    task,
    action,
    result,
    project_id,
    data_classification,
    status,
    main_skill_id,
    level_claimed,
  } = body;

  if (!situation || !task || !action || !result) {
    return context.json(
      { ok: false, error: "situation, task, action, and result are required" },
      400,
    );
  }

  if ((main_skill_id && !level_claimed) || (!main_skill_id && level_claimed)) {
    return context.json(
      {
        ok: false,
        error: "main_skill_id and level_claimed must be provided together",
      },
      400,
    );
  }

  if (status && status !== "draft" && status !== "submitted") {
    return context.json(
      { ok: false, error: "status must be either draft or submitted" },
      400,
    );
  }

  const updated = await updateDraftEvidence(id, {
    situation: situation as string,
    task: task as string,
    action: action as string,
    result: result as string,
    project_id: project_id ? (project_id as string) : null,
    data_classification:
      (data_classification as
        | "public"
        | "official"
        | "official_sensitive"
        | "secret"
        | undefined) ?? "official",
    status: (status as "draft" | "submitted" | undefined) ?? "draft",
  });

  if (!updated) {
    return context.json(
      {
        ok: false,
        error: "Evidence could not be updated because it is no longer a draft",
      },
      409,
    );
  }

  await upsertPrimaryEvidenceSkill({
    evidenceId: id,
    skillId: (main_skill_id as string | undefined) ?? null,
    levelClaimed:
      (level_claimed as
        | "associate"
        | "junior"
        | "mid"
        | "senior"
        | "lead"
        | "principal"
        | undefined) ?? null,
  });

  return context.json({ ok: true, data: updated });
});

// Get a user's evidence that is in the pending state for peer review, including the primary skill and level claimed for that skill (if any), and the name of the project (if any)
evidence.get("/pending", async (context) => {
  const session = context.get("session");
  const user = await getUserByAuthId(session.userId);

  if (!user) {
    return context.json({ ok: false, error: "User not found" }, 404);
  }

  const evidence = await getPendingEvidenceByUser(user.id);
  console.log("Pending evidence for user", user.id, evidence);

  return context.json({ ok: true, data: evidence });
});

export default evidence;
