import type { Person } from "./types";
import { addDays } from "./dateHelpers";

const today = new Date();
today.setHours(0, 0, 0, 0);

function d(offset: number): Date {
  return addDays(today, offset);
}

export const MOCK_PEOPLE: Person[] = [
  // 1. Fully bench — available immediately
  {
    name: "Priya Sharma",
    initials: "PS",
    grade: "Senior Consultant",
    clearance: "SC",
    clearanceExpiryDays: 480,
    skills: ["Service Design", "User Research", "Agile Delivery"],
    assignments: [],
  },

  // 2. Single full-time project, free mid-quarter
  {
    name: "Marcus Webb",
    initials: "MW",
    grade: "Consultant",
    clearance: "DV",
    clearanceExpiryDays: 340,
    skills: ["Cloud Architecture", "AWS", "Terraform"],
    assignments: [
      {
        project: "NHS England Data Platform",
        role: "Cloud Architect",
        startDate: d(-30),
        endDate: d(38),
        sector: "Health",
        confirmed: true,
        utilisation: 100,
      },
    ],
  },

  // 3. Split across two concurrent projects at 60/40 (totalling 100%)
  {
    name: "Aisha Okonkwo",
    initials: "AO",
    grade: "Principal Consultant",
    clearance: "SC",
    clearanceExpiryDays: 210,
    skills: ["Programme Management", "Benefits Realisation", "Stakeholder Mgmt"],
    assignments: [
      {
        project: "DWP Digital Transformation",
        role: "Programme Manager",
        startDate: d(-14),
        endDate: d(55),
        sector: "Benefits & Welfare",
        confirmed: true,
        utilisation: 60,
      },
      {
        project: "GDS Notify Platform",
        role: "Delivery Advisor",
        startDate: d(-7),
        endDate: d(55),
        sector: "Central Government",
        confirmed: true,
        utilisation: 40,
      },
    ],
  },

  // 4. Partially utilised (60%) — visible partial capacity strips
  {
    name: "Tom Blakely",
    initials: "TB",
    grade: "Consultant",
    clearance: "BPSS",
    clearanceExpiryDays: null,
    skills: ["Data Engineering", "Python", "Apache Spark"],
    assignments: [
      {
        project: "HMRC MTD Programme",
        role: "Data Engineer",
        startDate: d(-20),
        endDate: d(70),
        sector: "Taxation",
        confirmed: true,
        utilisation: 60,
      },
    ],
  },

  // 5. Current project ends, then gap, then next one starts — multi-bar single-lane with free strip
  {
    name: "Rachel Finch",
    initials: "RF",
    grade: "Senior Consultant",
    clearance: "SC",
    clearanceExpiryDays: 600,
    skills: ["Business Analysis", "Process Mapping", "Requirements"],
    assignments: [
      {
        project: "Home Office Borders Tech",
        role: "Business Analyst",
        startDate: d(-10),
        endDate: d(25),
        sector: "Immigration & Border",
        confirmed: true,
        utilisation: 100,
      },
      {
        project: "DVLA Vehicle Services",
        role: "Business Analyst",
        startDate: d(40),
        endDate: d(85),
        sector: "Transport",
        confirmed: true,
        utilisation: 100,
      },
    ],
  },

  // 6. Tentative upcoming assignment
  {
    name: "James Osei",
    initials: "JO",
    grade: "Consultant",
    clearance: "BPSS",
    clearanceExpiryDays: null,
    skills: ["DevOps", "Kubernetes", "CI/CD"],
    assignments: [
      {
        project: "Cabinet Office Innovation",
        role: "DevOps Engineer",
        startDate: d(14),
        endDate: d(75),
        sector: "Central Government",
        confirmed: false,
        utilisation: 100,
      },
    ],
  },

  // 7. Clearance expiry within display window
  {
    name: "Natalie Cross",
    initials: "NC",
    grade: "Senior Consultant",
    clearance: "DV",
    clearanceExpiryDays: 45,
    skills: ["Security Architecture", "Risk Assessment", "NCSC Frameworks"],
    assignments: [
      {
        project: "MOD Defence Digital",
        role: "Security Architect",
        startDate: d(-5),
        endDate: d(60),
        sector: "Defence",
        confirmed: true,
        utilisation: 100,
      },
    ],
  },

  // 8. Over 12 months on same project — ROTATION flag
  {
    name: "Daniel Hughes",
    initials: "DH",
    grade: "Principal Consultant",
    clearance: "SC",
    clearanceExpiryDays: 380,
    skills: ["Enterprise Architecture", "TOGAF", "Strategy"],
    assignments: [
      {
        project: "DWP Digital Transformation",
        role: "Enterprise Architect",
        startDate: addDays(today, -420),
        endDate: d(50),
        sector: "Benefits & Welfare",
        confirmed: true,
        utilisation: 100,
      },
    ],
  },

  // 9. Clearance expires within 90 days — CLEARANCE flag
  {
    name: "Fiona MacLeod",
    initials: "FM",
    grade: "Consultant",
    clearance: "SC",
    clearanceExpiryDays: 72,
    skills: ["Change Management", "Training Delivery", "Comms"],
    assignments: [
      {
        project: "MHCLG Levelling Up",
        role: "Change Manager",
        startDate: d(-28),
        endDate: d(35),
        sector: "Local Government",
        confirmed: true,
        utilisation: 80,
      },
    ],
  },

  // 10. Fully booked entire quarter — no free period
  {
    name: "Ravi Patel",
    initials: "RP",
    grade: "Senior Consultant",
    clearance: "SC",
    clearanceExpiryDays: 250,
    skills: ["Agile Coaching", "SAFe", "Scrum Master"],
    assignments: [
      {
        project: "FCDO Digital Services",
        role: "Agile Coach",
        startDate: d(-60),
        endDate: d(92),
        sector: "Foreign Affairs",
        confirmed: true,
        utilisation: 100,
      },
    ],
  },

  // 11. Partially utilised with upcoming tentative second assignment
  {
    name: "Siobhan Kelly",
    initials: "SK",
    grade: "Consultant",
    clearance: "BPSS",
    clearanceExpiryDays: null,
    skills: ["Content Design", "Accessibility", "GOV.UK"],
    assignments: [
      {
        project: "GDS Notify Platform",
        role: "Content Designer",
        startDate: d(-15),
        endDate: d(65),
        sector: "Central Government",
        confirmed: true,
        utilisation: 50,
      },
      {
        project: "Cabinet Office Innovation",
        role: "Content Advisor",
        startDate: d(20),
        endDate: d(65),
        sector: "Central Government",
        confirmed: false,
        utilisation: 50,
      },
    ],
  },

  // 12. Just finishing, long bench stretch ahead
  {
    name: "Oliver Marsh",
    initials: "OM",
    grade: "Associate Consultant",
    clearance: "BPSS",
    clearanceExpiryDays: null,
    skills: ["User Research", "Usability Testing", "Prototype"],
    assignments: [
      {
        project: "DVLA Vehicle Services",
        role: "User Researcher",
        startDate: d(-45),
        endDate: d(7),
        sector: "Transport",
        confirmed: true,
        utilisation: 100,
      },
    ],
  },

  // 13. DV clearance, complex split — 70/30
  {
    name: "Zara Ahmed",
    initials: "ZA",
    grade: "Principal Consultant",
    clearance: "DV",
    clearanceExpiryDays: 520,
    skills: ["Cyber Security", "Threat Intelligence", "SOC"],
    assignments: [
      {
        project: "MOD Defence Digital",
        role: "Cyber Security Lead",
        startDate: d(-20),
        endDate: d(45),
        sector: "Defence",
        confirmed: true,
        utilisation: 70,
      },
      {
        project: "Home Office Borders Tech",
        role: "Security Advisor",
        startDate: d(5),
        endDate: d(45),
        sector: "Immigration & Border",
        confirmed: true,
        utilisation: 30,
      },
    ],
  },

  // 14. SC, short-term gig wrapping up soon, then free
  {
    name: "Ben Stafford",
    initials: "BS",
    grade: "Consultant",
    clearance: "SC",
    clearanceExpiryDays: 400,
    skills: ["Solution Architecture", "Azure", "Integration"],
    assignments: [
      {
        project: "HMRC MTD Programme",
        role: "Solutions Architect",
        startDate: d(-5),
        endDate: d(14),
        sector: "Taxation",
        confirmed: true,
        utilisation: 100,
      },
    ],
  },
];
