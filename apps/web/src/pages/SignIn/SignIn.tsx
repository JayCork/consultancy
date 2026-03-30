import styles from "./SignIn.module.css";
import { createSignal } from "solid-js";
import { useNavigate, A } from "@solidjs/router";
import { signIn } from "../../lib/auth-client";
import { Button, InputField } from "@consultancy/ui";

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
    <div class={styles.base}>
      <h1>Sign in</h1>
      <p>Enter your email and password to sign in.</p>
      <form class={styles.form} onSubmit={handleSubmit}>
        <InputField
          label="Email"
          id="email"
          type="email"
          value={email()}
          onInput={(e) => setEmail(e.target.value)}
          autocomplete="email"
          required
        />
        <InputField
          label="Password"
          id="password"
          type="password"
          value={password()}
          onInput={(e) => setPassword(e.target.value)}
          autocomplete="current-password"
          required
        />

        {error() && <p role="alert">{error()}</p>}
        <Button type="submit" fullWidth>
          Sign in
        </Button>
      </form>
      <p>
        Don't have an account? <A href="/register">Create one</A>
      </p>
    </div>
  );
}
