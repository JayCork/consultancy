import type { Meta, StoryObj } from "storybook-solidjs-vite";
import TextArea from "./TextArea";

const meta: Meta<typeof TextArea> = {
  component: TextArea,
  title: "Atoms/TextArea",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TextArea>;

export const Default: Story = {
  args: {
    name: "default-textarea",
  },
};
export const WithDescription: Story = {
  args: {
    name: "textarea-with-description",
    description: "This is a description for the textarea.",
  },
};
