import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { EvidenceReview } from "./EvidenceReview";

const meta: Meta<typeof EvidenceReview> = {
  component: EvidenceReview,
  title: "Pages/EvidenceReview",
};

export default meta;
type Story = StoryObj<typeof EvidenceReview>;

export const Default: Story = {
  args: {},
};
