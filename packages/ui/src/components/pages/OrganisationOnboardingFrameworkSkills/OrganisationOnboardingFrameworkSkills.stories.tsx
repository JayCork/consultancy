import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { OrganisationOnboardingFrameworkSkills } from "./OrganisationOnboardingFrameworkSkills";

const meta: Meta<typeof OrganisationOnboardingFrameworkSkills> = {
  component: OrganisationOnboardingFrameworkSkills,
  title: "Pages/OrganisationOnboardingFrameworkSkills",
};

export default meta;
type Story = StoryObj<typeof OrganisationOnboardingFrameworkSkills>;

export const Default: Story = {
  args: {},
};
