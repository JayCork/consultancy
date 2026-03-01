import { faker, SimpleFaker } from "@faker-js/faker";
import { projectsTable, usersTable } from "../schema/schema";
import { visaTypesArray } from "../schema/schema";
faker.seed(123);

const jobTitles = [
  "Agile Project Manager",
  "User Experience Practitioner",
  "Data Analyst",
  "Solution Architect",
  "Cloud Engineer",
  "Cybersecurity Specialist",
  "AI Researcher",
  "Blockchain Developer",
  "IoT Engineer",
  "DevOps Engineer",
  "Product Manager",
];

const customSimpleFaker = new SimpleFaker();

export const generateUsers = (count: number) => {
  const users: (typeof usersTable.$inferInsert)[] = [];
  for (let i = 0; i < count; i++) {
    users.push({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: customSimpleFaker.helpers.arrayElement(jobTitles),
      is_contractor: faker.datatype.boolean(),
    });
  }
  return users;
};

export const generateVisas = (users: (typeof usersTable.$inferInsert)[]) => {
  return users.map((user) => ({
    id: faker.string.uuid(),
    user_id: user.id,
    country_code: faker.location.countryCode("alpha-3"),
    visa_type: faker.helpers.arrayElement(visaTypesArray),
    issue_date: faker.date.past(),
    expiration_date: faker.date.future(),
    sponsoring_organization: faker.company.name(),
  }));
};

export const generateProjects = (count: number) => {
  const projects: (typeof projectsTable.$inferInsert)[] = [];
  for (let i = 0; i < count; i++) {
    projects.push({
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
    });
  }
  return projects;
};
