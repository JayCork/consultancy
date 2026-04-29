import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { OrganisationOnboardingFrameworkSelect } from "./OrganisationOnboardingFrameworkSelect";

const meta: Meta<typeof OrganisationOnboardingFrameworkSelect> = {
  component: OrganisationOnboardingFrameworkSelect,
  title: "Pages/OrganisationOnboardingFrameworkSelect",
};

export default meta;
type Story = StoryObj<typeof OrganisationOnboardingFrameworkSelect>;

export const Default: Story = {
  args: {},
};
