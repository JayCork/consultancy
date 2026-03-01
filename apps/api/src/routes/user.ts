import { Hono } from "hono";
import { getAllUsers, getUserById } from "@consultancy/db";

const user = new Hono();

user.get("/", async (c) => {
  const users = await getAllUsers();
  return c.json({ ok: true, data: users });
});

user.get("/:id", async (c) => {
  const user = await getUserById(c.req.param("id"));
  if (!user) {
    return c.json({ ok: false, error: "User not found" }, 404);
  }
  return c.json({ ok: true, data: user });
});

export default user;
