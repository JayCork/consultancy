import { createSignal, createMemo, For, Show } from "solid-js";
import styles from "./TagPicker.module.css";

export interface TagOption {
  value: string;
  label: string;
}

export interface TagPickerProps {
  label: string;
  description?: string;
  options: TagOption[];
  value: string[];
  onChange: (values: string[]) => void;
}

export const TagPicker = (props: TagPickerProps) => {
  const [query, setQuery] = createSignal("");
  const [open, setOpen] = createSignal(false);

  const selectedOptions = createMemo(() =>
    props.options.filter((o) => props.value.includes(o.value)),
  );

  const filteredOptions = createMemo(() => {
    const q = query().toLowerCase();
    return props.options.filter(
      (o) =>
        !props.value.includes(o.value) && o.label.toLowerCase().includes(q),
    );
  });

  const select = (value: string) => {
    props.onChange([...props.value, value]);
    setQuery("");
  };

  const deselect = (value: string) => {
    props.onChange(props.value.filter((v) => v !== value));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
    if (e.key === "Backspace" && query() === "" && props.value.length > 0) {
      deselect(props.value[props.value.length - 1]);
    }
  };

  return (
    <div class={styles.root}>
      <label>{props.label}</label>
      <Show when={props.description}>
        <p class={styles.description}>{props.description}</p>
      </Show>
      <div
        class={styles.field}
        onFocusOut={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setOpen(false);
          }
        }}
      >
        <div class={styles.inputRow}>
          <For each={selectedOptions()}>
            {(tag) => (
              <span class={styles.chip}>
                {tag.label}
                <button
                  type="button"
                  class={styles.dismiss}
                  onClick={() => deselect(tag.value)}
                  aria-label={`Remove ${tag.label}`}
                >
                  ✕
                </button>
              </span>
            )}
          </For>
          <input
            class={styles.input}
            type="text"
            placeholder={props.value.length === 0 ? "Search tags..." : ""}
            value={query()}
            onInput={(e) => {
              setQuery(e.currentTarget.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            role="combobox"
            aria-expanded={open()}
            aria-autocomplete="list"
            autocomplete="off"
          />
        </div>
        <Show when={open() && filteredOptions().length > 0}>
          <ul class={styles.dropdown} role="listbox">
            <For each={filteredOptions()}>
              {(option) => (
                <li
                  class={styles.option}
                  role="option"
                  aria-selected={false}
                  onMouseDown={(e) => {
                    // prevent blur firing before click
                    e.preventDefault();
                    select(option.value);
                  }}
                >
                  {option.label}
                </li>
              )}
            </For>
          </ul>
        </Show>
      </div>
    </div>
  );
};
