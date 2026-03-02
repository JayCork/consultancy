import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Header } from "./Header";

const meta: Meta<typeof Header> = {
  component: Header,
  title: "Molecules/Header",
  argTypes: {
    title: { control: "text" },
    firstName: { control: "text" },
  },
  args: {
    title: "Application Name",
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {},
};

export const WithUser: Story = {
  args: {
    firstName: "John",
  },
};
