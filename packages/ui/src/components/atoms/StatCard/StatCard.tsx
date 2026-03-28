import { Show } from "solid-js";
import styles from "./StatCard.module.css";

export interface StatCardProps {
  value: number;
  label: string;
  sublabel?: string;
  /** CSS variable string applied as the value text colour, e.g. "var(--color-success)" */
  color: string;
  /** CSS variable string applied as the card background, e.g. "var(--color-success-subtle)" */
  background: string;
  action?: { label: string; onClick: () => void };
}

export function StatCard(props: StatCardProps) {
  return (
    <div
      class={styles.card}
      style={{ background: props.background }}
    >
      <span class={styles.value} style={{ color: props.color }}>
        {props.value}
      </span>
      <span class={styles.label}>{props.label}</span>
      <Show when={props.sublabel}>
        <span class={styles.sublabel}>{props.sublabel}</span>
      </Show>
      <Show when={props.action}>
        {(action) => (
          <button class={styles.action} onClick={action().onClick}>
            {action().label}
          </button>
        )}
      </Show>
    </div>
  );
}
