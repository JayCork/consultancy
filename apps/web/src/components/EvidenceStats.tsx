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
    const res = await fetch(`${API}/api/v0/evidence`, {
      credentials: "include",
    });
    const json = await res.json();
    const entries = (json.data ?? []) as { status: string }[];
    return entries.reduce(
      (acc, e) => {
        acc.total++;
        if (e.status === "draft") acc.draft++;
        else if (e.status === "pending_verification")
          acc.pending_verification++;
        else if (e.status === "verified") acc.verified++;
        return acc;
      },
      {
        total: 0,
        draft: 0,
        pending_verification: 0,
        verified: 0,
      } as EvidenceStatCounts,
    );
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
