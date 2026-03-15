import { JSX } from "solid-js/jsx-runtime";
import styles from "./ButtonIcon.module.css";

interface ButtonIconProps {
  children: JSX.Element;
  onClick?: () => void;
  "aria-label": string;
}

export const ButtonIcon = (props: ButtonIconProps) => {
  return (
    <button class={styles.base} {...props}>
      {props.children}
    </button>
  );
};
