import { createSignal, For, mergeProps, splitProps, type JSX } from "solid-js";
import styles from "./Select.module.css";

// Makes label and value required, but allows other option props like disabled
export interface SelectOption extends JSX.SelectHTMLAttributes<HTMLOptionElement> {
  label: string;
  value: string;
}

export interface SelectProps extends JSX.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  description?: string;
  options: SelectOption[];
  fullWidth?: boolean;
}

const Select = (_props: SelectProps) => {
  const [props, selectProps] = splitProps(_props, [
    "id",
    "label",
    "description",
    "options",
    "fullWidth",
  ]);

  const id = () => props.id;
  const label = () => props.label;
  const description = () => props.description;
  const options = () => props.options;
  const fullWidth = () => props.fullWidth;
  const [selectedOption, setSelectedOption] = createSignal("");

  return (
    <div class={`${styles.root} ${fullWidth() ? styles.fullWidth : ""}`}>
      <label for={id()}>{label()}</label>
      {description() && <span id={`${id()}-description`}>{description()}</span>}
      <select
        class={styles.select}
        id={id()}
        aria-describedby={description() ? `${id()}-description` : undefined}
        {...selectProps}
      >
        <For each={options()}>
          {(item, index) => (
            <option
              value={item.value}
              selected={item.value === selectedOption()}
            >
              {item.label}
            </option>
          )}
        </For>
      </select>
    </div>
  );
};

export default Select;
