import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { NavMenu } from "./NavMenu";

const meta: Meta<typeof NavMenu> = {
  component: NavMenu,
  title: "Molecules/NavMenu",
};

export default meta;
type Story = StoryObj<typeof NavMenu>;

export const Default: Story = {
  args: {},
};
