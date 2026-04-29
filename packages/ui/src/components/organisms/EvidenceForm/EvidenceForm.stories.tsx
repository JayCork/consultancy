import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { EvidenceForm } from "./EvidenceForm";

const meta: Meta<typeof EvidenceForm> = {
  component: EvidenceForm,
  title: "Organisms/EvidenceForm",
};

export default meta;
type Story = StoryObj<typeof EvidenceForm>;

const mockProjects = [
  { value: "project-alpha", label: "Project Alpha" },
  { value: "project-beta", label: "Project Beta" },
  { value: "project-gamma", label: "Project Gamma" },
];

const mockClassifications = [
  { value: "official", label: "Official" },
  { value: "official_sensitive", label: "Official Sensitive" },
  { value: "secret", label: "Secret" },
];

const mockSkills = [
  { value: "communication", label: "Communication" },
  { value: "problem-solving", label: "Problem Solving" },
  { value: "leadership", label: "Leadership" },
];

const mockTags = [
  { value: "tag1", label: "Tag 1" },
  { value: "tag2", label: "Tag 2" },
  { value: "tag3", label: "Tag 3" },
];

export const Default: Story = {
  args: {
    projects: mockProjects,
    classifications: mockClassifications,
    skills: mockSkills,
    tags: mockTags,
    onSubmit: async (data) => {
      console.log("Form submitted:", data);
    },
  },
};
