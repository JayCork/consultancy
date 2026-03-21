import { InferInsertModel } from "drizzle-orm";
import { db } from "..";
import { evidenceTable } from "../schema";

type NewEvidence = Omit<InferInsertModel<typeof evidenceTable>, "id" | "created_at" | "updated_at" | "deleted_at">;

export const createEvidence = async (data: NewEvidence) => {
  const [entry] = await db.insert(evidenceTable).values(data).returning();
  return entry;
};
