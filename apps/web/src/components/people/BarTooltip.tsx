import type { JSX } from "solid-js";
import type { Bar } from "../../lib/people/types";
import { formatDate, weeksUntil, daysBetween } from "../../lib/people/dateHelpers";
import styles from "./BarTooltip.module.css";

interface BarTooltipProps {
  bar: Bar;
  today: Date;
}

export function BarTooltip(props: BarTooltipProps): JSX.Element {
  const a = () => props.bar.assignment;
  const isPast = () => a().endDate <= props.today;
  const weeksLabel = () => {
    if (isPast()) {
      const daysAgo = daysBetween(a().endDate, props.today);
      return `Ended ${Math.round(daysAgo / 7)} week${Math.round(daysAgo / 7) !== 1 ? "s" : ""} ago`;
    }
    const weeks = weeksUntil(props.today, a().endDate);
    return `${weeks} week${weeks !== 1 ? "s" : ""} remaining`;
  };

  return (
    <div class={styles.tooltip}>
      <div class={styles.project}>{a().project}</div>
      <div class={styles.meta}>
        {a().role} · {a().sector}
      </div>
      <div class={styles.row}>
        <span class={styles.utilLabel}>Utilisation</span>
        <span class={styles.utilValue}>{a().utilisation}%</span>
      </div>
      <div class={styles.row}>
        <span class={styles.utilLabel}>Status</span>
        <span
          class={`${styles.badge} ${a().confirmed ? styles.confirmed : styles.tentative}`}
        >
          {a().confirmed ? "Confirmed" : "Tentative"}
        </span>
      </div>
      <div class={styles.row}>
        <span class={styles.utilLabel}>Ends</span>
        <span class={styles.utilValue}>{formatDate(a().endDate)}</span>
      </div>
      <div class={styles.weeks}>{weeksLabel()}</div>
    </div>
  );
}
