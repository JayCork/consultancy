import { eq, inArray, isNull, and } from "drizzle-orm";
import { db } from "..";
import {
  usersTable,
  userGradeAssignmentsTable,
  jobGradesTable,
  frameworkRolesTable,
  projectMembersTable,
  projectsTable,
  organizationUnitsTable,
  competenciesTable,
  skillsTable,
} from "../schema";

const CONFIRMED_STATUSES = new Set([
  "contract_signed",
  "mobilising",
  "discovery",
  "in_delivery",
  "uat",
  "hypercare",
  "support",
  "contract_renewal",
  "closing",
]);

function toInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const getPeopleForPlanning = async () => {
  const users = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.status, "active"));

  if (users.length === 0) return [];

  const userIds = users.map((u) => u.id);

  const [gradeRows, memberRows, skillRows] = await Promise.all([
    db
      .select({
        userId: userGradeAssignmentsTable.userId,
        gradeName: jobGradesTable.name,
        level: frameworkRolesTable.level,
      })
      .from(userGradeAssignmentsTable)
      .innerJoin(
        jobGradesTable,
        eq(userGradeAssignmentsTable.jobGradeId, jobGradesTable.id),
      )
      .innerJoin(
        frameworkRolesTable,
        eq(jobGradesTable.frameworkRoleId, frameworkRolesTable.id),
      )
      .where(
        and(
          inArray(userGradeAssignmentsTable.userId, userIds),
          isNull(userGradeAssignmentsTable.endDate),
        ),
      ),

    db
      .select({
        userId: projectMembersTable.userId,
        projectName: projectsTable.name,
        projectRole: projectMembersTable.projectRole,
        startDate: projectMembersTable.startDate,
        endDate: projectMembersTable.endDate,
        projectEndDate: projectsTable.endDate,
        allocatedHoursPerWeek: projectMembersTable.allocatedHoursPerWeek,
        sector: organizationUnitsTable.name,
        projectStatus: projectsTable.status,
      })
      .from(projectMembersTable)
      .innerJoin(
        projectsTable,
        eq(projectMembersTable.projectId, projectsTable.id),
      )
      .innerJoin(
        organizationUnitsTable,
        eq(projectsTable.organizationUnitId, organizationUnitsTable.id),
      )
      .where(inArray(projectMembersTable.userId, userIds)),

    db
      .select({
        userId: competenciesTable.userId,
        skillName: skillsTable.name,
      })
      .from(competenciesTable)
      .innerJoin(skillsTable, eq(competenciesTable.skillId, skillsTable.id))
      .where(inArray(competenciesTable.userId, userIds)),
  ]);

  const gradeByUser = new Map(
    gradeRows.map((r) => [r.userId, { name: r.gradeName, level: r.level }]),
  );

  const membersByUser = new Map<string, typeof memberRows>();
  for (const row of memberRows) {
    const list = membersByUser.get(row.userId) ?? [];
    list.push(row);
    membersByUser.set(row.userId, list);
  }

  const skillsByUser = new Map<string, string[]>();
  for (const row of skillRows) {
    const list = skillsByUser.get(row.userId) ?? [];
    list.push(row.skillName);
    skillsByUser.set(row.userId, list);
  }

  return users.map((user) => {
    const members = membersByUser.get(user.id) ?? [];

    const assignments = members.map((m) => {
      const allocated = m.allocatedHoursPerWeek
        ? Number(m.allocatedHoursPerWeek)
        : null;
      const contracted = user.contractedHoursPerWeek ?? null;
      const utilisation =
        allocated !== null && contracted !== null && contracted > 0
          ? Math.round((allocated / contracted) * 100)
          : 100;

      return {
        project: m.projectName,
        role: m.projectRole.replace(/_/g, " "),
        startDate: m.startDate,
        endDate: m.endDate ?? m.projectEndDate,
        sector: m.sector,
        projectStatus: m.projectStatus,
        confirmed: CONFIRMED_STATUSES.has(m.projectStatus),
        utilisation,
      };
    });

    const gradeInfo = gradeByUser.get(user.id);

    return {
      name: user.name,
      initials: toInitials(user.name),
      grade: gradeInfo?.name ?? "Unknown",
      level: gradeInfo?.level ?? null,
      skills: skillsByUser.get(user.id) ?? [],
      assignments,
    };
  });
};
