
import { execSync } from "child_process";
import fs from "fs";

if (fs.existsSync(".env")) {
  const env = fs.readFileSync(".env", "utf-8");
  env.split("\n").forEach(line => {
    if (!line.trim() || line.trim().startsWith("#")) return;
    const [key, ...rest] = line.split("=");
    if (key && rest.length) {
      process.env[key.trim()] = rest.join("=").trim();
    }
  });
}

const DB_USER = process.env.DB_USER || process.env.POSTGRES_USER || "basic_dev";
const DB_PASSWORD = process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || "butter_iron_knife";
const DB_NAME = process.env.DB_NAME || process.env.POSTGRES_DB || "consultancy_hub";

try {
  execSync("docker start consultancy_hub", { stdio: "pipe" });
  console.log("Database container started.");
} catch {
  try {
    execSync(
      `docker run --name consultancy_hub -e POSTGRES_USER=${DB_USER} -e POSTGRES_PASSWORD=${DB_PASSWORD} -e POSTGRES_DB=${DB_NAME} -d -p 5432:5432 postgres`,
      { stdio: "inherit" },
    );
    console.log("Database container created and started.");
  } catch {
    console.warn(
      "WARNING: Could not start database container - is Docker Desktop running?",
    );
  }
}
