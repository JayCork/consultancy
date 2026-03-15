import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { StarInput } from "./StarInput";

const meta: Meta<typeof StarInput> = {
  component: StarInput,
  title: "Organisms/StarInput",
  tags: ["!autodocs"],
};

export default meta;
type Story = StoryObj<typeof StarInput>;

export const Default: Story = {
  args: {},
};
