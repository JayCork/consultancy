import { Hono } from "hono";
import { createEvidence } from "@consultancy/db";

const evidence = new Hono();

evidence.post("/", async (c) => {
  const body = await c.req.json();

  const { author_id, skill_id, level_id, project_id, situation, task, action, result, sector, security_context } = body;

  if (!author_id || !skill_id || !level_id || !project_id || !situation || !task || !action || !result || !sector || !security_context) {
    return c.json({ ok: false, error: "Missing required fields" }, 400);
  }

  const entry = await createEvidence({ author_id, skill_id, level_id, project_id, situation, task, action, result, sector, security_context });
  return c.json({ ok: true, data: entry }, 201);
});

export default evidence;
