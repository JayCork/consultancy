import { Hono } from "hono";
import { serve } from "@hono/node-server";
import userRoutes from "./routes/user";
import evidenceRoutes from "./routes/evidence";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { env, auth } from "./lib";

const PORT = process.env.PORT || 5173;

const api = new Hono().basePath("/api");
const server = serve({
  fetch: api.fetch,
  port: env.port,
});
api.use(logger());

api.use(
  "/auth/**",
  cors({
    origin: env.webUrl,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  }),
);

api.on(["POST", "GET"], "/auth/**", (c) => {
  return auth.handler(c.req.raw);
});

api.route("/v0/users", userRoutes);
api.route("/v0/evidence", evidenceRoutes);

api.get("/v0/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    mode: env.nodeEnv,
  });
});

api.notFound((c) => c.text("Unable to find the requested resource", 404));
api.onError((err, c) => {
  console.error(err);
  return c.text("An unexpected error occurred", 500);
});

console.debug(`Hono API running on http://localhost:${env.port}`);

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

export default api;
