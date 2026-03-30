import { faker, SimpleFaker } from "@faker-js/faker";
import {
  usersTable,
  projectsTable,
  skillsTable,
  skillsLevelTable,
  jobRolesTable,
  roleSkillRequirementsTable,
  clearancesTable,
} from "../schema";
import { visaTypesArray } from "../schema/enums";

faker.seed(123);

const jobTitles = [
  "Junior Developer",
  "Developer",
  "Senior Developer",
  "Lead Developer",
  "Principal Developer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Engineering Manager",
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
    description:
      "Modernising case management and digital services for the Home Office, improving processing times and transparency for applicants.",
    sector: "central_government",
  },
  {
    name: "NHS Patient Portal",
    description:
      "Building a unified patient-facing portal for appointment booking, test results, and GP communications across NHS trusts.",
    sector: "health",
  },
  {
    name: "MOD Personnel System",
    description:
      "Replacing legacy HR and personnel management systems for the Ministry of Defence with a modern, secure cloud-based solution.",
    sector: "defence",
  },
  {
    name: "Transport for London Data Platform",
    description:
      "Designing and delivering a real-time data platform to support operational analytics and passenger experience improvements across the TfL network.",
    sector: "transport",
  },
  {
    name: "Barclays Digital Banking",
    description:
      "Delivering new features and infrastructure improvements to the Barclays retail banking app, serving millions of customers.",
    sector: "commercial",
  },
  {
    name: "HMCTS Case Management",
    description:
      "Transforming court and tribunal case management by migrating paper-based processes to a digital-first service.",
    sector: "justice",
  },
  {
    name: "DfE Schools Data Service",
    description:
      "Creating a centralised data service for the Department for Education to improve school performance monitoring and funding allocation.",
    sector: "education",
  },
  {
    name: "Camden Council Digital Services",
    description:
      "Redesigning citizen-facing digital services for Camden London Borough Council, reducing call volumes and improving resident satisfaction.",
    sector: "local_government",
  },
];

