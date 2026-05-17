import type { JSX } from "solid-js";
import { For } from "solid-js";
import type { EnrichedPerson } from "../../lib/people/types";
import { TimelineHeader } from "./TimelineHeader";
import { InfoCell } from "./InfoCell";
import { GanttRow, rowHeight } from "./GanttRow";
import styles from "./TimelineView.module.css";

interface TimelineViewProps {
  people: EnrichedPerson[];
}

export function TimelineView(props: TimelineViewProps): JSX.Element {
  const windowStart = () => props.people[0]?.windowStart ?? new Date();
  const windowEnd = () => {
    const ws = windowStart();
    const we = new Date(ws);
    we.setDate(we.getDate() + 99);
    return we;
  };
  const todayPercent = () => props.people[0]?.todayPercent ?? 7.07;

  return (
    <div class={styles.container}>
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
    </div>
  );
}
