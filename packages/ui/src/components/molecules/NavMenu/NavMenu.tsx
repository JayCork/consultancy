import LayoutDashboard from "lucide-solid/icons/layout-dashboard";
import styles from "./NavMenu.module.css";
import { For, JSX, Show } from "solid-js";
import { Library, TreePine } from "lucide-solid/icons/index";
import { NavItem } from "../../atoms";

interface NavMenuProps {
  // Define your props here
  title: string;
  items?: {
    id: number;
    href: string;
    label: string;
    icon?: any;
    notifications?: number;
  }[];
}

export const NavMenu = (props: NavMenuProps) => {
  return (
    <aside class={styles.container}>
      <div class={styles.appContainer}>
        {/* App-level controls (top section) */}
        <span>App</span>
      </div>
      <nav class={styles.nav} aria-label="Main navigation">
        <ul class={styles.navList}>
          <For each={props.items}>
            {(item, index) => (
              <li class={styles.navItem}>
                <NavItem
                  href={item.href}
                  label={item.label}
                  icon={item?.icon}
                  notifications={item?.notifications}
                />
              </li>
            )}
          </For>
        </ul>
      </nav>
      <div class={styles.userSettings}>
        {/* User settings (bottom section) */}
        <span>Logout</span>
      </div>
    </aside>
  );
};
