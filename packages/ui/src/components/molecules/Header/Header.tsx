import CircleUser from "lucide-solid/icons/user-circle";
import { ButtonIcon } from "../../atoms/ButtonIcon/ButtonIcon";
import styles from "./Header.module.css";
import { Hexagon } from "lucide-solid";

interface HeaderProps {
  title: string;
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
        <ButtonIcon aria-label="User Profile">
          <CircleUser />
        </ButtonIcon>
      </div>
    </header>
  );
};
