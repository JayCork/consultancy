import { faker, SimpleFaker } from "@faker-js/faker";
import { usersTable, projectsTable, skillsTable, skillsLevelTable } from "../schema";
import { visaTypesArray } from "../schema/enums";

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

export const generateUsers = (count: number, organisationId: string) => {
  const users: (typeof usersTable.$inferInsert)[] = [];
  for (let i = 0; i < count; i++) {
    users.push({
      id: faker.string.uuid(),
      auth_user_id: faker.string.uuid(),
      organisation_id: organisationId,
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
    country_code: faker.location.countryCode("alpha-2"),
    visa_type: faker.helpers.arrayElement(visaTypesArray),
    issue_date: faker.date.past(),
    expiration_date: faker.date.future(),
    sponsoring_organization: faker.company.name(),
  }));
};

export const SEED_PROJECTS: (typeof projectsTable.$inferInsert)[] = [
  {
    name: "Home Office Digital Platform",
    description: "Modernising case management and digital services for the Home Office, improving processing times and transparency for applicants.",
    sector: "central_government",
  },
  {
    name: "NHS Patient Portal",
    description: "Building a unified patient-facing portal for appointment booking, test results, and GP communications across NHS trusts.",
    sector: "health",
  },
  {
    name: "MOD Personnel System",
    description: "Replacing legacy HR and personnel management systems for the Ministry of Defence with a modern, secure cloud-based solution.",
    sector: "defence",
  },
  {
    name: "Transport for London Data Platform",
    description: "Designing and delivering a real-time data platform to support operational analytics and passenger experience improvements across the TfL network.",
    sector: "transport",
  },
  {
    name: "Barclays Digital Banking",
    description: "Delivering new features and infrastructure improvements to the Barclays retail banking app, serving millions of customers.",
    sector: "commercial",
  },
  {
    name: "HMCTS Case Management",
    description: "Transforming court and tribunal case management by migrating paper-based processes to a digital-first service.",
    sector: "justice",
  },
  {
    name: "DfE Schools Data Service",
    description: "Creating a centralised data service for the Department for Education to improve school performance monitoring and funding allocation.",
    sector: "education",
  },
  {
    name: "Camden Council Digital Services",
    description: "Redesigning citizen-facing digital services for Camden London Borough Council, reducing call volumes and improving resident satisfaction.",
    sector: "local_government",
  },
];

const SKILL_DEFINITIONS = [
  {
    name: "Solution Architecture",
    description: "Designing technical solutions that meet business requirements, including system design, technology selection, and integration patterns.",
    levels: [
      { level_number: 1, criteria: "Understands basic architectural patterns and can describe common design decisions with guidance from senior colleagues." },
      { level_number: 2, criteria: "Contributes to architectural discussions and documents design decisions for bounded components with some independence." },
      { level_number: 3, criteria: "Independently designs end-to-end solutions for moderately complex systems, justifying technology choices and trade-offs." },
      { level_number: 4, criteria: "Leads architectural design for complex, multi-system programmes and mentors others. Accountable for cross-cutting concerns such as security and scalability." },
      { level_number: 5, criteria: "Sets architectural strategy and standards across the organisation. Influences vendor and technology roadmaps. Recognised externally as a domain authority." },
    ],
  },
  {
    name: "Software Development",
    description: "Writing, reviewing, and maintaining production-quality code across the full development lifecycle, including testing and deployment.",
    levels: [
      { level_number: 1, criteria: "Writes working code for well-defined tasks under close supervision. Follows team coding standards and contributes to code reviews with guidance." },
      { level_number: 2, criteria: "Delivers features independently within an established codebase. Writes unit tests and participates in code reviews constructively." },
      { level_number: 3, criteria: "Designs and implements non-trivial features with appropriate testing strategies. Identifies and resolves systemic code quality issues." },
      { level_number: 4, criteria: "Leads technical direction for a team. Defines coding standards, drives adoption of best practices, and unblocks complex technical problems." },
      { level_number: 5, criteria: "Shapes engineering culture and practices across multiple teams or the organisation. Drives adoption of new technologies and engineering paradigms." },
    ],
  },
  {
    name: "Delivery Management",
    description: "Planning, coordinating, and tracking delivery of projects and programmes, managing risks, dependencies, and stakeholder expectations.",
    levels: [
      { level_number: 1, criteria: "Supports delivery planning and tracks progress for small, well-defined tasks. Escalates blockers promptly." },
      { level_number: 2, criteria: "Manages delivery of a workstream or small team with regular oversight. Maintains a risk log and facilitates team ceremonies." },
      { level_number: 3, criteria: "Independently manages delivery across a team or multiple workstreams. Proactively identifies and mitigates risks before they impact delivery." },
      { level_number: 4, criteria: "Leads delivery of a complex programme with multiple teams. Manages cross-team dependencies and provides delivery assurance to senior stakeholders." },
      { level_number: 5, criteria: "Sets delivery standards across the organisation or portfolio. Coaches delivery managers and shapes the organisation's approach to programme governance." },
    ],
  },
  {
    name: "Stakeholder Management",
    description: "Building and maintaining relationships with stakeholders at all levels, managing expectations, and communicating effectively to drive alignment.",
    levels: [
      { level_number: 1, criteria: "Communicates clearly with immediate team members and follows up on actions. Begins building rapport with colleagues and junior client contacts." },
      { level_number: 2, criteria: "Manages relationships with day-to-day client contacts. Prepares and presents status updates and handles routine stakeholder queries independently." },
      { level_number: 3, criteria: "Builds trusted relationships with senior client stakeholders. Navigates competing priorities and conflicting interests to maintain alignment." },
      { level_number: 4, criteria: "Manages relationships at director and C-suite level. Influences strategic decisions and handles escalations effectively. Accountable for overall client satisfaction." },
      { level_number: 5, criteria: "Operates as a trusted advisor to executive stakeholders. Shapes organisational relationships and opens new opportunities through sustained trust and credibility." },
    ],
  },
  {
    name: "Data Analysis",
    description: "Analysing data to surface insights, inform decisions, and communicate findings clearly to technical and non-technical audiences.",
    levels: [
      { level_number: 1, criteria: "Cleans and queries structured datasets using SQL or spreadsheet tools to answer predefined questions with guidance." },
      { level_number: 2, criteria: "Independently analyses datasets to answer business questions, produces clear visualisations, and documents methodology." },
      { level_number: 3, criteria: "Designs analytical frameworks and applies statistical methods. Translates complex findings into actionable recommendations for non-technical stakeholders." },
      { level_number: 4, criteria: "Leads data strategy for a programme or team. Defines data quality standards and builds reusable analytical assets. Mentors junior analysts." },
      { level_number: 5, criteria: "Sets data culture and strategy across the organisation. Champions data-driven decision making at the executive level and drives data literacy." },
    ],
  },
];

export const generateSkills = (): (typeof skillsTable.$inferInsert)[] =>
  SKILL_DEFINITIONS.map((s) => ({ name: s.name, description: s.description }));

export const generateSkillLevels = (
  skillName: string,
  skillId: string,
): (typeof skillsLevelTable.$inferInsert)[] => {
  const skill = SKILL_DEFINITIONS.find((s) => s.name === skillName);
  if (!skill) return [];
  return skill.levels.map((l) => ({ skill_id: skillId, ...l }));
};
