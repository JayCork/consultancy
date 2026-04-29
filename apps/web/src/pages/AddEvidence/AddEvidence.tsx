import { createResource } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useSession } from "../../lib/auth-client";
import { useAuthGuard } from "../../lib/use-auth-guard";
import { Container, EvidenceAdd } from "@consultancy/ui";
import type { EvidenceFormData } from "@consultancy/ui";
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

export function AddEvidence() {
  useAuthGuard();
  const session = useSession();
  const navigate = useNavigate();

  const [projects] = createResource(fetchProjects);
  const [skills] = createResource(fetchSkills);

  const handleSubmit = async (data: EvidenceFormData) => {
    const userId = session()?.data?.user?.id;
    if (!userId) throw new Error("No active session — please sign in again.");

    const res = await fetch(`${API}/api/v0/evidence`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        situation: data.situation,
        task: data.task,
        action: data.action,
        result: data.result,
        project_id: data.projectId || null,
        data_classification: data.classification || "official",
        main_skill_id: data.mainSkillId || null,
        level_claimed: data.levelClaimed || null,
        tag_ids: data.tagIds,
      }),
    });

    const json = await res.json();
    if (!json.ok) throw new Error(json.error ?? "Submission failed.");

    navigate("/evidence");
  };

  return (
    <Shell>
      <Container>
        <EvidenceAdd
          projects={projects() ?? []}
          skills={skills() ?? []}
          classifications={CLASSIFICATION_OPTIONS}
          tags={[]}
          onSubmit={handleSubmit}
        />
      </Container>
    </Shell>
  );
}
