import { TextArea } from "@consultancy/ui/components/atoms";
import styles from "./StarInput.module.css";

interface StarInputProps {
  // Define your props here
}

export const StarInput = (props: StarInputProps) => {
  return (
    <div class={styles.base}>
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
  );
};
