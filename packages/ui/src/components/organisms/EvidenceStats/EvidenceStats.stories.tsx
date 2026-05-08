import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { EvidenceStats } from "./EvidenceStats";

const meta: Meta<typeof EvidenceStats> = {
  component: EvidenceStats,
  title: "Organisms/EvidenceStats",
};

export default meta;
type Story = StoryObj<typeof EvidenceStats>;

export const AllZero: Story = {
  args: {
    counts: { total: 0, draft: 0, pendingVerification: 0, verified: 0 },
  },
};

export const DraftsOnly: Story = {
  args: {
    counts: { total: 3, draft: 3, pendingVerification: 0, verified: 0 },
    onSubmitDrafts: () => {},
  },
};

export const Mixed: Story = {
  args: {
    counts: { total: 12, draft: 2, pendingVerification: 3, verified: 7 },
    onSubmitDrafts: () => {},
  },
};

export const AllVerified: Story = {
  args: {
    counts: { total: 8, draft: 0, pendingVerification: 0, verified: 8 },
  },
};
