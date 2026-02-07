import LayoutDashboard from "lucide-solid/icons/layout-dashboard";
import styles from "./NavMenu.module.css";
import { For, Show } from "solid-js";
import { Library, TreePine } from "lucide-solid/icons/index";
import { NavItem } from "../../atoms";

interface NavMenuProps {
  // Define your props here
}

export const NavMenu = (props: NavMenuProps) => {
  const data = () => [
    {
      id: 1,
      href: "#",
      name: "Dashboard",
      icon: LayoutDashboard,
      notifications: 3,
    },
    { id: 2, href: "#evidence-locker", name: "You're evidence", icon: Library },
    { id: 3, href: "#career-hub", name: "Career Hub", icon: TreePine },
  ];

  return (
    <nav class={styles.base}>
      <div>
        <h2>Menu</h2>
      </div>
      <ul class={styles.unorderedList}>
        <For each={data()}>
          {(item, index) => (
            <NavItem
              href={item.href}
              name={item.name}
              icon={item?.icon}
              notifications={item?.notifications}
            />
          )}
        </For>
      </ul>
    </nav>
  );
};
