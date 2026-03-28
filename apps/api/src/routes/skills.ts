import { Hono } from "hono";
import { getAllSkills, getSkillLevels } from "@consultancy/db";

const skills = new Hono();

skills.get("/", async (c) => {
  const data = await getAllSkills();
  return c.json({ ok: true, data });
});

skills.get("/:id/levels", async (c) => {
  const data = await getSkillLevels(c.req.param("id"));
  return c.json({ ok: true, data });
});

export default skills;
