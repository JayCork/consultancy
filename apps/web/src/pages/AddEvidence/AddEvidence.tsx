import { createSignal, createResource, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useSession } from "../../lib/auth-client";
import { TextArea, Select, Button, Container } from "@consultancy/ui";
import { Shell } from "../../Shell";

const API = import.meta.env.VITE_API_URL;

const NON_PROJECT_VALUE = "non-project";

const SECTOR_OPTIONS = [
  { value: "", label: "Select a sector" },
  { value: "central_government", label: "Central Government" },
  { value: "defence", label: "Defence" },
  { value: "health", label: "Health" },
  { value: "justice", label: "Justice" },
  { value: "transport", label: "Transport" },
  { value: "local_government", label: "Local Government" },
  { value: "education", label: "Education" },
  { value: "commercial", label: "Commercial" },
];

const SECURITY_CONTEXT_OPTIONS = [
  { value: "", label: "Select security context" },
  { value: "public_facing", label: "Public Facing" },
  { value: "official", label: "Official" },
  { value: "official_sensitive", label: "Official Sensitive" },
  { value: "high_side_sc", label: "High Side (SC)" },
  { value: "high_side_dv", label: "High Side (DV)" },
];

type Project = { id: string; name: string; sector: string };

async function fetchProjects() {
  const res = await fetch(`${API}/api/v0/projects`);
  const json = await res.json();
  return json.data as Project[];
}

async function fetchSkills() {
  const res = await fetch(`${API}/api/v0/skills`);
  const json = await res.json();
  return json.data as { id: string; name: string }[];
}

async function fetchSkillLevels(skillId: string) {
  const res = await fetch(`${API}/api/v0/skills/${skillId}/levels`);
  const json = await res.json();
  return json.data as { id: string; level_number: number; criteria: string }[];
}

