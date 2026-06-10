Content-rating dot + label.

```jsx
<RatingChip rating="safe" />
<RatingChip rating="suggestive" />
<RatingChip rating="erotica" showLabel={false} />
```

Colors: safe = green, suggestive = yellow, erotica = pink. This labels content; gating (blur/verify) is handled by `CoverCard` / the age gate.
