import { eq, and, sql, isNull } from "drizzle-orm";
import { db } from "..";
import {
  usersTable,
  organizationsTable,
  userGradeAssignmentsTable,
  jobGradesTable,
  frameworkRolesTable,
  frameworkRoleSkillExpectationsTable,
  skillsTable,
} from "../schema";

const FRAMEWORK_LEVEL_ORDER = [
  "associate",
  "junior",
  "mid",
  "senior",
  "lead",
  "principal",
] as const;

type FrameworkLevel = (typeof FRAMEWORK_LEVEL_ORDER)[number];

export interface ReadinessSkillRow {
  skill_id: string;
  skill_name: string;
  required_level: string;
  endorsed_count: number;
}

export interface ReadinessData {
  current_role: { display_name: string; level: string } | null;
  next_role: { display_name: string; level: string } | null;
  required_skills: ReadinessSkillRow[];
  endorsements_required: number;
  promotion_threshold: number;
  score: number;
}

export const getReadinessForUser = async (
  internalUserId: string,
): Promise<ReadinessData> => {
  const [user] = await db
    .select({ organizationId: usersTable.organizationId })
    .from(usersTable)
    .where(eq(usersTable.id, internalUserId))
    .limit(1);

  if (!user) {
    return {
      current_role: null,
      next_role: null,
      required_skills: [],
      endorsements_required: 0,
      promotion_threshold: 0,
      score: 0,
    };
  }

  const [org] = await db
    .select({
      endorsementsRequired: organizationsTable.endorsementsRequired,
      promotionThreshold: organizationsTable.promotionThreshold,
    })
    .from(organizationsTable)
    .where(eq(organizationsTable.id, user.organizationId))
    .limit(1);

  const endorsementsRequired = org?.endorsementsRequired ?? 2;
  const promotionThreshold = org?.promotionThreshold ?? 80;

  const [assignment] = await db
    .select({
      displayName: frameworkRolesTable.displayName,
      level: frameworkRolesTable.level,
      familyId: frameworkRolesTable.familyId,
      organizationId: frameworkRolesTable.organizationId,
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
        eq(userGradeAssignmentsTable.userId, internalUserId),
        isNull(userGradeAssignmentsTable.endDate),
      ),
    )
    .limit(1);

  if (!assignment) {
    return {
      current_role: null,
      next_role: null,
      required_skills: [],
      endorsements_required: endorsementsRequired,
      promotion_threshold: promotionThreshold,
      score: 0,
    };
  }

  const currentLevelIndex = FRAMEWORK_LEVEL_ORDER.indexOf(
    assignment.level as FrameworkLevel,
  );
  const nextLevel: FrameworkLevel | null =
    currentLevelIndex >= 0 &&
    currentLevelIndex < FRAMEWORK_LEVEL_ORDER.length - 1
      ? FRAMEWORK_LEVEL_ORDER[currentLevelIndex + 1]
      : null;

  if (!nextLevel) {
    return {
      current_role: { display_name: assignment.displayName, level: assignment.level },
      next_role: null,
      required_skills: [],
      endorsements_required: endorsementsRequired,
      promotion_threshold: promotionThreshold,
      score: 100,
    };
  }

  const orgCondition = assignment.organizationId
    ? eq(frameworkRolesTable.organizationId, assignment.organizationId)
    : isNull(frameworkRolesTable.organizationId);

  const [nextRole] = await db
    .select({
      id: frameworkRolesTable.id,
      displayName: frameworkRolesTable.displayName,
      level: frameworkRolesTable.level,
    })
    .from(frameworkRolesTable)
    .where(
      and(
        eq(frameworkRolesTable.familyId, assignment.familyId),
        eq(frameworkRolesTable.level, nextLevel),
        orgCondition,
      ),
    )
    .limit(1);

  if (!nextRole) {
    return {
      current_role: { display_name: assignment.displayName, level: assignment.level },
      next_role: null,
      required_skills: [],
      endorsements_required: endorsementsRequired,
      promotion_threshold: promotionThreshold,
      score: 0,
    };
  }

  const required_skills = await db
    .select({
      skill_id: frameworkRoleSkillExpectationsTable.skillId,
      skill_name: skillsTable.name,
      required_level: frameworkRoleSkillExpectationsTable.minimumLevel,
      endorsed_count: sql<number>`(
        SELECT COUNT(DISTINCT ev.id)::int
        FROM evidence ev
        INNER JOIN evidence_skills es ON es.evidence_id = ev.id
        WHERE ev.user_id = ${internalUserId}
          AND es.skill_id = ${frameworkRoleSkillExpectationsTable.skillId}
          AND es.level_claimed >= ${frameworkRoleSkillExpectationsTable.minimumLevel}
          AND ev.deleted_at IS NULL
          AND (
            SELECT COUNT(*)
            FROM endorsements en
            WHERE en.evidence_id = ev.id
              AND en.status = 'endorsed'
          ) >= ${endorsementsRequired}
      )`,
    })
    .from(frameworkRoleSkillExpectationsTable)
    .innerJoin(
      skillsTable,
      eq(frameworkRoleSkillExpectationsTable.skillId, skillsTable.id),
    )
    .where(
      eq(frameworkRoleSkillExpectationsTable.frameworkRoleId, nextRole.id),
    );

  const totalSkills = required_skills.length;
  const coveredSkills = required_skills.filter((s) => s.endorsed_count > 0).length;
  const score =
    totalSkills === 0 ? 0 : Math.round((coveredSkills / totalSkills) * 100);

  return {
    current_role: { display_name: assignment.displayName, level: assignment.level },
    next_role: { display_name: nextRole.displayName, level: nextRole.level },
    required_skills,
    endorsements_required: endorsementsRequired,
    promotion_threshold: promotionThreshold,
    score,
  };
};
