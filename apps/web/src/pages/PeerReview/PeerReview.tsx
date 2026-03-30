import { createResource, For, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useSession } from "../../lib/auth-client";
import { useAuthGuard } from "../../lib/use-auth-guard";
import { Container } from "@consultancy/ui";
import { Shell } from "../../Shell";
import styles from "./PeerReview.module.css";

const API = import.meta.env.VITE_API_URL;

export type PendingEvidenceEntry = {
  id: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  sector: string;
  security_context: string;
  project_id: string | null;
  status: string;
  created_at: string;
  skill_name: string;
  level_number: number;
  author_id: string;
  author_name: string;
  project_name: string | null;
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
  entry: PendingEvidenceEntry;
  onClick: () => void;
}

function PendingEvidenceCard(props: PendingCardProps) {
  const overdue = () => isOverdue(props.entry.created_at);

  return (
    <button class={styles.card} onClick={props.onClick}>
      <div class={styles.cardHeader}>
        <div class={styles.skillBadge}>
          <span class={styles.skillName}>{props.entry.skill_name}</span>
          <span class={styles.levelBadge}>Level {props.entry.level_number}</span>
        </div>
        <Show when={overdue()}>
          <span class={styles.overdueBadge}>Overdue</span>
        </Show>
      </div>
      <div class={styles.cardMeta}>
        <span class={styles.authorName}>{props.entry.author_name}</span>
        <Show when={props.entry.project_name}>
          <span class={styles.separator}>·</span>
          <span class={styles.projectName}>{props.entry.project_name}</span>
        </Show>
        <span class={styles.separator}>·</span>
        <time class={styles.date}>{formatDate(props.entry.created_at)}</time>
      </div>
      <p class={styles.preview}>
        {props.entry.action.length > 160
          ? props.entry.action.slice(0, 160) + "…"
          : props.entry.action}
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
      const res = await fetch(`${API}/api/v0/evidence/pending`, {
        credentials: "include",
      });
      const json = await res.json();
      return json.data as PendingEvidenceEntry[];
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
              Evidence submitted by your team will appear here once it is ready
              for verification.
            </p>
          </div>
        </Show>

        <Show when={(entries()?.length ?? 0) > 0}>
          <div class={styles.list}>
            <For each={entries()}>
              {(entry) => (
                <PendingEvidenceCard
                  entry={entry}
                  onClick={() => navigate(`/peer-review/${entry.id}`)}
                />
              )}
            </For>
          </div>
        </Show>
      </Container>
    </Shell>
  );
}
