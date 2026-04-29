import { createSignal, Show } from "solid-js";
import { Button, Select, TextArea } from "../../atoms";
import { TagPicker } from "../TagPicker/TagPicker";
import styles from "./EvidenceForm.module.css";

const LEVEL_OPTIONS = [
  { value: "", label: "Select a level" },
  { value: "associate", label: "Associate" },
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead" },
  { value: "principal", label: "Principal" },
];

export interface EvidenceFormData {
  situation: string;
  task: string;
  action: string;
  result: string;
  projectId: string;
  classification: string;
  mainSkillId: string;
  levelClaimed: string;
  tagIds: string[];
}

export interface EvidenceFormProps {
  projects: { value: string; label: string }[];
  skills: { value: string; label: string }[];
  classifications: { value: string; label: string }[];
  tags: { value: string; label: string }[];
  onSubmit: (data: EvidenceFormData) => void | Promise<void>;
}

export const EvidenceForm = (props: EvidenceFormProps) => {
  const [situation, setSituation] = createSignal("");
  const [task, setTask] = createSignal("");
  const [action, setAction] = createSignal("");
  const [result, setResult] = createSignal("");
  const [projectId, setProjectId] = createSignal("");
  const [classification, setClassification] = createSignal("");
  const [mainSkillId, setMainSkillId] = createSignal("");
  const [levelClaimed, setLevelClaimed] = createSignal("");
  const [tagIds, setTagIds] = createSignal<string[]>([]);
  const [submitting, setSubmitting] = createSignal(false);
  const [error, setError] = createSignal("");

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await props.onSubmit({
        situation: situation(),
        task: task(),
        action: action(),
        result: result(),
        projectId: projectId(),
        classification: classification(),
        mainSkillId: mainSkillId(),
        levelClaimed: levelClaimed(),
        tagIds: tagIds(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form class={styles.form} onSubmit={handleSubmit}>
      <section class={styles.section}>
        <h2 class={styles.sectionTitle}>STAR</h2>
        <div class={styles.fields}>
          <TextArea
            name="Situation"
            description="Set the scene. When did this happen, what was the context, and what challenges were present?"
            placeholder="e.g. During a critical go-live for a government client, the team discovered a data migration issue 48 hours before launch..."
            rows={5}
            required
            value={situation()}
            onInput={(e) => setSituation(e.currentTarget.value)}
          />
          <TextArea
            name="Task"
            description="What did you need to achieve or solve? What was your specific responsibility?"
            placeholder="e.g. I was tasked with diagnosing the root cause and producing a safe rollback plan that wouldn't delay the go-live..."
            rows={5}
            required
            value={task()}
            onInput={(e) => setTask(e.currentTarget.value)}
          />
          <TextArea
            name="Action"
            description="What specific steps did you take? Focus on your individual contribution, not the team's."
            placeholder="e.g. I wrote a series of idempotent SQL scripts to clean the affected records, coordinated with the test team to validate each step..."
            rows={5}
            required
            value={action()}
            onInput={(e) => setAction(e.currentTarget.value)}
          />
          <TextArea
            name="Result"
            description="What was the outcome? Quantify the impact where possible — time saved, risk reduced, feedback received."
            placeholder="e.g. The migration completed cleanly and go-live proceeded on schedule. The client lead commended the response in the project retrospective..."
            rows={5}
            required
            value={result()}
            onInput={(e) => setResult(e.currentTarget.value)}
          />
        </div>
      </section>

      <section class={styles.section}>
        <h2>Skills</h2>
        <p class={styles.sectionIntro}>
          Which skills does this evidence demonstrate? This helps your
          management team and our AI match your evidence to the right skills and
          progression criteria.
        </p>
        <div class={styles.fields}>
          <Select
            label="Main skill"
            description="Which skill is the primary focus of this evidence?"
            options={props.skills}
            onChange={(e) => {
              setMainSkillId(e.currentTarget.value);
              setLevelClaimed("");
            }}
          />
          <Show when={mainSkillId()}>
            <Select
              label="Skill level"
              description="At what level does this evidence demonstrate your skill?"
              options={LEVEL_OPTIONS}
              onChange={(e) => setLevelClaimed(e.currentTarget.value)}
            />
          </Show>
          <TagPicker
            label="Tags"
            description="Add tags to help categorise this evidence."
            options={props.tags}
            value={tagIds()}
            onChange={setTagIds}
          />
        </div>
      </section>

      <section class={styles.section}>
        <h2 class={styles.sectionTitle}>Additional context</h2>
        <p class={styles.sectionIntro}>
          This helps your management team and our AI match your evidence to the
          right skills and progression criteria.
        </p>
        <div class={styles.fields}>
          <Select
            label="Project name"
            description="Which project does this evidence relate to?"
            options={props.projects}
            onChange={(e) => setProjectId(e.currentTarget.value)}
          />
          <Select
            label="Data classification"
            description="Determine the sensitivity level of the evidence to ensure appropriate handling and sharing."
            options={props.classifications}
            onChange={(e) => setClassification(e.currentTarget.value)}
          />
        </div>
      </section>

      <Show when={error()}>
        <p role="alert">{error()}</p>
      </Show>

      <div class={styles.actions}>
        <Button type="submit" disabled={submitting()}>
          {submitting() ? "Saving..." : "Save evidence"}
        </Button>
      </div>
    </form>
  );
};
