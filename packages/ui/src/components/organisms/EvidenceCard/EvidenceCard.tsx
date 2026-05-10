import { createSignal, Show } from "solid-js";
import {
  Clock,
  FilePenLine,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-solid";
import styles from "./EvidenceCard.module.css";

export type EvidenceEntry = {
  id: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  skill_name: string;
  level_claimed: number;
  data_classification: string;
  security_context: string;
  project_id: string | null;
  status: "draft" | "submitted" | "verified";
  created_at: string;
};

const STATUS_CONFIG = {
  draft: { label: "Draft", icon: FilePenLine },
  pending_verification: { label: "Pending Review", icon: Clock },
  submitted: { label: "Pending Review", icon: Clock },
  verified: { label: "Verified", icon: BadgeCheck },
} as const;

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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface EvidenceCardProps {
  entry: EvidenceEntry;
}

export function EvidenceCard(props: EvidenceCardProps) {
  const [expanded, setExpanded] = createSignal(false);
  const status = () => STATUS_CONFIG[props.entry.status];
  const StatusIcon = () => {
    const S = status().icon;
    return <S size={14} />;
  };

  const actionPreview = () => {
    const text = props.entry.action;
    return text.length > 240 ? text.slice(0, 240) + "…" : text;
  };

  return (
    <article class={styles.card}>
      <header class={styles.header}>
        <div class={styles.skillBadge}>
          <span class={styles.skillName}>{props.entry.skill_name}</span>
          <span class={styles.levelBadge}>{props.entry.level_claimed}</span>
        </div>

        <div class={styles.metaRight}>
          <span class={styles.statusBadge} data-status={props.entry.status}>
            <StatusIcon />
            {status().label}
          </span>
          <time class={styles.date}>{formatDate(props.entry.created_at)}</time>
          <button
            class={styles.expandBtn}
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded()}
            aria-label={
              expanded() ? "Collapse STAR details" : "Expand STAR details"
            }
          >
            <Show when={expanded()} fallback={<ChevronDown size={16} />}>
              <ChevronUp size={16} />
            </Show>
          </button>
        </div>
      </header>

      <Show
        when={expanded()}
        fallback={
          <section class={styles.starSection}>
            <p class={styles.sectionLabel}>Action</p>
            <p class={styles.sectionText}>{actionPreview()}</p>
          </section>
        }
      >
        <div class={styles.starGrid}>
          {STAR_SECTIONS.map((s) => (
            <section class={styles.starSection}>
              <p class={styles.sectionLabel}>{s.label}</p>
              <p class={styles.sectionText}>{props.entry[s.key]}</p>
            </section>
          ))}
        </div>
      </Show>

      <footer class={styles.footer}>
        <span class={styles.footerTag}>
          {SECTOR_LABELS[props.entry.data_classification] ??
            props.entry.data_classification}
        </span>
        <Show when={!props.entry.project_id}>
          <span class={styles.footerTag}>Non-project</span>
        </Show>
      </footer>
    </article>
  );
}
