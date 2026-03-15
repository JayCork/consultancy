import type { Meta, StoryObj } from "storybook-solidjs-vite";
import TextArea from "./TextArea";

const meta: Meta<typeof TextArea> = {
  component: TextArea,
  title: "Atoms/TextArea",
  tags: ["autodocs"],
  args: {
    name: "Example TextArea",
  },
};

export default meta;
type Story = StoryObj<typeof TextArea>;

export const Default: Story = {
  args: {},
};
export const WithDescription: Story = {
  args: {
    description: "This is a description for the textarea.",
  },
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: "Enter your text here...",
  },
};
