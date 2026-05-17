import { Hono } from "hono";
import { getUserByAuthId, getOrganizationUnits } from "@consultancy/db";
import type { HonoVariables } from "../lib";

const organizationUnits = new Hono<{ Variables: HonoVariables }>();

organizationUnits.get("/", async (c) => {
  const session = c.get("session");
  const user = await getUserByAuthId(session.userId);

  if (!user) {
    return c.json({ ok: false, error: "User not found" }, 404);
  }
  if (!user.organizationId) {
    return c.json(
      { ok: false, error: "User is not assigned to an organisation" },
      403,
    );
  }

  const data = await getOrganizationUnits(user.organizationId);
  return c.json({ ok: true, data });
});

export default organizationUnits;
