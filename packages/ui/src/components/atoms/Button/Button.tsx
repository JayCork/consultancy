import { JSX } from "solid-js/jsx-runtime";
import styles from "./Button.module.css";

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

const Button = (props: ButtonProps) => {
  return (
    <button class={styles.container} {...props}>
      {props.label}
    </button>
  );
};

export default Button;
