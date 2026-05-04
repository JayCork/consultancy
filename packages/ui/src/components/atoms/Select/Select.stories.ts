import { fn } from "storybook/test";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import Select from "./Select";
import { describe } from "node:test";

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

export const WithDescription: Story = {
  args: {
    ...Default.args,
    description: "This is a description for the select component.",
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    description: "This select is disabled.",
    disabled: true,
  },
};

export const Multiple: Story = {
  args: {
    ...Default.args,
    description: "This select allows multiple selections.",
    multiple: true,
  },
};

export const Required: Story = {
  args: {
    ...Default.args,
    description: "This select is required.",
    required: true,
  },
};

export const Size: Story = {
  args: {
    ...Default.args,
    description: `This select has a size of "3",`,
    size: "3",
  },
};

export const FullWidth: Story = {
  args: {
    ...Default.args,
    descriptionL: "This select takes the full width of its container.",
    fullWidth: true,
  },
};
