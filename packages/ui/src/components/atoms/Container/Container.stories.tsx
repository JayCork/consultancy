import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Container } from "./Container";

const meta: Meta<typeof Container> = {
  component: Container,
  title: "Atoms/Container",
  args: {
    children: (
      <div>
        <h1>Container Atom</h1>
        <p>This is a placeholder content inside the Container atom.</p>
      </div>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {
  args: {},
};
