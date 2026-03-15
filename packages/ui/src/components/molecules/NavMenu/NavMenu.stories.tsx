import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { NavMenu } from "./NavMenu";
import { LayoutDashboard } from "lucide-solid/icons/index";
import { SettingsIcon, UserIcon } from "lucide-solid";

const meta: Meta<typeof NavMenu> = {
  component: NavMenu,
  title: "Molecules/NavMenu",
  args: {
    title: "Company Name",
    items: [
      {
        id: 1,
        label: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard />,
      },
      { id: 2, label: "Settings", href: "/settings", icon: <SettingsIcon /> },
      { id: 3, label: "Profile", href: "/profile", icon: <UserIcon /> },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof NavMenu>;

export const Default: Story = {
  args: {},
};
