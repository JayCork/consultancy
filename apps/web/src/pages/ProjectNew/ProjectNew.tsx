import { createResource, createSignal, Show } from "solid-js";
import { useAuthGuard } from "../../lib/use-auth-guard";
import { Shell } from "../../Shell";
import { Container, InputField, Select } from "@consultancy/ui";
import type {
  TimelineProject,
  TimelineMonth,
  TextField,
} from "@consultancy/ui";
import styles from "./ProjectNew.module.css";

export function ProjectNewPage() {
  const [name, setName] = createSignal("");
  const [shortName, setShortName] = createSignal("");
  const [codeName, setCodeName] = createSignal("");
  const [isNameClassified, setIsNameClassified] = createSignal(false);
  const [minimumClearanceId, setMinimumClearanceId] = createSignal("");
  const [startDate, setStartDate] = createSignal("");
  const [endDate, setEndDate] = createSignal("");
  const [status, setStatus] = createSignal("");

  useAuthGuard();

  return (
    <Shell>
      <Container>
        <div class={styles.header}>
          <h2 class={styles.heading}>New Project</h2>
        </div>

        <form>
          <InputField
            label="Project name"
            id="name"
            type="text"
            value={name()}
            onInput={(e) => setName(e.target.value)}
            required
          />
          <InputField
            label="Short name"
            id="shortName"
            type="text"
            value={shortName()}
            onInput={(e) => setShortName(e.target.value)}
            description={
              "Used in places where space is limited, e.g. the timeline. Optional - if not provided, the full name will be used."
            }
          />
          {/* code name */}
          <InputField
            label="Code name"
            id="codeName"
            type="text"
            value={codeName()}
            onInput={(e) => setCodeName(e.target.value)}
            description={
              "Used for internal reference. Optional - if not provided, the full name will be used."
            }
          />

          {/* is_name_classified */}
          <InputField
            label="Is name classified?"
            id="isNameClassified"
            type="checkbox"
            checked={isNameClassified()}
            onChange={(e) => setIsNameClassified(e.target.checked)}
          />

          {/*  minimum_clearnce_id */}
          <Select
            label="Minimum clearance ID"
            id="minimumClearanceId"
            value={minimumClearanceId()}
            onInput={(e) => setMinimumClearanceId(e.target.value)}
            options={[
              { label: "None", value: "" },
              { label: "Confidential", value: "confidential-id" },
              { label: "Secret", value: "secret-id" },
              { label: "Top Secret", value: "top-secret-id" },
            ]}
            description={
              "The minimum clearance level required to view this project. Optional - if not provided, the project will be visible to all clearance levels."
            }
          />
          <div class={styles.flexRow}>
            <InputField
              label="Start date"
              id="startDate"
              type="date"
              value={startDate()}
              onInput={(e) => setStartDate(e.target.value)}
              autocomplete="today"
            />

            <InputField
              label="End date"
              id="endDate"
              type="date"
              value={endDate()}
              onInput={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* status */}
          <Select
            label="Status"
            id="status"
            // TODO: use real status options once we have the API for them, and handle the enum values properly instead of just using the display strings
            options={[
              { label: "Planned", value: "1" },
              { label: "In Progress", value: "2" },
              { label: "Completed", value: "3" },
            ]}
            value={status()}
            onChange={(e) => setStatus(e.target.value)}
          />

          <button type="submit" class={styles.todayBtn}>
            Create Project
          </button>
        </form>
      </Container>
    </Shell>
  );
}
