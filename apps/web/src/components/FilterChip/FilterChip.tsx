import type { JSX } from "solid-js";
import styles from "./FilterChip.module.css";

interface FilterChipProps {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}

export function FilterChip(props: FilterChipProps): JSX.Element {
  return (
    <button
      class={`${styles.chip} ${props.active ? styles.active : ""}`}
      onClick={props.onClick}
      type="button"
    >
      {props.label}
      {props.count !== undefined && (
        <span class={styles.count}>{props.count}</span>
      )}
    </button>
  );
}
