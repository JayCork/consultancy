import { createResource, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useSession } from "../lib/auth-client";
import {
  EvidenceStats as EvidenceStatsUI,
  type EvidenceStatCounts,
} from "@consultancy/ui";

const API = import.meta.env.VITE_API_URL;

export function EvidenceStats() {
  const session = useSession();
  const navigate = useNavigate();

  const userId = () => session()?.data?.user?.id;

  const [counts] = createResource(userId, async (id) => {
    if (!id) return null;
    const res = await fetch(`${API}/api/v0/evidence/stats`, {
      credentials: "include",
    });
    const json = await res.json();
    if (!json.ok) return null;
    return json.data as EvidenceStatCounts;
  });

  return (
    <Show when={!counts.loading && counts()}>
      {(c) => (
        <EvidenceStatsUI
          counts={c()}
          onSubmitDrafts={() => navigate("/evidence")}
        />
      )}
    </Show>
  );
}
