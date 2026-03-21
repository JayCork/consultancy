import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { signIn } from "../lib/auth-client";

export function SignIn() {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const navigate = useNavigate();

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError("");

    const result = await signIn.email({
      email: email().trim(),
      password: password().trim(),
    });

    if (result.error) {
      setError(result.error.message ?? "Sign in failed");
      return;
    }

    navigate("/", { replace: true });
  };

  return (
    <div>
      <h1>Sign in</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label for="email">Email</label>
          <input
            id="email"
            type="email"
            value={email()}
            onInput={(e) => setEmail(e.target.value)}
            autocomplete="email"
            required
          />
        </div>
        <div>
          <label for="password">Password</label>
          <input
            id="password"
            type="password"
            value={password()}
            onInput={(e) => setPassword(e.target.value)}
            autocomplete="current-password"
            required
          />
        </div>
        {error() && <p role="alert">{error()}</p>}
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
}
