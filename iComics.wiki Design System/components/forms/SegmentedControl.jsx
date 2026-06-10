import React from "react";

/**
 * SegmentedControl — single-select pill group. Core for the reader
 * (view mode, LTR/RTL, reader theme) and compact toggles.
 */
export function SegmentedControl({ options = [], value, onChange, accent = false, className = "", ...rest }) {
  return (
    <div className={["ic-seg", accent ? "ic-seg--accent" : "", className].filter(Boolean).join(" ")} role="tablist" {...rest}>
      {options.map((opt) => {
        const o = typeof opt === "string" ? { value: opt, label: opt } : opt;
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            className={["ic-seg__opt", active ? "is-active" : ""].filter(Boolean).join(" ")}
            onClick={() => onChange && onChange(o.value)}
          >
            {o.icon}
            {o.label != null && <span>{o.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
