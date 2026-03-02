import styles from "./NavItem.module.css";
import { Show } from "solid-js";

interface NavItemProps {
  href: string;
  label: string;
  icon?: any;
  notifications?: number;
}

const NavItem = (props: NavItemProps) => {
  return (
    <li class={styles.container}>
      <div class={styles.itemStart}>
        <a href={props.href} class={styles.link}>
          <Show when={props.icon}>
            <span class={styles.icon}>{props.icon}</span>
          </Show>
          {props.label}
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
    //               {item.label}
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
