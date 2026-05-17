import { and, eq, isNull } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type * as schema from "../schema";
import { projectMembersTable } from "../schema/projects";
import { resourceScenariosTable } from "../schema/scenarios";

type Db = NodePgDatabase<typeof schema>;

export async function commitScenario(db: Db, scenarioId: string) {
  return db.transaction(async (tx) => {
    const scenario = await tx.query.resourceScenariosTable.findFirst({
      where: and(
        eq(resourceScenariosTable.id, scenarioId),
        isNull(resourceScenariosTable.committedAt),
      ),
      with: { assignments: true },
    });

    if (!scenario) throw new Error("Scenario not found or already committed");

    if (scenario.assignments.length > 0) {
      await tx.insert(projectMembersTable).values(
        scenario.assignments.map((a) => ({
          projectId: scenario.projectId,
          userId: a.userId ?? null,
          projectRole: a.projectRole,
          jobGradeId: a.jobGradeId,
          allocatedHoursPerWeek: a.allocatedHoursPerWeek,
          startDate: a.startDate,
          endDate: a.endDate ?? null,
        })),
      );
    }

    await tx
      .update(resourceScenariosTable)
      .set({ committedAt: new Date() })
      .where(eq(resourceScenariosTable.id, scenarioId))
      .returning();
  });
}