const SKILL_DEFINITIONS = [
  {
    name: "Frontend Engineering",
    description:
      "Building accessible, performant user interfaces using modern HTML, CSS, and JavaScript frameworks.",
    levels: [
      {
        level_number: 1,
        criteria:
          "Writes HTML, CSS, and JavaScript for well-defined tasks under close supervision. Familiar with one frontend framework. Uses browser devtools to debug basic issues.",
      },
      {
        level_number: 2,
        criteria:
          "Independently builds responsive, accessible components. Comfortable with state management and the component lifecycle. Writes unit and component tests. Follows performance and accessibility guidelines.",
      },
      {
        level_number: 3,
        criteria:
          "Designs and implements complex UI features across a codebase. Owns frontend build configuration and performance budgets. Leads frontend direction for a workstream and reviews others' work critically.",
      },
      {
        level_number: 4,
        criteria:
          "Defines frontend architecture across a programme. Drives accessibility and performance standards. Evaluates and adopts frameworks or tooling. Mentors engineers and sets the technical bar for the team.",
      },
      {
        level_number: 5,
        criteria:
          "Sets frontend engineering strategy for the organisation. Contributes to open-source projects or web standards. Recognised externally as an authority on frontend engineering at scale.",
      },
    ],
  },
  {
    name: "Backend Engineering",
    description:
      "Designing and building reliable, scalable server-side systems including APIs, business logic, and data persistence layers.",
    levels: [
      {
        level_number: 1,
        criteria:
          "Writes server-side code for defined tasks under supervision. Understands the request/response lifecycle and basic data persistence. Follows existing patterns for validation and error handling.",
      },
      {
        level_number: 2,
        criteria:
          "Independently builds and ships API endpoints with appropriate validation, error handling, and logging. Contributes to database query design. Understands and applies basic auth patterns.",
      },
      {
        level_number: 3,
        criteria:
          "Designs service boundaries and data models for complex features. Implements authentication and authorisation systems. Owns reliability and performance of backend systems for a workstream.",
      },
      {
        level_number: 4,
        criteria:
          "Leads backend architecture across a programme. Defines API contracts and service patterns. Drives engineering quality, mentors engineers, and makes technology decisions with long-term consequence.",
      },
      {
        level_number: 5,
        criteria:
          "Sets backend engineering strategy for the organisation. Authors foundational platforms or shared libraries. Shapes industry practice and is recognised externally as an authority.",
      },
    ],
  },
  {
    name: "TypeScript / JavaScript",
    description:
      "Writing and maintaining well-typed, idiomatic TypeScript and JavaScript across frontend and backend codebases.",
    levels: [
      {
        level_number: 1,
        criteria:
          "Writes typed code following established team patterns. Understands primitive types, interfaces, and basic type inference. Resolves simple type errors with guidance.",
      },
      {
        level_number: 2,
        criteria:
          "Uses generics, utility types, and strict mode effectively. Resolves complex type errors independently. Configures tsconfig appropriately for the project context.",
      },
      {
        level_number: 3,
        criteria:
          "Authors conditional types, mapped types, and complex type transformations. Establishes typing conventions for a team. Guides others through difficult type problems.",
      },
      {
        level_number: 4,
        criteria:
          "Designs type systems for large codebases to maximise safety and developer experience. Educates teams on advanced patterns. Contributes to programme-level tooling configuration.",
      },
      {
        level_number: 5,
        criteria:
          "Recognised authority on the TypeScript type system. Contributes to TypeScript or JavaScript language standards, community tooling, or major open-source projects.",
      },
    ],
  },
  {
    name: "Testing & Quality Assurance",
    description:
      "Designing and implementing testing strategies across the full stack to ensure software correctness, reliability, and maintainability.",
    levels: [
      {
        level_number: 1,
        criteria:
          "Writes basic unit tests for own code following team conventions. Understands the test pyramid and the purpose of different test types. Runs the test suite and investigates failures.",
      },
      {
        level_number: 2,
        criteria:
          "Writes unit, integration, and component tests independently. Identifies and fills coverage gaps. Uses test doubles (mocks, stubs, fakes) appropriately. Contributes to CI quality gates.",
      },
      {
        level_number: 3,
        criteria:
          "Designs the testing strategy for a feature or service. Introduces end-to-end and contract tests where appropriate. Defines quality gates and flakiness standards in CI pipelines.",
      },
      {
        level_number: 4,
        criteria:
          "Sets QA strategy for a programme. Builds shared testing infrastructure. Mentors teams on quality culture. Drives adoption of test automation and performance testing practices.",
      },
      {
        level_number: 5,
        criteria:
          "Shapes the organisation's approach to engineering quality. Drives industry-level adoption of testing best practices. Recognised authority on software quality at scale.",
      },
    ],
  },
  {
    name: "DevOps & CI/CD",
    description:
      "Building and maintaining delivery pipelines, cloud infrastructure, and operational tooling to enable fast, reliable software releases.",
    levels: [
      {
        level_number: 1,
        criteria:
          "Understands core deployment concepts. Runs and interprets CI pipeline results. Resolves common pipeline failures with guidance. Familiar with containerisation basics.",
      },
      {
        level_number: 2,
        criteria:
          "Configures and maintains CI/CD pipelines independently. Manages containers and environment configuration. Writes basic infrastructure-as-code. Monitors deployments and responds to alerts.",
      },
      {
        level_number: 3,
        criteria:
          "Designs pipeline architecture for programmes. Implements GitOps workflows and multi-environment deployment strategies. Owns on-call runbooks and incident response for the platform.",
      },
      {
        level_number: 4,
        criteria:
          "Sets DevOps strategy across a programme. Leads platform engineering. Drives observability standards and SRE practices. Mentors engineers on operational excellence.",
      },
      {
        level_number: 5,
        criteria:
          "Shapes the organisation's engineering platform and DevOps culture. Influences tooling strategy at an organisational or industry level. Recognised authority on continuous delivery at scale.",
      },
    ],
  },
  {
    name: "Database Design",
    description:
      "Designing, querying, and managing relational and non-relational databases with a focus on correctness, performance, and maintainability.",
    levels: [
      {
        level_number: 1,
        criteria:
          "Writes basic SQL queries. Understands database normalisation. Adds schema migrations following established team patterns.",
      },
      {
        level_number: 2,
        criteria:
          "Designs database schemas for features. Writes optimised queries with appropriate indexes. Manages migrations safely. Understands transactions and basic concurrency concerns.",
      },
      {
        level_number: 3,
        criteria:
          "Designs data models for complex domains. Implements query performance tuning and explains plans. Owns migration strategy. Advises on database technology selection for the project.",
      },
      {
        level_number: 4,
        criteria:
          "Sets data architecture standards for a programme. Manages scaling, replication, and backup strategies. Mentors engineers on data modelling and query design.",
      },
      {
        level_number: 5,
        criteria:
          "Shapes the organisation's data infrastructure strategy. Recognised expert in data storage and retrieval at scale. Influences technology selection at the portfolio level.",
      },
    ],
  },
  {
    name: "API Design",
    description:
      "Designing clear, consistent, and evolvable APIs — REST, event-driven, or otherwise — with a focus on developer experience and long-term maintainability.",
    levels: [
      {
        level_number: 1,
        criteria:
          "Understands REST conventions and HTTP semantics. Reads and uses OpenAPI specifications. Implements endpoints following established team patterns.",
      },
      {
        level_number: 2,
        criteria:
          "Designs resource-oriented APIs independently. Writes OpenAPI specs. Versions APIs correctly. Handles errors and edge cases consistently across endpoints.",
      },
      {
        level_number: 3,
        criteria:
          "Leads API design across a service or programme. Establishes contract-first development practices. Introduces GraphQL or event-driven patterns where appropriate. Reviews API designs critically.",
      },
      {
        level_number: 4,
        criteria:
          "Sets API governance and standards across a programme. Drives developer experience for internal and external consumers. Evaluates API platforms and gateways.",
      },
      {
        level_number: 5,
        criteria:
          "Shapes the organisation's API strategy. Contributes to industry standards or influential open-source API tooling. Recognised authority on API design at scale.",
      },
    ],
  },
  {
    name: "Web Security",
    description:
      "Applying secure development practices to protect web applications from common vulnerabilities and emerging threats.",
    levels: [
      {
        level_number: 1,
        criteria:
          "Aware of the OWASP Top 10 and common web vulnerabilities. Follows secure coding guidance. Escalates security concerns to senior colleagues promptly.",
      },
      {
        level_number: 2,
        criteria:
          "Independently applies secure coding practices. Implements authentication and authorisation patterns correctly. Uses dependency scanning and SAST tools in the development workflow.",
      },
      {
        level_number: 3,
        criteria:
          "Leads security reviews for features and services. Implements OWASP mitigations. Defines security requirements alongside architects. Manages and communicates security incidents.",
      },
      {
        level_number: 4,
        criteria:
          "Sets security standards for a programme. Drives threat modelling, penetration testing, and security assurance. Trains teams on secure development practices.",
      },
      {
        level_number: 5,
        criteria:
          "Shapes the organisation's security posture. Recognised authority on web application security. Contributes to security standards or community knowledge at an industry level.",
      },
    ],
  },
];

