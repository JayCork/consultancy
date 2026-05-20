import type { JSX } from "solid-js";
import { For, Show } from "solid-js";
import type { EnrichedPerson } from "../../lib/people/types";
import { formatDate, weeksUntil } from "../../lib/people/dateHelpers";
import styles from "./TableView.module.css";

interface TableViewProps {
  people: EnrichedPerson[];
}

function NextFreeCell(props: { person: EnrichedPerson }): JSX.Element {
  const p = props.person;

  if (p.flags.has("UNBILLED")) {
    return <span class={styles.freeNow}>Free now</span>;
  }

  if (p.nextFreeDate) {
    const weeks = weeksUntil(p.today, p.nextFreeDate);
    return (
      <span>
        {formatDate(p.nextFreeDate)}
        <span class={styles.weekCount}>{weeks}w</span>
      </span>
    );
  }

  if (
    p.freeQuarterDays > 0 &&
    p.availabilityPeriods.some((ap) => ap.utilisation === 0)
  ) {
    return <span class={styles.partial}>Partial only</span>;
  }

  return <span class={styles.none}>None this quarter</span>;
}

export function TableView(props: TableViewProps): JSX.Element {
  return (
    <div class={styles.wrapper}>
      <table class={styles.table}>
        <thead>
          <tr>
            <th class={styles.th}>Person</th>
            <th class={styles.th}>Assignment(s)</th>
            <th class={styles.th}>Tenure</th>
            <th class={styles.th}>Next Free</th>
            <th class={styles.th}>Skills</th>
            <th class={styles.th}>Flags</th>
          </tr>
        </thead>
        <tbody>
          <For each={props.people}>
            {(person) => (
              <tr class={styles.tr}>
                {/* Person */}
                <td class={styles.td}>
                  <div class={styles.personCell}>
                    <div class={styles.avatar}>{person.initials}</div>
                    <div>
                      <div class={styles.personName}>{person.name}</div>
                      <div class={styles.personGrade}>{person.grade}</div>
                    </div>
                  </div>
                </td>

                {/* Assignment(s) */}
                <td class={styles.td}>
                  <Show
                    when={person.currentAssignments.length > 0}
                    fallback={<span class={styles.unbilled}>Unbilled</span>}
                  >
                    <div class={styles.assignmentStack}>
                      <For each={person.currentAssignments}>
                        {(a) => (
                          <div class={styles.assignmentRow}>
                            <span class={styles.assignmentProject}>
                              {a.project}
                            </span>
                            <Show when={a.utilisation < 100}>
                              <span class={styles.utilChip}>
                                {a.utilisation}%
                              </span>
                            </Show>
                          </div>
                        )}
                      </For>
                    </div>
                  </Show>
                </td>

                {/* Tenure */}
                <td class={styles.td}>
                  <span
                    class={`${styles.tenure} ${person.flags.has("ROTATION") ? styles.rotation : ""}`}
                  >
                    {person.primaryProjectMonths}mo
                    <Show when={person.flags.has("ROTATION")}>
                      <span class={styles.rotationFlag}> ↻</span>
                    </Show>
                  </span>
                </td>

                {/* Next free */}
                <td class={styles.td}>
                  <NextFreeCell person={person} />
                </td>

                {/* Skills */}
                <td class={styles.td}>
                  <div class={styles.skillTags}>
                    <For each={person.skills.slice(0, 3)}>
                      {(skill) => <span class={styles.skillTag}>{skill}</span>}
                    </For>
                  </div>
                </td>

                {/* Flags */}
                <td class={styles.td}>
                  <div class={styles.flagBadges}>
                    <For each={[...person.flags]}>
                      {(flag) => (
                        <span class={`${styles.flag} ${styles[`flag${flag}`]}`}>
                          {flag}
                        </span>
                      )}
                    </For>
                  </div>
                </td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  );
}
