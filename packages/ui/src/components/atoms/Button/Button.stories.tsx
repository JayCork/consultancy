import type { Meta, StoryObj } from "storybook-solidjs-vite";
import Button from "./Button";
import LayoutDashboard from "lucide-solid/icons/layout-dashboard";

const meta: Meta<typeof Button> = {
  component: Button,
  title: "Atoms/Button",
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    label: "Button",
  },
};

export const WithALongLabel: Story = {
  args: {
    ...Primary.args,
    label: "This is a button with a long label",
  },
};

export const WithFocus: Story = {
  args: {
    ...Primary.args,
    label: "Focused Button",
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector("button");
    button?.focus();
  },
};
