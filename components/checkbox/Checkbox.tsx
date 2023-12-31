import { ChangeEvent } from "react";
import styles from "./Checkbox.module.scss";

interface CheckboxProps {
  checked: boolean;
  onChange: (e: boolean) => void;
  text?: string | JSX.Element | number;
  name?: string;
  className?: string;
  responsive?: boolean;
  type?: "primary" | "transparent" | "secondary";
  disabled?: boolean;
  rounded?: boolean;
}
const Checkbox = (props: CheckboxProps) => {
  const {
    onChange = () => {},
    text,
    name,
    checked,
    className,
    type,
    disabled,
    rounded
  } = props;

  const _onChange = (e: ChangeEvent<HTMLInputElement>) =>
    onChange(e.target.checked);

  return (
    <label
      className={[styles.wrapper, disabled && styles.disabled, className].join(
        " "
      )}
    >
      <input
        name={name}
        className={[styles.checkbox, rounded && styles.rounded].join(" ")}
        checked={checked}
        onChange={_onChange}
        type="checkbox"
        disabled={disabled}
      />
      <span
        className={[
          styles["check-wrapper"],
          styles[type || "primary"],
          rounded && styles.rounded
        ].join(" ")}
      >
        <span className={styles["check-icon"]} />
      </span>
      {text && <span className={styles.text}>{text}</span>}
    </label>
  );
};

export default Checkbox;
