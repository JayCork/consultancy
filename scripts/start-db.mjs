import { execSync } from "child_process";

try {
  execSync("docker start drizzle-postgres", { stdio: "pipe" });
  console.log("Database container started.");
} catch {
  try {
    execSync(
      "docker run --name drizzle-postgres -e POSTGRES_PASSWORD=mypassword -d -p 5432:5432 postgres",
      { stdio: "inherit" },
    );
    console.log("Database container created and started.");
  } catch {
    console.warn(
      "WARNING: Could not start database container - is Docker Desktop running?",
    );
  }
}
