import { InferInsertModel, eq, and, isNull, desc, getTableColumns } from "drizzle-orm";

import { db } from "..";
import { evidenceTable, evidenceSkillsTable, skillsTable } from "../schema";

type NewEvidence = Omit<
  InferInsertModel<typeof evidenceTable>,
  "id" | "created_at" | "updated_at" | "deleted_at"
>;

export const createEvidence = async (data: NewEvidence) => {
  const [entry] = await db.insert(evidenceTable).values(data).returning();
  return entry;
};

// Get all the current user's evidence, ordered by creation date desc, including primary skill and level claimed for that skill (if any)
// Filter out any evidence marked as deleted (soft delete via deleted_at timestamp)
// Filter out any evidence with a parent_id (i.e. only return the latest version of each piece of evidence, not the revision history)
export const getEvidenceByUser = async (userId: string) => {
  return db
    .select({
      ...getTableColumns(evidenceTable),
      skill_name: skillsTable.name,
      level_claimed: evidenceSkillsTable.level_claimed,
    })
    .from(evidenceTable)
    .leftJoin(
      evidenceSkillsTable,
      and(
        eq(evidenceSkillsTable.evidence_id, evidenceTable.id),
        eq(evidenceSkillsTable.is_primary, true),
      ),
    )
    .leftJoin(skillsTable, eq(evidenceSkillsTable.skill_id, skillsTable.id))
    .where(
      and(
        eq(evidenceTable.user_id, userId),
        isNull(evidenceTable.deleted_at),
        isNull(evidenceTable.parent_id),
      ),
    )
    .orderBy(desc(evidenceTable.created_at));
};
