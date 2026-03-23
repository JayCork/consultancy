import { createResource, For, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useSession } from "../../lib/auth-client";
import { Button, Container } from "@consultancy/ui";
import { EvidenceCard, type EvidenceEntry } from "@consultancy/ui";
import { Shell } from "../../Shell";
import styles from "./EvidenceList.module.css";

const API = import.meta.env.VITE_API_URL;

export function EvidenceList() {
  const session = useSession();
  const navigate = useNavigate();

  const userId = () => session()?.data?.user?.id;

  const [entries] = createResource(userId, async (id) => {
    if (!id) return [];
    const res = await fetch(`${API}/api/v0/evidence?userId=${id}`);
    const json = await res.json();
    return json.data as EvidenceEntry[];
  });

  return (
    <Shell>
      <Container>
        <div class={styles.header}>
          <h2 class={styles.heading}>My Evidence</h2>
          <Button
            label="Add Evidence"
            onClick={() => navigate("/evidence/add")}
          />
        </div>

        <Show when={entries.loading}>
          <p>Loading evidence…</p>
        </Show>

        <Show when={!entries.loading && entries()?.length === 0}>
          <div class={styles.noEvidence}>
            <p>You haven't logged any evidence yet.</p>
            <p>
              Use the STAR method to capture moments that demonstrate your
              skills — even small wins count.
            </p>
            <Button
              label="Add your first entry"
              onClick={() => navigate("/evidence/add")}
            />
          </div>
        </Show>

        <Show when={(entries()?.length ?? 0) > 0}>
          <div class={styles.entryContainer}>
            <For each={entries()}>
              {(entry) => <EvidenceCard entry={entry} />}
            </For>
          </div>
        </Show>
      </Container>
    </Shell>
  );
}
