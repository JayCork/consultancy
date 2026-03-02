import { Chip, Select, TextArea } from "../../atoms";
import styles from "./StarInput.module.css";

interface StarInputProps {
  // Define your props here
}

export const StarInput = (props: StarInputProps) => {
  return (
    <div class={styles.base}>
      <div class={styles.grid}>
        <TextArea
          name="Situation"
          placeholder="Set the scene and provide context for the story"
          rows={5}
        />
        <TextArea
          name="Task"
          placeholder="Describe the task you needed to accomplish"
          rows={5}
        />
        <TextArea
          name="Action"
          placeholder="Explain the actions you took to address the task"
          rows={5}
        />
        <TextArea
          name="Result"
          placeholder="Share the outcome or results of your actions"
          rows={5}
        />
      </div>
      <Select
        label="Main competency"
        options={[
          { value: "1", label: "Management" },
          { value: "2", label: "Communication" },
          { value: "3", label: "Technical" },
          { value: "4", label: "Leadership" },
          { value: "5", label: "Creativity" },
        ]}
      />
      <div class={styles.tags}>
        <Chip label="Tag 1" />
        <Chip label="Tag 2" />
        <Chip label="Tag 3" />
      </div>
      <button class={styles.button}>Cancel</button>
      <button class={styles.button}>Submit</button>
    </div>
  );
};
