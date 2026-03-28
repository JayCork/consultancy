import { Show } from "solid-js";
import styles from "./ReadinessCard.module.css";

export interface ReadinessCardProps {
  roleName: string;
  seniorityLevel: number;
  readinessPct: number;
  threshold: number;
  isPromotionReady: boolean;
}

export function ReadinessCard(props: ReadinessCardProps) {
  const pctToThreshold = () => props.threshold - props.readinessPct;

  return (
    <div class={styles.card}>
      <div class={styles.header}>
        <div class={styles.roleInfo}>
          <span class={styles.roleName}>{props.roleName}</span>
          <span class={styles.levelPill}>Level {props.seniorityLevel}</span>
        </div>
        <Show
          when={props.isPromotionReady}
          fallback={
            <span class={styles.notReady}>
              {pctToThreshold()}% to promotion threshold
            </span>
          }
        >
          <span class={styles.readyBadge}>Promotion ready</span>
        </Show>
      </div>

      <div class={styles.barWrapper}>
        <div
          class={styles.bar}
          style={{ width: `${props.readinessPct}%` }}
          aria-label={`${props.readinessPct}% readiness`}
        />
        {/* Threshold marker */}
        <div
          class={styles.thresholdMarker}
          style={{ left: `${props.threshold}%` }}
          title={`Promotion threshold: ${props.threshold}%`}
        />
      </div>

      <div class={styles.legend}>
        <span class={styles.pct}>{props.readinessPct}%</span>
        <span class={styles.legendLabel}>career readiness</span>
      </div>
    </div>
  );
}
