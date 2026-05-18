import { eq, inArray, isNull, and } from "drizzle-orm";
import { db } from "..";
import {
  usersTable,
  userClearancesTable,
  userGradeAssignmentsTable,
  jobGradesTable,
  clearanceLevelsTable,
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

  const [gradeRows, clearanceRows, memberRows, skillRows] = await Promise.all([
    db
      .select({
        userId: userGradeAssignmentsTable.userId,
        gradeName: jobGradesTable.name,
      })
      .from(userGradeAssignmentsTable)
      .innerJoin(
        jobGradesTable,
        eq(userGradeAssignmentsTable.jobGradeId, jobGradesTable.id),
      )
      .where(
        and(
          inArray(userGradeAssignmentsTable.userId, userIds),
          isNull(userGradeAssignmentsTable.endDate),
        ),
      ),

    db
      .select({
        userId: userClearancesTable.userId,
        shortName: clearanceLevelsTable.shortName,
        expiresAt: userClearancesTable.expiresAt,
        grantedAt: userClearancesTable.grantedAt,
      })
      .from(userClearancesTable)
      .innerJoin(
        clearanceLevelsTable,
        eq(userClearancesTable.clearanceLevelId, clearanceLevelsTable.id),
      )
      .where(inArray(userClearancesTable.userId, userIds)),

    db
      .select({
        userId: projectMembersTable.userId,
        projectName: projectsTable.name,
        projectRole: projectMembersTable.projectRole,
        startDate: projectMembersTable.startDate,
        endDate: projectMembersTable.endDate,
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

  const gradeByUser = new Map(gradeRows.map((r) => [r.userId, r.gradeName]));

  // For each user, pick the most recently granted clearance
  const clearanceByUser = new Map<
    string,
    { shortName: string; expiresAt: Date | null }
  >();
  for (const row of clearanceRows) {
    const existing = clearanceByUser.get(row.userId);
    if (!existing || row.grantedAt > (existing as { grantedAt?: Date }).grantedAt!) {
      clearanceByUser.set(row.userId, {
        shortName: row.shortName,
        expiresAt: row.expiresAt,
      });
    }
  }
  // Re-build with grantedAt so the comparison above works correctly
  const clearanceFullByUser = new Map<
    string,
    { shortName: string; expiresAt: Date | null; grantedAt: Date }
  >();
  for (const row of clearanceRows) {
    const existing = clearanceFullByUser.get(row.userId);
    if (!existing || row.grantedAt > existing.grantedAt) {
      clearanceFullByUser.set(row.userId, {
        shortName: row.shortName,
        expiresAt: row.expiresAt,
        grantedAt: row.grantedAt,
      });
    }
  }

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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return users.map((user) => {
    const clearance = clearanceFullByUser.get(user.id);
    const members = membersByUser.get(user.id) ?? [];

    const clearanceExpiryDays = clearance?.expiresAt
      ? Math.round(
          (clearance.expiresAt.getTime() - today.getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : null;

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
        endDate: m.endDate,
        sector: m.sector,
        confirmed: CONFIRMED_STATUSES.has(m.projectStatus),
        utilisation,
      };
    });

    return {
      name: user.name,
      initials: toInitials(user.name),
      grade: gradeByUser.get(user.id) ?? "Unknown",
      clearance: (clearance?.shortName ?? "BPSS") as "BPSS" | "SC" | "DV",
      clearanceExpiryDays,
      skills: skillsByUser.get(user.id) ?? [],
      assignments,
    };
  });
};
