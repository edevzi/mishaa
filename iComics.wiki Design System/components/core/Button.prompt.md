Primary action control — use marigold `primary` for the one key action on a view, everything else `secondary`/`ghost`.

```jsx
<Button variant="primary" iconStart={<BookOpen size={16} />}>Read now</Button>
<Button variant="secondary">Add to library</Button>
<Button variant="ghost" size="sm">See all</Button>
```

Variants: `primary` (marigold, dark ink text) · `secondary` (outlined surface) · `ghost` (transparent) · `danger`.
Sizes: `sm` (34) · `md` (42) · `lg` (52). Props: `block`, `iconStart`, `iconEnd`, `disabled`, `as` (e.g. `as="a"` for links).
