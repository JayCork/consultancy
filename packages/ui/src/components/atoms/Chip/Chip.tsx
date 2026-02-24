import type { JSX } from "solid-js/jsx-runtime";
import styles from "./chip.module.css";
import { Show } from "solid-js";

const Chip = (props: {
  label: string;
  variant?: "default" | "outlined";
  leadingIcon?: JSX.Element;
  trailingIcon?: JSX.Element;
}) => {
  return (
    <div class={styles.container}>
      <Show when={props.leadingIcon}>
        <svg>{props.leadingIcon}</svg>
      </Show>
      <span class={styles.label}>{props.label}</span>
      <Show when={props.trailingIcon}>
        <svg>{props.trailingIcon}</svg>
      </Show>
    </div>
  );
};

export default Chip;
