import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { generateProjects, generateUsers } from "./seed.generator";
import { projectsTable, usersTable } from "../schema/schema";

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  // const mockUsers = generateUsers(10);
  // await db.insert(usersTable).values(mockUsers);
  // console.log("10 users created!");

  const mockProjects = generateProjects(5);
  await db.insert(projectsTable).values(mockProjects);
  console.log("5 projects created!");
}

main();
