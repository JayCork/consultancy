import type { JSX } from "solid-js";
import { createSignal, createMemo, createResource, For, Show } from "solid-js";
import { enrichPerson, sortPeople } from "../../lib/people/enrichment";
import { buildWindow } from "../../lib/people/dateHelpers";
import type { Person } from "../../lib/people/types";
import { StatCard } from "./StatCard";
import { FilterChip } from "./FilterChip";
import { TimelineView } from "./TimelineView";
import { TableView } from "./TableView";
import styles from "./PeopleView.module.css";

const API = import.meta.env.VITE_API_URL as string;

async function fetchPeople(): Promise<Person[]> {
  const res = await fetch(`${API}/api/v0/people`, { credentials: "include" });
  const json = await res.json() as { ok: boolean; data: unknown[] };
  return (json.data as Person[]).map((p) => ({
    ...p,
    assignments: p.assignments.map((a) => ({
      ...a,
      startDate: new Date(a.startDate),
      endDate: new Date(a.endDate),
    })),
  }));
}

type AvailFilter =
  | "ALL"
  | "BENCH"
  | "SPLIT"
  | "4W"
  | "8W"
  | "QUARTER"
  | "ROTATION"
  | "CLEARANCE";

export function PeopleView(): JSX.Element {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { windowStart, windowEnd } = buildWindow(today);

  const [rawPeople] = createResource(fetchPeople);

  const allEnriched = createMemo(() => {
    const people = rawPeople();
    if (!people) return [];
    return sortPeople(
      people.map((p) => enrichPerson(p, windowStart, windowEnd, today)),
    );
  });

  const [viewMode, setViewMode] = createSignal<"timeline" | "table">(
    "timeline",
  );
  const [search, setSearch] = createSignal("");
  const [availFilter, setAvailFilter] = createSignal<AvailFilter>("ALL");
  const [clearanceFilter, setClearanceFilter] = createSignal("");
  const [gradeFilter, setGradeFilter] = createSignal("");

  const stats = createMemo(() => {
    const all = allEnriched();
    const bench = all.filter((p) => p.flags.has("BENCH")).length;
    const partial = all.filter((p) => p.flags.has("PARTIAL")).length;
    const free4w = all.filter(
      (p) => p.daysUntilFree !== null && p.daysUntilFree <= 28,
    ).length;
    const free8w = all.filter(
      (p) => p.daysUntilFree !== null && p.daysUntilFree <= 56,
    ).length;
    const freeQuarter = all.filter(
      (p) => p.freeQuarterDays > 0,
    ).length;
    const rotation = all.filter((p) => p.flags.has("ROTATION")).length;
    const clearance = all.filter((p) =>
      p.flags.has("CLEARANCE"),
    ).length;
    return { bench, partial, free4w, free8w, freeQuarter, rotation, clearance };
  });

  const filtered = createMemo(() => {
    const q = search().toLowerCase();
    const af = availFilter();
    const cf = clearanceFilter();
    const gf = gradeFilter();

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

      if (cf && p.clearance !== cf) return false;
      if (gf && !p.grade.toLowerCase().includes(gf.toLowerCase())) return false;

      if (af === "BENCH") return p.flags.has("BENCH");
      if (af === "SPLIT") return p.flags.has("PARTIAL");
      if (af === "4W") return p.daysUntilFree !== null && p.daysUntilFree <= 28;
      if (af === "8W") return p.daysUntilFree !== null && p.daysUntilFree <= 56;
      if (af === "QUARTER") return p.freeQuarterDays > 0;
      if (af === "ROTATION") return p.flags.has("ROTATION");
      if (af === "CLEARANCE") return p.flags.has("CLEARANCE");

      return true;
    });
  });

  const chips: { label: string; key: AvailFilter; count?: number }[] = [
    { label: "All", key: "ALL" },
    { label: "Bench", key: "BENCH" },
    { label: "Split", key: "SPLIT" },
    { label: "≤ 4 weeks", key: "4W" },
    { label: "≤ 8 weeks", key: "8W" },
    { label: "This quarter", key: "QUARTER" },
    { label: "Rotation", key: "ROTATION" },
    { label: "Clearance ⚠", key: "CLEARANCE" },
  ];

  return (
    <div class={styles.view}>
      <div class={styles.statsBar}>
        <StatCard label="Bench" value={stats().bench} prominent />
        <StatCard label="Split" value={stats().partial} />
        <StatCard label="Free ≤ 4w" value={stats().free4w} />
        <StatCard label="Free ≤ 8w" value={stats().free8w} />
        <StatCard label="Free this Q" value={stats().freeQuarter} />
        <StatCard label="Rotation" value={stats().rotation} />
        <StatCard label="Clearance ⚠" value={stats().clearance} />
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
                if (chip.key === "BENCH") return stats().bench;
                if (chip.key === "SPLIT") return stats().partial;
                if (chip.key === "4W") return stats().free4w;
                if (chip.key === "8W") return stats().free8w;
                if (chip.key === "QUARTER") return stats().freeQuarter;
                if (chip.key === "ROTATION") return stats().rotation;
                if (chip.key === "CLEARANCE") return stats().clearance;
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
          value={clearanceFilter()}
          onChange={(e) => setClearanceFilter(e.currentTarget.value)}
        >
          <option value="">All clearances</option>
          <option value="BPSS">BPSS</option>
          <option value="SC">SC</option>
          <option value="DV">DV</option>
        </select>

        <select
          class={styles.select}
          value={gradeFilter()}
          onChange={(e) => setGradeFilter(e.currentTarget.value)}
        >
          <option value="">All grades</option>
          <option value="Associate">Associate</option>
          <option value="Consultant">Consultant</option>
          <option value="Senior">Senior</option>
          <option value="Principal">Principal</option>
        </select>
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
        <TimelineView people={filtered()} />
      </Show>

      <Show when={filtered().length > 0 && viewMode() === "table"}>
        <TableView people={filtered()} />
      </Show>
    </div>
  );
}
