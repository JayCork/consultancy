import { For, Show } from "solid-js";
import { GanttBar, type GanttBarProps } from "../GanttBar/GanttBar";
import styles from "./ProjectTimeline.module.css";

export interface TimelineMonth {
  label: string;
  widthPercent: number;
}

export interface TimelineProject extends GanttBarProps {
  id: string;
}

export interface ProjectTimelineProps {
  months: TimelineMonth[];
  projects: TimelineProject[];
  windowLabel: string;
  onPrev: () => void;
  onNext: () => void;
  todayPercent?: number;
  onToday?: () => void;
}

const STATUS_LEGEND = [
  { label: "Pre-contract", color: "var(--color-data-3)" },
  { label: "Mobilising", color: "var(--color-warning)" },
  { label: "In delivery", color: "var(--color-accent)" },
  { label: "Support / BAU", color: "var(--color-data-6)" },
  { label: "Closing", color: "var(--color-data-5)" },
  { label: "Cancelled", color: "var(--color-error)" },
  { label: "Closed / Lost", color: "var(--color-text-muted)" },
];

export function ProjectTimeline(props: ProjectTimelineProps) {
  return (
    <div class={styles.container}>
      <div class={styles.controls}>
        <button
          class={styles.navBtn}
          onClick={props.onPrev}
          aria-label="Previous period"
        >
          &#8249;
        </button>
        <span class={styles.windowLabel}>{props.windowLabel}</span>
        <button
          class={styles.navBtn}
          onClick={props.onNext}
          aria-label="Next period"
        >
          &#8250;
        </button>
        <Show when={props.onToday}>
          <button class={styles.todayBtn} onClick={props.onToday}>
            Today
          </button>
        </Show>
      </div>

      <div class={styles.timelineArea}>
        <div class={styles.gridContainer}>
          <div class={styles.grid}>
            <div class={styles.nameColumnHeader} />
            <div class={styles.monthHeaders}>
              <For each={props.months}>
                {(m) => (
                  <div
                    class={styles.monthLabel}
                    style={{ width: `${m.widthPercent}%` }}
                  >
                    {m.label}
                  </div>
                )}
              </For>
            </div>

            <For each={props.projects}>
              {(project) => (
                <>
                  <div
                    class={styles.projectName}
                    title={
                      project.isClassified ? "CLASSIFIED" : project.projectName
                    }
                  >
                    {project.isClassified ? "CLASSIFIED" : project.projectName}
                  </div>
                  <div class={styles.barCell}>
                    <GanttBar {...project} />
                  </div>
                </>
              )}
            </For>
          </div>

          <Show when={props.todayPercent !== undefined}>
            <div
              class={styles.todayLine}
              style={{
                left: `calc(220px + (100% - 220px) * ${(props.todayPercent ?? 0) / 100})`,
              }}
              aria-hidden="true"
            />
          </Show>
        </div>
      </div>

      <div class={styles.legend}>
        <For each={STATUS_LEGEND}>
          {(entry) => (
            <div class={styles.legendItem}>
              <span
                class={styles.legendSwatch}
                style={{ "background-color": entry.color }}
              />
              <span class={styles.legendLabel}>{entry.label}</span>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
