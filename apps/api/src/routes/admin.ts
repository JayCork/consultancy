import { Hono } from "hono";
import { getOrgConfig, getJobRolesWithRequirements } from "@consultancy/db";

const admin = new Hono();

admin.get("/config", async (c) => {
  const org = await getOrgConfig();
  if (!org) {
    return c.json({ ok: false, error: "No organization found" }, 404);
  }

  const roles = await getJobRolesWithRequirements(org.id);

  return c.json({
    ok: true,
    data: {
      organization: {
        id: org.id,
        name: org.name,
        promotion_readiness_threshold: org.promotion_readiness_threshold,
        evidence_required_per_skill: org.evidence_required_per_skill,
      },
      roles,
    },
  });
});

export default admin;
