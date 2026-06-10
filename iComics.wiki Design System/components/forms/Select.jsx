import React from "react";

/** Select — native dropdown styled to the system. Pass <option>s as children. */
export function Select({ label, id, className = "", children, ...rest }) {
  const field = (
    <div className="ic-select-wrap">
      <select id={id} className={["ic-select", className].filter(Boolean).join(" ")} {...rest}>
        {children}
      </select>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
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
