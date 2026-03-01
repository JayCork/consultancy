import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { usersTable } from "./db/schema/schema";
import { generateUsers } from "./db/scripts/seed.generator";

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  const mockUsers = generateUsers(10);
  await db.insert(usersTable).values(mockUsers);

  console.log("10 users created!");
}

main();
