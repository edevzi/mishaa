import * as React from "react";

/** Native select styled to the system. Provide <option> children. Used for language pickers, content-language, sort. */
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export function Select(props: SelectProps): JSX.Element;
