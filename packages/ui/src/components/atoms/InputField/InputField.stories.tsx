import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { InputField } from "./InputField";

const meta: Meta<typeof InputField> = {
  component: InputField,
  title: "Atoms/InputField",
};

export default meta;
type Story = StoryObj<typeof InputField>;

export const Default: Story = {
  args: {},
};
