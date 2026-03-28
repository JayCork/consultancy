import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { SkillGapList } from "./SkillGapList";

const meta: Meta<typeof SkillGapList> = {
  component: SkillGapList,
  title: "Organisms/SkillGapList",
};

export default meta;
type Story = StoryObj<typeof SkillGapList>;

export const Empty: Story = {
  args: { skills: [] },
};

export const AllPending: Story = {
  args: {
    skills: [
      { skill_name: "Requirements Analysis", level_number: 1, verified_count: 0, required_count: 3, is_ready: false },
      { skill_name: "Software Development", level_number: 1, verified_count: 1, required_count: 3, is_ready: false },
      { skill_name: "Technical Communication", level_number: 1, verified_count: 2, required_count: 3, is_ready: false },
    ],
  },
};

export const Mixed: Story = {
  args: {
    skills: [
      { skill_name: "Requirements Analysis", level_number: 1, verified_count: 3, required_count: 3, is_ready: true },
      { skill_name: "Software Development", level_number: 1, verified_count: 1, required_count: 3, is_ready: false },
      { skill_name: "Technical Communication", level_number: 2, verified_count: 3, required_count: 3, is_ready: true },
      { skill_name: "Stakeholder Management", level_number: 1, verified_count: 0, required_count: 3, is_ready: false },
    ],
  },
};

export const AllComplete: Story = {
  args: {
    skills: [
      { skill_name: "Requirements Analysis", level_number: 1, verified_count: 3, required_count: 3, is_ready: true },
      { skill_name: "Software Development", level_number: 1, verified_count: 5, required_count: 3, is_ready: true },
      { skill_name: "Technical Communication", level_number: 1, verified_count: 3, required_count: 3, is_ready: true },
    ],
  },
};
