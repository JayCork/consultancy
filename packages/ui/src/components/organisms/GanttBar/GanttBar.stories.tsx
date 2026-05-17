import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { GanttBar } from "./GanttBar";

const meta: Meta<typeof GanttBar> = {
  component: GanttBar,
  title: "Organisms/GanttBar",
  decorators: [
    (Story) => (
      <div style={{ padding: "2rem", width: "600px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GanttBar>;

export const Default: Story = {
  args: {
    projectName: "Project Alpha",
    statusColor: "var(--color-accent)",
    leftPercent: 10,
    widthPercent: 50,
    milestones: [
      {
        id: "1",
        name: "Contract Renewal",
        date: "2026-07-15",
        leftPercent: 30,
      },
      { id: "2", name: "Final Demo", date: "2026-09-01", leftPercent: 55 },
    ],
  },
};

export const Classified: Story = {
  args: {
    projectName: "Operation Midnight",
    statusColor: "var(--color-data-3)",
    leftPercent: 5,
    widthPercent: 80,
    milestones: [],
  },
};

export const Short: Story = {
  args: {
    projectName: "Sprint Kickoff",
    statusColor: "var(--color-warning)",
    leftPercent: 40,
    widthPercent: 3,
    milestones: [],
  },
};
