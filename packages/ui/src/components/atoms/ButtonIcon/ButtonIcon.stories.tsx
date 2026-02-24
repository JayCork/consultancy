import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { ButtonIcon } from "./ButtonIcon";
import LayoutDashboard from "lucide-solid/icons/layout-dashboard";
import { children } from "solid-js";

const meta: Meta<typeof ButtonIcon> = {
  component: ButtonIcon,
  title: "Atoms/ButtonIcon",
};

export default meta;
type Story = StoryObj<typeof ButtonIcon>;

export const Default: Story = {
  args: {
    children: <LayoutDashboard />,
  },
};
