import "dotenv/config";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import userRoutes from "./routes/user";
import { logger } from "hono/logger";

const PORT = process.env.PORT || 5173;

const api = new Hono().basePath("/api");
const server = serve(api);
api.route("/v0/users", userRoutes);
api.use(logger());

// Graceful shutdown
process.on("SIGINT", () => {
  server.close();
  process.exit(0);
});
process.on("SIGTERM", () => {
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
});

api.notFound((c) => {
  return c.text("Unable to find the requested resource", 404);
});

api.onError((err, c) => {
  console.error(`${err}`);
  return c.text("An unexpected error occurred", 500);
});

api.get("/v0/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    mode: process.env.NODE_ENV,
  });
});

console.debug(`Hono API running on http://localhost:${PORT}`);
serve({ fetch: api.fetch, port: Number(PORT) });

export default api;
