import styles from "./Register.module.css";
import { createSignal } from "solid-js";
import { useNavigate, A } from "@solidjs/router";
import { signUp } from "../../lib/auth-client";
import { Button, InputField } from "@consultancy/ui";

export function Register() {
  const [name, setName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const [submitting, setSubmitting] = createSignal(false);
  const navigate = useNavigate();
  let confirmPasswordRef: HTMLInputElement | undefined;

  const validatePasswordMatch = () => {
    confirmPasswordRef?.setCustomValidity(
      password() !== confirmPassword() ? "Passwords do not match" : ""
    );
  };

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
    <div class={styles.base}>
      <h1>Create account</h1>
      <form class={styles.form} onSubmit={handleSubmit}>
        <InputField
          label="Full name"
          id="name"
          type="text"
          value={name()}
          onInput={(e) => setName(e.target.value)}
          autocomplete="name"
          required
        />
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
          onInput={(e) => { setPassword(e.target.value); validatePasswordMatch(); }}
          autocomplete="new-password"
          required
        />
        <InputField
          label="Confirm Password"
          id="confirm-password"
          type="password"
          ref={confirmPasswordRef}
          value={confirmPassword()}
          onInput={(e) => { setConfirmPassword(e.target.value); validatePasswordMatch(); }}
          autocomplete="new-password"
          errorMessage="Passwords do not match"
          required
        />
        {error() && <p role="alert">{error()}</p>}
        <Button type="submit" disabled={submitting()}>
          {submitting() ? "Creating account…" : "Create account"}
        </Button>
      </form>
      <p>
        Already have an account? <A href="/sign-in">Sign in</A>
      </p>
    </div>
  );
}
