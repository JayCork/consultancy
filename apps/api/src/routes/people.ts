import { Hono } from "hono";
import { getPeopleForPlanning } from "@consultancy/db";

const people = new Hono();

people.get("/", async (c) => {
  const data = await getPeopleForPlanning();
  return c.json({ ok: true, data });
});

export default people;
