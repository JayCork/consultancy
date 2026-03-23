import { Hono } from "hono";
import {
  createEvidence,
  getEvidenceByUser,
  getUserByAuthId,
  type EvidenceStatus,
} from "@consultancy/db";

const evidence = new Hono();

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

  const { author_id, skill_id, level_id, project_id, situation, task, action, result, sector, security_context } = body;

  if (!author_id || !skill_id || !level_id || !situation || !task || !action || !result || !sector || !security_context) {
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

export default evidence;
