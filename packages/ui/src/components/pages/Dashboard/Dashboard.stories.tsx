import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Dashboard } from "./Dashboard";

const meta: Meta<typeof Dashboard> = {
  component: Dashboard,
  title: "Pages/Dashboard",
  parameters: {
    layout: "fullscreen",
  },
  tags: ["!autodocs"],
};

export default meta;
type Story = StoryObj<typeof Dashboard>;

export const Default: Story = {
  render: () => (
    <div
      style={{
        padding: "0",
        maxWidth: "1200px",
        margin: "0 auto",
        background: "var(--color-surface-0, #f5f5f5)",
        minHeight: "100vh",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        borderRadius: "1rem",
      }}
    >
      {/* Optionally add header/sidebar here */}
      <Dashboard />
    </div>
  ),
};
