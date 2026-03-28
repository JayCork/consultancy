import styles from "./NavItem.module.css";
import { Component, Show } from "solid-js";
import { Dynamic } from "solid-js/web";

interface NavItemProps {
  href: string;
  label: string;
  icon?: Component;
  notifications?: number;
  showText?: boolean;
  isActive?: boolean;
}

const NavItem = (props: NavItemProps) => {
  return (
    <li
      class={styles.container}
      classList={{ [styles.active]: props.isActive }}
    >
      <div class={styles.itemStart}>
        <a
          href={props.href}
          class={styles.link}
          aria-current={props.isActive ? "page" : undefined}
        >
          <Show when={props.icon}>
            <span class={styles.icon}>
              <Dynamic component={props.icon} />
            </span>
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
