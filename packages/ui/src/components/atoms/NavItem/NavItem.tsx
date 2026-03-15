import styles from "./NavItem.module.css";
import { Show } from "solid-js";

interface NavItemProps {
  href: string;
  label: string;
  icon?: any;
  notifications?: number;
  showText?: boolean;
}

const NavItem = (props: NavItemProps) => {
  return (
    <li class={styles.container}>
      <div class={styles.itemStart}>
        <a href={props.href} class={styles.link}>
          <Show when={props.icon}>
            <span class={styles.icon}>{props.icon}</span>
          </Show>
          <Show when={props.showText}>
            <span class={styles.label}>{props.label}</span>
          </Show>
        </a>
      </div>
      <div class={styles.itemEnd}>
        <Show when={props.notifications}>
          <span class={styles.badge}>{props.notifications}</span>
        </Show>
      </div>
    </li>
  );
};

export default NavItem;
