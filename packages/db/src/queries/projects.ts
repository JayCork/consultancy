import { db } from "..";
import { projectsTable, projectMilestonesTable } from "../schema";
import { eq, and, lte, isNull } from "drizzle-orm";

export const getAllProjects = async () => {
  return db.select().from(projectsTable);
};

export const getProjectsWithMilestones = async (
  organizationId: string,
  windowStart: Date,
  windowEnd: Date,
) => {
  const projects = await db
    .select()
    .from(projectsTable)
    .where(
      and(
        eq(projectsTable.organization_id, organizationId),
        isNull(projectsTable.deleted_at),
        lte(projectsTable.start_date, windowEnd),
      ),
    );

  // Open-ended projects (null end_date) are always included once started;
  // others must end on or after the window start.
  const overlapping = projects.filter(
    (p) => p.end_date === null || new Date(p.end_date) >= windowStart,
  );

  if (overlapping.length === 0) return [];

  const projectIds = new Set(overlapping.map((p) => p.id));

  const allMilestones = await db
    .select()
    .from(projectMilestonesTable)
    .where(isNull(projectMilestonesTable.deleted_at));

  const milestonesByProject = new Map<
    string,
    (typeof allMilestones)[number][]
  >();
  for (const m of allMilestones) {
    if (!projectIds.has(m.project_id)) continue;
    const list = milestonesByProject.get(m.project_id) ?? [];
    list.push(m);
    milestonesByProject.set(m.project_id, list);
  }

  return overlapping.map((p) => ({
    ...p,
    milestones: milestonesByProject.get(p.id) ?? [],
  }));
};
