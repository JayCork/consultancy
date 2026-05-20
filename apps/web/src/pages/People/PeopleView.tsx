import type { JSX } from "solid-js";
import { createSignal, createMemo, createResource, For, Show } from "solid-js";
import { enrichPerson, sortPeople } from "../../lib/people/enrichment";
import { buildWindow, addDays } from "../../lib/people/dateHelpers";
import type { Person } from "../../lib/people/types";
import { StatCard } from "../../components/StatCard/StatCard";
import { FilterChip } from "../../components/FilterChip/FilterChip";
import { TimelineView } from "../../templates/PeopleTimelineView/TimelineView";
import { TableView } from "../../templates/PeopleTableView/TableView";
import styles from "./PeopleView.module.css";

const API = import.meta.env.VITE_API_URL as string;

async function fetchPeople(): Promise<Person[]> {
  const res = await fetch(`${API}/api/v0/people`, { credentials: "include" });
  const json = (await res.json()) as { ok: boolean; data: unknown[] };
  return (json.data as Person[]).map((p) => ({
    ...p,
    assignments: p.assignments.map((a) => ({
      ...a,
      startDate: new Date(a.startDate),
      endDate: a.endDate != null ? new Date(a.endDate) : null,
    })),
  }));
}

type AvailFilter =
  | "ALL"
  | "UNBILLED"
  | "SPLIT"
  | "4W"
  | "8W"
  | "QUARTER"
  | "ROTATION";

