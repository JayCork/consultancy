import { Hono } from "hono";
import { getOrgConfig } from "@consultancy/db";

const admin = new Hono();

admin.get("/config", async (c) => {
  const org = await getOrgConfig();
  console.log("Org config:", org);
  if (!org) {
    console.log("No organization found in database");
    return c.json({ ok: false, error: "No organization found" }, 404);
  }

  return c.json({
    ok: true,
    data: {
      ...org,
    },
  });
});

export default admin;
