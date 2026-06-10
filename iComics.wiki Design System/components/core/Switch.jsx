import React from "react";

/** Switch — boolean toggle (settings, age-verify, RTL). */
export function Switch({ checked, defaultChecked, onChange, label, className = "", ...rest }) {
  return (
    <label className={["ic-switch", className].filter(Boolean).join(" ")} aria-label={label}>
      <input type="checkbox" checked={checked} defaultChecked={defaultChecked} onChange={onChange} {...rest} />
      <span className="ic-switch__track" />
      <span className="ic-switch__thumb" />
    </label>
  );
}
