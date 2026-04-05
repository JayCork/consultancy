import { eq, and, sql } from "drizzle-orm";
import { db } from "..";
import {
  usersTable,
  userRoleAssignmentsTable,
  jobRolesTable,
  roleSkillRequirementsTable,
  skillsTable,
  skillsLevelTable,
  organizationsTable,
  evidenceTable,
} from "../schema";

export interface ReadinessSkillRow {
  skill_id: string;
  skill_name: string;
  level_id: string;
  level_number: number;
  verified_count: number;
}

export interface ReadinessData {
  role: { name: string; seniority_level: number } | null;
  required_skills: ReadinessSkillRow[];
  evidence_required_per_skill: number;
  promotion_readiness_threshold: number;
}

export const getReadinessForUser = async (
  internalUserId: string,
): Promise<ReadinessData> => {
  // Resolve the user's org for threshold settings
  const [user] = await db
    .select({ organization_id: usersTable.organization_id })
    .from(usersTable)
    .where(eq(usersTable.id, internalUserId))
    .limit(1);

  if (!user) {
    return {
      role: null,
      required_skills: [],
      evidence_required_per_skill: 0,
      promotion_readiness_threshold: 0,
    };
  }

  const [org] = await db
    .select({
      evidence_required_per_skill:
        organizationsTable.evidence_required_per_skill,
      promotion_readiness_threshold:
        organizationsTable.promotion_readiness_threshold,
    })
    .from(organizationsTable)
    .where(eq(organizationsTable.id, user.organization_id))
    .limit(1);

  // Get the current role assignment
  const [assignment] = await db
    .select({
      role_id: userRoleAssignmentsTable.role_id,
      role_name: jobRolesTable.name,
      seniority_level: jobRolesTable.seniority_level,
    })
    .from(userRoleAssignmentsTable)
    .innerJoin(
      jobRolesTable,
      eq(userRoleAssignmentsTable.role_id, jobRolesTable.id),
    )
    .where(
      and(
        eq(userRoleAssignmentsTable.user_id, internalUserId),
        eq(userRoleAssignmentsTable.is_current, true),
      ),
    )
    .limit(1);

  if (!assignment) {
    return {
      role: null,
      required_skills: [],
      evidence_required_per_skill: org?.evidence_required_per_skill ?? 3,
      promotion_readiness_threshold: org?.promotion_readiness_threshold ?? 80,
    };
  }

  // Get required skills with verified evidence count per skill
  const required_skills = await db
    .select({
      skill_id: roleSkillRequirementsTable.skill_id,
      skill_name: skillsTable.name,
      level_id: roleSkillRequirementsTable.level_id,
      level_number: skillsLevelTable.level_number,
      verified_count: sql<number>`
        (
          SELECT COUNT(*)::int
          FROM evidence_entries e
          WHERE e.author_id = ${internalUserId}
            AND e.skill_id = ${roleSkillRequirementsTable.skill_id}
            AND e.level_id = ${roleSkillRequirementsTable.level_id}
            AND e.status = 'verified'
            AND e.deleted_at IS NULL
        )
      `,
    })
    .from(roleSkillRequirementsTable)
    .innerJoin(
      skillsTable,
      eq(roleSkillRequirementsTable.skill_id, skillsTable.id),
    )
    .innerJoin(
      skillsLevelTable,
      eq(roleSkillRequirementsTable.level_id, skillsLevelTable.id),
    )
    .where(eq(roleSkillRequirementsTable.role_id, assignment.role_id));

  return {
    role: {
      name: assignment.role_name,
      seniority_level: assignment.seniority_level,
    },
    required_skills,
    evidence_required_per_skill: org?.evidence_required_per_skill ?? 3,
    promotion_readiness_threshold: org?.promotion_readiness_threshold ?? 80,
  };
};
