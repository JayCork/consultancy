export type ClearanceLevel = "BPSS" | "SC" | "DV";

export interface Assignment {
  project: string;
  role: string;
  startDate: Date;
  endDate: Date;
  sector: string;
  confirmed: boolean;
  utilisation: number; // 0–100
}

export interface Person {
  name: string;
  initials: string;
  grade: string;
  clearance: ClearanceLevel;
  clearanceExpiryDays: number | null;
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
  flags: Set<"BENCH" | "PARTIAL" | "ROTATION" | "CLEARANCE">;
  bars: Bar[];
  lanes: Bar[][];
  laneCount: number;
  // Pre-computed percentages for rendering
  todayPercent: number;
  clearanceExpiryPercent: number | null;
  windowStart: Date;
  today: Date;
}
