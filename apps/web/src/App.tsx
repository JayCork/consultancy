import { Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useSession } from "./lib/auth-client";
import { Button, Container } from "@consultancy/ui";
import { Shell } from "./Shell";
import { EvidenceStats } from "./components/EvidenceStats";
import { CareerProgress } from "./components/CareerProgress";

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
          <EvidenceStats />
          <CareerProgress />
          <p>
            Log evidence of your work to build your SFIA profile and track your
            career progression.
          </p>
          <Button fullWidth onClick={() => navigate("/evidence/add")}>
            Add Evidence
          </Button>
        </Container>
      </Shell>
    </Show>
  );
}
