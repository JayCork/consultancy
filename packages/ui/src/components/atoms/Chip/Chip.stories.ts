import type { Meta, StoryObj } from "storybook-solidjs-vite";
import Chip from "./Chip";

const meta = {
  title: "Atoms/Chip",
  component: Chip,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "chip--default",
    label: "Chip",
  },
};
