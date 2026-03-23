import { InferInsertModel, eq, desc } from "drizzle-orm";
import { db } from "..";
import { evidenceTable, skillsTable, skillsLevelTable } from "../schema";

type NewEvidence = Omit<InferInsertModel<typeof evidenceTable>, "id" | "created_at" | "updated_at" | "deleted_at">;

export const createEvidence = async (data: NewEvidence) => {
  const [entry] = await db.insert(evidenceTable).values(data).returning();
  return entry;
};

export const getEvidenceByUser = async (userId: string) => {
  return db
    .select({
      id: evidenceTable.id,
      situation: evidenceTable.situation,
      task: evidenceTable.task,
      action: evidenceTable.action,
      result: evidenceTable.result,
      status: evidenceTable.status,
      sector: evidenceTable.sector,
      security_context: evidenceTable.security_context,
      project_id: evidenceTable.project_id,
      created_at: evidenceTable.created_at,
      skill_name: skillsTable.name,
      level_number: skillsLevelTable.level_number,
    })
    .from(evidenceTable)
    .innerJoin(skillsTable, eq(evidenceTable.skill_id, skillsTable.id))
    .innerJoin(skillsLevelTable, eq(evidenceTable.level_id, skillsLevelTable.id))
    .where(eq(evidenceTable.author_id, userId))
    .orderBy(desc(evidenceTable.created_at));
};
