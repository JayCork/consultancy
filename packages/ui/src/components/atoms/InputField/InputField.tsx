import styles from "./InputField.module.css";
import { JSX, splitProps } from "solid-js";

interface InputFieldProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
}

export const InputField = (props: InputFieldProps) => {
  const [local, rest] = splitProps(props, ["label", "id"]);
  return (
    <div class={styles.base}>
      <label for={local.id}>{local.label}</label>
      <input class={styles.input} id={local.id} {...rest} />
    </div>
  );
};
