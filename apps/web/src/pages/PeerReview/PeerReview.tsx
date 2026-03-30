import { Shell } from "../../Shell";
import { Container } from "@consultancy/ui";
import { useAuthGuard } from "../../lib/use-auth-guard";

export function PeerReview() {
  useAuthGuard();
  return (
    <Shell>
      <Container>
        <h2>Peer Review</h2>
        <p>
          Evidence submitted by your team members will appear here for you to
          verify.
        </p>
      </Container>
    </Shell>
  );
}
