import { eq, asc } from "drizzle-orm";
import { db } from "..";
import { skillsTable, skillsLevelTable } from "../schema";

export const getAllSkills = async () => {
  return db.select().from(skillsTable);
};

export const getSkillLevels = async (skillId: string) => {
  return db
    .select()
    .from(skillsLevelTable)
    .where(eq(skillsLevelTable.skill_id, skillId))
    .orderBy(asc(skillsLevelTable.level_number));
};
