import { createSignal, Show } from "solid-js";

import { Clock, FilePenLine, BadgeCheck } from "lucide-solid";

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
  draft: {
    label: "Draft",
    icon: FilePenLine,
    color: "var(--color-text-secondary)",
    background: "var(--color-overlay)",
  },
  pending_verification: {
    label: "Pending Review",
    icon: Clock,
    color: "var(--color-on-warning)",
    background: "var(--color-warning-subtle)",
  },
  verified: {
    label: "Verified",
    icon: BadgeCheck,
    color: "var(--color-success)",
    background: "var(--color-success-subtle)",
  },
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
    <article style={cardStyle}>
      <header style={headerStyle}>
        <div style={skillBadgeStyle}>
          <span style={skillNameStyle}>{props.entry.skill_name}</span>
          <span style={levelBadgeStyle}>Level {props.entry.level_number}</span>
        </div>

        <div style={metaRightStyle}>
          <span
            style={{
              ...statusBadgeStyle,
              color: status().color,
              background: status().background,
            }}
          >
            <Icon />
            {status().label}
          </span>
          <time style={dateStyle}>{formatDate(props.entry.created_at)}</time>
        </div>
      </header>

      <section style={actionSectionStyle}>
        <p style={actionLabelStyle}>What I did</p>
        <p style={actionTextStyle}>{actionPreview()}</p>
        <Show when={props.entry.action.length > 240}>
          <button style={toggleStyle} onClick={() => setExpanded((v) => !v)}>
            {expanded() ? "Show less" : "Read more"}
          </button>
        </Show>
      </section>

      <footer style={footerStyle}>
        <span style={footerTagStyle}>
          {SECTOR_LABELS[props.entry.sector] ?? props.entry.sector}
        </span>
        <Show when={!props.entry.project_id}>
          <span style={footerTagStyle}>Non-project</span>
        </Show>
      </footer>
    </article>
  );
}

const cardStyle = {
  background: "var(--color-container)",
  border: "1px solid var(--color-border)",
  "border-radius": "var(--radius-card)",
  "box-shadow": "var(--shadow-card)",
  padding: "var(--space-component-lg)",
  display: "flex",
  "flex-direction": "column",
  gap: "var(--space-4)",
} as const;

const headerStyle = {
  display: "flex",
  "align-items": "flex-start",
  "justify-content": "space-between",
  gap: "var(--space-4)",
  "flex-wrap": "wrap",
} as const;

const skillBadgeStyle = {
  display: "flex",
  "align-items": "center",
  gap: "var(--space-2)",
  "flex-wrap": "wrap",
} as const;

const skillNameStyle = {
  "font-size": "var(--font-size-md)",
  "font-weight": "var(--font-weight-semibold)",
  color: "var(--color-text-primary)",
} as const;

const levelBadgeStyle = {
  "font-size": "var(--font-size-xs)",
  "font-weight": "var(--font-weight-semibold)",
  background: "var(--color-accent-container)",
  color: "var(--color-on-accent-container)",
  padding: "var(--space-1) var(--space-2)",
  "border-radius": "var(--radius-badge)",
} as const;

const metaRightStyle = {
  display: "flex",
  "align-items": "center",
  gap: "var(--space-3)",
  "flex-shrink": "0",
} as const;

const statusBadgeStyle = {
  display: "inline-flex",
  "align-items": "center",
  gap: "var(--space-inline-xs)",
  "font-size": "var(--font-size-xs)",
  "font-weight": "var(--font-weight-medium)",
  padding: "var(--space-1) var(--space-3)",
  "border-radius": "var(--radius-badge)",
} as const;

const dateStyle = {
  "font-size": "var(--font-size-xs)",
  color: "var(--color-text-muted)",
  "white-space": "nowrap",
} as const;

const actionSectionStyle = {
  display: "flex",
  "flex-direction": "column",
  gap: "var(--space-stack-sm)",
} as const;

const actionLabelStyle = {
  "font-size": "var(--text-overline-size)",
  "font-weight": "var(--text-overline-weight)",
  "letter-spacing": "var(--text-overline-tracking)",
  "text-transform": "uppercase",
  color: "var(--color-text-muted)",
  margin: "0",
} as const;

const actionTextStyle = {
  "font-size": "var(--text-body-sm-size)",
  "line-height": "var(--line-height-relaxed)",
  color: "var(--color-text-primary)",
  margin: "0",
} as const;

const toggleStyle = {
  background: "none",
  border: "none",
  padding: "0",
  "font-size": "var(--text-body-sm-size)",
  "font-weight": "var(--font-weight-medium)",
  color: "var(--color-primary)",
  cursor: "pointer",
  "align-self": "flex-start",
} as const;

const footerStyle = {
  display: "flex",
  gap: "var(--space-2)",
  "flex-wrap": "wrap",
  "padding-top": "var(--space-3)",
  "border-top": "1px solid var(--color-border)",
} as const;

const footerTagStyle = {
  "font-size": "var(--font-size-xs)",
  color: "var(--color-text-secondary)",
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  padding: "var(--space-1) var(--space-2)",
  "border-radius": "var(--radius-sm)",
} as const;
