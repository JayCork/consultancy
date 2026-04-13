import { Hono } from "hono";
import { getOrganisationCount } from "@consultancy/db";

const setupRoutes = new Hono();

setupRoutes.post("/api/setup", async (c) => {
  const count = await getOrganisationCount();
  if (count > 0) {
    return c.json({ error: "Already initialised" }, 410);
  }
  // create org + first user in a transaction
});

export default setupRoutes;
