import { Hono } from "hono";
import { getUserByAuthId, getReadinessForUser } from "@consultancy/db";

const readiness = new Hono();

readiness.get("/", async (c) => {
  const authUserId = c.req.query("userId");
  if (!authUserId) {
    return c.json({ ok: false, error: "Missing userId query parameter" }, 400);
  }

  const user = await getUserByAuthId(authUserId);
  if (!user) {
    return c.json({ ok: false, error: "User not found" }, 404);
  }

  const data = await getReadinessForUser(user.id);

  const requiredCount = data.evidence_required_per_skill;
  const enrichedSkills = data.required_skills.map((s) => ({
    ...s,
    required_count: requiredCount,
    is_ready: s.verified_count >= requiredCount,
  }));

  const totalSkills = enrichedSkills.length;
  const readySkills = enrichedSkills.filter((s) => s.is_ready).length;
  const readiness_pct =
    totalSkills === 0 ? 0 : Math.round((readySkills / totalSkills) * 100);
  const is_promotion_ready = readiness_pct >= data.promotion_readiness_threshold;

  return c.json({
    ok: true,
    data: {
      role: data.role,
      readiness_pct,
      promotion_readiness_threshold: data.promotion_readiness_threshold,
      is_promotion_ready,
      required_skills: enrichedSkills,
    },
  });
});

export default readiness;
