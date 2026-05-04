import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { EvidenceLocker } from "./EvidenceLocker";

const meta: Meta<typeof EvidenceLocker> = {
  component: EvidenceLocker,
  title: "Pages/EvidenceLocker",
};

export default meta;
type Story = StoryObj<typeof EvidenceLocker>;

export const Default: Story = {
  args: {},
};
