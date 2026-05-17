import { createResource, createSignal, Show, createEffect, on } from "solid-js";
import { useAuthGuard } from "../../lib/use-auth-guard";
import { Shell } from "../../Shell";
import { Container, InputField, Select } from "@consultancy/ui";
import styles from "./ProjectNew.module.css";

const API = import.meta.env.VITE_API_URL;

const fetchUsers = async () => {
  const res = await fetch(`${API}/api/v0/users`, { credentials: "include" });
  const json = await res.json();
  const users = json.data.map((user: { id: string; name: string }) => ({
    label: user.name,
    value: user.id,
  }));
  return [{ label: "Select a user", value: "" }, ...users];
};

const fetchOrganizationUnits = async () => {
  const res = await fetch(`${API}/api/v0/organization-units`, {
    credentials: "include",
  });
  const json = await res.json();
  const units = json.data.map((unit: { id: string; name: string }) => ({
    label: unit.name,
    value: unit.id,
  }));
  return [{ label: "Select an organisational unit", value: "" }, ...units];
};

const fetchEnums = async () => {
  const res = await fetch(`${API}/api/v0/projects/enums`, {
    credentials: "include",
  });
  const json = await res.json();
  return json.data as {
    status: string[];
    fundingModel: string[];
    region: string[];
  };
};

const fetchClearanceLevels = async () => {
  const res = await fetch(`${API}/api/v0/projects/clearance-levels`, {
    credentials: "include",
  });
  const json = await res.json();
  return json.data as { id: string; name: string }[];
};

