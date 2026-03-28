import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { EvidenceCard } from "./EvidenceCard";

const meta: Meta<typeof EvidenceCard> = {
  component: EvidenceCard,
  title: "Organisms/EvidenceCard",
};

export default meta;
type Story = StoryObj<typeof EvidenceCard>;

const baseEntry = {
  id: "1",
  skill_name: "Solution Architecture",
  level_number: 3,
  situation: "During a critical go-live for a government client, the team discovered a data migration issue 48 hours before launch.",
  task: "I was tasked with diagnosing the root cause and producing a safe rollback plan that wouldn't delay the go-live.",
  action: "I wrote a series of idempotent SQL scripts to clean the affected records, coordinated with the test team to validate each step, and produced a runbook for the operations team to execute on the day.",
  result: "The migration completed cleanly and go-live proceeded on schedule. The client lead commended the response in the project retrospective.",
  sector: "central_government",
  security_context: "official",
  project_id: "abc-123",
  created_at: new Date().toISOString(),
};

export const Draft: Story = {
  args: {
    entry: { ...baseEntry, status: "draft" },
  },
};

export const PendingReview: Story = {
  args: {
    entry: { ...baseEntry, status: "pending_verification" },
  },
};

export const Verified: Story = {
  args: {
    entry: { ...baseEntry, status: "verified" },
  },
};

export const NonProject: Story = {
  args: {
    entry: {
      ...baseEntry,
      status: "verified",
      project_id: null,
      sector: "commercial",
    },
  },
};

export const LongAction: Story = {
  args: {
    entry: {
      ...baseEntry,
      status: "pending_verification",
      action:
        "I started by running a full audit of the affected records using a set of diagnostic queries I wrote against the staging database. Once I understood the scope — around 4,200 rows with malformed foreign key references — I designed a two-phase remediation plan. Phase one was a dry-run script that logged every change without committing, which I reviewed with the lead engineer. Phase two was the live execution with transaction wrapping and row-level logging to an audit table. I then coordinated with the infrastructure team to schedule a 30-minute maintenance window at 02:00, briefed the on-call engineer on the rollback procedure, and stood up a monitoring dashboard to track record counts in real time during the migration.",
    },
  },
};
