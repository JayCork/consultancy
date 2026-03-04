import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { AppShell } from "./AppShell.tsx";
import { LayoutDashboard } from "lucide-solid/icons/index";
import { SettingsIcon, UserIcon } from "lucide-solid";

const meta: Meta<typeof AppShell> = {
  component: AppShell,
  title: "Templates/AppShell",
  args: {},
  // Full screen layout for the AppShell template
  parameters: {
    layout: "fullscreen",
  },
};

const placeholderContent = (
  <div>
    <h1>Welcome to the AppShell Template</h1>
    <p>
      This is a placeholder content area. Replace this with your actual app
      content.
    </p>
  </div>
);

export default meta;
type Story = StoryObj<typeof AppShell>;

export const Default: Story = {
  args: {
    children: placeholderContent,
    navMenuProps: {
      title: "Main Menu",
      items: [
        { id: 1, href: "/home", label: "Home" },
        { id: 2, href: "/profile", label: "Profile" },
      ],
    },
  },
};
