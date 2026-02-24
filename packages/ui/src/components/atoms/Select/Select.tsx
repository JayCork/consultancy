import { createSignal, For, mergeProps, splitProps, type JSX } from "solid-js";
import styles from "./select.module.css";

export interface SelectProps extends JSX.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  description?: string;
  options: JSX.SelectHTMLAttributes<HTMLOptionElement>[];
}

const Select = (_props: SelectProps) => {
  const [props, selectProps] = splitProps(_props, [
    "id",
    "label",
    "description",
    "options",
  ]);

  const id = () => props.id;
  const label = () => props.label;
  const description = () => props.description;
  const options = () => props.options;
  const [selectedOption, setSelectedOption] = createSignal("");

  return (
    <div class={styles.root}>
      <label for={id()}>{label()}</label>
      {/* {description() && <p>{description()}</p>} */}
      <select id={id()} {...selectProps}>
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
