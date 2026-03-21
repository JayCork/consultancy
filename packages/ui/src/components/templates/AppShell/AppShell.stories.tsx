import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { AppShell } from "./AppShell";
import { LayoutDashboard } from "lucide-solid/icons/index";
import { UserIcon } from "lucide-solid";
import { Container } from "../../atoms/Container/Container.jsx";

const meta: Meta<typeof AppShell> = {
  component: AppShell,
  title: "Templates/AppShell",
  args: {},
  parameters: {
    layout: "fullscreen",
  },
};

const placeholderContent = (
  <Container>
    <h1>Welcome to the AppShell Template</h1>
    <p>
      This is a placeholder content area. Replace this with your actual app
      content.
    </p>
  </Container>
);

export default meta;
type Story = StoryObj<typeof AppShell>;

export const Default: Story = {
  args: {
    title: "Contractor Hub",
    children: placeholderContent,
    navMenuProps: {
      title: "Main Menu",
      items: [
        { id: 1, href: "/home", label: "Home", icon: LayoutDashboard },
        { id: 2, href: "/profile", label: "Profile", icon: UserIcon },
      ],
      user: { name: "Jane Smith" },
      onSignOut: () => {},
    },
  },
};
