import React from "react";

/** Tabs — underline tab bar (Library source/category tabs). */
export function Tabs({ tabs = [], value, onChange, className = "", ...rest }) {
  return (
    <div className={["ic-tabs", className].filter(Boolean).join(" ")} role="tablist" {...rest}>
      {tabs.map((t) => {
        const o = typeof t === "string" ? { value: t, label: t } : t;
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            className={["ic-tab", active ? "is-active" : ""].filter(Boolean).join(" ")}
            onClick={() => onChange && onChange(o.value)}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
