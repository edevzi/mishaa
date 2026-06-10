The catalog's primary unit — poster + title + light metadata. Used in every shelf, the infinite grid, Library, and related titles.

```jsx
<CoverCard title="Sousou no Frieren" source="MangaDex" status="Hiatus" score={8.9} rating="safe" onClick={open} />
<CoverCard title="Continue…" cover={url} progress={62} />
<CoverCard title="Doujinshi vol.3" adult revealed={verified} rating="erotica" />
```

Omitting `cover` renders a deterministic warm placeholder poster (good for loading/empty). `adult` blurs + locks until `revealed`. `progress` (0–100) draws the resume bar.
