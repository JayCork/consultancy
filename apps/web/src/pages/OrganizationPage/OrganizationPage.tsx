import { createResource, createSignal, Show } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";
import { useAuthGuard } from "../../lib/use-auth-guard";
import { Button, Container } from "@consultancy/ui";
import { Shell } from "../../Shell";
import styles from "./EvidenceReview.module.css";

const API = import.meta.env.VITE_API_URL;

const SECTOR_LABELS: Record<string, string> = {
  central_government: "Central Government",
  defence: "Defence",
  health: "Health",
  justice: "Justice",
  transport: "Transport",
  local_government: "Local Government",
  education: "Education",
  commercial: "Commercial",
};

const STAR_SECTIONS = [
  { key: "situation", label: "Situation" },
  { key: "task", label: "Task" },
  { key: "action", label: "Action" },
  { key: "result", label: "Result" },
] as const;

function workingDaysSince(createdAt: string): number {
  const start = new Date(createdAt);
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(0, 0, 0, 0);
  let count = 0;
  const current = new Date(start);
  while (current < end) {
    current.setDate(current.getDate() + 1);
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
  }
  return count;
}

function isOverdue(createdAt: string): boolean {
  return workingDaysSince(createdAt) > 2;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function EvidenceReview() {
  useAuthGuard();
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [orgSkills] = createResource(
    () => params.id,
    async (id) => {
      const res = await fetch(`${API}/api/v0/skills/${id}`, {
        credentials: "include",
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    },
  );

  return (
    <Shell>
      <Container>
        <h1>Organization Settings</h1>
        <div>
          <h2>Skills</h2>
        </div>
      </Container>
    </Shell>
  );
}
