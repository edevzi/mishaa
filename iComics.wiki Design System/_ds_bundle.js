/* @ds-bundle: {"format":3,"namespace":"IComicsWikiDesignSystem_3734a1","components":[{"name":"CoverCard","sourcePath":"components/catalog/CoverCard.jsx"},{"name":"Logo","sourcePath":"components/catalog/Logo.jsx"},{"name":"ProgressBar","sourcePath":"components/catalog/ProgressBar.jsx"},{"name":"RatingChip","sourcePath":"components/catalog/RatingChip.jsx"},{"name":"ScoreBadge","sourcePath":"components/catalog/ScoreBadge.jsx"},{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Switch","sourcePath":"components/core/Switch.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"SegmentedControl","sourcePath":"components/forms/SegmentedControl.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/catalog/CoverCard.jsx":"40fd50597130","components/catalog/Logo.jsx":"b8f211c84a60","components/catalog/ProgressBar.jsx":"68c97b15d139","components/catalog/RatingChip.jsx":"b93d32ac36f9","components/catalog/ScoreBadge.jsx":"451f00692780","components/core/Avatar.jsx":"639a2e6df437","components/core/Badge.jsx":"51f73ecc50a1","components/core/Button.jsx":"1ce08debf552","components/core/IconButton.jsx":"4e3fa648f329","components/core/Switch.jsx":"14927e43886e","components/core/Tag.jsx":"0ca85b689d40","components/forms/Input.jsx":"4f2d06a38c9e","components/forms/SegmentedControl.jsx":"30d4232d055d","components/forms/Select.jsx":"f0e60992ff25","components/navigation/Tabs.jsx":"f0d5bc486cee","ui_kits/home/app.jsx":"f8b5f2994f9b","ui_kits/home/data.js":"8ffd1b136d43","ui_kits/reader/reader.jsx":"39b38a8381f0"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.IComicsWikiDesignSystem_3734a1 = window.IComicsWikiDesignSystem_3734a1 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/catalog/CoverCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Deterministic warm gradient for placeholder posters (no real cover image). */
function hueFromString(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 360;
  return h;
}

/**
 * CoverCard — the catalog's primary unit. Poster (image or generated placeholder),
 * title + light metadata below, score overlay, content rating, adult blur/lock, and
 * optional reading-progress bar.
 */
