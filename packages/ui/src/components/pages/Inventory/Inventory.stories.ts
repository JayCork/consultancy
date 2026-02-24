import { fn } from "storybook/test";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Inventory } from "./Inventory";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Pages/Inventory",
  component: Inventory,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  //   argTypes: {
  //     backgroundColor: { control: "color" },
  //   },
  args: { onClick: fn() },
} satisfies Meta<typeof Inventory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "text-area--default",
    label: "Text Area",
  },
};
