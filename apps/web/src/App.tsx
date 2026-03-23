import { Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useSession } from "./lib/auth-client";
import { Button, Container, ProgressTracker } from "@consultancy/ui";
import { Shell } from "./Shell";
import { EvidenceStats } from "./components/EvidenceStats";

export function App() {
  const session = useSession();
  const navigate = useNavigate();

  return (
    <Show
      when={session()?.data?.user}
      fallback={<>{navigate("/sign-in", { replace: true })}</>}
    >
      <Shell>
        <Container>
          <h2>Welcome back, {session()?.data?.user?.name}</h2>
          <ProgressTracker percentComplete={0} />
          <EvidenceStats />
          <p>
            Log evidence of your work to build your SFIA profile and track your
            career progression.
          </p>
          <Button
            label="Add Evidence"
            onClick={() => navigate("/evidence/add")}
          />
        </Container>
      </Shell>
    </Show>
  );
}
