import styles from "./InputField.module.css";
import { JSX, splitProps } from "solid-js";

interface InputFieldProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  errorMessage?: string;
  description?: string;
  startAdornment?: string;
}

export const InputField = (props: InputFieldProps) => {
  const [local, rest] = splitProps(props, [
    "label",
    "id",
    "errorMessage",
    "description",
    "startAdornment",
  ]);
  const errorId = `${local.id}-error`;
  return (
    <div class={styles.base}>
      <label for={local.id}>{local.label}</label>
      <span>{local.description}</span>
      <div class={styles.inputWrapper}>
        {local.startAdornment ? (
          <span class={styles.startAdornment} aria-hidden="true">
            {local.startAdornment}
          </span>
        ) : null}
        <input
          classList={{
            [styles.input]: true,
            [styles.inputWithAdornment]: !!local.startAdornment,
          }}
          id={local.id}
          aria-describedby={errorId}
          {...rest}
        />
      </div>
      <span id={errorId} class={styles.error} aria-live="polite">
        {local.errorMessage}
      </span>
    </div>
  );
};
