import React from "react";

/** Input — text field with optional leading icon. */
export function Input({ label, icon = null, size = "md", id, className = "", wrapClassName = "", ...rest }) {
  const field = (
    <div className={["ic-input-wrap", icon ? "has-icon" : "", wrapClassName].filter(Boolean).join(" ")}>
      {icon}
      <input id={id} className={["ic-input", size === "sm" ? "ic-input--sm" : "", className].filter(Boolean).join(" ")} {...rest} />
    </div>
  );
  if (!label) return field;
  return (
    <label className="ic-field" htmlFor={id}>
      <span className="ic-field__label">{label}</span>
      {field}
    </label>
  );
}
