import { ButtonIcon } from "../../atoms/ButtonIcon/ButtonIcon";
import styles from "./Header.module.css";
import { Hexagon } from "lucide-solid";

interface HeaderProps {
  title: string;
  handleMenuClick?: () => void;
}

export const Header = (props: HeaderProps) => {
  return (
    <header class={styles.container}>
      <div class={styles.start}>
        <ButtonIcon aria-label="Menu" onClick={props.handleMenuClick}>
          <Hexagon />
        </ButtonIcon>
        <h1>{props.title}</h1>
      </div>
    </header>
  );
};
