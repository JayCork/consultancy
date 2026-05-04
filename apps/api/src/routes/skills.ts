import { Hono } from "hono";
import {
  getAllOrgSkills,
  getOrgSkillById,
  getSkillLevels,
  getUserByAuthId,
} from "@consultancy/db";
import type { HonoVariables } from "../lib";

const skills = new Hono<{ Variables: HonoVariables }>();

skills.get("/", async (context) => {
  const session = context.get("session");
  const user = await getUserByAuthId(session.userId);

  if (!user) {
    return context.json({ ok: false, error: "User not found" }, 404);
  }
  if (!user.organization_id) {
    return context.json({ ok: false, error: "User has no organisation" }, 403);
  }

  const skills = await getAllOrgSkills(user.organization_id);
  return context.json({ ok: true, data: skills });
});

skills.get("/:skillId/levels", async (context) => {
  const session = context.get("session");
  const user = await getUserByAuthId(session.userId);

  if (!user) {
    return context.json({ ok: false, error: "User not found" }, 404);
  }
  if (!user.organization_id) {
    return context.json({ ok: false, error: "User has no organisation" }, 403);
  }

  const { skillId } = context.req.param();
  const skill = await getOrgSkillById(skillId, user.organization_id);
  if (!skill) {
    return context.json({ ok: false, error: "Skill not found" }, 404);
  }

  const levels = await getSkillLevels(skillId);
  return context.json({ ok: true, data: levels });
});

export default skills;
