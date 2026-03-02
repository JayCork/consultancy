import LayoutDashboard from "lucide-solid/icons/layout-dashboard";
import styles from "./NavItem.module.css";
import { For, Show } from "solid-js";
import { Library, TreePine } from "lucide-solid/icons/index";

interface NavItemProps {
  href: string;
  name: string;
  icon?: any;
  notifications?: number;
}

const NavItem = (props: NavItemProps) => {
  return (
    <li class={styles.container}>
      <div class={styles.itemStart}>
        <a href={props.href} class={styles.link}>
          {props.icon && <props.icon />}
          {props.name}
        </a>
      </div>
      <div class={styles.itemEnd}>
        <Show when={props.notifications}>
          <span class={styles.badge}>{props.notifications}</span>
        </Show>
      </div>
    </li>
    // <div class={styles.base}>
    //   <h2>Menu</h2>
    //   <ul class={styles.unorderedList}>
    //     <For each={data()}>
    //       {(item, index) => (
    //         <li class={styles.item}>
    //           <div class={styles.itemStart}>
    //             <a href={item.href} class={styles.link}>
    //               {item.icon && <item.icon />}
    //               {item.name}
    //             </a>
    //           </div>
    //           <div class={styles.itemEnd}>
    //             <Show when={item.notifications}>
    //               <span class={styles.badge}>{item.notifications}</span>
    //             </Show>
    //           </div>
    //         </li>
    //       )}
    //     </For>
    //   </ul>
    // </div>
  );
};

export default NavItem;
