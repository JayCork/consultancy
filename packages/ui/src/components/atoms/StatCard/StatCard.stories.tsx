import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { StatCard } from "./StatCard";

const meta: Meta<typeof StatCard> = {
  component: StatCard,
  title: "Atoms/StatCard",
};

export default meta;
type Story = StoryObj<typeof StatCard>;

export const Default: Story = {
  args: {
    value: 12,
    label: "Total entries",
    color: "var(--color-text-primary)",
    background: "var(--color-container)",
  },
};

export const WithSublabel: Story = {
  args: {
    value: 3,
    label: "Pending review",
    sublabel: "Awaiting verification by a peer",
    color: "var(--color-on-warning)",
    background: "var(--color-warning-subtle)",
  },
};

export const WithAction: Story = {
  args: {
    value: 2,
    label: "Draft",
    sublabel: "Entries not yet submitted for review",
    color: "var(--color-text-secondary)",
    background: "var(--color-overlay)",
    action: { label: "Submit for review", onClick: () => {} },
  },
};

export const Verified: Story = {
  args: {
    value: 7,
    label: "Verified",
    sublabel: "Locked and bid-ready",
    color: "var(--color-success)",
    background: "var(--color-success-subtle)",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        "grid-template-columns": "repeat(4, 1fr)",
        gap: "1rem",
      }}
    >
      <StatCard
        value={12}
        label="Total entries"
        color="var(--color-text-primary)"
        background="var(--color-container)"
      />
      <StatCard
        value={2}
        label="Draft"
        sublabel="Entries not yet submitted for review"
        color="var(--color-text-secondary)"
        background="var(--color-overlay)"
        action={{ label: "Submit for review", onClick: () => {} }}
      />
      <StatCard
        value={3}
        label="Pending review"
        sublabel="Awaiting verification by a peer"
        color="var(--color-on-warning)"
        background="var(--color-warning-subtle)"
      />
      <StatCard
        value={7}
        label="Verified"
        sublabel="Locked and bid-ready"
        color="var(--color-success)"
        background="var(--color-success-subtle)"
      />
    </div>
  ),
};
