import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { ProjectTimeline } from "./ProjectTimeline";

const meta: Meta<typeof ProjectTimeline> = {
  component: ProjectTimeline,
  title: "Organisms/ProjectTimeline",
  decorators: [
    (Story) => (
      <div style={{ padding: "2rem" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProjectTimeline>;

const months = [
  { label: "May 2026", widthPercent: 16.7 },
  { label: "Jun 2026", widthPercent: 16.7 },
  { label: "Jul 2026", widthPercent: 16.7 },
  { label: "Aug 2026", widthPercent: 16.7 },
  { label: "Sep 2026", widthPercent: 16.7 },
  { label: "Oct 2026", widthPercent: 16.5 },
];

export const Default: Story = {
  args: {
    windowLabel: "May 2026 – Oct 2026",
    months,
    onPrev: () => {},
    onNext: () => {},
    projects: [
      {
        id: "1",
        projectName: "Project Alpha",
        statusColor: "var(--color-accent)",
        leftPercent: 0,
        widthPercent: 60,
        milestones: [
          { id: "m1", name: "Contract Renewal", date: "2026-07-10", leftPercent: 36 },
        ],
      },
      {
        id: "2",
        projectName: "Project Beta",
        statusColor: "var(--color-data-3)",
        leftPercent: 20,
        widthPercent: 35,
        milestones: [],
      },
      {
        id: "3",
        projectName: "Operation Classified",
        statusColor: "var(--color-warning)",
        leftPercent: 50,
        widthPercent: 45,
        milestones: [
          { id: "m2", name: "Final Demo", date: "2026-09-15", leftPercent: 72 },
        ],
      },
      {
        id: "4",
        projectName: "Legacy Support Contract",
        statusColor: "var(--color-data-6)",
        leftPercent: 0,
        widthPercent: 100,
        milestones: [],
      },
    ],
  },
};

export const Empty: Story = {
  args: {
    windowLabel: "May 2026 – Oct 2026",
    months,
    projects: [],
    onPrev: () => {},
    onNext: () => {},
  },
};
