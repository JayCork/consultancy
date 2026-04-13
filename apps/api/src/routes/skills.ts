import { Hono } from "hono";
import {
  getAllSkills,
  getUserByAuthId,
  getUsersFrameworkSkills,
  user,
} from "@consultancy/db";

const skills = new Hono();

skills.get("/", async (c) => {
  console.group("GET /skills");
  const authUserId = c.req.query("userId");
  if (!authUserId) {
    console.debug("Missing userId query parameter");
    console.groupEnd();
    return c.json({ ok: false, error: "Missing userId query parameter" }, 400);
  }
  const user = await getUserByAuthId(authUserId);

  if (!user) {
    console.debug(`No user found for auth ID: ${authUserId}`);
    console.groupEnd();
    return c.json({ ok: false, error: "User not found" }, 404);
  }
  const data = await getUsersFrameworkSkills(user.id);
  console.groupEnd();
  return c.json({ ok: true, data });
});

// Get all skills for an organization
skills.get("/all", async (c) => {
  const orgId = c.req.query("orgId");
  if (!orgId) {
    return c.json({ ok: false, error: "Missing orgId query parameter" }, 400);
  }
  const data = await getAllOrgSkills(orgId);
  return c.json({ ok: true, data });
});

export default skills;