function CoverCard({
  title = "Untitled",
  cover = null,
  source,
  status,
  score,
  rating,
  adult = false,
  revealed = false,
  progress = null,
  onClick,
  className = "",
  ...rest
}) {
  const hue = hueFromString(title);
  const ph = {
    background: `linear-gradient(155deg,
      oklch(0.42 0.11 ${hue}) 0%,
      oklch(0.30 0.09 ${(hue + 28) % 360}) 60%,
      oklch(0.20 0.06 ${(hue + 50) % 360}) 100%)`
  };
  const cls = ["ic-cover", adult ? "ic-cover--adult" : "", adult && revealed ? "is-revealed" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: cls,
    onClick: onClick
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "ic-cover__poster"
  }, cover ? /*#__PURE__*/React.createElement("img", {
    src: cover,
    alt: "",
    loading: "lazy"
  }) : /*#__PURE__*/React.createElement("span", {
    className: "ic-cover__ph",
    style: ph
  }, title), score != null && /*#__PURE__*/React.createElement("span", {
    className: "ic-cover__topmeta"
  }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", {
    className: "ic-score ic-score--oncover"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18.6 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z"
  })), Number(score).toFixed(1))), adult && /*#__PURE__*/React.createElement("span", {
    className: "ic-cover__lock"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    width: "18",
    height: "11",
    x: "3",
    y: "11",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 11V7a5 5 0 0 1 10 0v4"
  })), "18+"), progress != null && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic-progress",
    style: {
      borderRadius: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic-progress__fill",
    style: {
      width: Math.max(0, Math.min(100, progress)) + "%"
    }
  })))), /*#__PURE__*/React.createElement("span", {
    className: "ic-cover__title"
  }, title), (source || status || rating) && /*#__PURE__*/React.createElement("span", {
    className: "ic-cover__meta"
  }, source && /*#__PURE__*/React.createElement("span", {
    className: "ic-badge ic-badge--neutral"
  }, source), rating && /*#__PURE__*/React.createElement("span", {
    className: `ic-rating ic-rating--${rating}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic-rating__dot"
  })), status && /*#__PURE__*/React.createElement("span", {
    className: "ic-eyebrow",
    style: {
      fontSize: "var(--text-2xs)"
    }
  }, status)));
}
Object.assign(__ds_scope, { CoverCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/catalog/CoverCard.jsx", error: String((e && e.message) || e) }); }

// components/catalog/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Logo — the iComics.wiki lockup: monogram mark + "iComics·wiki" wordmark.
 * NOTE: the mark here is a PLACEHOLDER pending the real brand logo (logo.png).
 */
function Logo({
  size = 28,
  showWordmark = true,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: className,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: Math.round(size * 0.34)
    }
  }, rest), /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 512 512",
    fill: "none",
    "aria-label": "iComics.wiki",
    role: "img",
    style: {
      borderRadius: size * 0.26,
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("rect", {
    width: "512",
    height: "512",
    rx: "116",
    fill: "#F2994A"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "168",
    cy: "150",
    r: "30",
    fill: "#2A1705"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "142",
    y: "208",
    width: "52",
    height: "190",
    rx: "20",
    fill: "#2A1705"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M392 214c-22-20-52-32-86-32-62 0-110 44-110 122s48 122 110 122c34 0 64-12 86-32",
    stroke: "#2A1705",
    strokeWidth: "52",
    strokeLinecap: "round",
    fill: "none"
  })), showWordmark && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: 700,
      fontSize: size * 0.62,
      letterSpacing: "-0.01em",
      color: "var(--text-primary)",
      lineHeight: 1
    }
  }, "iComics", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-muted)",
      fontWeight: 500
    }
  }, "\xB7wiki")));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/catalog/Logo.jsx", error: String((e && e.message) || e) }); }

// components/catalog/ProgressBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** ProgressBar — reading-progress track. value 0–100. */
function ProgressBar({
  value = 0,
  thick = false,
  className = "",
  ...rest
}) {
  const pct = Math.max(0, Math.min(100, value));
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ["ic-progress", thick ? "ic-progress--thick" : "", className].filter(Boolean).join(" "),
    role: "progressbar",
    "aria-valuenow": Math.round(pct),
    "aria-valuemin": 0,
    "aria-valuemax": 100
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "ic-progress__fill",
    style: {
      width: pct + "%"
    }
  }));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/catalog/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/catalog/RatingChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const LABELS = {
  safe: "Safe",
  suggestive: "Suggestive",
  erotica: "Erotica"
};

/** RatingChip — content rating indicator (dot + label). */
function RatingChip({
  rating = "safe",
  showLabel = true,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ["ic-rating", `ic-rating--${rating}`, className].filter(Boolean).join(" ")
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "ic-rating__dot"
  }), showLabel && (LABELS[rating] || rating));
}
Object.assign(__ds_scope, { RatingChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/catalog/RatingChip.jsx", error: String((e && e.message) || e) }); }

// components/catalog/ScoreBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** ScoreBadge — mono score with a star. Use `onCover` for the frosted variant over art. */
function ScoreBadge({
  score,
  onCover = false,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ["ic-score", onCover ? "ic-score--oncover" : "", className].filter(Boolean).join(" ")
  }, rest), /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18.6 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z"
  })), Number(score).toFixed(1));
}
Object.assign(__ds_scope, { ScoreBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/catalog/ScoreBadge.jsx", error: String((e && e.message) || e) }); }

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Avatar — user image or initials fallback. */
function Avatar({
  src,
  name = "",
  size = "md",
  className = "",
  ...rest
}) {
  const initials = name.split(" ").map(p => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ["ic-avatar", `ic-avatar--${size}`, className].filter(Boolean).join(" ")
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name
  }) : /*#__PURE__*/React.createElement("span", null, initials || "?"));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Badge — compact mono status pill (source name, "NEW", count, status). */
function Badge({
  variant = "neutral",
  className = "",
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ["ic-badge", `ic-badge--${variant}`, className].filter(Boolean).join(" ")
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — primary action control for iComics.wiki.
 * Variants: primary (marigold), secondary (outline), ghost, danger.
 */
function Button({
  variant = "primary",
  size = "md",
  block = false,
  iconStart = null,
  iconEnd = null,
  disabled = false,
  as = "button",
  className = "",
  children,
  ...rest
}) {
  const Tag = as;
  const cls = ["ic-btn", `ic-btn--${variant}`, `ic-btn--${size}`, block ? "ic-btn--block" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls,
    disabled: Tag === "button" ? disabled : undefined,
    "aria-disabled": disabled || undefined
  }, rest), iconStart, children != null && /*#__PURE__*/React.createElement("span", null, children), iconEnd);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * IconButton — square control for a single glyph. Pass a Lucide (or any) icon as children.
 * Variants: plain, solid (surface), accent (marigold), ghost-scrim (over imagery).
 */
function IconButton({
  variant = "plain",
  size = "md",
  pressed,
  label,
  className = "",
  children,
  ...rest
}) {
  const cls = ["ic-iconbtn", variant !== "plain" ? `ic-iconbtn--${variant}` : "", `ic-iconbtn--${size}`, className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: cls,
    "aria-label": label,
    "aria-pressed": pressed
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Switch — boolean toggle (settings, age-verify, RTL). */
function Switch({
  checked,
  defaultChecked,
  onChange,
  label,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: ["ic-switch", className].filter(Boolean).join(" "),
    "aria-label": label
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    checked: checked,
    defaultChecked: defaultChecked,
    onChange: onChange
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "ic-switch__track"
  }), /*#__PURE__*/React.createElement("span", {
    className: "ic-switch__thumb"
  }));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Switch.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Tag — pill for genres/keywords. Set `interactive` + `pressed` for filter chips. */
function Tag({
  interactive = false,
  pressed,
  className = "",
  children,
  ...rest
}) {
  const cls = ["ic-tag", interactive ? "ic-tag--interactive" : "", className].filter(Boolean).join(" ");
  if (interactive) {
    return /*#__PURE__*/React.createElement("button", _extends({
      type: "button",
      className: cls,
      "aria-pressed": !!pressed
    }, rest), children);
  }
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Input — text field with optional leading icon. */
function Input({
  label,
  icon = null,
  size = "md",
  id,
  className = "",
  wrapClassName = "",
  ...rest
}) {
  const field = /*#__PURE__*/React.createElement("div", {
    className: ["ic-input-wrap", icon ? "has-icon" : "", wrapClassName].filter(Boolean).join(" ")
  }, icon, /*#__PURE__*/React.createElement("input", _extends({
    id: id,
    className: ["ic-input", size === "sm" ? "ic-input--sm" : "", className].filter(Boolean).join(" ")
  }, rest)));
  if (!label) return field;
  return /*#__PURE__*/React.createElement("label", {
    className: "ic-field",
    htmlFor: id
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic-field__label"
  }, label), field);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/SegmentedControl.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SegmentedControl — single-select pill group. Core for the reader
 * (view mode, LTR/RTL, reader theme) and compact toggles.
 */
function SegmentedControl({
  options = [],
  value,
  onChange,
  accent = false,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ["ic-seg", accent ? "ic-seg--accent" : "", className].filter(Boolean).join(" "),
    role: "tablist"
  }, rest), options.map(opt => {
    const o = typeof opt === "string" ? {
      value: opt,
      label: opt
    } : opt;
    const active = o.value === value;
    return /*#__PURE__*/React.createElement("button", {
      key: o.value,
      type: "button",
      role: "tab",
      "aria-selected": active,
      className: ["ic-seg__opt", active ? "is-active" : ""].filter(Boolean).join(" "),
      onClick: () => onChange && onChange(o.value)
    }, o.icon, o.label != null && /*#__PURE__*/React.createElement("span", null, o.label));
  }));
}
Object.assign(__ds_scope, { SegmentedControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SegmentedControl.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Select — native dropdown styled to the system. Pass <option>s as children. */
function Select({
  label,
  id,
  className = "",
  children,
  ...rest
}) {
  const field = /*#__PURE__*/React.createElement("div", {
    className: "ic-select-wrap"
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: id,
    className: ["ic-select", className].filter(Boolean).join(" ")
  }, rest), children), /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  })));
  if (!label) return field;
  return /*#__PURE__*/React.createElement("label", {
    className: "ic-field",
    htmlFor: id
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic-field__label"
  }, label), field);
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Tabs — underline tab bar (Library source/category tabs). */
function Tabs({
  tabs = [],
  value,
  onChange,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ["ic-tabs", className].filter(Boolean).join(" "),
    role: "tablist"
  }, rest), tabs.map(t => {
    const o = typeof t === "string" ? {
      value: t,
      label: t
    } : t;
    const active = o.value === value;
    return /*#__PURE__*/React.createElement("button", {
      key: o.value,
      type: "button",
      role: "tab",
      "aria-selected": active,
      className: ["ic-tab", active ? "is-active" : ""].filter(Boolean).join(" "),
      onClick: () => onChange && onChange(o.value)
    }, o.label);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/home/app.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* iComics.wiki — Home (interactive kit). One file to keep React scope simple. */
const NS = window.IComicsWikiDesignSystem_3734a1;
const {
  CoverCard,
  Button,
  IconButton,
  Badge,
  Tag,
  Avatar,
  Switch,
  Input,
  SegmentedControl,
  Tabs,
  ScoreBadge,
  RatingChip,
  ProgressBar,
  Logo
} = NS;
const D = window.ICW_DATA;
const {
  useState,
  useEffect,
  useRef
} = React;
const Icon = ({
  n,
  s = 18,
  style
}) => /*#__PURE__*/React.createElement("i", {
  "data-lucide": n,
  style: {
    width: s,
    height: s,
    display: "inline-flex",
    ...style
  }
});
function refreshIcons() {
  setTimeout(() => window.lucide && window.lucide.createIcons(), 30);
}
function hue(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 360;
  return h;
}
function phStyle(title) {
  const h = hue(title);
  return {
    background: `linear-gradient(155deg, oklch(0.44 0.11 ${h}) 0%, oklch(0.28 0.08 ${(h + 30) % 360}) 65%, oklch(0.18 0.05 ${(h + 55) % 360}) 100%)`
  };
}
function PosterThumb({
  title,
  className,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: className,
    style: {
      ...phStyle(title),
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0
    }
  }));
}
const LANGS = ["EN", "JA", "KO", "ZH", "RU"];

/* ----------------------------------------------------------------- Header --- */
function Header({
  theme,
  onTheme,
  lang,
  onLang,
  query,
  setQuery,
  allTitles,
  onVerifyOpen,
  verified
}) {
  const [open, setOpen] = useState(false);
  const results = query.length >= 2 ? allTitles.filter(x => x.title.toLowerCase().includes(query.toLowerCase())).slice(0, 6) : [];
  return /*#__PURE__*/React.createElement("header", {
    className: "hdr"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap hdr__in"
  }, /*#__PURE__*/React.createElement(Logo, {
    size: 26
  }), /*#__PURE__*/React.createElement("nav", {
    className: "hdr__nav"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Library"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Guides"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Reading hub"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "About")), /*#__PURE__*/React.createElement("div", {
    className: "hdr__spacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "hdr__right"
  }, /*#__PURE__*/React.createElement("div", {
    className: "qsearch",
    onBlur: e => {
      if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
    }
  }, /*#__PURE__*/React.createElement(Input, {
    size: "sm",
    icon: /*#__PURE__*/React.createElement(Icon, {
      n: "search",
      s: 16
    }),
    placeholder: "Search titles\u2026",
    value: query,
    onFocus: () => setOpen(true),
    onChange: e => {
      setQuery(e.target.value);
      setOpen(true);
      refreshIcons();
    }
  }), open && results.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "qresults"
  }, results.map((r, i) => /*#__PURE__*/React.createElement("div", {
    className: "qresult",
    key: i,
    tabIndex: 0,
    onMouseDown: () => {
      setQuery("");
      setOpen(false);
    }
  }, /*#__PURE__*/React.createElement(PosterThumb, {
    title: r.title,
    className: "qresult__thumb",
    style: {
      position: "relative"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "qresult__t",
    style: {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, r.title), /*#__PURE__*/React.createElement("div", {
    className: "qresult__m"
  }, (r.source || "MangaDex").toUpperCase())))), /*#__PURE__*/React.createElement("div", {
    className: "qresult qresult--all",
    tabIndex: 0,
    onMouseDown: () => setOpen(false)
  }, "All results in Library \u2192"))), /*#__PURE__*/React.createElement("button", {
    className: "langpill",
    onClick: onLang,
    title: "UI language"
  }, lang, /*#__PURE__*/React.createElement(Icon, {
    n: "chevron-down",
    s: 13
  })), /*#__PURE__*/React.createElement(IconButton, {
    label: "Toggle theme",
    variant: "solid",
    onClick: onTheme
  }, /*#__PURE__*/React.createElement(Icon, {
    n: theme === "dark" ? "sun" : "moon"
  })), verified ? /*#__PURE__*/React.createElement(Avatar, {
    name: "Rei Tanaka",
    size: "md"
  }) : /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    onClick: onVerifyOpen
  }, "Join"))));
}

/* ------------------------------------------------------------------- Hero --- */
function Hero({
  items,
  onVerifyOpen
}) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useRef(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    if (paused || reduce.current) return;
    const t = setInterval(() => setIdx(i => (i + 1) % items.length), 6000);
    return () => clearInterval(t);
  }, [paused, items.length]);
  const f = items[idx];
  const bg = f.banner ? {
    backgroundImage: `url(${f.banner})`
  } : phStyle(f.title);
  return /*#__PURE__*/React.createElement("section", {
    className: "hero",
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocus: () => setPaused(true),
    onBlur: () => setPaused(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero__bg" + (f.adult ? " is-adult" : ""),
    style: bg
  }), /*#__PURE__*/React.createElement("div", {
    className: "wrap hero__in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero__content"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic-eyebrow"
  }, "Featured \xB7 ", (f.source || "MangaDex").toLowerCase()), /*#__PURE__*/React.createElement("h1", {
    className: "hero__title"
  }, f.title), /*#__PURE__*/React.createElement("p", {
    className: "hero__blurb"
  }, f.blurb), /*#__PURE__*/React.createElement("div", {
    className: "hero__meta"
  }, f.score != null && /*#__PURE__*/React.createElement(ScoreBadge, {
    score: f.score,
    onCover: true
  }), /*#__PURE__*/React.createElement(Badge, {
    variant: "neutral"
  }, f.status), /*#__PURE__*/React.createElement(RatingChip, {
    rating: f.rating
  })), /*#__PURE__*/React.createElement("div", {
    className: "hero__cta"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    iconStart: /*#__PURE__*/React.createElement(Icon, {
      n: "book-open",
      s: 18
    })
  }, "Read now"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg",
    style: {
      background: "rgba(255,255,255,.1)",
      color: "#fff",
      borderColor: "rgba(255,255,255,.25)"
    }
  }, "Details")))), /*#__PURE__*/React.createElement("div", {
    className: "hero__dots"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero__navbtns"
  }, /*#__PURE__*/React.createElement(IconButton, {
    label: "Previous",
    variant: "ghost-scrim",
    onClick: () => setIdx(i => (i - 1 + items.length) % items.length)
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "chevron-left"
  })), /*#__PURE__*/React.createElement(IconButton, {
    label: "Next",
    variant: "ghost-scrim",
    onClick: () => setIdx(i => (i + 1) % items.length)
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "chevron-right"
  }))), items.map((_, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    className: "dot" + (i === idx ? " is-active" : ""),
    "aria-label": "Featured " + (i + 1),
    onClick: () => setIdx(i)
  }))));
}

/* ------------------------------------------------------- Continue reading --- */
function ContinueReading({
  items
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section__titles"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic-eyebrow"
  }, "Pick up where you left off"), /*#__PURE__*/React.createElement("h2", {
    className: "section__heading"
  }, "Continue reading")), /*#__PURE__*/React.createElement("span", {
    className: "seeall"
  }, "Your library ", /*#__PURE__*/React.createElement(Icon, {
    n: "arrow-right",
    s: 15
  }))), /*#__PURE__*/React.createElement("div", {
    className: "continue"
  }, items.map((c, i) => /*#__PURE__*/React.createElement("button", {
    className: "cont-card",
    key: i
  }, /*#__PURE__*/React.createElement(PosterThumb, {
    title: c.title,
    className: "cont-card__thumb",
    style: {
      position: "relative"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "cont-card__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cont-card__title"
  }, c.title), /*#__PURE__*/React.createElement("div", {
    className: "cont-card__ch"
  }, c.chapter, " \xB7 ", c.progress, "%"), /*#__PURE__*/React.createElement(ProgressBar, {
    value: c.progress
  }))))));
}

/* -------------------------------------------------------------- Adult card --- */
function AdultCover({
  item,
  verified,
  onLocked
}) {
  const [hover, setHover] = useState(false);
  return /*#__PURE__*/React.createElement("span", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, /*#__PURE__*/React.createElement(CoverCard, _extends({}, item, {
    adult: true,
    revealed: verified && hover,
    onClick: () => {
      if (!verified) onLocked();
    }
  })));
}

/* ----------------------------------------------------------------- Shelf ---- */
function Shelf({
  shelf,
  verified,
  onLocked,
  query
}) {
  let items = shelf.items;
  if (query.length >= 2) {
    items = items.filter(x => x.title.toLowerCase().includes(query.toLowerCase()));
    if (items.length === 0) return null;
  }
  return /*#__PURE__*/React.createElement("section", {
    className: "section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section__titles"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic-eyebrow"
  }, shelf.eyebrow), /*#__PURE__*/React.createElement("h2", {
    className: "section__heading"
  }, shelf.heading, shelf.personalized && /*#__PURE__*/React.createElement("span", {
    className: "pz"
  }, "personalized"))), /*#__PURE__*/React.createElement("span", {
    className: "seeall"
  }, "See all ", /*#__PURE__*/React.createElement(Icon, {
    n: "arrow-right",
    s: 15
  }))), /*#__PURE__*/React.createElement("div", {
    className: "shelf"
  }, items.map((it, i) => it.adult ? /*#__PURE__*/React.createElement(AdultCover, {
    key: i,
    item: it,
    verified: verified,
    onLocked: onLocked
  }) : /*#__PURE__*/React.createElement(CoverCard, _extends({
    key: i
  }, it)))));
}

/* --------------------------------------------------------- Skeleton shelf --- */
function SkeletonShelf() {
  return /*#__PURE__*/React.createElement("section", {
    className: "section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section__titles"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sk sk-line",
    style: {
      width: 90
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "sk sk-line",
    style: {
      width: 150,
      height: 20,
      marginTop: 10
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "shelf"
  }, Array.from({
    length: 8
  }).map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "sk sk-cover"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sk sk-line",
    style: {
      width: "85%"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "sk sk-line",
    style: {
      width: "55%"
    }
  })))));
}

/* ----------------------------------------------------------- Infinite grid -- */
function MoreTitles({
  pool,
  query
}) {
  const [count, setCount] = useState(12);
  const [loading, setLoading] = useState(false);
  let pl = pool;
  if (query.length >= 2) pl = pool.filter(x => x.title.toLowerCase().includes(query.toLowerCase()));
  const shown = pl.slice(0, count);
  const done = count >= pl.length;
  const loadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setCount(c => c + 12);
      setLoading(false);
    }, 650);
  };
  return /*#__PURE__*/React.createElement("section", {
    className: "section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section__titles"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic-eyebrow"
  }, "Discover"), /*#__PURE__*/React.createElement("h2", {
    className: "section__heading"
  }, "More titles"))), /*#__PURE__*/React.createElement("div", {
    className: "mtgrid"
  }, shown.map((it, i) => /*#__PURE__*/React.createElement(CoverCard, _extends({
    key: it._k || i
  }, it)))), loading && /*#__PURE__*/React.createElement("div", {
    className: "mt-loadwrap"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic-eyebrow"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "loader",
    s: 14,
    style: {
      marginRight: 6
    }
  }), " Loading more\u2026")), !loading && !done && /*#__PURE__*/React.createElement("div", {
    className: "mt-loadwrap"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: loadMore,
    iconStart: /*#__PURE__*/React.createElement(Icon, {
      n: "plus",
      s: 16
    })
  }, "Load more")), done && /*#__PURE__*/React.createElement("div", {
    className: "mt-end"
  }, "You're all caught up"));
}

/* ---------------------------------------------------------------- Footer ---- */
function Footer() {
  const links = ["Guides", "Reading hub", "FAQ", "Library", "About", "Privacy", "Terms"];
  return /*#__PURE__*/React.createElement("footer", {
    className: "ftr"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap ftr__in"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 420
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    size: 24
  }), /*#__PURE__*/React.createElement("p", {
    className: "ftr__note"
  }, "Read manga, manhwa, webtoons and comics from across the web in one place. Results are cached briefly \u2014 repeats won't hammer the API. icomics.wiki is independent \u2014 not MangaDex.org."), /*#__PURE__*/React.createElement("div", {
    className: "ftr__copy"
  }, "\xA9 2026 iComics.wiki")), /*#__PURE__*/React.createElement("div", {
    className: "ftr__links"
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    href: "#",
    key: l
  }, l)))));
}

/* ----------------------------------------------------------- Age dialog ----- */
function AgeDialog({
  onClose,
  onVerify
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ic-dialog-scrim",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "ic-dialog",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "ic-dialog__title"
  }, "Mature content"), /*#__PURE__*/React.createElement("div", {
    className: "ic-dialog__body"
  }, "Some shelves and sources contain adult material. Confirm you are 18 or older to view them. We remember this on this device for about 24 hours \u2014 change it anytime in Settings."), /*#__PURE__*/React.createElement("div", {
    className: "ic-dialog__actions"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: onClose
  }, "Not now"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: onVerify
  }, "I'm 18 or older"))));
}

/* ------------------------------------------------------------------- App ---- */
function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("icw-theme") || "dark");
  const [lang, setLang] = useState("EN");
  const [verified, setVerified] = useState(() => localStorage.getItem("icw-verified") === "1");
  const [query, setQuery] = useState("");
  const [dialog, setDialog] = useState(false);
  const [demo, setDemo] = useState("content");
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("icw-theme", theme);
  }, [theme]);
  useEffect(() => {
    refreshIcons();
  });
  const allTitles = D.shelves.flatMap(s => s.adultOnly && !verified ? [] : s.items);
  const shelves = D.shelves.filter(s => !s.adultOnly || verified);
  const doVerify = () => {
    setVerified(true);
    localStorage.setItem("icw-verified", "1");
    setDialog(false);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "home"
  }, /*#__PURE__*/React.createElement(Header, {
    theme: theme,
    onTheme: () => setTheme(t => t === "dark" ? "light" : "dark"),
    lang: lang,
    onLang: () => setLang(l => LANGS[(LANGS.indexOf(l) + 1) % LANGS.length]),
    query: query,
    setQuery: setQuery,
    allTitles: allTitles,
    onVerifyOpen: () => setDialog(true),
    verified: verified
  }), query.length < 2 && /*#__PURE__*/React.createElement(Hero, {
    items: D.featured,
    onVerifyOpen: () => setDialog(true)
  }), /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, query.length < 2 && demo === "content" && /*#__PURE__*/React.createElement(ContinueReading, {
    items: D.continueReading
  }), demo === "loading" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SkeletonShelf, null), /*#__PURE__*/React.createElement(SkeletonShelf, null)), demo === "empty" && /*#__PURE__*/React.createElement("section", {
    className: "section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "state-block"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "library-big",
    s: 28
  }), /*#__PURE__*/React.createElement("h4", null, "Nothing on this shelf right now"), /*#__PURE__*/React.createElement("p", null, "A source came back empty. Browse the full catalog in the Library while it refreshes."), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    iconStart: /*#__PURE__*/React.createElement(Icon, {
      n: "arrow-right",
      s: 16
    })
  }, "Open Library"))), demo === "error" && /*#__PURE__*/React.createElement("section", {
    className: "section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "state-block"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "cloud-off",
    s: 28
  }), /*#__PURE__*/React.createElement("h4", null, "Showing cached picks"), /*#__PURE__*/React.createElement("p", null, "We couldn't reach a source, so these are recent cached results. We'll refresh automatically \u2014 nothing is broken."), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    iconStart: /*#__PURE__*/React.createElement(Icon, {
      n: "refresh-cw",
      s: 16
    })
  }, "Retry now"))), demo === "content" && shelves.map(s => /*#__PURE__*/React.createElement(Shelf, {
    key: s.id,
    shelf: s,
    verified: verified,
    onLocked: () => setDialog(true),
    query: query
  })), demo === "content" && query.length < 2 && /*#__PURE__*/React.createElement(MoreTitles, {
    pool: D.grid,
    query: query
  })), /*#__PURE__*/React.createElement(Footer, null), dialog && /*#__PURE__*/React.createElement(AgeDialog, {
    onClose: () => setDialog(false),
    onVerify: doVerify
  }), /*#__PURE__*/React.createElement("div", {
    className: "demobar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "demobar__label"
  }, "State"), /*#__PURE__*/React.createElement(SegmentedControl, {
    value: demo,
    onChange: setDemo,
    options: [{
      value: "content",
      label: "Content"
    }, {
      value: "loading",
      label: "Loading"
    }, {
      value: "empty",
      label: "Empty"
    }, {
      value: "error",
      label: "Error"
    }]
  })));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
refreshIcons();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/home/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/home/data.js
try { (() => {
// iComics.wiki — sample catalog data for the Home kit (titles are real catalog
// entries; covers are placeholders except the hero banner/cover).
window.ICW_DATA = function () {
  const t = (title, opts = {}) => Object.assign({
    title,
    source: "MangaDex",
    status: "Ongoing",
    rating: "safe"
  }, opts);
  const featured = [{
    title: "Byeoreul Pumeun Swordmaster",
    source: "MangaDex",
    status: "Ongoing",
    score: 8.2,
    rating: "safe",
    blurb: "A fallen swordmaster swallows a dying star and is reborn with the strength to rewrite his ruin — a manhwa of slow revenge and quiet resolve.",
    banner: "https://s4.anilist.co/file/anilistcdn/media/manga/banner/170400-EgLAQtqhdQAx.jpg",
    cover: "https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium/bx170400-yMIuOIboWuoO.jpg",
    hue: 28
  }, {
    title: "Tongari Boushi no Atelier",
    source: "MangaDex",
    status: "Ongoing",
    score: 8.7,
    rating: "safe",
    blurb: "In a world where magic is drawn, not spoken, a girl who saw something she shouldn't have is taken in by a witch — and learns the cost of every spell.",
    hue: 200
  }, {
    title: "Hwasangwihwan",
    source: "MangaDex",
    status: "Ongoing",
    score: 8.4,
    rating: "suggestive",
    blurb: "A grandmaster returns to his youth at the foot of the mountain sect that made him — and sets out to do it all better the second time.",
    hue: 150
  }];
  const romance = [t("Sono Bisque Doll wa Koi o Suru", {
    status: "Completed",
    rating: "suggestive",
    score: 8.1
  }), t("Kaoru Hana wa Rin to Saku", {
    score: 8.5
  }), t("Komi-san wa Komyushou Desu.", {
    status: "Completed",
    score: 8.0
  }), t("Ki ni Natteru Hito ga Otoko ja Nakatta", {
    score: 8.3
  }), t("Ijiranaide, Nagatoro-san", {
    status: "Completed",
    rating: "suggestive",
    score: 7.4
  }), t("Kusuriya no Hitorigoto", {
    rating: "suggestive",
    score: 9.0
  }), t("Mairimashita! Iruma-kun", {
    score: 7.8
  }), t("Otome Game Sekai wa Mob ni Kibishii Sekai desu", {
    status: "Completed",
    rating: "suggestive",
    score: 7.6
  }), t("Dosanko Gal wa Namara Menkoi", {
    status: "Completed",
    rating: "suggestive",
    score: 7.2
  })];
  const fantasy = [t("Tate no Yuusha no Nariagari", {
    score: 7.9
  }), t("The New Gate", {
    score: 7.7
  }), t("Tensei Shitara Ken deshita", {
    rating: "suggestive",
    score: 8.0
  }), t("Tondemo Skill de Isekai Hourou Meshi", {
    score: 7.9
  }), t("A Returner's Magic Should Be Special", {
    status: "Completed",
    score: 8.1
  }), t("Shuumatsu no Valkyrie", {
    rating: "suggestive",
    score: 7.6
  }), t("Sekai Saikou no Ansatsusha", {
    rating: "suggestive",
    score: 7.8
  }), t("Hitoribocchi no Isekai Kouryaku", {
    rating: "suggestive",
    score: 7.5
  })];
  const drama = [t("Attack on Titan", {
    status: "Completed",
    score: 9.0
  }), t("Kaiju No. 8", {
    status: "Completed",
    score: 8.2
  }), t("Kanojo, Okarishimasu", {
    rating: "suggestive",
    score: 6.9
  }), t("Watashi no Oshi wa Akuyaku Reijou.", {
    rating: "suggestive",
    score: 7.7
  }), t("Boushoku no Berserk", {
    score: 7.5
  }), t("Tensei Oujo to Tensai Reijou no Mahou Kakumei", {
    score: 8.0
  }), t("Haimiya-senpai wa Kowakute Kawaii", {
    score: 7.3
  })];
  const trending = [t("Choujin X", {
    status: "Trending #10",
    score: 7.6
  }), t("Shangri-La Frontier", {
    status: "Trending #11",
    score: 8.1
  }), t("Eleceed", {
    status: "Trending #7",
    score: 8.5
  }), t("Blue Lock", {
    status: "Trending #4",
    score: 8.2
  }), t("Muhanui Mabeopsa", {
    status: "Trending #3",
    score: 7.8
  }), t("Myeolmang Ihuui Segye", {
    status: "Trending #8",
    score: 7.6
  }), t("Hoegwihan Yongbyeongeun Da Gyehoegi Itda", {
    status: "Trending #6",
    score: 8.0
  })];
  const mangaHub = [t("Sousou no Frieren", {
    status: "Hiatus",
    score: 8.9
  }), t("Tensei Shitara Slime datta Ken", {
    score: 8.2
  }), t("Jujutsu Kaisen", {
    status: "Completed",
    rating: "suggestive",
    score: 8.6
  }), t("Chainsaw Man", {
    status: "Completed",
    rating: "suggestive",
    score: 8.7
  }), t("One Punch-Man", {
    rating: "suggestive",
    score: 8.8
  }), t("Kage no Jitsuryokusha ni Naritakute!", {
    score: 8.0
  }), t("Mieruko-chan", {
    score: 7.8
  }), t("Kumo desu ga, Nani ka?", {
    score: 7.6
  })];
  const fresh = [t("Mazoku no Musumetachi to Okuru Midareta Isekai Seikatsu", {
    rating: "suggestive"
  }), t("Itsumo no Coffee de Yoroshii desu ka?", {
    status: "Completed"
  }), t("Moto Saikyou Boukensha no Rojiura Caffe", {}), t("Kamikakushi no Kaerimichi", {}), t("Donuts wa Circus", {
    status: "Completed"
  }), t("Maju no Taisai", {
    status: "Completed"
  }), t("Lone-AU", {})];
  const manhwa = [t("Unintentional Love Story", {
    status: "Completed"
  }), t("I Will Seduce the Northern Duke", {
    status: "Completed"
  }), t("Emperor, Stay Here", {
    status: "Completed"
  }), t("Yongbi the Invincible", {
    status: "Completed"
  }), t("Skill of Lure", {
    status: "Completed",
    rating: "suggestive"
  }), t("Off Limits!", {}), t("The Kind Older Sister Is No More", {
    status: "Completed"
  })];
  const webtoons = [t("This Villainess Wants a Divorce!", {
    status: "Completed"
  }), t("Roxana", {
    status: "Hiatus"
  }), t("The Lady and the Beast", {
    status: "Completed"
  }), t("Dungeon Reset", {
    status: "Completed"
  }), t("The Max Level Hero Strikes Back", {}), t("Latna Saga: Survival of a Sword King", {}), t("Ibeon Saengeun Gajuga Doegetseumnida", {})];
  const adult = [t("Doujinshi — Spring Collection", {
    source: "nhentai",
    rating: "erotica",
    adult: true
  }), t("After Hours vol. 2", {
    source: "nhentai",
    rating: "erotica",
    adult: true
  }), t("Booru Gallery — Selected", {
    source: "booru",
    rating: "erotica",
    adult: true
  }), t("Late Night Anthology", {
    source: "nhentai",
    rating: "erotica",
    adult: true
  }), t("Midnight Doujin", {
    source: "nhentai",
    rating: "erotica",
    adult: true
  }), t("Crimson Pages", {
    source: "booru",
    rating: "erotica",
    adult: true
  })];
  const continueReading = [{
    title: "Sousou no Frieren",
    source: "MangaDex",
    chapter: "Ch. 92",
    progress: 62,
    rating: "safe"
  }, {
    title: "Blue Lock",
    source: "MangaDex",
    chapter: "Ch. 241",
    progress: 28,
    rating: "suggestive"
  }, {
    title: "Eleceed",
    source: "MangaDex",
    chapter: "Ch. 318",
    progress: 88,
    rating: "safe"
  }, {
    title: "Jujutsu Kaisen",
    source: "MangaDex",
    chapter: "Ch. 142",
    progress: 45,
    rating: "suggestive"
  }, {
    title: "Kaiju No. 8",
    source: "MangaDex",
    chapter: "Ch. 51",
    progress: 12,
    rating: "safe"
  }];

  // "More titles" infinite grid pool
  const grid = [].concat(mangaHub, manhwa, webtoons, fantasy, drama, fresh).map((x, i) => Object.assign({}, x, {
    _k: "g" + i
  }));
  const shelves = [{
    id: "romance",
    eyebrow: "Reader picks",
    heading: "Romance",
    items: romance
  }, {
    id: "fantasy",
    eyebrow: "Adventure reads",
    heading: "Fantasy",
    items: fantasy
  }, {
    id: "drama",
    eyebrow: "Emotional storytelling",
    heading: "Drama",
    items: drama
  }, {
    id: "trending",
    eyebrow: "Popular now",
    heading: "Trending",
    items: trending
  }, {
    id: "foryou",
    eyebrow: "Tuned to your reading",
    heading: "For you",
    items: shuffleSeed(mangaHub.concat(romance).slice(0, 8)),
    personalized: true
  }, {
    id: "manga",
    eyebrow: "Japanese comics",
    heading: "Manga Hub",
    items: mangaHub
  }, {
    id: "new",
    eyebrow: "Recently added",
    heading: "New",
    items: fresh
  }, {
    id: "manhwa",
    eyebrow: "Korean comics",
    heading: "Manhwa",
    items: manhwa
  }, {
    id: "webtoons",
    eyebrow: "Vertical reads",
    heading: "Webtoons",
    items: webtoons
  }, {
    id: "adult",
    eyebrow: "Mature · age-verified",
    heading: "Doujinshi",
    items: adult,
    adultOnly: true
  }];
  function shuffleSeed(arr) {
    const a = arr.slice();
    let s = 7;
    for (let i = a.length - 1; i > 0; i--) {
      s = (s * 9301 + 49297) % 233280;
      const j = Math.floor(s / 233280 * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  return {
    featured,
    shelves,
    continueReading,
    grid
  };
}();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/home/data.js", error: String((e && e.message) || e) }); }

// ui_kits/reader/reader.jsx
try { (() => {
/* iComics.wiki — Reader (classic / journal / flow + LTR/RTL + full controls). */
const RNS = window.IComicsWikiDesignSystem_3734a1;
const {
  Button,
  IconButton,
  SegmentedControl,
  Badge,
  ScoreBadge,
  ProgressBar,
  Logo
} = RNS;
const {
  useState,
  useEffect,
  useRef,
  useCallback
} = React;
const RIcon = ({
  n,
  s = 18,
  style
}) => /*#__PURE__*/React.createElement("i", {
  "data-lucide": n,
  style: {
    width: s,
    height: s,
    display: "inline-flex",
    ...style
  }
});
const rIcons = () => setTimeout(() => window.lucide && window.lucide.createIcons(), 20);
const CHAPTERS = [{
  n: 1,
  title: "The star that fell",
  pages: 16
}, {
  n: 2,
  title: "Ashes of the academy",
  pages: 20
}, {
  n: 3,
  title: "A blade remembered",
  pages: 18
}, {
  n: 4,
  title: "Official chapter (VIZ)",
  pages: 0,
  external: true
}, {
  n: 5,
  title: "Return to the foothills",
  pages: 14
}];
const ZMIN = 0.6,
  ZMAX = 2.6;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lastSpreadStart = P => {
  if (P <= 1) return 0;
  let s = P - 1;
  if (s % 2 === 0) s -= 1;
  return Math.max(1, s);
};

/* ---- placeholder page art ---- */
function PageArt({
  n,
  spread
}) {
  const layouts = ["1fr 1fr / 1fr", "1.4fr 1fr / 1fr 1fr", "1fr / 1fr", "1fr 1.2fr / 1fr 1fr"];
  const tmpl = layouts[n % layouts.length];
  const cells = n % 4 === 2 ? 1 : n % 4 === 1 || n % 4 === 3 ? 4 : 2;
  return /*#__PURE__*/React.createElement("div", {
    className: "page" + (spread ? " page--spread" : "")
  }, /*#__PURE__*/React.createElement("span", {
    className: "page__no"
  }, "P. ", n + 1), /*#__PURE__*/React.createElement("div", {
    className: "page__panels",
    style: {
      gridTemplate: tmpl
    }
  }, Array.from({
    length: cells
  }).map((_, i) => /*#__PURE__*/React.createElement("div", {
    className: "panel" + (i % 2 ? " dark" : ""),
    key: i
  }))), /*#__PURE__*/React.createElement("div", {
    className: "page__caption"
  }, "\u2014 placeholder page \u2014"));
}
function MiniArt() {
  return /*#__PURE__*/React.createElement("div", {
    className: "thumb__mini",
    style: {
      gridTemplate: "1fr 1fr / 1fr"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel"
  }), /*#__PURE__*/React.createElement("div", {
    className: "panel"
  }));
}
function Reader({
  start,
  onExit
}) {
  const [mode, setMode] = useState(() => localStorage.getItem("icw-rmode") || "classic");
  const [dir, setDir] = useState(() => localStorage.getItem("icw-rdir") || "ltr");
  const [rtheme, setRtheme] = useState(() => localStorage.getItem("icw-rtheme") || "dark");
  const [zoom, setZoom] = useState(() => parseFloat(localStorage.getItem("icw-rzoom")) || 1);
  const [ch, setCh] = useState(start.ch);
  const [page, setPage] = useState(start.page);
  const [uiHidden, setUiHidden] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [thumbs, setThumbs] = useState(false);
  const [help, setHelp] = useState(false);
  const [chmenu, setChmenu] = useState(false);
  const [resume, setResume] = useState(start.resume || null);
  const [fs, setFs] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const hideTimer = useRef(null);
  const anyOverlay = sheet || thumbs || help || chmenu;
  const cur = CHAPTERS[ch];
  const P = cur.pages;
  useEffect(() => {
    localStorage.setItem("icw-rmode", mode);
  }, [mode]);
  useEffect(() => {
    localStorage.setItem("icw-rdir", dir);
  }, [dir]);
  useEffect(() => {
    localStorage.setItem("icw-rtheme", rtheme);
  }, [rtheme]);
  useEffect(() => {
    localStorage.setItem("icw-rzoom", String(zoom));
  }, [zoom]);
  useEffect(() => {
    localStorage.setItem("icw-rpos", JSON.stringify({
      ch,
      page
    }));
  }, [ch, page]);
  useEffect(() => {
    rIcons();
  });

  /* ---- auto-hide UI ---- */
  const showUI = useCallback(() => {
    setUiHidden(false);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setUiHidden(true), 2800);
  }, []);
  useEffect(() => {
    showUI();
    return () => clearTimeout(hideTimer.current);
  }, [showUI]);
  useEffect(() => {
    if (anyOverlay) {
      setUiHidden(false);
      clearTimeout(hideTimer.current);
    }
  }, [anyOverlay]);

  /* ---- chapter movement ---- */
  const gotoChapter = (nc, landLast) => {
    if (nc < 0 || nc >= CHAPTERS.length) return;
    const np = landLast ? CHAPTERS[nc].external ? 0 : mode === "journal" ? lastSpreadStart(CHAPTERS[nc].pages) : CHAPTERS[nc].pages - 1 : 0;
    setCh(nc);
    setPage(Math.max(0, np));
    if (stageRef.current && mode === "flow") stageRef.current.scrollTop = landLast ? stageRef.current.scrollHeight : 0;
  };

  /* ---- reading-order forward / back (paged modes) ---- */
  const forward = useCallback(() => {
    if (cur.external) {
      gotoChapter(ch + 1, false);
      return;
    }
    if (mode === "journal") {
      const next = page === 0 ? 1 : page + 2;
      if (next > P - 1) gotoChapter(ch + 1, false);else setPage(next);
    } else {
      const next = page + 1;
      if (next > P - 1) gotoChapter(ch + 1, false);else setPage(next);
    }
  }, [mode, page, P, ch, cur]);
  const backward = useCallback(() => {
    if (cur.external) {
      gotoChapter(ch - 1, true);
      return;
    }
    if (mode === "journal") {
      if (page === 0) gotoChapter(ch - 1, true);else setPage(page === 1 ? 0 : page - 2);
    } else {
      if (page === 0) gotoChapter(ch - 1, true);else setPage(page - 1);
    }
  }, [mode, page, ch, cur]);

  /* ---- keyboard ---- */
  useEffect(() => {
    const onKey = e => {
      const tag = (e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || e.target.isContentEditable) return;
      showUI();
      const k = e.key;
      if (k === "Escape") {
        if (anyOverlay) {
          setSheet(false);
          setThumbs(false);
          setHelp(false);
          setChmenu(false);
        } else onExit();
        return;
      }
      if (k === "f" || k === "F") {
        e.preventDefault();
        toggleFs();
        return;
      }
      if (mode !== "flow" && k === "0") {
        setZoom(1);
        return;
      }
      if (mode !== "flow" && (k === "+" || k === "=")) {
        setZoom(z => clamp(+(z + 0.15).toFixed(2), ZMIN, ZMAX));
        return;
      }
      if (mode !== "flow" && (k === "-" || k === "_")) {
        setZoom(z => clamp(+(z - 0.15).toFixed(2), ZMIN, ZMAX));
        return;
      }
      if (k === "Home") {
        e.preventDefault();
        setPage(0);
        if (stageRef.current) stageRef.current.scrollTop = 0;
        return;
      }
      if (k === "End") {
        e.preventDefault();
        if (mode === "flow") {
          if (stageRef.current) stageRef.current.scrollTop = stageRef.current.scrollHeight;
        } else setPage(mode === "journal" ? lastSpreadStart(P) : P - 1);
        return;
      }
      if (mode === "flow") {
        if (k === "ArrowDown" || k === "PageDown" || k === " ") {
          e.preventDefault();
          stageRef.current.scrollBy({
            top: window.innerHeight * 0.85
          });
        }
        if (k === "ArrowUp" || k === "PageUp") {
          e.preventDefault();
          stageRef.current.scrollBy({
            top: -window.innerHeight * 0.85
          });
        }
        return;
      }
      if (k === " ") {
        e.preventDefault();
        forward();
        return;
      }
      if (k === "ArrowRight") {
        e.preventDefault();
        dir === "ltr" ? forward() : backward();
      }
      if (k === "ArrowLeft") {
        e.preventDefault();
        dir === "ltr" ? backward() : forward();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, dir, forward, backward, anyOverlay, showUI, P]);

  /* ---- ctrl/cmd + wheel zoom (paged) ---- */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onWheel = e => {
      if (mode === "flow") return;
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setZoom(z => clamp(+(z - Math.sign(e.deltaY) * 0.12).toFixed(2), ZMIN, ZMAX));
      }
    };
    el.addEventListener("wheel", onWheel, {
      passive: false
    });
    return () => el.removeEventListener("wheel", onWheel);
  }, [mode]);

  /* ---- swipe (touch) ---- */
  const touch = useRef(null);
  const onTouchStart = e => {
    const t = e.touches[0];
    touch.current = {
      x: t.clientX,
      y: t.clientY
    };
  };
  const onTouchEnd = e => {
    if (!touch.current || mode === "flow") return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touch.current.x,
      dy = t.clientY - touch.current.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      const swipeLeft = dx < 0;
      if (swipeLeft) dir === "ltr" ? forward() : backward();else dir === "ltr" ? backward() : forward();
    }
    touch.current = null;
  };

  /* ---- fullscreen ---- */
  const toggleFs = () => {
    const el = rootRef.current;
    if (!document.fullscreenElement) {
      el.requestFullscreen && el.requestFullscreen().then(() => setFs(true)).catch(() => {});
    } else {
      document.exitFullscreen && document.exitFullscreen();
      setFs(false);
    }
  };
  useEffect(() => {
    const h = () => setFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);

  /* ---- flow scroll progress + chapter boundaries ---- */
  const onScroll = () => {
    const el = stageRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setScrollPct(max > 0 ? Math.round(el.scrollTop / max * 100) : 0);
  };
  useEffect(() => {
    if (mode === "flow" && stageRef.current) {
      stageRef.current.scrollTop = 0;
      setScrollPct(0);
    }
  }, [mode, ch]);

  /* ---- zones ---- */
  const zoneEdge = side => {
    // side 'l' or 'r'
    if (side === "r") dir === "ltr" ? forward() : backward();else dir === "ltr" ? backward() : forward();
  };

  /* ---- progress label + fraction ---- */
  const N = CHAPTERS.length;
  let label, frac;
  if (cur.external) {
    label = `Ch ${ch + 1}/${N} · external`;
    frac = (ch + 0.5) / N;
  } else if (mode === "flow") {
    label = `Ch ${ch + 1}/${N} · ${scrollPct}%`;
    frac = (ch + scrollPct / 100) / N;
  } else {
    label = `Ch ${ch + 1}/${N} · ${page + 1}/${P}`;
    frac = (ch + (page + 1) / P) / N;
  }

  /* ---- page view (classic / journal) ---- */
  const renderPaged = () => {
    if (cur.external) return /*#__PURE__*/React.createElement("div", {
      className: "external"
    }, /*#__PURE__*/React.createElement(RIcon, {
      n: "external-link",
      s: 30
    }), /*#__PURE__*/React.createElement("h3", null, "Read on the official platform"), /*#__PURE__*/React.createElement("p", null, "This chapter is licensed and read on the publisher's site \u2014 there are no in-app pages for it. Your progress still tracks at the chapter level."), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      iconStart: /*#__PURE__*/React.createElement(RIcon, {
        n: "external-link",
        s: 16
      })
    }, "Open official reader"));
    let pages;
    if (mode === "journal") {
      pages = page === 0 ? [0] : [page, page + 1].filter(p => p <= P - 1);
    } else {
      pages = [page];
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "pageview" + (mode === "journal" && dir === "rtl" ? " pageview--rtl" : ""),
      style: {
        transform: `scale(${zoom})`
      }
    }, pages.map(p => /*#__PURE__*/React.createElement(PageArt, {
      key: p,
      n: p,
      spread: mode === "journal" && pages.length > 1
    })));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "reader" + (uiHidden && !anyOverlay ? " ui-hidden" : ""),
    "data-reader": rtheme,
    ref: rootRef,
    onMouseMove: showUI,
    onTouchStart: e => {
      showUI();
      onTouchStart(e);
    },
    onTouchEnd: onTouchEnd
  }, mode === "flow" && !cur.external ? /*#__PURE__*/React.createElement("div", {
    className: "stage stage--flow",
    ref: stageRef,
    onScroll: onScroll
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "64px 0 96px"
    }
  }, Array.from({
    length: P
  }).map((_, p) => /*#__PURE__*/React.createElement("div", {
    className: "page flowpage",
    key: p,
    style: {
      width: "min(640px,94vw)",
      aspectRatio: "2/3"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "page__no"
  }, "P. ", p + 1), /*#__PURE__*/React.createElement("div", {
    className: "page__panels",
    style: {
      gridTemplate: "1fr 1fr / 1fr"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel"
  }), /*#__PURE__*/React.createElement("div", {
    className: "panel dark"
  })), /*#__PURE__*/React.createElement("div", {
    className: "page__caption"
  }, "\u2014 placeholder strip \u2014"))))) : /*#__PURE__*/React.createElement("div", {
    className: "stage"
  }, renderPaged()), mode !== "flow" && !cur.external && /*#__PURE__*/React.createElement("div", {
    className: "zones"
  }, /*#__PURE__*/React.createElement("div", {
    className: "zone zone--edge",
    onClick: () => zoneEdge("l")
  }, /*#__PURE__*/React.createElement("span", {
    className: "zonehint zonehint--l"
  }, /*#__PURE__*/React.createElement(RIcon, {
    n: dir === "ltr" ? "chevron-left" : "chevron-right"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "zone zone--center",
    onClick: () => setUiHidden(h => !h)
  }), /*#__PURE__*/React.createElement("div", {
    className: "zone zone--edge",
    onClick: () => zoneEdge("r")
  }, /*#__PURE__*/React.createElement("span", {
    className: "zonehint zonehint--r"
  }, /*#__PURE__*/React.createElement(RIcon, {
    n: dir === "ltr" ? "chevron-right" : "chevron-left"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "rbar rbar--top"
  }, /*#__PURE__*/React.createElement(IconButton, {
    label: "Back to title",
    variant: "ghost-scrim",
    onClick: onExit
  }, /*#__PURE__*/React.createElement(RIcon, {
    n: "arrow-left"
  })), /*#__PURE__*/React.createElement("div", {
    className: "rtitle"
  }, /*#__PURE__*/React.createElement("b", null, "Byeoreul Pumeun Swordmaster"), /*#__PURE__*/React.createElement("span", null, "CH. ", cur.n, " \xB7 ", cur.title.toUpperCase())), /*#__PURE__*/React.createElement("div", {
    className: "rspacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "rtools"
  }, /*#__PURE__*/React.createElement("button", {
    className: "gbtn",
    onClick: () => setChmenu(v => !v),
    "aria-label": "Chapters"
  }, /*#__PURE__*/React.createElement(RIcon, {
    n: "list"
  })), /*#__PURE__*/React.createElement("button", {
    className: "gbtn",
    onClick: () => setThumbs(true),
    "aria-label": "Page overview"
  }, /*#__PURE__*/React.createElement(RIcon, {
    n: "layout-grid"
  })), /*#__PURE__*/React.createElement("button", {
    className: "gbtn",
    onClick: () => setHelp(true),
    "aria-label": "Keyboard shortcuts"
  }, /*#__PURE__*/React.createElement(RIcon, {
    n: "keyboard"
  })), /*#__PURE__*/React.createElement("button", {
    className: "gbtn" + (fs ? " is-on" : ""),
    onClick: toggleFs,
    "aria-label": "Fullscreen"
  }, /*#__PURE__*/React.createElement(RIcon, {
    n: fs ? "minimize" : "maximize"
  })), /*#__PURE__*/React.createElement("button", {
    className: "gbtn",
    onClick: () => setSheet(true),
    "aria-label": "Reader settings"
  }, /*#__PURE__*/React.createElement(RIcon, {
    n: "settings-2"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "rbar rbar--bottom"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rprog"
  }, /*#__PURE__*/React.createElement("button", {
    className: "gbtn",
    onClick: () => dir === "ltr" ? backward() : forward(),
    "aria-label": "Previous"
  }, /*#__PURE__*/React.createElement(RIcon, {
    n: "chevron-left",
    s: 20
  })), /*#__PURE__*/React.createElement("div", {
    className: "rprog__bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rprog__fill",
    style: {
      width: clamp(frac * 100, 0, 100) + "%"
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "rprog__label"
  }, label), /*#__PURE__*/React.createElement("button", {
    className: "gbtn",
    onClick: () => dir === "ltr" ? forward() : backward(),
    "aria-label": "Next"
  }, /*#__PURE__*/React.createElement(RIcon, {
    n: "chevron-right",
    s: 20
  })))), chmenu && /*#__PURE__*/React.createElement("div", {
    className: "chmenu"
  }, CHAPTERS.map((c, i) => /*#__PURE__*/React.createElement("div", {
    className: "chitem" + (i === ch ? " is-current" : ""),
    key: i,
    onClick: () => {
      gotoChapter(i, false);
      setChmenu(false);
    }
  }, /*#__PURE__*/React.createElement("span", null, "Ch. ", c.n, " \xB7 ", c.title), /*#__PURE__*/React.createElement("em", null, c.external ? "ext" : c.pages + "p")))), resume && /*#__PURE__*/React.createElement("div", {
    className: "resume"
  }, /*#__PURE__*/React.createElement("span", null, "Continue from Ch. ", resume.ch + 1, ", page ", resume.page + 1, "?"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "primary",
    onClick: () => {
      setCh(resume.ch);
      setPage(resume.page);
      setResume(null);
    }
  }, "Resume"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost",
    onClick: () => {
      setResume(null);
    }
  }, "Start over")), sheet && /*#__PURE__*/React.createElement("div", {
    className: "sheet-scrim",
    onClick: () => setSheet(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "sheet",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "sheet__head"
  }, /*#__PURE__*/React.createElement("h3", null, "Reader settings"), /*#__PURE__*/React.createElement(IconButton, {
    label: "Close",
    variant: "ghost",
    onClick: () => setSheet(false)
  }, /*#__PURE__*/React.createElement(RIcon, {
    n: "x"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "setrow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic-eyebrow"
  }, "View mode"), /*#__PURE__*/React.createElement(SegmentedControl, {
    value: mode,
    onChange: setMode,
    options: [{
      value: "classic",
      label: "Classic",
      icon: /*#__PURE__*/React.createElement(RIcon, {
        n: "square",
        s: 15
      })
    }, {
      value: "journal",
      label: "Journal",
      icon: /*#__PURE__*/React.createElement(RIcon, {
        n: "book-open",
        s: 15
      })
    }, {
      value: "flow",
      label: "Flow",
      icon: /*#__PURE__*/React.createElement(RIcon, {
        n: "scroll-text",
        s: 15
      })
    }]
  })), /*#__PURE__*/React.createElement("div", {
    className: "setrow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic-eyebrow"
  }, "Reading direction"), /*#__PURE__*/React.createElement(SegmentedControl, {
    accent: true,
    value: dir,
    onChange: setDir,
    options: [{
      value: "ltr",
      label: "Left → Right"
    }, {
      value: "rtl",
      label: "Right → Left"
    }]
  })), /*#__PURE__*/React.createElement("div", {
    className: "setrow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic-eyebrow"
  }, "Reader theme"), /*#__PURE__*/React.createElement(SegmentedControl, {
    value: rtheme,
    onChange: setRtheme,
    options: [{
      value: "light",
      label: "Light"
    }, {
      value: "sepia",
      label: "Sepia"
    }, {
      value: "dark",
      label: "Dark"
    }]
  })), /*#__PURE__*/React.createElement("div", {
    className: "setrow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic-eyebrow"
  }, "Zoom ", mode === "flow" ? "(paged modes only)" : ""), /*#__PURE__*/React.createElement("div", {
    className: "zoomctl"
  }, /*#__PURE__*/React.createElement(IconButton, {
    label: "Zoom out",
    variant: "solid",
    onClick: () => setZoom(z => clamp(+(z - 0.15).toFixed(2), ZMIN, ZMAX)),
    disabled: mode === "flow"
  }, /*#__PURE__*/React.createElement(RIcon, {
    n: "minus"
  })), /*#__PURE__*/React.createElement("b", null, Math.round(zoom * 100), "%"), /*#__PURE__*/React.createElement(IconButton, {
    label: "Zoom in",
    variant: "solid",
    onClick: () => setZoom(z => clamp(+(z + 0.15).toFixed(2), ZMIN, ZMAX)),
    disabled: mode === "flow"
  }, /*#__PURE__*/React.createElement(RIcon, {
    n: "plus"
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    onClick: () => setZoom(1),
    disabled: mode === "flow"
  }, "Reset"))), /*#__PURE__*/React.createElement("div", {
    className: "setrow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "setrow__inline"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    block: true,
    iconStart: /*#__PURE__*/React.createElement(RIcon, {
      n: "layout-grid",
      s: 16
    }),
    onClick: () => {
      setThumbs(true);
      setSheet(false);
    }
  }, "Page overview")), /*#__PURE__*/React.createElement("div", {
    className: "setrow__inline"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    block: true,
    iconStart: /*#__PURE__*/React.createElement(RIcon, {
      n: "keyboard",
      s: 16
    }),
    onClick: () => {
      setHelp(true);
      setSheet(false);
    }
  }, "Keyboard shortcuts"))))), thumbs && /*#__PURE__*/React.createElement("div", {
    className: "thumbs-scrim",
    onClick: () => setThumbs(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "thumbs-grid",
    onClick: e => e.stopPropagation()
  }, Array.from({
    length: Math.max(P, 1)
  }).map((_, p) => /*#__PURE__*/React.createElement("div", {
    className: "thumb" + (p === page ? " is-current" : ""),
    key: p,
    onClick: () => {
      setPage(mode === "journal" && p > 0 ? p % 2 ? p : p - 1 : p);
      setThumbs(false);
    }
  }, /*#__PURE__*/React.createElement(MiniArt, null), /*#__PURE__*/React.createElement("span", {
    className: "thumb__no"
  }, p + 1))))), help && /*#__PURE__*/React.createElement("div", {
    className: "help-scrim",
    onClick: () => setHelp(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "help",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("h3", null, "Keyboard & gestures"), /*#__PURE__*/React.createElement("div", {
    className: "help__grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "help__row"
  }, /*#__PURE__*/React.createElement("span", null, "Next / previous page"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, "\u2190"), " ", /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, "\u2192"))), /*#__PURE__*/React.createElement("div", {
    className: "help__row"
  }, /*#__PURE__*/React.createElement("span", null, "Page forward"), /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, "Space")), /*#__PURE__*/React.createElement("div", {
    className: "help__row"
  }, /*#__PURE__*/React.createElement("span", null, "Scroll (flow)"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, "\u2191"), " ", /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, "\u2193"))), /*#__PURE__*/React.createElement("div", {
    className: "help__row"
  }, /*#__PURE__*/React.createElement("span", null, "First / last page"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, "Home"), " ", /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, "End"))), /*#__PURE__*/React.createElement("div", {
    className: "help__row"
  }, /*#__PURE__*/React.createElement("span", null, "Zoom in / out (paged)"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, "+"), " ", /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, "\u2212"))), /*#__PURE__*/React.createElement("div", {
    className: "help__row"
  }, /*#__PURE__*/React.createElement("span", null, "Reset zoom"), /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, "0")), /*#__PURE__*/React.createElement("div", {
    className: "help__row"
  }, /*#__PURE__*/React.createElement("span", null, "Fullscreen"), /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, "F")), /*#__PURE__*/React.createElement("div", {
    className: "help__row"
  }, /*#__PURE__*/React.createElement("span", null, "Exit to title"), /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, "Esc")), /*#__PURE__*/React.createElement("div", {
    className: "help__row"
  }, /*#__PURE__*/React.createElement("span", null, "Tap zones"), /*#__PURE__*/React.createElement("span", null, "L \xB7 prev \u2014 C \xB7 UI \u2014 R \xB7 next")), /*#__PURE__*/React.createElement("div", {
    className: "help__row"
  }, /*#__PURE__*/React.createElement("span", null, "Swipe (touch)"), /*#__PURE__*/React.createElement("span", null, "horizontal, direction-aware"))), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 18,
      fontSize: 12,
      opacity: .6,
      fontFamily: "var(--font-mono)"
    }
  }, "Direction-aware controls flip with RTL."))));
}

/* ----------------------------------- launcher (fake detail → reader) ------- */
function App() {
  const [open, setOpen] = useState(false);
  const saved = (() => {
    try {
      return JSON.parse(localStorage.getItem("icw-rpos"));
    } catch (e) {
      return null;
    }
  })();
  const startFresh = {
    ch: 0,
    page: 0,
    resume: null
  };
  const startResume = saved && (saved.ch > 0 || saved.page > 0) ? {
    ch: 0,
    page: 0,
    resume: saved
  } : startFresh;
  useEffect(() => {
    rIcons();
  });
  if (open) return /*#__PURE__*/React.createElement(Reader, {
    start: open === "resume" ? startResume : startFresh,
    onExit: () => setOpen(false)
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "launch"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 460,
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 18,
      padding: 24
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    size: 28
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 150,
      aspectRatio: "2/3",
      borderRadius: 8,
      boxShadow: "var(--cover-frame), var(--shadow-md)",
      background: "linear-gradient(155deg, oklch(0.45 0.12 30), oklch(0.24 0.07 60))"
    }
  }), /*#__PURE__*/React.createElement("h1", {
    className: "ic-display",
    style: {
      fontSize: 40
    }
  }, "Byeoreul Pumeun Swordmaster"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(ScoreBadge, {
    score: 8.2
  }), /*#__PURE__*/React.createElement(Badge, {
    variant: "neutral"
  }, "Ongoing")), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 15,
      lineHeight: 1.6
    }
  }, "Open the reader to try Classic, Journal and Flow modes, LTR/RTL, zoom, themes, the page grid, and keyboard shortcuts."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    iconStart: /*#__PURE__*/React.createElement(RIcon, {
      n: "book-open",
      s: 18
    }),
    onClick: () => setOpen("fresh")
  }, "Start reading"), saved && (saved.ch > 0 || saved.page > 0) && /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg",
    onClick: () => setOpen("resume")
  }, "Continue \xB7 Ch ", saved.ch + 1))));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
rIcons();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/reader/reader.jsx", error: String((e && e.message) || e) }); }

__ds_ns.CoverCard = __ds_scope.CoverCard;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.RatingChip = __ds_scope.RatingChip;

__ds_ns.ScoreBadge = __ds_scope.ScoreBadge;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.SegmentedControl = __ds_scope.SegmentedControl;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
