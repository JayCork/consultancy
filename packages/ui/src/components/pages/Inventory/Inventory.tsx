import { mergeProps, splitProps, type JSX } from "solid-js";
import styles from "./inventory.module.css";
import Chip from "../../atoms/chip/chip";

export interface InventoryProps extends JSX.HTMLAttributes<HTMLDivElement> {
  label: string;
  description?: string;
}

export const Inventory = (_props: InventoryProps) => {
  const [props, textAreaProps] = splitProps(_props, []);

  return (
    <div class={styles.container}>
      <h1>Inventory</h1>
      <div class={styles.filters}>
        <label>
          Role:
          <select>
            <option value="all">All</option>
            <option value="software-engineer">Software Engineer</option>
            <option value="product-manager">Product Manager</option>
            <option value="ux-designer">UX Designer</option>
          </select>
        </label>
        <label>
          Level:
          <select>
            <option value="all">All</option>
            <option value="level-1">Level 1</option>
            <option value="level-2">Level 2</option>
            <option value="level-3">Level 3</option>
            <option value="level-4">Level 4</option>
          </select>
        </label>
      </div>
      <table class={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Level</th>
            <th>Current Allocation</th>
            <th>Skills</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Mary Sue</td>
            <td>Software Engineer</td>
            <td>Level 4</td>
            <td>
              <Chip label="Project A" />
            </td>
            <td>
              <Chip label="Management" />
              <Chip label="Communication" />
              <Chip label="Technical" />
            </td>
          </tr>
          <tr>
            <td>John Doe</td>
            <td>Product Manager</td>
            <td>Level 3</td>
            <td>
              <Chip label="Project B" />
            </td>
            <td>
              <Chip label="Leadership" />
              <Chip label="Communication" />
              <Chip label="Creativity" />
            </td>
          </tr>
          <tr>
            <td>Jane Smith</td>
            <td>UX Designer</td>
            <td>Level 2</td>
            <td>
              <Chip label="Project C" />
            </td>
            <td>
              <Chip label="Creativity" />
              <Chip label="Communication" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
