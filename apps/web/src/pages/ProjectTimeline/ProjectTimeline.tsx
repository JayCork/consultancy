import { createResource, createSignal, Show } from "solid-js";
import { useAuthGuard } from "../../lib/use-auth-guard";
import { Shell } from "../../Shell";
import { Container, ProjectTimeline } from "@consultancy/ui";
import type { TimelineProject, TimelineMonth } from "@consultancy/ui";
import styles from "./ProjectTimeline.module.css";

const API = import.meta.env.VITE_API_URL;
const WINDOW_MONTHS = 6;

function differenceInDays(a: Date, b: Date): number {
  return Math.floor((a.getTime() - b.getTime()) / 86_400_000);
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

function getMonthsInWindow(start: Date, end: Date): Date[] {
  const months: Date[] = [];
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
  while (cursor < end) {
    months.push(new Date(cursor));
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return months;
}

const STATUS_COLOR_MAP: Record<string, string> = {
  opportunity: "var(--color-data-3)",
  qualifying: "var(--color-data-3)",
  bidding: "var(--color-data-3)",
  bid_submitted: "var(--color-data-3)",
  bid_won: "var(--color-data-3)",
  bid_lost: "var(--color-text-muted)",
  contract_review: "var(--color-warning)",
  contract_signed: "var(--color-warning)",
  mobilising: "var(--color-warning)",
  discovery: "var(--color-accent)",
  in_delivery: "var(--color-accent)",
  uat: "var(--color-accent)",
  hypercare: "var(--color-accent)",
  support: "var(--color-data-6)",
  contract_renewal: "var(--color-data-6)",
  closing: "var(--color-data-5)",
  closed: "var(--color-text-muted)",
  cancelled: "var(--color-error)",
};

interface Milestone {
  id: string;
  name: string;
  date: string;
}

interface Project {
  id: string;
  name: string;
  shortName: string | null;
  status: string;
  startDate: string;
  endDate: string | null;
  milestones: Milestone[];
}

export function ProjectTimelinePage() {
  useAuthGuard();

  const [windowOffset, setWindowOffset] = createSignal(0);

  const windowStart = () => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return addMonths(d, windowOffset());
  };

  const windowEnd = () => addMonths(windowStart(), WINDOW_MONTHS);

  const [projects] = createResource(
    () => ({ start: windowStart(), end: windowEnd() }),
    async ({ start, end }) => {
      const from = start.toISOString().slice(0, 10);
      const to = end.toISOString().slice(0, 10);
      const res = await fetch(`${API}/api/v0/projects?from=${from}&to=${to}`, {
        credentials: "include",
      });
      const json = await res.json();
      return json.ok ? (json.data as Project[]) : [];
    },
  );

  const totalDays = () => differenceInDays(windowEnd(), windowStart());

  const months = (): TimelineMonth[] =>
    getMonthsInWindow(windowStart(), windowEnd()).map((monthStart) => {
      const monthEnd = addMonths(monthStart, 1);
      const startOffset = Math.max(
        0,
        differenceInDays(monthStart, windowStart()),
      );
      const endOffset = Math.min(
        totalDays(),
        differenceInDays(monthEnd, windowStart()),
      );
      return {
        label: formatMonthYear(monthStart),
        widthPercent: ((endOffset - startOffset) / totalDays()) * 100,
      };
    });

  const timelineProjects = (): TimelineProject[] =>
    (projects() ?? []).map((p) => {
      const projStart = new Date(p.startDate);
      const projEnd = p.endDate ? new Date(p.endDate) : windowEnd();

      const clampedLeft = Math.max(
        0,
        differenceInDays(projStart, windowStart()),
      );
      const clampedRight = Math.min(
        totalDays(),
        differenceInDays(projEnd, windowStart()),
      );

      const leftPercent = (clampedLeft / totalDays()) * 100;
      const widthPercent = Math.max(
        0.5,
        ((clampedRight - clampedLeft) / totalDays()) * 100,
      );

      const color = STATUS_COLOR_MAP[p.status] ?? "var(--color-text-muted)";

      const milestones = p.milestones.map((m) => {
        const mDate = new Date(m.date);
        const mOffset = differenceInDays(mDate, windowStart());
        return {
          id: m.id,
          name: m.name,
          date: m.date,
          leftPercent: Math.max(
            0,
            Math.min(100, (mOffset / totalDays()) * 100),
          ),
        };
      });

      return {
        id: p.id,
        projectName: p.name,
        statusColor: color,
        leftPercent,
        widthPercent,
        milestones,
      };
    });

  const windowLabel = () =>
    `${formatMonthYear(windowStart())} – ${formatMonthYear(addMonths(windowStart(), WINDOW_MONTHS - 1))}`;

  const todayPercent = () => {
    const today = new Date();
    const offset = differenceInDays(today, windowStart());
    const pct = (offset / totalDays()) * 100;
    return pct >= 0 && pct <= 100 ? pct : undefined;
  };

  return (
    <Shell>
      <Container>
        <div class={styles.header}>
          <h2 class={styles.heading}>Project Timeline</h2>
        </div>
        <a href="/projects/new" class={styles.newProjectBtn}>
          + New Project
        </a>
        <Show when={projects.loading}>
          <p class={styles.meta}>Loading projects…</p>
        </Show>

        <Show when={!projects.loading}>
          <ProjectTimeline
            months={months()}
            projects={timelineProjects()}
            windowLabel={windowLabel()}
            onPrev={() => setWindowOffset((o) => o - WINDOW_MONTHS)}
            onNext={() => setWindowOffset((o) => o + WINDOW_MONTHS)}
            todayPercent={todayPercent()}
            onToday={
              windowOffset() !== 0 ? () => setWindowOffset(0) : undefined
            }
          />
          <Show when={(projects() ?? []).length === 0 && !projects.loading}>
            <p class={styles.meta}>No projects found for this period.</p>
          </Show>
        </Show>
      </Container>
    </Shell>
  );
}