export function PeopleView(): JSX.Element {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { windowStart, windowEnd } = buildWindow(today);

  const STEP = 28;
  const [windowOffset, setWindowOffset] = createSignal(0);
  const shiftedStart = () => addDays(windowStart, windowOffset());
  const shiftedEnd = () => addDays(windowEnd, windowOffset());

  const [rawPeople] = createResource(fetchPeople);
  const allEnriched = createMemo(() => {
    const people = rawPeople();
    if (!people) return [];
    return sortPeople(
      people.map((p) => enrichPerson(p, shiftedStart(), shiftedEnd(), today)),
    );
  });

  const [viewMode, setViewMode] = createSignal<"timeline" | "table">(
    "timeline",
  );
  const [search, setSearch] = createSignal("");
  const [availFilter, setAvailFilter] = createSignal<AvailFilter>("ALL");
  const [gradeFilter, setGradeFilter] = createSignal("");
  const [statusFilter, setStatusFilter] = createSignal<string>("ALL");

  const stats = createMemo(() => {
    const all = allEnriched();
    const unbilled = all.filter((p) => p.flags.has("UNBILLED")).length;
    const partial = all.filter((p) => p.flags.has("PARTIAL")).length;
    const free4w = all.filter(
      (p) => p.daysUntilFree !== null && p.daysUntilFree <= 28,
    ).length;
    const free8w = all.filter(
      (p) => p.daysUntilFree !== null && p.daysUntilFree <= 56,
    ).length;
    const freeQuarter = all.filter((p) => p.freeQuarterDays > 0).length;
    const rotation = all.filter((p) => p.flags.has("ROTATION")).length;
    return { unbilled, partial, free4w, free8w, freeQuarter, rotation };
  });

  const STATUS_GROUPS: Record<string, string[]> = {
    PRE_CONTRACT: [
      "opportunity",
      "qualifying",
      "bidding",
      "bid_submitted",
      "bid_won",
    ],
    CONTRACT: ["contract_review", "contract_signed", "mobilising"],
    DELIVERY: ["discovery", "in_delivery", "uat", "hypercare"],
    SUSTAIN: ["support", "contract_renewal"],
    CLOSING: ["closing", "closed", "cancelled", "bid_lost"],
  };

  const filtered = createMemo(() => {
    const q = search().toLowerCase();
    const af = availFilter();
    const gf = gradeFilter();
    const sf = statusFilter();

    return allEnriched().filter((p) => {
      if (q) {
        const haystack = [
          p.name,
          p.grade,
          ...p.skills,
          ...p.assignments.map((a) => a.project),
          ...p.assignments.map((a) => a.sector),
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      if (gf && p.level !== gf) return false;

      if (sf !== "ALL") {
        const allowed = STATUS_GROUPS[sf] ?? [];
        const hasMatch = p.assignments.some((a) =>
          allowed.includes(a.projectStatus),
        );
        if (!hasMatch) return false;
      }

      if (af === "UNBILLED") return p.flags.has("UNBILLED");
      if (af === "SPLIT") return p.flags.has("PARTIAL");
      if (af === "4W") return p.daysUntilFree !== null && p.daysUntilFree <= 28;
      if (af === "8W") return p.daysUntilFree !== null && p.daysUntilFree <= 56;
      if (af === "QUARTER") return p.freeQuarterDays > 0;
      if (af === "ROTATION") return p.flags.has("ROTATION");

      return true;
    });
  });

  const statusChips: { label: string; key: string }[] = [
    { label: "All projects", key: "ALL" },
    { label: "Pre-contract", key: "PRE_CONTRACT" },
    { label: "Contract", key: "CONTRACT" },
    { label: "Delivery", key: "DELIVERY" },
    { label: "Sustain", key: "SUSTAIN" },
    { label: "Closing", key: "CLOSING" },
  ];

  const chips: { label: string; key: AvailFilter }[] = [
    { label: "All", key: "ALL" },
    { label: "Unbilled", key: "UNBILLED" },
    { label: "Split", key: "SPLIT" },
    { label: "≤ 4 weeks", key: "4W" },
    { label: "≤ 8 weeks", key: "8W" },
    { label: "This quarter", key: "QUARTER" },
    { label: "Rotation", key: "ROTATION" },
  ];

  return (
    <div class={styles.view}>
      <a href="/projects/new" class={styles.newProjectBtn}>
        + New Project
      </a>
      <div class={styles.statsBar}>
        <StatCard label="Unbilled" value={stats().unbilled} prominent />
        <StatCard label="Split" value={stats().partial} />
        <StatCard label="Free ≤ 4w" value={stats().free4w} />
        <StatCard label="Free ≤ 8w" value={stats().free8w} />
        <StatCard label="Free this Q" value={stats().freeQuarter} />
        <StatCard label="Rotation" value={stats().rotation} />
      </div>

      <div class={styles.filterBar}>
        <input
          class={styles.search}
          type="text"
          placeholder="Search name, grade, skill, project…"
          value={search()}
          onInput={(e) => setSearch(e.currentTarget.value)}
        />

        <div class={styles.chips}>
          <For each={chips}>
            {(chip) => {
              const count = createMemo(() => {
                if (chip.key === "ALL") return undefined;
                if (chip.key === "UNBILLED") return stats().unbilled;
                if (chip.key === "SPLIT") return stats().partial;
                if (chip.key === "4W") return stats().free4w;
                if (chip.key === "8W") return stats().free8w;
                if (chip.key === "QUARTER") return stats().freeQuarter;
                if (chip.key === "ROTATION") return stats().rotation;
              });
              return (
                <FilterChip
                  label={chip.label}
                  count={count()}
                  active={availFilter() === chip.key}
                  onClick={() => setAvailFilter(chip.key)}
                />
              );
            }}
          </For>
        </div>

        <select
          class={styles.select}
          value={gradeFilter()}
          onChange={(e) => setGradeFilter(e.currentTarget.value)}
        >
          <option value="">All levels</option>
          <option value="associate">Associate</option>
          <option value="junior">Junior</option>
          <option value="mid">Mid</option>
          <option value="senior">Senior</option>
          <option value="lead">Lead</option>
          <option value="principal">Principal</option>
        </select>
      </div>

      <div class={styles.filterBar}>
        <span class={styles.filterLabel}>Project status</span>
        <div class={styles.chips}>
          <For each={statusChips}>
            {(chip) => (
              <FilterChip
                label={chip.label}
                active={statusFilter() === chip.key}
                onClick={() => setStatusFilter(chip.key)}
              />
            )}
          </For>
        </div>
      </div>

      <div class={styles.meta}>
        {filtered().length} of {allEnriched().length} people
      </div>

      <Show when={rawPeople.loading}>
        <p class={styles.empty}>Loading…</p>
      </Show>

      <div class={styles.toggleRow}>
        <button
          class={`${styles.toggle} ${viewMode() === "timeline" ? styles.toggleActive : ""}`}
          onClick={() => setViewMode("timeline")}
          type="button"
        >
          Timeline
        </button>
        <button
          class={`${styles.toggle} ${viewMode() === "table" ? styles.toggleActive : ""}`}
          onClick={() => setViewMode("table")}
          type="button"
        >
          Table
        </button>
      </div>

      <Show when={!rawPeople.loading && filtered().length === 0}>
        <p class={styles.empty}>No people match the current filters.</p>
      </Show>

      <Show when={filtered().length > 0 && viewMode() === "timeline"}>
        <TimelineView
          people={filtered()}
          onPrev={() => setWindowOffset((o) => o - STEP)}
          onNext={() => setWindowOffset((o) => o + STEP)}
          onToday={() => setWindowOffset(0)}
          isAtDefault={windowOffset() === 0}
        />
      </Show>

      <Show when={filtered().length > 0 && viewMode() === "table"}>
        <TableView people={filtered()} />
      </Show>
    </div>
  );
}