const toLabel = (value: string) =>
  value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export function ProjectNewPage() {
  const [name, setName] = createSignal("");
  const [shortName, setShortName] = createSignal("");
  const [codeName, setCodeName] = createSignal("");
  const [codeNameError, setCodeNameError] = createSignal("");
  const [projectLeadId, setProjectLeadId] = createSignal("");
  const [organizationUnitId, setOrganizationUnitId] = createSignal("");
  const [minimumClearanceId, setMinimumClearanceId] = createSignal("");
  const [fundingModel, setFundingModel] = createSignal("");
  const [contractedValue, setContractedValue] = createSignal("");
  const [currency, setCurrency] = createSignal("GBP");
  const [startDate, setStartDate] = createSignal("");
  const [endDate, setEndDate] = createSignal("");
  const [endDateError, setEndDateError] = createSignal("");
  const [status, setStatus] = createSignal("");
  const [region, setRegion] = createSignal("GBR");
  const [submitting, setSubmitting] = createSignal(false);
  const [submitError, setSubmitError] = createSignal("");

  useAuthGuard();

  const [users] = createResource(fetchUsers);
  const [organizationUnits] = createResource(fetchOrganizationUnits);
  const [enums] = createResource(fetchEnums);
  const [clearanceLevels] = createResource(fetchClearanceLevels);

  const statusOptions = () => {
    const values = enums()?.status ?? [];
    return [
      { label: "Select a status", value: "" },
      ...values.map((v) => ({ label: toLabel(v), value: v })),
    ];
  };

  const fundingModelOptions = () => {
    const values = enums()?.fundingModel ?? [];
    return [
      { label: "Select a funding model", value: "" },
      ...values.map((v) => ({ label: toLabel(v), value: v })),
    ];
  };

  const regionOptions = () => {
    const values = enums()?.region ?? [];
    return values.map((v) => ({ label: v, value: v }));
  };

  const clearanceOptions = () => {
    const levels = clearanceLevels() ?? [];
    return [
      { label: "None", value: "" },
      ...levels.map((l) => ({ label: l.name, value: l.id })),
    ];
  };

  // Validate end date is not before start date
  createEffect(
    on([startDate, endDate], ([start, end]) => {
      if (start && end && new Date(end) < new Date(start)) {
        setEndDateError("End date cannot be before start date");
      } else {
        setEndDateError("");
      }
    }),
  );

  // Check code name uniqueness (debounced)
  let codeNameTimer: ReturnType<typeof setTimeout> | undefined;
  createEffect(
    on(codeName, (code) => {
      clearTimeout(codeNameTimer);
      setCodeNameError("");
      if (!code) return;
      codeNameTimer = setTimeout(async () => {
        const res = await fetch(
          `${API}/api/v0/projects/check-code-name?code=${encodeURIComponent(code)}`,
          { credentials: "include" },
        );
        const json = await res.json();
        if (json.data?.taken) {
          setCodeNameError("This code name is already in use");
        }
      }, 400);
    }),
  );

  const normaliseDate = (dateStr: string) => {
    if (!dateStr) return undefined;
    // Always use start of day in local time, serialised as ISO date-only
    return `${dateStr}T00:00:00`;
  };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    if (endDateError() || codeNameError()) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch(`${API}/api/v0/projects`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name().trim(),
          shortName: shortName().trim() || null,
          codeName: codeName().trim() || null,
          leadId: projectLeadId(),
          organizationUnitId: organizationUnitId(),
          minimumClearanceId: minimumClearanceId() || null,
          fundingModel: fundingModel(),
          contractedValue: contractedValue() ? Number(contractedValue()) : null,
          currency: currency(),
          startDate: normaliseDate(startDate()),
          endDate: normaliseDate(endDate()),
          status: status(),
          region: region(),
        }),
      });
      const json = await res.json();
      if (!json.ok) {
        setSubmitError(json.error ?? "Failed to create project");
      } else {
        // TODO: navigate to the new project page once routing is set up
        window.location.href = "/";
      }
    } catch {
      setSubmitError("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Shell>
      <Container>
        <div class={styles.header}>
          <h2 class={styles.heading}>New Project</h2>
        </div>

        <form onSubmit={handleSubmit} novalidate>
          <fieldset>
            <legend>Project Name</legend>
            <p class={styles.description}>
              The name of the project as displayed to users. It should be
              descriptive and unique within your organisation.
            </p>
            <InputField
              label="Project name"
              id="name"
              type="text"
              value={name()}
              onInput={(e) => setName(e.target.value)}
              onBlur={(e) => setName(e.target.value.trim())}
              required
            />
            <InputField
              label="Short name"
              id="shortName"
              type="text"
              value={shortName()}
              onInput={(e) => setShortName(e.target.value)}
              onBlur={(e) => setShortName(e.target.value.trim())}
              description="Used in space-limited views like the timeline. Falls back to the full name if omitted."
            />
            <InputField
              label="Code name"
              id="codeName"
              type="text"
              maxlength={8}
              value={codeName()}
              onInput={(e) => setCodeName(e.target.value)}
              onBlur={(e) => setCodeName(e.target.value.trim())}
              description="Up to 8 characters. Must be unique within your organisation."
              errorMessage={codeNameError()}
            />
          </fieldset>

          <fieldset>
            <legend>People</legend>
            <Show when={!users.loading} fallback={<p>Loading users…</p>}>
              <Select
                label="Project lead"
                id="leadId"
                value={projectLeadId()}
                onChange={(e) => setProjectLeadId(e.currentTarget.value)}
                options={users() ?? []}
                required
              />
            </Show>
            <Show
              when={!organizationUnits.loading}
              fallback={<p>Loading organisational units…</p>}
            >
              <Select
                label="Organisational unit"
                id="organizationUnitId"
                value={organizationUnitId()}
                onChange={(e) => setOrganizationUnitId(e.currentTarget.value)}
                options={organizationUnits() ?? []}
                required
              />
            </Show>
          </fieldset>

          <fieldset>
            <legend>Project Dates</legend>
            <p class={styles.description}>
              Start and end dates for the project. Historic dates are permitted.
              The end date must not be before the start date.
            </p>
            <div class={styles.flexRow}>
              <InputField
                label="Start date"
                id="startDate"
                type="date"
                value={startDate()}
                onInput={(e) => setStartDate(e.target.value)}
                required
              />
              <InputField
                label="End date"
                id="endDate"
                type="date"
                value={endDate()}
                onInput={(e) => setEndDate(e.target.value)}
                errorMessage={endDateError()}
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>Budget</legend>
            <p class={styles.description}>
              The contracted value and currency of the project. Optional — no
              budget information is shown if omitted.
            </p>
            <div class={styles.flexRow}>
              <InputField
                label="Contracted value"
                id="contractedValue"
                type="number"
                step="1000"
                min="0"
                startAdornment="£"
                placeholder="0.00"
                value={contractedValue()}
                onInput={(e) => setContractedValue(e.target.value)}
              />
              <Select
                label="Currency"
                id="currency"
                value={currency()}
                onChange={(e) => setCurrency(e.currentTarget.value)}
                options={[
                  { label: "GBP", value: "GBP" },
                  { label: "USD", value: "USD" },
                  { label: "EUR", value: "EUR" },
                ]}
              />
            </div>
            <Show
              when={!enums.loading}
              fallback={<p>Loading funding models…</p>}
            >
              <Select
                label="Funding model"
                id="fundingModel"
                value={fundingModel()}
                onChange={(e) => setFundingModel(e.currentTarget.value)}
                options={fundingModelOptions()}
                required
              />
            </Show>
          </fieldset>

          <fieldset>
            <legend>Status &amp; Classification</legend>
            <Show when={!enums.loading} fallback={<p>Loading statuses…</p>}>
              <Select
                label="Status"
                id="status"
                value={status()}
                onChange={(e) => setStatus(e.currentTarget.value)}
                options={statusOptions()}
                required
              />
            </Show>
            <Show when={!enums.loading} fallback={<p>Loading regions…</p>}>
              <Select
                label="Region"
                id="region"
                value={region()}
                onChange={(e) => setRegion(e.currentTarget.value)}
                options={regionOptions()}
                required
              />
            </Show>
            <Show
              when={!clearanceLevels.loading}
              fallback={<p>Loading clearance levels…</p>}
            >
              <Select
                label="Minimum clearance level"
                id="minimumClearanceId"
                value={minimumClearanceId()}
                onChange={(e) => setMinimumClearanceId(e.currentTarget.value)}
                options={clearanceOptions()}
                description="The minimum clearance required to view this project. Leave as None to make it visible to all clearance levels."
              />
            </Show>
          </fieldset>

          <Show when={submitError()}>
            <p class={styles.submitError}>{submitError()}</p>
          </Show>

          <button
            type="submit"
            class={styles.submitBtn}
            disabled={submitting() || !!endDateError() || !!codeNameError()}
          >
            {submitting() ? "Creating…" : "Create Project"}
          </button>
        </form>
      </Container>
    </Shell>
  );
}
