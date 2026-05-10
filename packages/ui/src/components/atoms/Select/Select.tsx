import { createEffect, For, splitProps, type JSX } from "solid-js";
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
  let selectRef: HTMLSelectElement | undefined;

  createEffect(() => {
    const currentValue = selectProps.value as string | undefined;
    const optionCount = options().length;
    if (!selectRef || currentValue === undefined) return;

    // Ensure the selected value is reapplied when options load asynchronously.
    if (optionCount > 0) {
      selectRef.value = currentValue;
    }
  });

  return (
    <div class={`${styles.root} ${fullWidth() ? styles.fullWidth : ""}`}>
      <label for={id()}>{label()}</label>
      {description() && <span id={`${id()}-description`}>{description()}</span>}
      <select
        ref={selectRef}
        class={styles.select}
        id={id()}
        aria-describedby={description() ? `${id()}-description` : undefined}
        {...selectProps}
      >
        <For each={options()}>
          {(item) => <option value={item.value}>{item.label}</option>}
        </For>
      </select>
    </div>
  );
};

export default Select;
