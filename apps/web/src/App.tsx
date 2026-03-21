import { Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useSession, signOut } from "./lib/auth-client";
import { AppShell } from "@consultancy/ui";

export function App() {
  const session = useSession();
  const navigate = useNavigate();

  return (
    <Show
      when={session()?.data?.user}
      fallback={<>{navigate("/sign-in", { replace: true })}</>}
    >
      <AppShell
        title="Contractor Hub"
        navMenuProps={{
          title: "Main Menu",
          items: [],
          user: session()?.data?.user
            ? { name: session()!.data!.user!.name! }
            : undefined,
          onSignOut: signOut,
        }}
      />
    </Show>
  );
}
