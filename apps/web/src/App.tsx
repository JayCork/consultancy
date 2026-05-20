import { Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Button, Container } from "@consultancy/ui";
import { Shell } from "./Shell";
import { EvidenceStats } from "./components/EvidenceStats";
import { CareerProgress } from "./components/CareerProgress";
import { MyClearancePanel } from "./components/MyClearancePanel";
import { useAuthGuard } from "./lib/use-auth-guard";

export function App() {
  const session = useAuthGuard();
  const navigate = useNavigate();

  return (
    <Show when={session()?.data?.user}>
      <Shell>
        <Container>
          <h2>Welcome back, {session()?.data?.user?.name}</h2>
          <MyClearancePanel />
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
