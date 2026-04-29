import { Hono } from "hono";
import { getUserByAuthId, getReadinessForUser } from "@consultancy/db";
import type { HonoVariables } from "../lib";

const readiness = new Hono<{ Variables: HonoVariables }>();

readiness.get("/", async (context) => {
  const session = context.get("session");
  const user = await getUserByAuthId(session.userId);

  if (!user) {
    return context.json({ ok: false, error: "User not found" }, 404);
  }

  const data = await getReadinessForUser(user.id);

  return context.json({ ok: true, data });
});

export default readiness;
