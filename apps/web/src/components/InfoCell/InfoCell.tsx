import type { JSX } from "solid-js";
import { For, Show } from "solid-js";
import type { EnrichedPerson } from "../../lib/people/types";
import styles from "./InfoCell.module.css";

interface InfoCellProps {
  person: EnrichedPerson;
  height: number;
}

function borderClass(person: EnrichedPerson): string {
  if (person.flags.has("ROTATION")) return styles.borderWarning;
  if (person.flags.has("UNBILLED")) return styles.borderBench;
  return styles.borderDefault;
}

export function InfoCell(props: InfoCellProps): JSX.Element {
  const p = () => props.person;
  const availableCapacity = () => 100 - p().currentUtilisation;

  return (
    <div
      class={`${styles.cell} ${borderClass(p())}`}
      style={{ height: `${props.height}px` }}
    >
      <div class={styles.top}>
        <div class={styles.avatar}>{p().initials}</div>
        <div class={styles.identity}>
          <span class={styles.name}>{p().name}</span>
          <span class={styles.grade}>{p().grade}</span>
        </div>
      </div>

      <Show when={p().flags.has("PARTIAL")}>
        <div class={styles.utilBar}>
          <div class={styles.utilTrack}>
            <div
              class={styles.utilFill}
              style={{ width: `${p().currentUtilisation}%` }}
            />
          </div>
          <span class={styles.utilLabel}>{availableCapacity()}% free</span>
        </div>
      </Show>

      <Show when={p().currentAssignments.length > 1}>
        <div class={styles.pills}>
          <For each={p().currentAssignments}>
            {(a) => (
              <span
                class={styles.pill}
                title={`${a.project} (${a.utilisation}%)`}
              >
                {a.project.split(" ").slice(0, 2).join(" ")} {a.utilisation}%
              </span>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
