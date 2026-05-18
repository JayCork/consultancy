import type { JSX } from "solid-js";
import { For } from "solid-js";
import { toPercent, clamp, formatShortDate } from "../../lib/people/dateHelpers";
import styles from "./TimelineHeader.module.css";

const INFO_CELL_WIDTH = 200; // must match InfoCell width

interface MonthSpan {
  label: string;
  leftPercent: number;
  widthPercent: number;
}

interface WeekMark {
  label: string;
  leftPercent: number;
}

function buildMonthSpans(windowStart: Date, windowEnd: Date): MonthSpan[] {
  const spans: MonthSpan[] = [];
  const cursor = new Date(windowStart.getFullYear(), windowStart.getMonth(), 1);

  while (cursor < windowEnd) {
    const nextMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
    const spanStart = cursor < windowStart ? windowStart : cursor;
    const spanEnd = nextMonth > windowEnd ? windowEnd : nextMonth;

    const left = clamp(toPercent(spanStart, windowStart), 0, 100);
    const right = clamp(toPercent(spanEnd, windowStart), 0, 100);

    spans.push({
      label: cursor.toLocaleDateString("en-GB", { month: "short", year: "numeric" }),
      leftPercent: left,
      widthPercent: right - left,
    });

    cursor.setMonth(cursor.getMonth() + 1);
  }
  return spans;
}

function buildWeekMarks(windowStart: Date, windowEnd: Date): WeekMark[] {
  const marks: WeekMark[] = [];
  const cursor = new Date(windowStart);
  const dayOfWeek = cursor.getDay();
  const daysToMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  cursor.setDate(cursor.getDate() + daysToMonday);

  while (cursor <= windowEnd) {
    marks.push({ label: formatShortDate(cursor), leftPercent: clamp(toPercent(cursor, windowStart), 0, 100) });
    cursor.setDate(cursor.getDate() + 7);
  }
  return marks;
}

interface TimelineHeaderProps {
  windowStart: Date;
  windowEnd: Date;
  todayPercent: number;
}

export function TimelineHeader(props: TimelineHeaderProps): JSX.Element {
  const months = () => buildMonthSpans(props.windowStart, props.windowEnd);
  const weeks = () => buildWeekMarks(props.windowStart, props.windowEnd);

  return (
    <div class={styles.header}>
      <div class={styles.spacer} style={{ width: `${INFO_CELL_WIDTH}px` }} />
      <div class={styles.timeline}>
        {/* Month row */}
        <div class={styles.monthRow}>
          <For each={months()}>
            {(m) => (
              <div
                class={styles.month}
                style={{ left: `${m.leftPercent}%`, width: `${m.widthPercent}%` }}
              >
                {m.label}
              </div>
            )}
          </For>
          {/* Today marker line extending down */}
          <div
            class={styles.todayMarker}
            style={{ left: `${props.todayPercent}%` }}
          >
            <span class={styles.todayLabel}>Today</span>
          </div>
        </div>

        {/* Week row */}
        <div class={styles.weekRow}>
          <For each={weeks()}>
            {(w) => (
              <div
                class={styles.weekMark}
                style={{ left: `${w.leftPercent}%` }}
              >
                <span class={styles.weekLabel}>{w.label}</span>
              </div>
            )}
          </For>
          {/* Past shade in header */}
          <div
            class={styles.pastShade}
            style={{ width: `${props.todayPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
