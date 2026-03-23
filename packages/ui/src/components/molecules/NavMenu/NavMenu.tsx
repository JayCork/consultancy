import styles from "./NavMenu.module.css";
import { Component, For, Show } from "solid-js";
import { NavItem } from "../../atoms";
import CircleUser from "lucide-solid/icons/user-circle";
import { ButtonIcon } from "../../atoms/ButtonIcon/ButtonIcon";
import LogOut from "lucide-solid/icons/log-out";

interface NavMenuProps {
  title: string;
  isOpen?: boolean;
  items?: {
    id: number;
    href: string;
    label: string;
    icon?: Component;
    notifications?: number;
    isActive?: boolean;
  }[];
  user?: { name: string };
  onSignOut?: () => void;
}

export const NavMenu = (props: NavMenuProps) => {
  return (
    <aside
      class={styles.container}
      classList={{
        [styles.closed]: props.isOpen === false,
      }}
    >
      <div class={styles.appContainer}>
        <Show when={props.isOpen !== false}>
          <span class={styles.appName}>{props.title}</span>
        </Show>
        <Show when={props.isOpen === false}>
          <span class={styles.appNameCollapsed}>{props.title.charAt(0)}</span>
        </Show>
      </div>
      <nav class={styles.nav} aria-label="Main navigation">
        <ul class={styles.navList}>
          <For each={props.items}>
            {(item) => (
              <li class={styles.navItem}>
                <NavItem
                  href={item.href}
                  label={item.label}
                  icon={item?.icon}
                  notifications={item?.notifications}
                  showText={props.isOpen !== false}
                  isActive={item?.isActive}
                />
              </li>
            )}
          </For>
        </ul>
      </nav>
      <div class={styles.userSettings}>
        <Show when={props.user}>
          <CircleUser />
          <Show when={props.isOpen !== false}>
            <span>{props.user?.name}</span>
          </Show>
        </Show>
        <Show when={props.onSignOut}>
          <ButtonIcon aria-label="Sign out" onClick={props.onSignOut}>
            <LogOut />
          </ButtonIcon>
        </Show>
      </div>
    </aside>
  );
};
