export interface ProjectColorSet {
  fill: string;
  text: string;
  border: string;
}

// Solid fills for legibility. Warning amber is lighter (~72% oklch) so needs dark text;
// all other status colors are ≤62% oklch and carry white text at sufficient contrast.
const STATUS_COLORS: Record<string, ProjectColorSet> = {
  // Pre-contract — purple
  opportunity:      { fill: "var(--color-data-3)", text: "oklch(98% 0.005 290)", border: "oklch(48% 0.15 290)" },
  qualifying:       { fill: "var(--color-data-3)", text: "oklch(98% 0.005 290)", border: "oklch(48% 0.15 290)" },
  bidding:          { fill: "var(--color-data-3)", text: "oklch(98% 0.005 290)", border: "oklch(48% 0.15 290)" },
  bid_submitted:    { fill: "var(--color-data-3)", text: "oklch(98% 0.005 290)", border: "oklch(48% 0.15 290)" },
  bid_won:          { fill: "var(--color-data-3)", text: "oklch(98% 0.005 290)", border: "oklch(48% 0.15 290)" },
  // Contract / mobilisation — warning amber (72% lightness → dark text)
  contract_review:  { fill: "var(--color-warning)", text: "var(--color-on-warning)", border: "oklch(58% 0.15 75)" },
  contract_signed:  { fill: "var(--color-warning)", text: "var(--color-on-warning)", border: "oklch(58% 0.15 75)" },
  mobilising:       { fill: "var(--color-warning)", text: "var(--color-on-warning)", border: "oklch(58% 0.15 75)" },
  // Delivery — accent teal
  discovery:        { fill: "var(--color-accent)", text: "var(--color-on-accent)", border: "oklch(48% 0.13 195)" },
  in_delivery:      { fill: "var(--color-accent)", text: "var(--color-on-accent)", border: "oklch(48% 0.13 195)" },
  uat:              { fill: "var(--color-accent)", text: "var(--color-on-accent)", border: "oklch(48% 0.13 195)" },
  hypercare:        { fill: "var(--color-accent)", text: "var(--color-on-accent)", border: "oklch(48% 0.13 195)" },
  // Sustain — blue
  support:          { fill: "var(--color-data-6)", text: "oklch(98% 0.005 230)", border: "oklch(48% 0.12 230)" },
  contract_renewal: { fill: "var(--color-data-6)", text: "oklch(98% 0.005 230)", border: "oklch(48% 0.12 230)" },
  // Closing — red-orange
  closing:          { fill: "var(--color-data-5)", text: "oklch(98% 0.005 25)", border: "oklch(48% 0.18 25)" },
  // Terminal / muted
  bid_lost:         { fill: "var(--color-overlay)", text: "var(--color-text-muted)", border: "var(--color-border-strong)" },
  closed:           { fill: "var(--color-overlay)", text: "var(--color-text-muted)", border: "var(--color-border-strong)" },
  cancelled:        { fill: "var(--color-error)", text: "oklch(98% 0.005 25)", border: "oklch(43% 0.2 25)" },
};

const FALLBACK: ProjectColorSet = {
  fill: "var(--color-overlay)",
  text: "var(--color-text-secondary)",
  border: "var(--color-border-strong)",
};

export const STATUS_LEGEND = [
  { label: "Pre-contract", fill: "var(--color-data-3)" },
  { label: "Mobilising",   fill: "var(--color-warning)" },
  { label: "In delivery",  fill: "var(--color-accent)" },
  { label: "Support",      fill: "var(--color-data-6)" },
  { label: "Closing",      fill: "var(--color-data-5)" },
  { label: "Cancelled",    fill: "var(--color-error)" },
  { label: "Inactive",     fill: "var(--color-overlay)", border: true },
] as const;

export function getProjectColors(projectStatus: string): ProjectColorSet {
  return STATUS_COLORS[projectStatus] ?? FALLBACK;
}
