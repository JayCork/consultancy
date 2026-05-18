import type { JSX } from "solid-js";
import { For, Show, createSignal } from "solid-js";
import type { EnrichedPerson, Bar } from "../../lib/people/types";
import { getProjectColors } from "../../lib/people/projectColors";
import { toPercent, clamp, weeksUntil } from "../../lib/people/dateHelpers";
import { BarTooltip } from "./BarTooltip";
import styles from "./GanttRow.module.css";

const LANE_HEIGHT = 36; // px per lane
const LANE_GAP = 4;
const PADDING_V = 6;

export function rowHeight(laneCount: number): number {
  return laneCount * LANE_HEIGHT + (laneCount - 1) * LANE_GAP + PADDING_V * 2;
}

interface WeekLine {
  pct: number;
}

function buildWeekLines(windowStart: Date): WeekLine[] {
  const lines: WeekLine[] = [];
  const cursor = new Date(windowStart);
  // advance to next Monday
  const dayOfWeek = cursor.getDay();
  const daysToMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  cursor.setDate(cursor.getDate() + daysToMonday);

  while (toPercent(cursor, windowStart) <= 100) {
    const pct = clamp(toPercent(cursor, windowStart), 0, 100);
    lines.push({ pct });
    cursor.setDate(cursor.getDate() + 7);
  }
  return lines;
}

interface GanttRowProps {
  person: EnrichedPerson;
  height: number;
}

export function GanttRow(props: GanttRowProps): JSX.Element {
  const [hoveredBar, setHoveredBar] = createSignal<Bar | null>(null);
  const p = () => props.person;

  const weekLines = () => buildWeekLines(p().windowStart);

  return (
    <div class={styles.gantt} style={{ height: `${props.height}px` }}>
      {/* Layer 1: Week boundary lines */}
      <For each={weekLines()}>
        {(line) => (
          <div
            class={styles.weekLine}
            style={{ left: `${line.pct}%` }}
          />
        )}
      </For>

      {/* Layer 2: Past region shade */}
      <div
        class={styles.pastShade}
        style={{ width: `${p().todayPercent}%` }}
      />

      {/* Layer 3: Availability strips */}
      <For each={p().availabilityPeriods}>
        {(period) => {
          const left = clamp(toPercent(period.start, p().windowStart), 0, 100);
          const right = clamp(toPercent(period.end, p().windowStart), 0, 100);
          const width = right - left;
          if (width <= 0) return null;

          const isFree = period.utilisation === 0;
          const weeks = Math.floor(weeksUntil(period.start, period.end));
          const showLabel = width > 8;

          return (
            <div
              class={`${styles.availStrip} ${isFree ? styles.availFree : styles.availPartial}`}
              style={{ left: `${left}%`, width: `${width}%` }}
            >
              <Show when={showLabel}>
                <span class={styles.availLabel}>
                  {isFree
                    ? `${weeks}w free`
                    : `${period.availablePercent}% cap`}
                </span>
              </Show>
            </div>
          );
        }}
      </For>

      {/* Layer 4: Assignment bars in lanes */}
      <For each={p().lanes}>
        {(lane, laneIndex) => (
          <For each={lane}>
            {(bar) => {
              const colors = getProjectColors(bar.assignment.project);
              const top =
                PADDING_V + laneIndex() * (LANE_HEIGHT + LANE_GAP);
              const isSecondary = laneIndex() > 0;
              const showLabel = bar.widthPercent > 12;

              return (
                <div
                  class={`${styles.bar} ${!bar.assignment.confirmed ? styles.tentative : ""} ${isSecondary ? styles.secondary : ""}`}
                  style={{
                    left: `${bar.leftPercent}%`,
                    width: `${bar.widthPercent}%`,
                    top: `${top}px`,
                    height: `${LANE_HEIGHT}px`,
                    background: colors.fill,
                    color: colors.text,
                    "border-color": colors.border,
                  }}
                  onMouseEnter={() => setHoveredBar(bar)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  <Show when={bar.clippedLeft}>
                    <span class={styles.clip}>◀</span>
                  </Show>
                  <Show when={showLabel}>
                    <span class={styles.barLabel}>
                      {bar.assignment.project.split(" ").slice(0, 2).join(" ")}
                      {bar.assignment.utilisation < 100
                        ? ` ${bar.assignment.utilisation}%`
                        : ""}
                    </span>
                  </Show>
                  <Show when={bar.clippedRight}>
                    <span class={styles.clip}>▶</span>
                  </Show>
                  <Show when={hoveredBar() === bar}>
                    <BarTooltip bar={bar} today={p().today} />
                  </Show>
                </div>
              );
            }}
          </For>
        )}
      </For>

      {/* Layer 5: Clearance expiry marker */}
      <Show when={p().clearanceExpiryPercent !== null}>
        <div
          class={styles.clearanceMarker}
          style={{ left: `${p().clearanceExpiryPercent}%` }}
          title={`Clearance expires in ${p().clearanceExpiryDays} days`}
        />
      </Show>

      {/* Layer 6: Today line */}
      <div
        class={styles.todayLine}
        style={{ left: `${p().todayPercent}%` }}
      />
    </div>
  );
}
