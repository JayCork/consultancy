import * as schema from "../schema/index";
import { pgGenerate } from "drizzle-dbml-generator";

pgGenerate({ schema, out: "./schema.dbml", relational: false });
console.log("schema.dbml generated");
