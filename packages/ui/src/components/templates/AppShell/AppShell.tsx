import styles from "./AppShell.module.css";
import { NavMenu } from "../../molecules/NavMenu/NavMenu";
import { JSX, Component, createSignal } from "solid-js";
import { Header } from "../../molecules/Header/Header";

interface NavItem {
  id: number;
  href: string;
  icon?: Component;
  label: string;
  notifications?: number;
  isActive?: boolean;
}

interface AppShellProps {
  title: string;
  navMenuProps: {
    title: string;
    items?: NavItem[];
    user?: { name: string };
    onSignOut?: () => void;
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
        <Header title={props.title} handleMenuClick={toggleNavMenu} />
        <div class={styles.content}>{props.children}</div>
      </main>
    </div>
  );
};
