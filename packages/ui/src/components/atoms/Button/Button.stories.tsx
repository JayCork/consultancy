import type { Meta, StoryObj } from "storybook-solidjs-vite";
import Button from "./Button";

// https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button

const meta: Meta<typeof Button> = {
  component: Button,
  title: "Atoms/Button",
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: "Button",
  },
};

export const WithALongLabel: Story = {
  args: {
    ...Primary.args,
    children: "This is a button with a long label",
  },
};

export const WithFocus: Story = {
  args: {
    ...Primary.args,
    children: "Focused Button",
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector("button");
    button?.focus();
  },
};

export const AutoFocus: Story = {
  args: {
    ...Primary.args,
    children: "Auto Focus Button",
    autofocus: true,
  },
};

// TODO: Add story for command and commandfor attributes once implemented in the Button component
// export const CommandShowModal: Story = {
//   args: {
//     ...Primary.args,
//     children: "Show Modal",
//     command: "show-modal",
//   },
// };
