import type {
  Person,
  Assignment,
  EnrichedPerson,
  Bar,
  AvailabilityPeriod,
} from "./types";
import { daysBetween, toPercent, clamp, monthsBetween } from "./dateHelpers";

function buildBars(
  assignments: Assignment[],
  windowStart: Date,
  windowEnd: Date,
): Bar[] {
  return assignments
    .filter(
      (a) =>
        a.startDate < windowEnd &&
        (a.endDate == null || a.endDate > windowStart),
    )
    .map((a) => {
      const clippedLeft = a.startDate < windowStart;
      const clippedRight = a.endDate == null || a.endDate > windowEnd;

      const effectiveStart = clippedLeft ? windowStart : a.startDate;
      const effectiveEnd = clippedRight ? windowEnd : a.endDate!;

      const leftPercent = clamp(toPercent(effectiveStart, windowStart), 0, 100);
      const rightPercent = clamp(toPercent(effectiveEnd, windowStart), 0, 100);
      const widthPercent = Math.max(0.5, rightPercent - leftPercent);

      return {
        assignment: a,
        leftPercent,
        widthPercent,
        clippedLeft,
        clippedRight,
      };
    });
}

function overlaps(a: Bar, b: Bar): boolean {
  return (
    a.leftPercent < b.leftPercent + b.widthPercent &&
    b.leftPercent < a.leftPercent + a.widthPercent
  );
}

function assignLanes(bars: Bar[]): Bar[][] {
  const sorted = [...bars].sort(
    (a, b) => b.assignment.utilisation - a.assignment.utilisation,
  );

  const lanes: Bar[][] = [];

  for (const bar of sorted) {
    let placed = false;
    for (const lane of lanes) {
      if (!lane.some((existing) => overlaps(existing, bar))) {
        lane.push(bar);
        placed = true;
        break;
      }
    }
    if (!placed) {
      lanes.push([bar]);
    }
  }

  return lanes;
}

function computeAvailabilityPeriods(
  assignments: Assignment[],
  today: Date,
  windowEnd: Date,
): AvailabilityPeriod[] {
  type Event = { date: Date; delta: number };
  const events: Event[] = [];

  for (const a of assignments) {
    if (a.endDate != null && a.endDate <= today) continue;

    const startClamped = a.startDate < today ? today : a.startDate;
    const endClamped =
      a.endDate == null || a.endDate > windowEnd ? windowEnd : a.endDate;

    if (startClamped >= windowEnd) continue;

    events.push({ date: startClamped, delta: a.utilisation });
    events.push({ date: endClamped, delta: -a.utilisation });
  }

  // Sort: by date, decreases before increases on same day
  events.sort((a, b) => {
    const diff = a.date.getTime() - b.date.getTime();
    if (diff !== 0) return diff;
    return a.delta - b.delta;
  });

  const periods: AvailabilityPeriod[] = [];
  let cursor = today;
  let running = 0;

  for (const event of events) {
    if (event.date > cursor && running < 100) {
      periods.push({
        start: new Date(cursor),
        end: new Date(event.date),
        utilisation: running,
        availablePercent: 100 - running,
      });
    }
    cursor = event.date;
    running += event.delta;
    running = Math.round(running * 1000) / 1000; // float safety
  }

  if (cursor < windowEnd && running < 100) {
    periods.push({
      start: new Date(cursor),
      end: new Date(windowEnd),
      utilisation: running,
      availablePercent: 100 - running,
    });
  }

  return periods;
}

function countFreeQuarterDays(periods: AvailabilityPeriod[]): number {
  return periods.reduce((sum, p) => {
    if (p.utilisation === 0) {
      return sum + daysBetween(p.start, p.end);
    }
    return sum;
  }, 0);
}

export function enrichPerson(
  person: Person,
  windowStart: Date,
  windowEnd: Date,
  today: Date,
): EnrichedPerson {
  const currentAssignments = person.assignments.filter(
    (a) => a.startDate <= today && (a.endDate == null || a.endDate > today),
  );

  const currentUtilisation = currentAssignments.reduce(
    (sum, a) => sum + a.utilisation,
    0,
  );

  const primaryAssignment = [...currentAssignments].sort(
    (a, b) => b.utilisation - a.utilisation,
  )[0];

  const primaryProjectMonths = primaryAssignment
    ? monthsBetween(primaryAssignment.startDate, today)
    : 0;

  const availabilityPeriods = computeAvailabilityPeriods(
    person.assignments,
    today,
    windowEnd,
  );

  const firstFreePeriod = availabilityPeriods.find((p) => p.utilisation === 0);
  const nextFreeDate = firstFreePeriod?.start ?? null;
  const daysUntilFree = nextFreeDate ? daysBetween(today, nextFreeDate) : null;

  const freeQuarterDays = countFreeQuarterDays(availabilityPeriods);

  const flags = new Set<"UNBILLED" | "PARTIAL" | "ROTATION">();
  if (currentUtilisation === 0) flags.add("UNBILLED");
  if (currentUtilisation > 0 && currentUtilisation < 100) flags.add("PARTIAL");
  if (primaryProjectMonths >= 12) flags.add("ROTATION");

  const bars = buildBars(person.assignments, windowStart, windowEnd);
  const lanes = assignLanes(bars);

  const todayPercent = clamp(toPercent(today, windowStart), 0, 100);

  return {
    ...person,
    currentAssignments,
    primaryProjectMonths,
    currentUtilisation,
    availabilityPeriods,
    nextFreeDate,
    daysUntilFree,
    freeQuarterDays,
    flags,
    bars,
    lanes,
    laneCount: lanes.length || 1,
    todayPercent,
    windowStart,
    today,
  };
}

export function sortPeople(people: EnrichedPerson[]): EnrichedPerson[] {
  return [...people].sort((a, b) => {
    const aBench = a.flags.has("UNBILLED") ? 0 : 1;
    const bBench = b.flags.has("UNBILLED") ? 0 : 1;
    if (aBench !== bBench) return aBench - bBench;

    const aPartial = a.flags.has("PARTIAL") ? 0 : 1;
    const bPartial = b.flags.has("PARTIAL") ? 0 : 1;
    if (aPartial !== bPartial) return aPartial - bPartial;

    const aDays = a.daysUntilFree ?? Infinity;
    const bDays = b.daysUntilFree ?? Infinity;
    if (aDays !== bDays) return aDays - bDays;

    return b.primaryProjectMonths - a.primaryProjectMonths;
  });
}
