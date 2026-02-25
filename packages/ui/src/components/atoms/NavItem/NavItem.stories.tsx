import type { Meta, StoryObj } from "storybook-solidjs-vite";
import NavItem from "./NavItem";
import { LayoutDashboardIcon } from "lucide-solid";

const meta: Meta<typeof NavItem> = {
  component: NavItem,
  title: "Atoms/NavItem",
};

export default meta;
type Story = StoryObj<typeof NavItem>;

export const Default: Story = {
  args: {
    href: "#",
    name: "Menu Item",
    // icon: LayoutDashboardIcon,
  },
};

export const WithLeadingIcon: Story = {
  args: {
    href: "#",
    name: "Menu Item",
    icon: LayoutDashboardIcon,
  },
};

export const WithNotifications: Story = {
  args: {
    href: "#",
    name: "Menu Item",
    notifications: 5,
  },
};
