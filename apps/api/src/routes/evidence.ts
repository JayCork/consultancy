import { Hono } from "hono";
import {
  createEvidence,
  getEvidenceByUser,
  db,
  evidenceSkillsTable,
  evidenceTagsTable,
  getUserByAuthId,
  getAllOrgSkills,
} from "@consultancy/db";
import type { HonoVariables } from "../lib";

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

  const { situation, task, action, result, project_id, data_classification } =
    body;

  if (!situation || !task || !action || !result) {
    return context.json(
      { ok: false, error: "situation, task, action, and result are required" },
      400,
    );
  }

  const entry = await createEvidence({
    user_id: user.id,
    situation: situation as string,
    task: task as string,
    action: action as string,
    result: result as string,
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

export default evidence;
