import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { EmployeeDashboard } from "./EmployeeDashboard";

const meta: Meta<typeof EmployeeDashboard> = {
  component: EmployeeDashboard,
  title: "Pages/EmployeeDashboard",
};

export default meta;
type Story = StoryObj<typeof EmployeeDashboard>;

export const Default: Story = {
  args: {},
};
