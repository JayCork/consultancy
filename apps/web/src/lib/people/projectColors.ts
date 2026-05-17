export interface ProjectColorSet {
  fill: string;
  text: string;
  border: string;
}

const PROJECT_COLORS: Record<string, ProjectColorSet> = {
  "DWP Digital Transformation": {
    fill: "var(--color-data-3)",
    text: "var(--color-text-inverse)",
    border: "oklch(50% 0.15 290)",
  },
  "HMRC MTD Programme": {
    fill: "var(--color-data-2)",
    text: "var(--color-on-accent)",
    border: "var(--color-accent-hover)",
  },
  "NHS England Data Platform": {
    fill: "var(--color-data-4)",
    text: "var(--color-on-success)",
    border: "oklch(42% 0.15 145)",
  },
  "MOD Defence Digital": {
    fill: "var(--color-data-5)",
    text: "var(--color-on-error)",
    border: "oklch(45% 0.18 25)",
  },
  "Home Office Borders Tech": {
    fill: "var(--color-data-6)",
    text: "var(--color-on-info)",
    border: "oklch(48% 0.12 230)",
  },
  "GDS Notify Platform": {
    fill: "var(--color-data-1)",
    text: "var(--color-on-primary)",
    border: "var(--color-primary-hover)",
  },
  "DVLA Vehicle Services": {
    fill: "oklch(62% 0.14 320)",
    text: "oklch(98% 0.005 320)",
    border: "oklch(48% 0.14 320)",
  },
  "Cabinet Office Innovation": {
    fill: "oklch(60% 0.12 160)",
    text: "oklch(98% 0.005 160)",
    border: "oklch(46% 0.12 160)",
  },
  "MHCLG Levelling Up": {
    fill: "oklch(62% 0.13 40)",
    text: "oklch(20% 0.08 40)",
    border: "oklch(48% 0.13 40)",
  },
  "FCDO Digital Services": {
    fill: "oklch(58% 0.14 265)",
    text: "oklch(98% 0.005 265)",
    border: "oklch(44% 0.14 265)",
  },
};

const FALLBACK: ProjectColorSet = {
  fill: "var(--color-overlay)",
  text: "var(--color-text-secondary)",
  border: "var(--color-border-strong)",
};

export function getProjectColors(projectName: string): ProjectColorSet {
  return PROJECT_COLORS[projectName] ?? FALLBACK;
}
