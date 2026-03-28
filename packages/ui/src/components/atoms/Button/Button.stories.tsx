import type { Meta, StoryObj } from "storybook-solidjs-vite";
import Button from "./Button";

const meta: Meta<typeof Button> = {
  component: Button,
  title: "Atoms/Button",
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: "Button",
  },
};

export const WithALongLabel: Story = {
  args: {
    ...Primary.args,
    children: "This is a button with a long label",
  },
};

export const WithFocus: Story = {
  args: {
    ...Primary.args,
    children: "Focused Button",
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector("button");
    button?.focus();
  },
};
