import styles from "./ButtonIcon.module.css";

interface ButtonIconProps {
  // Define your props here
}

export const ButtonIcon = (props: ButtonIconProps) => {
  return (
    <button class={styles.base} {...props}>
      {props.children}
    </button>
  );
};
