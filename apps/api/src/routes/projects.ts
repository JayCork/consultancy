import { Hono } from "hono";
import { getAllProjects } from "@consultancy/db";

const projects = new Hono();

projects.get("/", async (c) => {
  const data = await getAllProjects();
  return c.json({ ok: true, data });
});

export default projects;
