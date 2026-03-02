import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Header } from "./Header";

const meta: Meta<typeof Header> = {
  component: Header,
  title: "Molecules/Header",
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    title: "Consultancy Dashboard",
  },
};
