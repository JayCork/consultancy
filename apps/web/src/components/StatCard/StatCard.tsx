import type { JSX } from "solid-js";
import styles from "./StatCard.module.css";

interface StatCardProps {
  label: string;
  value: number;
  prominent?: boolean;
}

export function StatCard(props: StatCardProps): JSX.Element {
  return (
    <div class={`${styles.card} ${props.prominent ? styles.prominent : ""}`}>
      <span class={styles.value}>{props.value}</span>
      <span class={styles.label}>{props.label}</span>
    </div>
  );
}
