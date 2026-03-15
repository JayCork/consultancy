import styles from "./AppShell.module.css";
import { NavMenu } from "../../molecules/NavMenu/NavMenu";
import { JSX } from "solid-js/jsx-runtime";
import { Header } from "../../molecules/Header/Header";
import { createSignal } from "solid-js";

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
  const [isNavMenuOpen, setIsNavMenuOpen] = createSignal(true);

  const toggleNavMenu = () => setIsNavMenuOpen(!isNavMenuOpen());

  return (
    <div class={styles.appShell}>
      <NavMenu {...props.navMenuProps} isOpen={isNavMenuOpen()} />
      <main class={styles.main}>
        <Header title="Contractor Hub" handleMenuClick={toggleNavMenu} />
        <div class={styles.content}>{props.children}</div>
      </main>
    </div>
  );
};
