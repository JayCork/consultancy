import type { JSX } from "solid-js";
import type { Bar } from "../../lib/people/types";
import {
  formatDate,
  weeksUntil,
  daysBetween,
} from "../../lib/people/dateHelpers";
import styles from "./BarTooltip.module.css";

interface BarTooltipProps {
  bar: Bar;
  today: Date;
}

export function BarTooltip(props: BarTooltipProps): JSX.Element {
  const getBarAssignment = () => props.bar.assignment;
  const endDate = () => getBarAssignment().endDate;
  const isPast = () => endDate() != null && endDate()! <= props.today;
  const weeksLabel = () => {
    const end = endDate();
    if (end == null) return "Ongoing — no end date set";
    if (isPast()) {
      const daysAgo = daysBetween(end, props.today);
      return `Ended ${Math.round(daysAgo / 7)} week${Math.round(daysAgo / 7) !== 1 ? "s" : ""} ago`;
    }
    const weeks = weeksUntil(props.today, end);
    return `${weeks} week${weeks !== 1 ? "s" : ""} remaining`;
  };

  return (
    <div class={styles.tooltip}>
      <div class={styles.project}>{getBarAssignment().project}</div>
      <div class={styles.meta}>
        {getBarAssignment().role} · {getBarAssignment().sector}
      </div>
      <div class={styles.row}>
        <span class={styles.utilLabel}>Utilisation</span>
        <span class={styles.utilValue}>{getBarAssignment().utilisation}%</span>
      </div>
      <div class={styles.row}>
        <span class={styles.utilLabel}>Status</span>
        <span
          class={`${styles.badge} ${getBarAssignment().confirmed ? styles.confirmed : styles.tentative}`}
        >
          {getBarAssignment().confirmed ? "Confirmed" : "Tentative"}
        </span>
      </div>
      <div class={styles.row}>
        <span class={styles.utilLabel}>Ends</span>
        <span class={styles.utilValue}>
          {endDate() != null ? formatDate(endDate()!) : "Ongoing"}
        </span>
      </div>
      <div class={styles.weeks}>{weeksLabel()}</div>
    </div>
  );
}
