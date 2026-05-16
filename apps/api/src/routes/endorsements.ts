import { Hono } from "hono";
import {
  getUserByAuthId,
  getPendingEndorsementsForEndorser,
  getEndorsementsForEvidence,
  updateEndorsement,
  deleteEndorsement,
  addEndorsementToEvidence,
  getSuggestedEndorsers,
} from "@consultancy/db";
import type { HonoVariables } from "../lib";

const endorsements = new Hono<{ Variables: HonoVariables }>();

// Get all pending endorsements assigned to the current user (their inbox)
endorsements.get("/", async (context) => {
  const session = context.get("session");
  const user = await getUserByAuthId(session.userId);

  if (!user) {
    return context.json({ ok: false, error: "User not found" }, 404);
  }

  const pending = await getPendingEndorsementsForEndorser(user.id);
  return context.json({ ok: true, data: pending });
});

// Get suggested endorsers for a piece of evidence (used by UI before submission)
endorsements.get("/suggested", async (context) => {
  const session = context.get("session");
  const user = await getUserByAuthId(session.userId);
  console.log(`Looking for suggested endorsers for user ${user?.id}`);
  if (!user) {
    return context.json({ ok: false, error: "User not found" }, 404);
  }

  if (!user.organizationId) {
    return context.json(
      { ok: false, error: "User is not assigned to an organisation" },
      403,
    );
  }

  const projectId = context.req.query("project_id");
  const suggested = await getSuggestedEndorsers(
    user.id,
    user.organizationId,
    projectId,
  );

  return context.json({ ok: true, data: suggested });
});

// Get all endorsements for a specific piece of evidence (evidence owner view)
endorsements.get("/evidence/:evidenceId", async (context) => {
  const session = context.get("session");
  const user = await getUserByAuthId(session.userId);

  if (!user) {
    return context.json({ ok: false, error: "User not found" }, 404);
  }

  const { evidenceId } = context.req.param();
  const list = await getEndorsementsForEvidence(evidenceId);
  return context.json({ ok: true, data: list });
});

// Add an endorser to a piece of evidence (evidence owner only)
endorsements.post("/evidence/:evidenceId", async (context) => {
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

  const { endorser_id } = body;
  if (!endorser_id || typeof endorser_id !== "string") {
    return context.json({ ok: false, error: "endorser_id is required" }, 400);
  }

  const { evidenceId } = context.req.param();
  const created = await addEndorsementToEvidence(
    evidenceId,
    user.id,
    endorser_id,
  );

  if (!created) {
    return context.json(
      { ok: false, error: "Evidence not found or you do not own it" },
      404,
    );
  }

  return context.json({ ok: true, data: created }, 201);
});

// Update endorsement status (endorser only: endorse / skip / flag)
endorsements.patch("/:id", async (context) => {
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

  const { status, note } = body;
  if (
    !status ||
    !["endorsed", "skipped", "flagged"].includes(status as string)
  ) {
    return context.json(
      { ok: false, error: "status must be one of: endorsed, skipped, flagged" },
      400,
    );
  }

  const { id } = context.req.param();
  const updated = await updateEndorsement(id, user.id, {
    status: status as "endorsed" | "skipped" | "flagged",
    note: note as string | undefined,
  });

  if (!updated) {
    return context.json(
      { ok: false, error: "Endorsement not found or you are not the endorser" },
      404,
    );
  }

  return context.json({ ok: true, data: updated });
});

// Remove an endorsement (endorser removes themselves, or evidence owner removes someone)
endorsements.delete("/:id", async (context) => {
  const session = context.get("session");
  const user = await getUserByAuthId(session.userId);

  if (!user) {
    return context.json({ ok: false, error: "User not found" }, 404);
  }

  const { id } = context.req.param();
  const deleted = await deleteEndorsement(id, user.id);

  if (!deleted) {
    return context.json(
      {
        ok: false,
        error:
          "Endorsement not found or you do not have permission to remove it",
      },
      404,
    );
  }

  return context.json({ ok: true, data: deleted });
});

export default endorsements;
