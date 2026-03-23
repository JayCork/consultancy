import { drizzle } from "drizzle-orm/node-postgres";
import { organizationsTable, projectsTable, usersTable } from "../schema";
import { generateProjects, generateUsers } from "./seed.generator";

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  // Must exist before users
  const [org] = await db
    .insert(organizationsTable)
    .values({ name: "Demo Consultancy" })
    .returning();

  const mockUsers = generateUsers(10, org.id);
  await db.insert(usersTable).values(mockUsers);
  console.log("10 users created!");

  const mockProjects = generateProjects(5);
  await db.insert(projectsTable).values(mockProjects);
  console.log("5 projects created!");
}

main();
