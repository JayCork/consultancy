import type { JSX } from "solid-js";
import { Show, createResource } from "solid-js";
import styles from "./MyClearancePanel.module.css";

const API = import.meta.env.VITE_API_URL as string;

interface MyClearance {
  level: string;
  levelName: string;
  expiresAt: string | null;
  expiryDays: number | null;
  expiringSoon: boolean;
}

async function fetchMyClearance(): Promise<MyClearance | null> {
  const res = await fetch(`${API}/api/v0/users/me/clearance`, {
    credentials: "include",
  });
  const json = await res.json();
  return json.data as MyClearance | null;
}

export function MyClearancePanel(): JSX.Element {
  const [clearance] = createResource(fetchMyClearance);

  return (
    <Show when={clearance()}>
      {(c) => (
        <div class={`${styles.panel} ${c().expiringSoon ? styles.panelExpiring : ""}`}>
          <div class={styles.label}>My clearance</div>
          <div class={styles.row}>
            <span class={`${styles.level} ${c().expiringSoon ? styles.levelExpiring : ""}`}>
              {c().level}
            </span>
            <span class={styles.levelName}>{c().levelName}</span>
            <Show when={c().expiryDays !== null}>
              <span class={`${styles.expiry} ${c().expiringSoon ? styles.expiryWarn : ""}`}>
                {c().expiringSoon ? "⚠ " : ""}Expires in {c().expiryDays}d
              </span>
            </Show>
            <Show when={c().expiresAt === null}>
              <span class={styles.expiry}>No expiry</span>
            </Show>
          </div>
        </div>
      )}
    </Show>
  );
}
