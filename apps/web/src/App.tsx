import { Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useSession, signOut } from "./lib/auth-client";

export function App() {
  const session = useSession();
  const navigate = useNavigate();

  return (
    <Show
      when={session()?.data?.user}
      fallback={<>{navigate("/sign-in", { replace: true })}</>}
    >
      <div>
        <p>Signed in as {session()?.data?.user?.name}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    </Show>
  );
}
