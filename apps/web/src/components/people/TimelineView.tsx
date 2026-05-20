import type { JSX } from "solid-js";
import { For } from "solid-js";
import type { EnrichedPerson } from "../../lib/people/types";
import { addDays, formatShortDate } from "../../lib/people/dateHelpers";
import { WINDOW_TOTAL } from "../../lib/people/dateHelpers";
import { STATUS_LEGEND } from "../../lib/people/projectColors";
import { TimelineHeader } from "./TimelineHeader";
import { InfoCell } from "./InfoCell";
import { GanttRow, rowHeight } from "./GanttRow";
import styles from "./TimelineView.module.css";

interface TimelineViewProps {
  people: EnrichedPerson[];
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  isAtDefault: boolean;
}

export function TimelineView(props: TimelineViewProps): JSX.Element {
  const windowStart = () => props.people[0]?.windowStart ?? new Date();
  const windowEnd = () => addDays(windowStart(), WINDOW_TOTAL);
  const todayPercent = () => props.people[0]?.todayPercent ?? 7.07;
  const periodLabel = () =>
    `${formatShortDate(windowStart())} – ${formatShortDate(windowEnd())}`;

  return (
    <div class={styles.container}>
      <div class={styles.nav}>
        <button class={styles.navBtn} onClick={props.onPrev} type="button" aria-label="Previous period">
          ‹ Prev
        </button>
        <button
          class={`${styles.navBtn} ${props.isAtDefault ? styles.navBtnActive : ""}`}
          onClick={props.onToday}
          type="button"
          disabled={props.isAtDefault}
        >
          Today
        </button>
        <span class={styles.navPeriod}>{periodLabel()}</span>
        <button class={styles.navBtn} onClick={props.onNext} type="button" aria-label="Next period">
          Next ›
        </button>
      </div>
      <TimelineHeader
        windowStart={windowStart()}
        windowEnd={windowEnd()}
        todayPercent={todayPercent()}
      />
      <div class={styles.rows}>
        <For each={props.people}>
          {(person) => {
            const height = rowHeight(person.laneCount);
            return (
              <div class={styles.row}>
                <InfoCell person={person} height={height} />
                <GanttRow person={person} height={height} />
              </div>
            );
          }}
        </For>
      </div>
      <div class={styles.legend}>
        <For each={STATUS_LEGEND}>
          {(entry) => (
            <span class={styles.legendItem}>
              <span
                class={styles.legendSwatch}
                style={{
                  background: entry.fill,
                  ...(("border" in entry && entry.border)
                    ? { border: "1.5px solid var(--color-border-strong)" }
                    : {}),
                }}
              />
              {entry.label}
            </span>
          )}
        </For>
      </div>
    </div>
  );
}
