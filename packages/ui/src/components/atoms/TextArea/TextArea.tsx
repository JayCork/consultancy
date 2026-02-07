import { JSX } from "solid-js";
import styles from "./TextArea.module.css";
import { Show, splitProps } from "solid-js";

interface TextAreaProps extends JSX.HTMLAttributes<HTMLTextAreaElement> {
  name: string;
  description?: string;
  placeholder?: string;
}

export const TextArea = (_props: TextAreaProps) => {
  const [props, rest] = splitProps(_props, [
    "name",
    "description",
    "placeholder",
  ]);
  const name = () => props.name;
  const description = () => props.description;
  const placeholder = () => props.placeholder;
  return (
    <div>
      <label id={`${name()}-label`} class={styles.label}>
        {name()}
      </label>
      <Show when={description()}>
        <p id={`${name()}-description`}>{description()}</p>
      </Show>
      <textarea
        class={styles.base}
        id={name()}
        aria-labelledby={`${name()}-label`}
        aria-describedby={description() ? `${name()}-description` : undefined}
        placeholder={placeholder()}
        {...rest}
      ></textarea>
    </div>
  );
};
