import { createResource, createEffect, Show } from "solid-js";
import { useSession } from "../lib/auth-client";
import { ReadinessCard, SkillGapList, type SkillEntry } from "@consultancy/ui";

const API = import.meta.env.VITE_API_URL;

interface ReadinessResponse {
  role: { name: string; seniority_level: number } | null;
  readiness_pct: number;
  promotion_readiness_threshold: number;
  is_promotion_ready: boolean;
  required_skills: SkillEntry[];
}

export function CareerProgress() {
  const session = useSession();
  const userId = () => session()?.data?.user?.id;

  const [data] = createResource(userId, async (id) => {
    if (!id) return null;
    const res = await fetch(`${API}/api/v0/readiness?userId=${id}`);
    const json = await res.json();
    return json.data as ReadinessResponse;
  });

  createEffect(() => console.log("Readiness data:", data()));

  return (
    <Show when={!data.loading && data()?.role != null && data()}>
      {(d) => (
        <>
          <ReadinessCard
            roleName={d().role!.name}
            seniorityLevel={d().role!.seniority_level}
            readinessPct={d().readiness_pct}
            threshold={d().promotion_readiness_threshold}
            isPromotionReady={d().is_promotion_ready}
          />
          <SkillGapList skills={d().required_skills} />
        </>
      )}
    </Show>
  );
}
