import { Hono } from "hono";
import {
  getAllProjects,
  getProjectsWithMilestones,
  getUserByAuthId,
  createProject,
  isCodeNameTaken,
  getClearanceLevels,
} from "@consultancy/db";
import {
  projectStatusEnum,
  projectFundingModelEnum,
  regionEnum,
} from "@consultancy/db";
import type { HonoVariables } from "../lib";

const projects = new Hono<{ Variables: HonoVariables }>();

projects.get("/all", async (c) => {
  const data = await getAllProjects();
  return c.json({ ok: true, data });
});

projects.get("/enums", async (c) => {
  return c.json({
    ok: true,
    data: {
      status: projectStatusEnum.enumValues,
      fundingModel: projectFundingModelEnum.enumValues,
      region: regionEnum.enumValues,
    },
  });
});

projects.get("/clearance-levels", async (c) => {
  const data = await getClearanceLevels();
  return c.json({ ok: true, data });
});

projects.get("/check-code-name", async (c) => {
  const session = c.get("session");
  const user = await getUserByAuthId(session.userId);

  if (!user?.organizationId) {
    return c.json({ ok: false, error: "User not in an organisation" }, 403);
  }

  const code = c.req.query("code");
  if (!code) {
    return c.json({ ok: false, error: "code query param required" }, 400);
  }

  const taken = await isCodeNameTaken(code, user.organizationId);
  return c.json({ ok: true, data: { taken } });
});

projects.post("/", async (c) => {
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

  const body = await c.req.json();

  const {
    name,
    shortName,
    codeName,
    leadId,
    organizationUnitId,
    minimumClearanceId,
    fundingModel,
    contractedValue,
    currency,
    startDate,
    endDate,
    status,
    region,
  } = body;

  if (
    !name ||
    !leadId ||
    !organizationUnitId ||
    !startDate ||
    !status ||
    !fundingModel
  ) {
    return c.json({ ok: false, error: "Missing required fields" }, 400);
  }

  if (codeName) {
    const taken = await isCodeNameTaken(codeName, user.organizationId);
    if (taken) {
      return c.json({ ok: false, error: "Code name already in use" }, 409);
    }
  }

  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : undefined;

  if (end && end < start) {
    return c.json(
      { ok: false, error: "End date cannot be before start date" },
      400,
    );
  }

  const project = await createProject({
    organizationId: user.organizationId,
    leadId,
    name: name.trim(),
    shortName: shortName?.trim() || null,
    codeName: codeName?.trim() || null,
    organizationUnitId,
    minimumClearanceId: minimumClearanceId || null,
    fundingModel,
    contractedValue: contractedValue ?? null,
    currency: currency || "GBP",
    startDate: start,
    endDate: end ?? null,
    status,
    region: region || "GBR",
    marginOverridePct: null,
  });

  return c.json({ ok: true, data: project }, 201);
});

projects.get("/", async (c) => {
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

  const fromParam = c.req.query("from");
  const toParam = c.req.query("to");

  const now = new Date();
  const windowStart = fromParam ? new Date(fromParam) : now;
  const windowEnd = toParam
    ? new Date(toParam)
    : new Date(new Date(now).setMonth(now.getMonth() + 6));

  if (isNaN(windowStart.getTime()) || isNaN(windowEnd.getTime())) {
    return c.json({ ok: false, error: "Invalid date parameters" }, 400);
  }

  const data = await getProjectsWithMilestones(
    user.organizationId,
    windowStart,
    windowEnd,
  );

  return c.json({ ok: true, data });
});

export default projects;
