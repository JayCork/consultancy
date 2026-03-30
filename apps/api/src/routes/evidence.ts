import { Hono } from "hono";
import {
  createEvidence,
  getEvidenceByUser,
  getEvidenceWithDetails,
  getPendingEvidenceForReviewer,
  getUserByAuthId,
  canUserVerifyEvidence,
  updateEvidenceStatus,
  type EvidenceStatus,
} from "@consultancy/db";
import { auth } from "../lib";

const evidence = new Hono();

evidence.get("/pending", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    return c.json({ ok: false, error: "Unauthorised" }, 401);
  }
  const reviewer = await getUserByAuthId(session.user.id);
  if (!reviewer) {
    return c.json({ ok: false, error: "User not found" }, 404);
  }
  const entries = await getPendingEvidenceForReviewer(reviewer.id);
  return c.json({ ok: true, data: entries });
});

evidence.get("/:id", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    return c.json({ ok: false, error: "Unauthorised" }, 401);
  }
  const entry = await getEvidenceWithDetails(c.req.param("id"));
  if (!entry) {
    return c.json({ ok: false, error: "Evidence not found" }, 404);
  }
  return c.json({ ok: true, data: entry });
});

evidence.get("/", async (c) => {
  const authUserId = c.req.query("userId");
  if (!authUserId) {
    return c.json({ ok: false, error: "Missing userId query parameter" }, 400);
  }
  const user = await getUserByAuthId(authUserId);
  if (!user) {
    return c.json({ ok: false, error: "User not found" }, 404);
  }
  const entries = await getEvidenceByUser(user.id);
  return c.json({ ok: true, data: entries });
});

evidence.post("/", async (c) => {
  const body = await c.req.json();

  const {
    author_id,
    skill_id,
    level_id,
    project_id,
    situation,
    task,
    action,
    result,
    sector,
    security_context,
  } = body;

  if (
    !author_id ||
    !skill_id ||
    !level_id ||
    !situation ||
    !task ||
    !action ||
    !result ||
    !sector ||
    !security_context
  ) {
    return c.json({ ok: false, error: "Missing required fields" }, 400);
  }

  const user = await getUserByAuthId(author_id);
  if (!user) {
    return c.json({ ok: false, error: "User not found" }, 404);
  }

  const entry = await createEvidence({
    author_id: user.id,
    skill_id,
    level_id,
    project_id: project_id ?? null,
    situation,
    task,
    action,
    result,
    sector,
    security_context,
    status: "pending_verification" satisfies EvidenceStatus,
  });
  return c.json({ ok: true, data: entry }, 201);
});

evidence.patch("/:id/status", async (c) => {
  // Caller identity comes from the session cookie — never a query param
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    return c.json({ ok: false, error: "Unauthorised" }, 401);
  }

  const verifier = await getUserByAuthId(session.user.id);
  if (!verifier) {
    return c.json({ ok: false, error: "User not found" }, 404);
  }

  const body = await c.req.json();
  if (body.status !== "verified") {
    return c.json(
      { ok: false, error: "Only 'verified' is a valid target status" },
      400,
    );
  }

  const evidenceId = c.req.param("id");
  const { allowed, reason } = await canUserVerifyEvidence(
    verifier.id,
    evidenceId,
  );
  if (!allowed) {
    return c.json({ ok: false, error: reason }, 403);
  }

  const updated = await updateEvidenceStatus(evidenceId, "verified");
  return c.json({ ok: true, data: updated });
});

export default evidence;
