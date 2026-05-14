import { createResource, For, Show } from "solid-js";
import { Container } from "@consultancy/ui";
import { Shell } from "../../Shell";
import styles from "./AdminConfig.module.css";
import { useAuthGuard } from "../../lib/use-auth-guard";

const API = import.meta.env.VITE_API_URL;

interface SkillRequirement {
  skill_name: string;
  level_number: number;
  criteria: string;
}

interface OrgConfig {
  name: string;
  promotion_threshold: number;
  endorsements_required: number;
  endorsement_routing_policy: string;
  feedback_review_required: boolean;
  region: string;
}

export function AdminConfig() {
  useAuthGuard();
  const [config] = createResource<OrgConfig | null>(async () => {
    const res = await fetch(`${API}/api/v0/admin/config`, {
      credentials: "include",
    });
    const json = await res.json();
    return json.ok ? (json.data as OrgConfig) : null;
  });

  async function fetchOrg(): Promise<OrgConfig | null> {
    const res = await fetch(`${API}/api/v0/admin/config`, {
      credentials: "include",
    });
    const json = await res.json();
    if (!json.ok) return null;
    return json.data as OrgConfig;
  }

  const [org] = createResource(fetchOrg);
  console.log(org());
  return (
    <Shell>
      <Container>
        <Show when={org.loading}>
          <p class={styles.loading}>Loading configuration…</p>
        </Show>

        <Show when={!org.loading && org()}>
          <>
            <h2>Organization: {org()?.name}</h2>
            <dl>
              <dt>Promotion threshold</dt>
              <dd>{org()?.promotion_threshold}%</dd>

              <dt>Endorsements required</dt>
              <dd>{org()?.endorsements_required}</dd>

              <dt>Endorsement routing policy</dt>
              <dd>{org()?.endorsement_routing_policy}</dd>

              <dt>Feedback review required</dt>
              <dd>{org()?.feedback_review_required ? "Yes" : "No"}</dd>

              <dt>Region</dt>
              <dd>{org()?.region}</dd>
            </dl>
          </>
        </Show>
      </Container>
    </Shell>
  );
}
