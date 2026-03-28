import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { ReadinessCard } from "./ReadinessCard";

const meta: Meta<typeof ReadinessCard> = {
  component: ReadinessCard,
  title: "Organisms/ReadinessCard",
};

export default meta;
type Story = StoryObj<typeof ReadinessCard>;

export const NotStarted: Story = {
  args: {
    roleName: "Consultant",
    seniorityLevel: 1,
    readinessPct: 0,
    threshold: 80,
    isPromotionReady: false,
  },
};

export const InProgress: Story = {
  args: {
    roleName: "Backend Developer",
    seniorityLevel: 3,
    readinessPct: 42,
    threshold: 80,
    isPromotionReady: false,
  },
};

export const AtThreshold: Story = {
  args: {
    roleName: "Backend Developer",
    seniorityLevel: 3,
    readinessPct: 80,
    threshold: 80,
    isPromotionReady: true,
  },
};

export const FullyReady: Story = {
  args: {
    roleName: "Senior Consultant",
    seniorityLevel: 4,
    readinessPct: 100,
    threshold: 80,
    isPromotionReady: true,
  },
};
