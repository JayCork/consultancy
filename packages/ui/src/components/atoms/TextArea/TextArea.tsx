import { JSX, Show, splitProps } from "solid-js";
import styles from "./TextArea.module.css";

interface TextAreaProps extends JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  description?: string;
  placeholder?: string;
}

const TextArea = (_props: TextAreaProps) => {
  const [props, rest] = splitProps(_props, [
    "name",
    "description",
    "placeholder",
  ]);
  return (
    <div>
      <label id={`${props.name}-label`} class={styles.label}>
        {props.name}
      </label>
      <Show when={props.description}>
        <p id={`${props.name}-description`} class={styles.description}>
          {props.description}
        </p>
      </Show>
      <textarea
        class={styles.base}
        id={props.name}
        aria-labelledby={`${props.name}-label`}
        aria-describedby={
          props.description ? `${props.name}-description` : undefined
        }
        placeholder={props.placeholder}
        {...rest}
      ></textarea>
    </div>
  );
};

export default TextArea;
