import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { StarInput } from "./StarInput";

const meta: Meta<typeof StarInput> = {
  component: StarInput,
  title: "Templates/StarInput",
};

export default meta;
type Story = StoryObj<typeof StarInput>;

export const Default: Story = {
  args: {},
};