export function AddEvidence() {
  const session = useSession();
  const navigate = useNavigate();

  const [situation, setSituation] = createSignal("");
  const [task, setTask] = createSignal("");
  const [action, setAction] = createSignal("");
  const [result, setResult] = createSignal("");
  const [projectId, setProjectId] = createSignal("");
  const [inferredSector, setInferredSector] = createSignal("");
  const [skillId, setSkillId] = createSignal("");
  const [levelId, setLevelId] = createSignal("");
  const [manualSector, setManualSector] = createSignal("");
  const [securityContext, setSecurityContext] = createSignal("");
  const [error, setError] = createSignal("");
  const [submitting, setSubmitting] = createSignal(false);

  const [projects] = createResource(fetchProjects);
  const [skills] = createResource(fetchSkills);
  const [levels] = createResource(skillId, (id) =>
    id ? fetchSkillLevels(id) : Promise.resolve([]),
  );

  const isNonProject = () => projectId() === NON_PROJECT_VALUE;
  const effectiveSector = () =>
    isNonProject() ? manualSector() : inferredSector();

  const handleProjectChange = (e: Event) => {
    const id = (e.target as HTMLSelectElement).value;
    setProjectId(id);
    if (id === NON_PROJECT_VALUE || id === "") {
      setInferredSector("");
    } else {
      const project = projects()?.find((p) => p.id === id);
      setInferredSector(project?.sector ?? "");
    }
  };

  const handleSkillChange = (e: Event) => {
    const id = (e.target as HTMLSelectElement).value;
    setSkillId(id);
    setLevelId("");
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError("");

    const userId = session()?.data?.user?.id;
    if (!userId) {
      setError("No active session — please sign in again.");
      return;
    }

    if (
      !situation() ||
      !task() ||
      !action() ||
      !result() ||
      !projectId() ||
      !skillId() ||
      !levelId() ||
      !effectiveSector() ||
      !securityContext()
    ) {
      setError("Please complete all fields before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/v0/evidence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author_id: userId,
          situation: situation(),
          task: task(),
          action: action(),
          result: result(),
          project_id: isNonProject() ? null : projectId(),
          skill_id: skillId(),
          level_id: levelId(),
          sector: effectiveSector(),
          security_context: securityContext(),
        }),
      });

      const json = await res.json();
      if (!json.ok) {
        setError(json.error ?? "Submission failed.");
        return;
      }

      navigate("/evidence");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Shell>
      <Container>
        <h2>Add Evidence</h2>
        <p>
          Record a piece of evidence using the STAR method. Be specific — the
          more detail you provide, the more useful it is for your progression
          reviews.
        </p>

        <form onSubmit={handleSubmit}>
          <h3>Your story</h3>

          <TextArea
            name="Situation"
            description="Set the scene. When did this happen, what was the context, and what challenges were present?"
            placeholder="e.g. During a critical go-live for a government client, the team discovered a data migration issue 48 hours before launch..."
            rows={5}
            value={situation()}
            onInput={(e) =>
              setSituation((e.target as HTMLTextAreaElement).value)
            }
            required
          />

          <TextArea
            name="Task"
            description="What did you need to achieve or solve? What was your specific responsibility?"
            placeholder="e.g. I was tasked with diagnosing the root cause and producing a safe rollback plan that wouldn't delay the go-live..."
            rows={5}
            value={task()}
            onInput={(e) => setTask((e.target as HTMLTextAreaElement).value)}
            required
          />

          <TextArea
            name="Action"
            description="What specific steps did you take? Focus on your individual contribution, not the team's."
            placeholder="e.g. I wrote a series of idempotent SQL scripts to clean the affected records, coordinated with the test team to validate each step..."
            rows={5}
            value={action()}
            onInput={(e) => setAction((e.target as HTMLTextAreaElement).value)}
            required
          />

          <TextArea
            name="Result"
            description="What was the outcome? Quantify the impact where possible — time saved, risk reduced, feedback received."
            placeholder="e.g. The migration completed cleanly and go-live proceeded on schedule. The client lead commended the response in the project retrospective..."
            rows={5}
            value={result()}
            onInput={(e) => setResult((e.target as HTMLTextAreaElement).value)}
            required
          />

          <h3>Additional context</h3>
          <p>
            This helps your management team and our AI match your evidence to
            the right skills and progression criteria.
          </p>

          <Show when={!projects.loading} fallback={<p>Loading projects…</p>}>
            <Select
              id="project"
              label="Project"
              description="Which project does this evidence relate to? Sector is inferred automatically from the project."
              options={[
                { value: "", label: "Select a project" },
                { value: NON_PROJECT_VALUE, label: "Non-project work" },
                ...(projects()?.map((p) => ({
                  value: p.id,
                  label: p.name,
                })) ?? []),
              ]}
              onChange={handleProjectChange}
              required
            />
          </Show>

          <Show when={isNonProject()}>
            <Select
              id="sector"
              label="Sector"
              description="Which sector was this work delivered in?"
              options={SECTOR_OPTIONS}
              onChange={(e) =>
                setManualSector((e.target as HTMLSelectElement).value)
              }
              required
            />
          </Show>

          <Show when={!skills.loading} fallback={<p>Loading skills…</p>}>
            <Select
              id="skill"
              label="Skill"
              description="Which skill does this evidence demonstrate?"
              options={[
                { value: "", label: "Select a skill" },
                ...(skills()?.map((s) => ({
                  value: s.id,
                  label: s.name,
                })) ?? []),
              ]}
              onChange={handleSkillChange}
              required
            />
          </Show>

          <Select
            id="level"
            label="Skill Level"
            description="Which level of this skill does your evidence best demonstrate?"
            options={[
              {
                value: "",
                label: skillId() ? "Select a level" : "Select a skill first",
              },
              ...(levels()?.map((l) => ({
                value: l.id,
                label: `Level ${l.level_number} — ${l.criteria.slice(0, 60)}${l.criteria.length > 60 ? "…" : ""}`,
              })) ?? []),
            ]}
            disabled={!skillId()}
            onChange={(e) => setLevelId((e.target as HTMLSelectElement).value)}
            required
          />

          <Select
            id="security-context"
            label="Security Context"
            description="What was the security classification of the environment you were working in?"
            options={SECURITY_CONTEXT_OPTIONS}
            onChange={(e) =>
              setSecurityContext((e.target as HTMLSelectElement).value)
            }
            required
          />

          <Show when={error()}>
            <p role="alert">{error()}</p>
          </Show>

          <div>
            <Button type="button" onClick={() => navigate("/")}>
              Cancel
            </Button>

            <Button type="submit" disabled={submitting()}>
              {submitting() ? "Submitting…" : "Submit Evidence"}
            </Button>
          </div>
        </form>
      </Container>
    </Shell>
  );
}
