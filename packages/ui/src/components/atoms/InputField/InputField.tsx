import styles from "./InputField.module.css";
import { JSX, splitProps } from "solid-js";

interface InputFieldProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  errorMessage?: string;
  description?: string;
}

export const InputField = (props: InputFieldProps) => {
  const [local, rest] = splitProps(props, [
    "label",
    "id",
    "errorMessage",
    "description",
  ]);
  const errorId = `${local.id}-error`;
  return (
    <div class={styles.base}>
      <label for={local.id}>{local.label}</label>
      <span>{local.description}</span>
      <input
        class={styles.input}
        id={local.id}
        aria-describedby={errorId}
        {...rest}
      />
      <span id={errorId} class={styles.error} aria-live="polite">
        {local.errorMessage}
      </span>
    </div>
  );
};
