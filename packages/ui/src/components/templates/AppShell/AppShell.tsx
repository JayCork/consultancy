import styles from "./AppShell.module.css";
import { NavMenu } from "../../molecules/NavMenu/NavMenu";
import { JSX } from "solid-js/jsx-runtime";

interface AppShellProps {
  navMenuProps: {
    title: string;
    items?: {
      id: number;
      href: string;
      icon?: any;
      label: string;
      notifications?: number;
    }[];
  };
  children?: JSX.Element;
}

export const AppShell = (props: AppShellProps) => {
  return (
    <div class={styles.appShell}>
      <NavMenu {...props.navMenuProps} />
      <main class={styles.mainContent}>{props.children}</main>
    </div>
  );
};
