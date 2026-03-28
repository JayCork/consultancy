import { createSignal, Show } from "solid-js";
import { Clock, FilePenLine, BadgeCheck } from "lucide-solid";
import styles from "./EvidenceCard.module.css";

export type EvidenceEntry = {
  id: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  skill_name: string;
  level_number: number;
  sector: string;
  security_context: string;
  project_id: string | null;
  status: "draft" | "pending_verification" | "verified";
  created_at: string;
};

const STATUS_CONFIG = {
  draft: { label: "Draft", icon: FilePenLine },
  pending_verification: { label: "Pending Review", icon: Clock },
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
  const Icon = () => {
    const S = status().icon;
    return <S size={14} />;
  };

  const actionPreview = () => {
    const text = props.entry.action;
    if (expanded() || text.length <= 240) return text;
    return text.slice(0, 240) + "…";
  };

  return (
    <article class={styles.card}>
      <header class={styles.header}>
        <div class={styles.skillBadge}>
          <span class={styles.skillName}>{props.entry.skill_name}</span>
          <span class={styles.levelBadge}>Level {props.entry.level_number}</span>
        </div>

        <div class={styles.metaRight}>
          <span
            class={styles.statusBadge}
            data-status={props.entry.status}
          >
            <Icon />
            {status().label}
          </span>
          <time class={styles.date}>{formatDate(props.entry.created_at)}</time>
        </div>
      </header>

      <section class={styles.actionSection}>
        <p class={styles.actionLabel}>What I did</p>
        <p class={styles.actionText}>{actionPreview()}</p>
        <Show when={props.entry.action.length > 240}>
          <button class={styles.toggle} onClick={() => setExpanded((v) => !v)}>
            {expanded() ? "Show less" : "Read more"}
          </button>
        </Show>
      </section>

      <footer class={styles.footer}>
        <span class={styles.footerTag}>
          {SECTOR_LABELS[props.entry.sector] ?? props.entry.sector}
        </span>
        <Show when={!props.entry.project_id}>
          <span class={styles.footerTag}>Non-project</span>
        </Show>
      </footer>
    </article>
  );
}
