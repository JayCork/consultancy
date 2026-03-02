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
    icon?: any;
    label: string;
    notifications?: number;
  }[];
}

export const NavMenu = (props: NavMenuProps) => {
  return (
    <nav class={styles.base}>
      <div class={styles.tenant}>
        <h2>{props.title}</h2>
        <div class={styles.divider} />
      </div>
      <ul class={styles.unorderedList}>
        <For each={props.items}>
          {(item, index) => (
            <NavItem
              href={item.href}
              label={item.label}
              icon={item?.icon}
              notifications={item?.notifications}
            />
          )}
        </For>
      </ul>
    </nav>
  );
};
