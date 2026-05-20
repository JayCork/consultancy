export interface Assignment {
  project: string;
  role: string;
  startDate: Date;
  endDate: Date | null;
  sector: string;
  projectStatus: string;
  confirmed: boolean;
  utilisation: number; // 0–100
}

export type FrameworkLevel =
  | "associate"
  | "junior"
  | "mid"
  | "senior"
  | "lead"
  | "principal";

export interface Person {
  name: string;
  initials: string;
  grade: string;
  level: FrameworkLevel | null;
  skills: string[];
  assignments: Assignment[];
}

export interface AvailabilityPeriod {
  start: Date;
  end: Date;
  utilisation: number; // running total during this period
  availablePercent: number; // 100 - utilisation
}

export interface Bar {
  assignment: Assignment;
  leftPercent: number;
  widthPercent: number;
  clippedLeft: boolean;
  clippedRight: boolean;
}

export interface EnrichedPerson extends Person {
  currentAssignments: Assignment[];
  primaryProjectMonths: number;
  currentUtilisation: number;
  availabilityPeriods: AvailabilityPeriod[];
  nextFreeDate: Date | null;
  daysUntilFree: number | null;
  freeQuarterDays: number;
  flags: Set<"UNBILLED" | "PARTIAL" | "ROTATION">;
  bars: Bar[];
  lanes: Bar[][];
  laneCount: number;
  todayPercent: number;
  windowStart: Date;
  today: Date;
}
