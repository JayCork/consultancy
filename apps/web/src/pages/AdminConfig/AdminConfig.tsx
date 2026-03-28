import { createResource, For, Show } from "solid-js";
import { Container } from "@consultancy/ui";
import { Shell } from "../../Shell";
import styles from "./AdminConfig.module.css";

const API = import.meta.env.VITE_API_URL;

interface SkillRequirement {
  skill_name: string;
  level_number: number;
  criteria: string;
}

interface JobRole {
  id: string;
  name: string;
  seniority_level: number;
  description: string | null;
  user_count: number;
  requirements: SkillRequirement[];
}

interface OrgConfig {
  organisation: {
    name: string;
    promotion_readiness_threshold: number;
    evidence_required_per_skill: number;
  };
  roles: JobRole[];
}

export function AdminConfig() {
  const [config] = createResource<OrgConfig | null>(async () => {
    const res = await fetch(`${API}/api/v0/admin/config`);
    const json = await res.json();
    return json.ok ? (json.data as OrgConfig) : null;
  });

  return (
    <Shell>
      <Container>
        <Show when={config.loading}>
          <p class={styles.loading}>Loading configuration…</p>
        </Show>

        <Show when={!config.loading && config()}>
          {(cfg) => (
            <>
              {/* ── Organisation settings ─────────────────────────────── */}
              <section class={styles.section}>
                <h2 class={styles.sectionTitle}>{cfg().organisation.name}</h2>
                <div class={styles.settingsGrid}>
                  <div class={styles.settingCard}>
                    <span class={styles.settingValue}>
                      {cfg().organisation.promotion_readiness_threshold}%
                    </span>
                    <span class={styles.settingLabel}>Promotion threshold</span>
                    <span class={styles.settingHint}>
                      Minimum readiness score before a user is considered
                      promotion-ready
                    </span>
                  </div>
                  <div class={styles.settingCard}>
                    <span class={styles.settingValue}>
                      {cfg().organisation.evidence_required_per_skill}
                    </span>
                    <span class={styles.settingLabel}>Evidence per skill</span>
                    <span class={styles.settingHint}>
                      Verified entries required to mark a skill as complete
                    </span>
                  </div>
                </div>
              </section>

              {/* ── Job roles ────────────────────────────────────────────── */}
              <section class={styles.section}>
                <h3 class={styles.sectionTitle}>
                  Job roles
                  <span class={styles.roleBadge}>{cfg().roles.length}</span>
                </h3>

                <Show
                  when={cfg().roles.length > 0}
                  fallback={
                    <p class={styles.empty}>
                      No roles defined yet. Run the seed script to create a
                      starter role.
                    </p>
                  }
                >
                  <div class={styles.roleList}>
                    <For each={cfg().roles}>
                      {(role) => (
                        <div class={styles.roleCard}>
                          <div class={styles.roleHeader}>
                            <div class={styles.roleTitle}>
                              <span class={styles.roleName}>{role.name}</span>
                              <span class={styles.levelPill}>
                                Level {role.seniority_level}
                              </span>
                            </div>
                            <span class={styles.userCount}>
                              {role.user_count}{" "}
                              {role.user_count === 1 ? "user" : "users"}
                            </span>
                          </div>

                          <Show when={role.description}>
                            <p class={styles.roleDescription}>
                              {role.description}
                            </p>
                          </Show>

                          <Show
                            when={role.requirements.length > 0}
                            fallback={
                              <p class={styles.noRequirements}>
                                No skill requirements defined.
                              </p>
                            }
                          >
                            <div class={styles.requirementsSection}>
                              <span class={styles.requirementsLabel}>
                                Required skills (
                                {role.requirements.length})
                              </span>
                              <ul class={styles.requirementsList}>
                                <For each={role.requirements}>
                                  {(req) => (
                                    <li class={styles.requirementItem}>
                                      <div class={styles.reqMeta}>
                                        <span class={styles.reqSkill}>
                                          {req.skill_name}
                                        </span>
                                        <span class={styles.reqLevel}>
                                          Level {req.level_number}
                                        </span>
                                      </div>
                                      <p class={styles.reqCriteria}>
                                        {req.criteria}
                                      </p>
                                    </li>
                                  )}
                                </For>
                              </ul>
                            </div>
                          </Show>
                        </div>
                      )}
                    </For>
                  </div>
                </Show>
              </section>
            </>
          )}
        </Show>
      </Container>
    </Shell>
  );
}
