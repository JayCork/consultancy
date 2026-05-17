import { createResource, createSignal, Show } from "solid-js";
import { useNavigate, useParams, useSearchParams } from "@solidjs/router";
import { useAuthGuard } from "../../lib/use-auth-guard";
import { Button, Container } from "@consultancy/ui";
import { Shell } from "../../Shell";
import styles from "./EvidenceReview.module.css";

const API = import.meta.env.VITE_API_URL;

type EvidenceEntry = {
  id: string;
  userId: string;
  projectId: string | null;
  parentId: string | null;
  version: number;
  situation: string;
  task: string;
  action: string;
  result: string;
  status: string;
  dataClassification: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  main_skill_id: string | null;
  skill_name: string | null;
  level_claimed: string | null;
};

const STAR_SECTIONS = [
  { key: "situation", label: "Situation" },
  { key: "task", label: "Task" },
  { key: "action", label: "Action" },
  { key: "result", label: "Result" },
] as const;

const CLASSIFICATION_LABELS: Record<string, string> = {
  public: "Public",
  official: "Official",
  official_sensitive: "Official Sensitive",
  secret: "Secret",
};

const LEVEL_LABELS: Record<string, string> = {
  associate: "Associate",
  junior: "Junior",
  mid: "Mid",
  senior: "Senior",
  lead: "Lead",
  principal: "Principal",
};

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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  const endorsementId = () => searchParams.endorsementId as string | undefined;

  const [evidence] = createResource(
    () => params.id,
    async (id) => {
      const res = await fetch(`${API}/api/v0/evidence/${id}`, {
        credentials: "include",
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data as EvidenceEntry;
    },
  );

  const handleAction = async (status: "endorsed" | "skipped" | "flagged") => {
    const eid = endorsementId();
    if (!eid) {
      setError("Endorsement reference missing — please go back and try again.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/v0/endorsements/${eid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const json = await res.json();
        setError(json.error ?? "Failed to submit response");
        return;
      }
      navigate("/peer-review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Shell>
      <Container>
        <Show when={evidence.loading}>
          <p>Loading…</p>
        </Show>

        <Show when={!evidence.loading && !evidence()}>
          <p>Evidence not found.</p>
        </Show>

        <Show when={evidence()}>
          {(e) => (
            <div class={styles.layout}>
              <header class={styles.pageHeader}>
                <div class={styles.titleRow}>
                  <Show when={e().skill_name}>
                    <div class={styles.skillBadge}>
                      <span class={styles.skillName}>{e().skill_name}</span>
                      <Show when={e().level_claimed}>
                        <span class={styles.levelBadge}>
                          {LEVEL_LABELS[e().level_claimed!] ?? e().level_claimed}
                        </span>
                      </Show>
                    </div>
                  </Show>
                </div>

                <dl class={styles.metaGrid}>
                  <div class={styles.metaItem}>
                    <dt class={styles.metaLabel}>Date submitted</dt>
                    <dd class={styles.metaValue}>{formatDate(e().createdAt)}</dd>
                  </div>
                  <div class={styles.metaItem}>
                    <dt class={styles.metaLabel}>Classification</dt>
                    <dd class={styles.metaValue}>
                      {CLASSIFICATION_LABELS[e().dataClassification] ?? e().dataClassification}
                    </dd>
                  </div>
                  <Show when={e().version > 1}>
                    <div class={styles.metaItem}>
                      <dt class={styles.metaLabel}>Version</dt>
                      <dd class={styles.metaValue}>{e().version}</dd>
                    </div>
                  </Show>
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
                  <Button onClick={() => navigate("/peer-review")}>Back</Button>
                  <Show when={endorsementId()}>
                    <Button
                      onClick={() => handleAction("skipped")}
                      disabled={submitting()}
                    >
                      Skip
                    </Button>
                    <Button
                      onClick={() => handleAction("flagged")}
                      disabled={submitting()}
                    >
                      Flag
                    </Button>
                    <Button
                      onClick={() => handleAction("endorsed")}
                      disabled={submitting()}
                    >
                      {submitting() ? "Submitting…" : "Endorse"}
                    </Button>
                  </Show>
                </div>
              </footer>
            </div>
          )}
        </Show>
      </Container>
    </Shell>
  );
}
