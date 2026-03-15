import styles from "./ProgressTracker.module.css";

interface ProgressTrackerProps {
  percentComplete: number;
}

export const ProgressTracker = (props: ProgressTrackerProps) => {
  return (
    <progress
      class={styles.container}
      value={props.percentComplete}
      max="100"
    />
  );
};
// <progress id="file" max="100" value="70">70%</progress>
