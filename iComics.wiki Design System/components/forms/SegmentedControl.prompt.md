Single-select pill group — reader view mode, reading direction, theme, and other compact switches.

```jsx
<SegmentedControl
  value={mode}
  onChange={setMode}
  options={[
    { value: "classic", label: "Classic", icon: <Square size={15} /> },
    { value: "journal", label: "Journal", icon: <BookOpen size={15} /> },
    { value: "flow", label: "Flow", icon: <ScrollText size={15} /> },
  ]}
/>
```

`accent` fills the active segment with marigold. Options can be plain strings too.
