import { JSXElement } from "solid-js";
import styles from "./Container.module.css";

interface ContainerProps {
  children?: JSXElement;
}

export const Container = (props: ContainerProps) => {
  return (
    <div class={styles.container}>
      <main class={styles.mainContent}>{props.children}</main>
    </div>
  );
};
