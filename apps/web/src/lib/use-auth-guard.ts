import { createEffect } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useSession } from "./auth-client";

/**
 * Redirects to /sign-in if no authenticated session is found.
 * Safe to call during the initial pending state — redirect only fires
 * once the session check has completed and confirms no user is present.
 */
export function useAuthGuard() {
  const session = useSession();
  const navigate = useNavigate();

  createEffect(() => {
    if (!session().isPending && !session()?.data?.user) {
      navigate("/sign-in", { replace: true });
    }
  });

  return session;
}
