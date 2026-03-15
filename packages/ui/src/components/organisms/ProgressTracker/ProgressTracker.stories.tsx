import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { ProgressTracker } from "./ProgressTracker";

const meta: Meta<typeof ProgressTracker> = {
  component: ProgressTracker,
  title: "Organisms/ProgressTracker",
};

export default meta;
type Story = StoryObj<typeof ProgressTracker>;

export const Default: Story = {
  args: {
    percentComplete: 70,
  },
};
