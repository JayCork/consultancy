import { createResource, createSignal, Show } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";
import { useAuthGuard } from "../../lib/use-auth-guard";
import { Button, Container } from "@consultancy/ui";
import { Shell } from "../../Shell";
import { type PendingEvidenceEntry } from "../PeerReview/PeerReview";
import styles from "./EvidenceReview.module.css";

const API = import.meta.env.VITE_API_URL;

const SECTOR_LABELS: Record<string, string> = {
  central_government: "Central Government",
  defence: "Defence",
  health: "Health",
  justice: "Justice",
  transport: "Transport",
  local_government: "Local Government",
  education: "Education",
  commercial: "Commercial",
};

const STAR_SECTIONS = [
  { key: "situation", label: "Situation" },
  { key: "task", label: "Task" },
  { key: "action", label: "Action" },
  { key: "result", label: "Result" },
] as const;

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

export function EvidenceReview() {
  useAuthGuard();
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [approving, setApproving] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  const [entry] = createResource(
    () => params.id,
    async (id) => {
      const res = await fetch(`${API}/api/v0/evidence/${id}`, {
        credentials: "include",
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data as PendingEvidenceEntry;
    },
  );

  const handleApprove = async () => {
    setApproving(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/v0/evidence/${params.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: "verified" }),
      });
      if (!res.ok) {
        const json = await res.json();
        setError(json.error ?? "Failed to approve evidence");
        return;
      }
      navigate("/peer-review");
    } finally {
      setApproving(false);
    }
  };

  return (
    <Shell>
      <Container>
        <Show when={entry.loading}>
          <p>Loading…</p>
        </Show>

        <Show when={!entry.loading && !entry()}>
          <p>Evidence not found.</p>
        </Show>

        <Show when={entry()}>
          {(e) => (
            <div class={styles.layout}>
              <header class={styles.pageHeader}>
                <div class={styles.titleRow}>
                  <div class={styles.skillBadge}>
                    <span class={styles.skillName}>{e().skill_name}</span>
                    <span class={styles.levelBadge}>Level {e().level_number}</span>
                  </div>
                  <Show when={isOverdue(e().created_at)}>
                    <span class={styles.overdueBadge}>Overdue</span>
                  </Show>
                </div>

                <dl class={styles.metaGrid}>
                  <div class={styles.metaItem}>
                    <dt class={styles.metaLabel}>Submitted by</dt>
                    <dd class={styles.metaValue}>{e().author_name}</dd>
                  </div>
                  <Show when={e().project_name}>
                    <div class={styles.metaItem}>
                      <dt class={styles.metaLabel}>Project</dt>
                      <dd class={styles.metaValue}>{e().project_name}</dd>
                    </div>
                  </Show>
                  <Show when={!e().project_name}>
                    <div class={styles.metaItem}>
                      <dt class={styles.metaLabel}>Project</dt>
                      <dd class={styles.metaValue}>Non-project work</dd>
                    </div>
                  </Show>
                  <div class={styles.metaItem}>
                    <dt class={styles.metaLabel}>Date submitted</dt>
                    <dd class={styles.metaValue}>{formatDate(e().created_at)}</dd>
                  </div>
                  <div class={styles.metaItem}>
                    <dt class={styles.metaLabel}>Sector</dt>
                    <dd class={styles.metaValue}>
                      {SECTOR_LABELS[e().sector] ?? e().sector}
                    </dd>
                  </div>
                </dl>
              </header>

              <div class={styles.starSections}>
                {STAR_SECTIONS.map((s) => (
                  <section class={styles.starSection}>
                    <p class={styles.sectionLabel}>{s.label}</p>
                    <p class={styles.sectionText}>{e()[s.key]}</p>
                  </section>
                ))}
              </div>

              <footer class={styles.actions}>
                <Show when={error()}>
                  <p class={styles.errorMessage}>{error()}</p>
                </Show>
                <div class={styles.buttonRow}>
                  <Button onClick={() => navigate("/peer-review")}>
                    Back
                  </Button>
                  <Button
                    onClick={handleApprove}
                    disabled={approving()}
                  >
                    {approving() ? "Approving…" : "Approve"}
                  </Button>
                </div>
              </footer>
            </div>
          )}
        </Show>
      </Container>
    </Shell>
  );
}
