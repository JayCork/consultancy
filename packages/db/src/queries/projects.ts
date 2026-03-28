import { db } from "..";
import { projectsTable } from "../schema";

export const getAllProjects = async () => {
  return db.select().from(projectsTable);
};
