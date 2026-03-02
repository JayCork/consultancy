import { Show } from "solid-js";
import CircleUser from "lucide-solid/icons/user-circle";
import { ButtonIcon } from "../../atoms/ButtonIcon/ButtonIcon";
import styles from "./Header.module.css";
import { Hexagon, LogIn } from "lucide-solid";

interface HeaderProps {
  title: string;
  firstName?: string;
}

export const Header = (props: HeaderProps) => {
  return (
    <header class={styles.container}>
      <div class={styles.start}>
        <div class={styles.logoContainer}>
          <Hexagon />
        </div>
        <h1>{props.title}</h1>
      </div>
      <div class={styles.end}>
        <Show
          when={props.firstName}
          fallback={
            <>
              <span class={styles.userName}>Log in</span>
              <ButtonIcon aria-label="Log In">
                <LogIn />
              </ButtonIcon>
            </>
          }
        >
          <span class={styles.userName}>{props.firstName}</span>
          <ButtonIcon aria-label="User Profile">
            <CircleUser />
          </ButtonIcon>
        </Show>
      </div>
    </header>
  );
};
