export const WINDOW_LOOKBACK = 7;
export const WINDOW_FORWARD = 92;
export const WINDOW_TOTAL = WINDOW_LOOKBACK + WINDOW_FORWARD; // 99

export function buildWindow(today: Date): { windowStart: Date; windowEnd: Date } {
  const windowStart = new Date(today);
  windowStart.setDate(windowStart.getDate() - WINDOW_LOOKBACK);
  windowStart.setHours(0, 0, 0, 0);

  const windowEnd = new Date(today);
  windowEnd.setDate(windowEnd.getDate() + WINDOW_FORWARD);
  windowEnd.setHours(0, 0, 0, 0);

  return { windowStart, windowEnd };
}

export function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

export function toPercent(date: Date, windowStart: Date): number {
  return (daysBetween(windowStart, date) / WINDOW_TOTAL) * 100;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function monthsBetween(start: Date, end: Date): number {
  return (
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth())
  );
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function weeksUntil(from: Date, to: Date): number {
  return Math.ceil(daysBetween(from, to) / 7);
}
