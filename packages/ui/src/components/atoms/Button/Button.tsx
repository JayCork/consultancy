import { JSX, splitProps } from "solid-js";
import styles from "./Button.module.css";

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
}

const Button = (props: ButtonProps) => {
  const [local, rest] = splitProps(props, ["fullWidth", "children"]);
  return (
    <button
      {...rest}
      class={`${styles.container}${local.fullWidth ? ` ${styles.fullWidth}` : ""}`}
    >
      {local.children}
    </button>
  );
};

export default Button;
