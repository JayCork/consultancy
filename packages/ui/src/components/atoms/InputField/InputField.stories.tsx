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

export const TypeButton: Story = {
  args: {
    type: "button",
    label: "Button Input",
    value: "Click Me",
  },
};

export const TypeCheckbox: Story = {
  args: {
    type: "checkbox",
    label: "Accept Terms and Conditions",
  },
};

export const TypeColor: Story = {
  args: {
    type: "color",
    label: "Choose a color",
  },
};

export const TypeDate: Story = {
  args: {
    type: "date",
    label: "Select a date",
  },
};

export const TypeDatetimeLocal: Story = {
  args: {
    type: "datetime-local",
    label: "Select date and time",
  },
};

export const TypeEmail: Story = {
  args: {
    type: "email",
    label: "Email Address",
  },
};

export const TypeFile: Story = {
  args: {
    type: "file",
    label: "Upload a file",
  },
};

export const TypeHidden: Story = {
  args: {
    type: "hidden",
    value: "This is a hidden input",
  },
};

export const TypeImage: Story = {
  args: {
    type: "image",
    src: "https://picsum.photos/100/100",
    alt: "Placeholder Image",
  },
};

export const TypeMonth: Story = {
  args: {
    type: "month",
    label: "Select a month",
  },
};

export const TypePassword: Story = {
  args: {
    type: "password",
    label: "Password",
  },
};

export const TypeRange: Story = {
  args: {
    type: "range",
    label: "Select a value",
    min: 0,
    max: 100,
  },
};

export const TypeSearch: Story = {
  args: {
    type: "search",
    label: "Search",
  },
};

export const TypeTel: Story = {
  args: {
    type: "tel",
    label: "Phone Number",
  },
};

export const TypeTime: Story = {
  args: {
    type: "time",
    label: "Select a time",
  },
};

export const TypeUrl: Story = {
  args: {
    type: "url",
    label: "Website URL",
  },
};

export const TypeWeek: Story = {
  args: {
    type: "week",
    label: "Select a week",
  },
};
