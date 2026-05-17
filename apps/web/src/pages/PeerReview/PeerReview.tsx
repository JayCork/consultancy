import { createResource, For, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useSession } from "../../lib/auth-client";
import { useAuthGuard } from "../../lib/use-auth-guard";
import { Container } from "@consultancy/ui";
import { Shell } from "../../Shell";
import styles from "./PeerReview.module.css";

const API = import.meta.env.VITE_API_URL;

export type PendingEndorsement = {
  id: string;
  evidenceId: string;
  endorserId: string;
  status: string;
  isSuggested: boolean;
  note: string | null;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
  evidenceSituation: string;
  evidenceTask: string;
  evidenceAction: string;
  evidenceResult: string;
  evidenceCreatedAt: string;
  evidenceDataClassification: string;
  subjectName: string;
  projectName: string | null;
};

function workingDaysSince(createdAt: string): number {
  const start = new Date(createdAt);
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(0, 0, 0, 0);
  let count = 0;
  const current = new Date(start);
  while (current < end) {
    current.setDate(current.getDate() + 1);
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
  }
  return count;
}

function isOverdue(createdAt: string): boolean {
  return workingDaysSince(createdAt) > 2;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface PendingCardProps {
  entry: PendingEndorsement;
  onClick: () => void;
}

function PendingEndorsementCard(props: PendingCardProps) {
  const overdue = () => isOverdue(props.entry.evidenceCreatedAt);

  return (
    <button class={styles.card} onClick={props.onClick}>
      <div class={styles.cardHeader}>
        <div class={styles.skillBadge}>
          <span class={styles.skillName}>{props.entry.subjectName}</span>
        </div>
        <Show when={overdue()}>
          <span class={styles.overdueBadge}>Overdue</span>
        </Show>
      </div>
      <div class={styles.cardMeta}>
        <Show when={props.entry.projectName}>
          <span class={styles.projectName}>{props.entry.projectName}</span>
          <span class={styles.separator}>·</span>
        </Show>
        <time class={styles.date}>
          {formatDate(props.entry.evidenceCreatedAt)}
        </time>
      </div>
      <p class={styles.preview}>
        {props.entry.evidenceAction.length > 160
          ? props.entry.evidenceAction.slice(0, 160) + "…"
          : props.entry.evidenceAction}
      </p>
    </button>
  );
}

export function PeerReview() {
  useAuthGuard();
  const session = useSession();
  const navigate = useNavigate();

  const [entries] = createResource(
    () => session()?.data?.user?.id,
    async () => {
      const res = await fetch(`${API}/api/v0/endorsements`, {
        credentials: "include",
      });
      const json = await res.json();
      return json.data as PendingEndorsement[];
    },
  );

  return (
    <Shell>
      <Container>
        <h2 class={styles.heading}>Pending Review</h2>

        <Show when={entries.loading}>
          <p>Loading…</p>
        </Show>

        <Show when={!entries.loading && (entries()?.length ?? 0) === 0}>
          <div class={styles.emptyState}>
            <p class={styles.emptyTitle}>Nothing to review right now</p>
            <p class={styles.emptySubtitle}>
              Evidence assigned to you for review will appear here.
            </p>
          </div>
        </Show>

        <Show when={(entries()?.length ?? 0) > 0}>
          <div class={styles.list}>
            <For each={entries()}>
              {(entry) => (
                <PendingEndorsementCard
                  entry={entry}
                  onClick={() => navigate(`/peer-review/${entry.evidenceId}?endorsementId=${entry.id}`)}
                />
              )}
            </For>
          </div>
        </Show>
      </Container>
    </Shell>
  );
}
