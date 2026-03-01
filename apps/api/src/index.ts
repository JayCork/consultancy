import "dotenv/config";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { getAllUsers } from "@consultancy/db";

const PORT = process.env.PORT || 5173;

const app = new Hono();

app.get("/api/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    mode: process.env.NODE_ENV,
  });
});

app.get("/api/users", async (c) => {
  const users = await getAllUsers();
  return c.json({ ok: true, data: users });
});

console.debug(`Hono API running on http://localhost:${PORT}`);
serve({ fetch: app.fetch, port: Number(PORT) });

export default app;
