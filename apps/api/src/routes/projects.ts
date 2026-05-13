import { Hono } from "hono";
import {
  getAllProjects,
  getProjectsWithMilestones,
  getUserByAuthId,
} from "@consultancy/db";
import type { HonoVariables } from "../lib";

const projects = new Hono<{ Variables: HonoVariables }>();

projects.get("/all", async (c) => {
  const data = await getAllProjects();
  return c.json({ ok: true, data });
});

projects.get("/", async (c) => {
  const session = c.get("session");
  const user = await getUserByAuthId(session.userId);

  if (!user) {
    return c.json({ ok: false, error: "User not found" }, 404);
  }
  if (!user.organization_id) {
    return c.json(
      { ok: false, error: "User is not assigned to an organisation" },
      403,
    );
  }

  const fromParam = c.req.query("from");
  const toParam = c.req.query("to");

  const now = new Date();
  const windowStart = fromParam ? new Date(fromParam) : now;
  const windowEnd = toParam
    ? new Date(toParam)
    : new Date(new Date(now).setMonth(now.getMonth() + 6));

  if (isNaN(windowStart.getTime()) || isNaN(windowEnd.getTime())) {
    return c.json({ ok: false, error: "Invalid date parameters" }, 400);
  }

  const data = await getProjectsWithMilestones(
    user.organization_id,
    windowStart,
    windowEnd,
  );

  return c.json({ ok: true, data });
});

export default projects;
