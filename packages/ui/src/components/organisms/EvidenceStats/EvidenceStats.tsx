import { Show } from "solid-js";
import { StatCard } from "../../atoms/StatCard/StatCard";
import styles from "./EvidenceStats.module.css";

export interface EvidenceStatCounts {
  total: number;
  draft: number;
  pending_verification: number;
  verified: number;
}

export interface EvidenceStatsProps {
  counts: EvidenceStatCounts;
  onSubmitDrafts?: () => void;
}

export function EvidenceStats(props: EvidenceStatsProps) {
  return (
    <div class={styles.grid}>
      <StatCard
        value={props.counts.total}
        label="Total entries"
        color="var(--color-text-primary)"
        background="var(--color-container)"
      />
      <StatCard
        value={props.counts.draft}
        label="Draft"
        sublabel={
          props.counts.draft > 0
            ? `${props.counts.draft === 1 ? "Entry" : "Entries"} not yet submitted for review`
            : undefined
        }
        color="var(--color-text-secondary)"
        background="var(--color-overlay)"
        action={
          props.counts.draft > 0 && props.onSubmitDrafts
            ? { label: "Submit for review", onClick: props.onSubmitDrafts }
            : undefined
        }
      />
      <StatCard
        value={props.counts.pending_verification}
        label="Pending review"
        sublabel={
          props.counts.pending_verification > 0
            ? "Awaiting verification by a peer"
            : undefined
        }
        color="var(--color-on-warning)"
        background="var(--color-warning-subtle)"
      />
      <StatCard
        value={props.counts.verified}
        label="Verified"
        sublabel={
          props.counts.verified > 0 ? "Locked and bid-ready" : undefined
        }
        color="var(--color-success)"
        background="var(--color-success-subtle)"
      />
    </div>
  );
}

// Convenience re-export so callers can use <EvidenceStats.Loading />
export function EvidenceStatsLoading() {
  return <div class={styles.grid}>{/* skeleton placeholder */}</div>;
}
