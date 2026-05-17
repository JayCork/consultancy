import { db } from "..";
import { projectsTable, projectMilestonesTable } from "../schema";
import { eq, and, lte, isNull, ilike } from "drizzle-orm";
import type { InferInsertModel } from "drizzle-orm";

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
        eq(projectsTable.organizationId, organizationId),
        isNull(projectsTable.deletedAt),
        lte(projectsTable.startDate, windowEnd),
      ),
    );

  // Open-ended projects (null endDate) are always included once started;
  // others must end on or after the window start.
  const overlapping = projects.filter(
    (p) => p.endDate === null || new Date(p.endDate) >= windowStart,
  );

  if (overlapping.length === 0) return [];

  const projectIds = new Set(overlapping.map((p) => p.id));

  const allMilestones = await db
    .select()
    .from(projectMilestonesTable)
    .where(isNull(projectMilestonesTable.deletedAt));

  const milestonesByProject = new Map<
    string,
    (typeof allMilestones)[number][]
  >();
  for (const m of allMilestones) {
    if (!projectIds.has(m.projectId)) continue;
    const list = milestonesByProject.get(m.projectId) ?? [];
    list.push(m);
    milestonesByProject.set(m.projectId, list);
  }

  return overlapping.map((p) => ({
    ...p,
    milestones: milestonesByProject.get(p.id) ?? [],
  }));
};

export const createProject = async (
  data: Omit<InferInsertModel<typeof projectsTable>, "id" | "created_at" | "updated_at" | "deleted_at">,
) => {
  const [project] = await db.insert(projectsTable).values(data).returning();
  return project;
};

export const isCodeNameTaken = async (
  codeName: string,
  organizationId: string,
  excludeProjectId?: string,
): Promise<boolean> => {
  const results = await db
    .select({ id: projectsTable.id })
    .from(projectsTable)
    .where(
      and(
        ilike(projectsTable.codeName, codeName),
        eq(projectsTable.organizationId, organizationId),
        isNull(projectsTable.deletedAt),
      ),
    );
  return results.some((r) => r.id !== excludeProjectId);
};
