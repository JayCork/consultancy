import { Hono } from "hono";
import { getAllUsers, getUserById, getUserClearanceByAuthId } from "@consultancy/db";
import type { HonoVariables } from "../lib/auth";

const MS_PER_DAY = 86_400_000;

const user = new Hono<{ Variables: HonoVariables }>();

user.get("/me/clearance", async (c) => {
  const session = c.get("session");
  const clearance = await getUserClearanceByAuthId(session.userId);
  if (!clearance) return c.json({ ok: true, data: null });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiryDays = clearance.expiresAt
    ? Math.round((clearance.expiresAt.getTime() - today.getTime()) / MS_PER_DAY)
    : null;

  return c.json({
    ok: true,
    data: {
      level: clearance.shortName,
      levelName: clearance.name,
      expiresAt: clearance.expiresAt?.toISOString() ?? null,
      expiryDays,
      expiringSoon: expiryDays !== null && expiryDays <= 90,
    },
  });
});

user.get("/", async (c) => {
  const users = await getAllUsers();
  return c.json({ ok: true, data: users });
});

user.get("/:id", async (c) => {
  const u = await getUserById(c.req.param("id"));
  if (!u) {
    return c.json({ ok: false, error: "User not found" }, 404);
  }
  return c.json({ ok: true, data: u });
});

export default user;
