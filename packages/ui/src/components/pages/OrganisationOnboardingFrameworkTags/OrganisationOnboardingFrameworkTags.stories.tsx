import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { OrganisationOnboardingFrameworkTags } from "./OrganisationOnboardingFrameworkTags";

const meta: Meta<typeof OrganisationOnboardingFrameworkTags> = {
  component: OrganisationOnboardingFrameworkTags,
  title: "Pages/OrganisationOnboardingFrameworkTags",
};

export default meta;
type Story = StoryObj<typeof OrganisationOnboardingFrameworkTags>;

export const Default: Story = {
  args: {},
};
