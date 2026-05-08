import { For, Show } from "solid-js";
import styles from "./GanttBar.module.css";

export interface GanttMilestone {
  id: string;
  name: string;
  date: string;
  leftPercent: number;
}

export interface GanttBarProps {
  projectName: string;
  statusColor: string;
  leftPercent: number;
  widthPercent: number;
  milestones: GanttMilestone[];
  isClassified?: boolean;
}

export function GanttBar(props: GanttBarProps) {
  return (
    <div class={styles.track}>
      <div
        class={styles.bar}
        style={{
          left: `${props.leftPercent}%`,
          width: `${props.widthPercent}%`,
          "background-color": props.statusColor,
        }}
        title={props.isClassified ? "CLASSIFIED" : props.projectName}
      >
        <Show when={props.widthPercent > 5}>
          <span class={styles.barLabel}>
            {props.isClassified ? "CLASSIFIED" : props.projectName}
          </span>
        </Show>
      </div>

      <For each={props.milestones}>
        {(m) => (
          <div
            class={styles.milestoneWrapper}
            style={{ left: `${m.leftPercent}%` }}
            title={`${m.name} — ${m.date}`}
          >
            <svg
              class={styles.milestoneDiamond}
              viewBox="-6 -6 12 12"
              width="12"
              height="12"
              aria-hidden="true"
            >
              <rect
                x="-4"
                y="-4"
                width="8"
                height="8"
                transform="rotate(45)"
                fill="currentColor"
              />
            </svg>
          </div>
        )}
      </For>
    </div>
  );
}
