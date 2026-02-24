import { mergeProps, splitProps, type JSX } from "solid-js";
import styles from "./employee.module.css";

export interface EmployeeProps extends JSX.HTMLAttributes<HTMLDivElement> {
  label: string;
  description?: string;
}

export const Employee = (_props: EmployeeProps) => {
  const [props, textAreaProps] = splitProps(_props, []);

  return (
    <div class={styles.container}>
      <h1>Employee</h1>
      <h2>Mary Sue</h2>
      <span>Level 4</span>
      <span>Software Engineer</span>
      <div>
        <h3>Current Allocation</h3>
        <ul>
          <li>Project A: 50%</li>
          <li>Project B: 25%</li>
          <li>Project C: 25%</li>
        </ul>
      </div>
      <div>
        <h3>Skills</h3>
        <ul>
          <li>Management</li>
          <li>Communication</li>
          <li>Technical</li>
        </ul>
      </div>
      <div>
        <h3>Feedback</h3>
        <blockquote>
          "Mary is a great team player and always willing to help others."
        </blockquote>
        <blockquote>
          "She has excellent communication skills and is very organized."
        </blockquote>
      </div>
    </div>
  );
};
