import { For, Show } from "solid-js";
import styles from "./SkillGapList.module.css";

export interface SkillEntry {
  skill_name: string;
  level_number: number;
  verified_count: number;
  required_count: number;
  is_ready: boolean;
}

export interface SkillGapListProps {
  skills: SkillEntry[];
}

export function SkillGapList(props: SkillGapListProps) {
  return (
    <div class={styles.container}>
      <h3 class={styles.heading}>Skill progress</h3>
      <Show
        when={props.skills.length > 0}
        fallback={
          <p class={styles.empty}>
            No skill requirements defined for your current role yet.
          </p>
        }
      >
        <ul class={styles.list}>
          <For each={props.skills}>
            {(skill) => (
              <li class={styles.row} data-ready={skill.is_ready ? "true" : "false"}>
                <div class={styles.skillInfo}>
                  <span class={styles.skillName}>{skill.skill_name}</span>
                  <span class={styles.levelLabel}>Level {skill.level_number}</span>
                </div>
                <div class={styles.progress}>
                  <span class={styles.fraction}>
                    {Math.min(skill.verified_count, skill.required_count)}&nbsp;/&nbsp;{skill.required_count}
                  </span>
                  <div class={styles.dots}>
                    <For each={Array.from({ length: skill.required_count })}>
                      {(_, i) => (
                        <span
                          class={styles.dot}
                          data-filled={i() < skill.verified_count ? "true" : "false"}
                        />
                      )}
                    </For>
                  </div>
                  <Show
                    when={skill.is_ready}
                    fallback={
                      <span class={styles.statusPending}>
                        {skill.required_count - Math.min(skill.verified_count, skill.required_count)} more needed
                      </span>
                    }
                  >
                    <span class={styles.statusReady}>Complete</span>
                  </Show>
                </div>
              </li>
            )}
          </For>
        </ul>
      </Show>
    </div>
  );
}
