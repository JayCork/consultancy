import { fn } from "storybook/test";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Select } from "./Select";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Atoms/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  //   argTypes: {
  //     backgroundColor: { control: "color" },
  //   },
  args: { onClick: fn() },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "select--default",
    label: "Select",
    options: [
      { label: "Option 1", value: "option1" },
      { label: "Option 2", value: "option2" },
      { label: "Option 3", value: "option3" },
    ],
  },
};
