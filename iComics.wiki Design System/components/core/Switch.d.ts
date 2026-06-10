import * as React from "react";

/** Boolean toggle for settings (theme, age-verification, reduced data, etc). */
export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  /** Accessible name. */
  label?: string;
}

export function Switch(props: SwitchProps): JSX.Element;
