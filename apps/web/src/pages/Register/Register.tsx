import { createSignal } from "solid-js";
import { useNavigate, A } from "@solidjs/router";
import { signUp } from "../../lib/auth-client";

export function Register() {
  const [name, setName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const [submitting, setSubmitting] = createSignal(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const result = await signUp.email({
        name: name().trim(),
        email: email().trim(),
        password: password().trim(),
      });

      if (result.error) {
        setError(result.error.message ?? "Registration failed");
        return;
      }

      navigate("/", { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Create account</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label for="name">Full name</label>
          <input
            id="name"
            type="text"
            value={name()}
            onInput={(e) => setName(e.target.value)}
            autocomplete="name"
            required
          />
        </div>
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
            autocomplete="new-password"
            required
          />
        </div>
        {error() && <p role="alert">{error()}</p>}
        <button type="submit" disabled={submitting()}>
          {submitting() ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p>
        Already have an account? <A href="/sign-in">Sign in</A>
      </p>
    </div>
  );
}
