import { createMemo, createResource, Show, createEffect } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";
import { useSession } from "../../lib/auth-client";
import { useAuthGuard } from "../../lib/use-auth-guard";
import { Container, EvidenceForm } from "@consultancy/ui";
import type {
  EvidenceFormData,
  EvidenceFormInitialData,
  EvidenceSubmitAction,
} from "@consultancy/ui";
import { Shell } from "../../Shell";

const API = import.meta.env.VITE_API_URL;

const CLASSIFICATION_OPTIONS = [
  { value: "", label: "Select a classification" },
  { value: "public", label: "Public" },
  { value: "official", label: "Official" },
  { value: "official_sensitive", label: "Official Sensitive" },
  { value: "secret", label: "Secret" },
];

type Project = { id: string; name: string };
type SuggestedEndorser = { id: string; name: string };

interface EvidenceResponse {
  id: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  project_id: string | null;
  data_classification?: string | null;
  main_skill_id?: string | null;
  level_claimed?: string | null;
  tag_ids?: string[];
  status?: string;
}

interface EndorsementResponse {
  endorser_id: string;
}

function normalizeSelectValue(value: string | null | undefined) {
  if (!value || value === "null" || value === "undefined") {
    return "";
  }
  return value;
}

async function fetchProjects(): Promise<{ value: string; label: string }[]> {
  const res = await fetch(`${API}/api/v0/projects`, { credentials: "include" });
  const json = await res.json();
  const projects: Project[] = json.data ?? [];
  return [
    { value: "", label: "Select a project" },
    ...projects.map((p) => ({ value: p.id, label: p.name })),
  ];
}

async function fetchSkills(): Promise<{ value: string; label: string }[]> {
  const res = await fetch(`${API}/api/v0/skills`, { credentials: "include" });
  const json = await res.json();
  if (!json.ok) return [{ value: "", label: "Select a skill" }];
  const skills: { id: string; name: string }[] = json.data ?? [];
  return [
    { value: "", label: "Select a skill" },
    ...skills.map((s) => ({ value: s.id, label: s.name })),
  ];
}

async function fetchSuggestedEndorsers(): Promise<SuggestedEndorser[]> {
  const res = await fetch(`${API}/api/v0/endorsements/suggested`, {
    credentials: "include",
  });
  const json = await res.json();
  if (!json.ok) return [];
  return json.data ?? [];
}

export function AddEvidence() {
  useAuthGuard();
  const session = useSession();
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();

  const evidenceId = () => params.id;
  const isEditMode = () => !!evidenceId();

  const [projects] = createResource(fetchProjects);
  const [skills] = createResource(fetchSkills);
  const [suggestedEndorsers] = createResource(fetchSuggestedEndorsers);

  const [draftEvidence] = createResource(evidenceId, async (id) => {
    if (!id) return null;
    const res = await fetch(`${API}/api/v0/evidence/${id}`, {
      credentials: "include",
    });

    const json = await res.json();
    if (!json.ok) {
      throw new Error(json.error ?? "Failed to load evidence.");
    }

    return (json.data ?? null) as EvidenceResponse | null;
  });

  const [existingEndorserIds] = createResource(evidenceId, async (id) => {
    if (!id) return [];

    const res = await fetch(`${API}/api/v0/endorsements/evidence/${id}`, {
      credentials: "include",
    });

    const json = await res.json();
    if (!json.ok) {
      throw new Error(json.error ?? "Failed to load endorsers.");
    }

    const endorsements = (json.data ?? []) as EndorsementResponse[];
    return endorsements.map((endorsement) => endorsement.endorser_id);
  });

  const initialData = createMemo<EvidenceFormInitialData | undefined>(() => {
    if (!isEditMode()) return undefined;
    const evidence = draftEvidence();
    if (!evidence) return undefined;

    return {
      situation: evidence.situation,
      task: evidence.task,
      action: evidence.action,
      result: evidence.result,
      projectId: normalizeSelectValue(evidence.project_id),
      dataClassification:
        normalizeSelectValue(evidence.data_classification) || "official",
      mainSkillId: normalizeSelectValue(evidence.main_skill_id),
      levelClaimed: normalizeSelectValue(evidence.level_claimed),
      tagIds: evidence.tag_ids ?? [],
      endorsers: existingEndorserIds() ?? [],
    };
  });

  const evidenceStatus = createMemo(() => draftEvidence()?.status ?? null);

  // Verified evidence is immutable — redirect away rather than showing a broken form.
  createEffect(() => {
    if (isEditMode() && evidenceStatus() === "verified") {
      navigate("/evidence");
    }
  });

  const isFormLoading = createMemo(
    () =>
      projects.loading ||
      skills.loading ||
      suggestedEndorsers.loading ||
      (isEditMode() && (draftEvidence.loading || existingEndorserIds.loading)),
  );

  const handleSubmit = async (
    data: EvidenceFormData,
    action: EvidenceSubmitAction,
  ) => {
    const userId = session()?.data?.user?.id;
    if (!userId) throw new Error("No active session — please sign in again.");

    const id = evidenceId();
    const isEdit = !!id;
    const endpoint = isEdit
      ? `${API}/api/v0/evidence/${id}`
      : `${API}/api/v0/evidence`;

    const res = await fetch(endpoint, {
      method: isEdit ? "PATCH" : "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        situation: data.situation,
        task: data.task,
        action: data.action,
        result: data.result,
        project_id: data.projectId || null,
        data_classification: data.dataClassification || "official",
        // For submitted evidence the API always creates a new submitted version;
        // for draft/new evidence the action controls whether to save or submit.
        ...(evidenceStatus() !== "submitted" && {
          status: action === "submit" ? "submitted" : "draft",
        }),
        main_skill_id: data.mainSkillId || null,
        level_claimed: data.levelClaimed || null,
        tag_ids: data.tagIds,
        endorser_ids: data.endorsers,
      }),
    });

    const json = await res.json();
    if (!json.ok) throw new Error(json.error ?? "Submission failed.");

    navigate("/evidence");
  };

  return (
    <Shell>
      <Container>
        <Show when={!isFormLoading()} fallback={<p>Loading evidence…</p>}>
          <Show
            when={!isEditMode() || !!draftEvidence()}
            fallback={<p role="alert">Unable to load this draft evidence.</p>}
          >
            <Show
              when={evidenceStatus() === "submitted"}
              fallback={
                <>
                  <h1>{isEditMode() ? "Edit Draft" : "Record Evidence"}</h1>
                  <p>
                    {isEditMode()
                      ? "Update your draft using the STAR method before submitting it for review."
                      : "Record a piece of evidence using the STAR method. Be specific, the more detail you provide, the more useful it is for your progression reviews."}
                  </p>
                </>
              }
            >
              <h1>Revise Evidence</h1>
              <p>
                This evidence has been submitted for review. Your changes will
                be saved as a new version — the previous version is preserved
                for audit purposes.
              </p>
            </Show>
            <EvidenceForm
              submitLabel={
                evidenceStatus() === "submitted"
                  ? "Resubmit with changes"
                  : "Submit for review"
              }
              saveDraftLabel={
                evidenceStatus() !== "submitted" ? "Save draft" : undefined
              }
              initialData={initialData()}
              projects={projects() ?? []}
              skills={skills() ?? []}
              dataClassifications={CLASSIFICATION_OPTIONS}
              tags={[]}
              suggested_endorsers={suggestedEndorsers() ?? []}
              onSubmit={handleSubmit}
            />
          </Show>
        </Show>
      </Container>
    </Shell>
  );
}