const ROLE_DEFINITIONS = [
  {
    name: "Junior Developer",
    seniority_level: 1,
    description:
      "Entry-level developer building core skills across the full stack. Works closely with a senior or lead developer and is expected to contribute to well-defined tasks.",
    requirements: [
      { skillName: "Frontend Engineering", levelNumber: 1 },
      { skillName: "Backend Engineering", levelNumber: 1 },
      { skillName: "TypeScript / JavaScript", levelNumber: 1 },
      { skillName: "Testing & Quality Assurance", levelNumber: 1 },
    ],
  },
  {
    name: "Mid-Level Developer",
    seniority_level: 2,
    description:
      "Capable developer who can own features end-to-end with limited supervision. Contributes to technical decisions within a team.",
    requirements: [
      { skillName: "Frontend Engineering", levelNumber: 2 },
      { skillName: "Backend Engineering", levelNumber: 2 },
      { skillName: "TypeScript / JavaScript", levelNumber: 2 },
      { skillName: "Testing & Quality Assurance", levelNumber: 2 },
      { skillName: "DevOps & CI/CD", levelNumber: 1 },
      { skillName: "API Design", levelNumber: 1 },
    ],
  },
  {
    name: "Senior Developer",
    seniority_level: 3,
    description:
      "Experienced developer who independently drives complex features, sets standards within a team, and mentors junior colleagues.",
    requirements: [
      { skillName: "Frontend Engineering", levelNumber: 3 },
      { skillName: "Backend Engineering", levelNumber: 3 },
      { skillName: "TypeScript / JavaScript", levelNumber: 2 },
      { skillName: "Testing & Quality Assurance", levelNumber: 2 },
      { skillName: "DevOps & CI/CD", levelNumber: 2 },
      { skillName: "Database Design", levelNumber: 2 },
      { skillName: "API Design", levelNumber: 2 },
      { skillName: "Web Security", levelNumber: 2 },
    ],
  },
  {
    name: "Lead Developer",
    seniority_level: 4,
    description:
      "Technical lead responsible for the architecture and delivery quality of an engineering team. Balances hands-on delivery with team leadership.",
    requirements: [
      { skillName: "Frontend Engineering", levelNumber: 3 },
      { skillName: "Backend Engineering", levelNumber: 3 },
      { skillName: "TypeScript / JavaScript", levelNumber: 3 },
      { skillName: "Testing & Quality Assurance", levelNumber: 3 },
      { skillName: "DevOps & CI/CD", levelNumber: 3 },
      { skillName: "Database Design", levelNumber: 3 },
      { skillName: "API Design", levelNumber: 3 },
      { skillName: "Web Security", levelNumber: 3 },
    ],
  },
  {
    name: "Principal Developer",
    seniority_level: 5,
    description:
      "Senior technical leader who shapes engineering strategy, standards, and culture across multiple teams or programmes.",
    requirements: [
      { skillName: "Frontend Engineering", levelNumber: 4 },
      { skillName: "Backend Engineering", levelNumber: 4 },
      { skillName: "TypeScript / JavaScript", levelNumber: 4 },
      { skillName: "Testing & Quality Assurance", levelNumber: 4 },
      { skillName: "DevOps & CI/CD", levelNumber: 4 },
      { skillName: "Database Design", levelNumber: 4 },
      { skillName: "API Design", levelNumber: 4 },
      { skillName: "Web Security", levelNumber: 4 },
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

export const generateJobRoles = (
  orgId: string,
): (typeof jobRolesTable.$inferInsert)[] =>
  ROLE_DEFINITIONS.map((r) => ({
    organisation_id: orgId,
    name: r.name,
    seniority_level: r.seniority_level,
    description: r.description,
  }));

export const generateRoleSkillRequirements = (
  roles: { id: string; name: string }[],
  skills: { id: string; name: string }[],
  levels: { id: string; skill_id: string; level_number: number }[],
): (typeof roleSkillRequirementsTable.$inferInsert)[] => {
  const result: (typeof roleSkillRequirementsTable.$inferInsert)[] = [];

  for (const roleDef of ROLE_DEFINITIONS) {
    const role = roles.find((r) => r.name === roleDef.name);
    if (!role) continue;

    for (const req of roleDef.requirements) {
      const skill = skills.find((s) => s.name === req.skillName);
      if (!skill) continue;

      const level = levels.find(
        (l) => l.skill_id === skill.id && l.level_number === req.levelNumber,
      );
      if (!level) continue;

      result.push({ role_id: role.id, skill_id: skill.id, level_id: level.id });
    }
  }

  return result;
};

const SPONSORING_ORGS = [
  "Demo Consultancy",
  "Home Office",
  "NHS Digital",
  "HMCTS",
  "MOD",
  "DfE",
];

// Clearances — realistic UK public sector distribution across all users.
// Demo user always gets Security Check; mock users are distributed across
// BPSS (most common), SC, and DV (rare).
export const generateClearances = (
  allUserIds: string[],
  demoDomainUserId: string,
): (typeof clearancesTable.$inferInsert)[] =>
  allUserIds.map((userId) => {
    if (userId === demoDomainUserId) {
      return {
        user_id: userId,
        level: "security check" as const,
        granted_at: new Date("2024-01-15"),
        expires_at: new Date("2029-01-15"),
        sponsoring_organization: "Demo Consultancy",
      };
    }

    const roll = faker.number.int({ min: 1, max: 10 });
    const level =
      roll <= 5
        ? ("baseline personnel security standard" as const)
        : roll <= 8
          ? ("security check" as const)
          : roll === 9
            ? ("enhanced security check" as const)
            : ("developed vetting check" as const);

    return {
      user_id: userId,
      level,
      granted_at: faker.date.past({ years: 3 }),
      expires_at:
        level === "baseline personnel security standard"
          ? null
          : faker.date.future({ years: 3 }),
      sponsoring_organization: faker.helpers.arrayElement(SPONSORING_ORGS),
    };
  });

type RelationshipSeed = {
  actor_id: string;
  subject_id: string;
  role: "manager" | "peer" | "mentor" | "mentee" | "colleague";
};

// Relationships — creates a realistic org structure around the demo user.
// allUserIds must be ordered as [demoDomainUserId, ...mockUserIds].
export const generateRelationships = (
  allUserIds: string[],
  demoDomainUserId: string,
): RelationshipSeed[] => {
  const others = allUserIds.filter((id) => id !== demoDomainUserId);

  return [
    // others[0] is the demo user's line manager
    { actor_id: others[0], subject_id: demoDomainUserId, role: "manager" },
    // Demo user mentors others[1]; others[1] records the reciprocal mentee side
    { actor_id: demoDomainUserId, subject_id: others[1], role: "mentor" },
    { actor_id: others[1], subject_id: demoDomainUserId, role: "mentee" },
    // Demo user has two colleagues on current project
    { actor_id: demoDomainUserId, subject_id: others[2], role: "colleague" },
    { actor_id: others[2], subject_id: demoDomainUserId, role: "colleague" },
    // Demo user is a peer with others[3]
    { actor_id: demoDomainUserId, subject_id: others[3], role: "peer" },
    // others[0] also manages others[4] and others[5]
    { actor_id: others[0], subject_id: others[4], role: "manager" },
    { actor_id: others[0], subject_id: others[5], role: "manager" },
    // A few relationships among the remaining mock users
    { actor_id: others[6], subject_id: others[7], role: "colleague" },
    { actor_id: others[7], subject_id: others[6], role: "colleague" },
    { actor_id: others[8], subject_id: others[5], role: "peer" },
  ];
};
