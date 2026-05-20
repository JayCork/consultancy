import type { JSX } from "solid-js";
import { Shell } from "../Shell";
import { PeopleView } from "../pages/People/PeopleView";
import { useAuthGuard } from "../lib/use-auth-guard";

export function PeoplePage(): JSX.Element {
  useAuthGuard();
  return (
    <Shell>
      <PeopleView />
    </Shell>
  );
}
