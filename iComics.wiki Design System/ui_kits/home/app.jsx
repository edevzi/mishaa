/* iComics.wiki — Home (interactive kit). One file to keep React scope simple. */
const NS = window.IComicsWikiDesignSystem_3734a1;
const { CoverCard, Button, IconButton, Badge, Tag, Avatar, Switch, Input,
        SegmentedControl, Tabs, ScoreBadge, RatingChip, ProgressBar, Logo } = NS;
const D = window.ICW_DATA;
const { useState, useEffect, useRef } = React;

const Icon = ({ n, s = 18, style }) => <i data-lucide={n} style={{ width: s, height: s, display: "inline-flex", ...style }} />;
function refreshIcons() { setTimeout(() => window.lucide && window.lucide.createIcons(), 30); }

function hue(str = "") { let h = 0; for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 360; return h; }
function phStyle(title) {
  const h = hue(title);
  return { background: `linear-gradient(155deg, oklch(0.44 0.11 ${h}) 0%, oklch(0.28 0.08 ${(h + 30) % 360}) 65%, oklch(0.18 0.05 ${(h + 55) % 360}) 100%)` };
}
function PosterThumb({ title, className, style }) {
  return <span className={className} style={{ ...phStyle(title), ...style }}><span style={{ position: "absolute", inset: 0 }} /></span>;
}

const LANGS = ["EN", "JA", "KO", "ZH", "RU"];

/* ----------------------------------------------------------------- Header --- */
function Header({ theme, onTheme, lang, onLang, query, setQuery, allTitles, onVerifyOpen, verified }) {
  const [open, setOpen] = useState(false);
  const results = query.length >= 2
    ? allTitles.filter(x => x.title.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
    : [];
  return (
    <header className="hdr">
      <div className="wrap hdr__in">
        <Logo size={26} />
        <nav className="hdr__nav">
          <a href="#">Library</a><a href="#">Guides</a><a href="#">Reading hub</a><a href="#">About</a>
        </nav>
        <div className="hdr__spacer" />
        <div className="hdr__right">
          <div className="qsearch" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); }}>
            <Input size="sm" icon={<Icon n="search" s={16} />} placeholder="Search titles…"
              value={query} onFocus={() => setOpen(true)}
              onChange={(e) => { setQuery(e.target.value); setOpen(true); refreshIcons(); }} />
            {open && results.length > 0 && (
              <div className="qresults">
                {results.map((r, i) => (
                  <div className="qresult" key={i} tabIndex={0} onMouseDown={() => { setQuery(""); setOpen(false); }}>
                    <PosterThumb title={r.title} className="qresult__thumb" style={{ position: "relative" }} />
                    <div style={{ minWidth: 0 }}>
                      <div className="qresult__t" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.title}</div>
                      <div className="qresult__m">{(r.source || "MangaDex").toUpperCase()}</div>
                    </div>
                  </div>
                ))}
                <div className="qresult qresult--all" tabIndex={0} onMouseDown={() => setOpen(false)}>All results in Library →</div>
              </div>
            )}
          </div>
          <button className="langpill" onClick={onLang} title="UI language">{lang}<Icon n="chevron-down" s={13} /></button>
          <IconButton label="Toggle theme" variant="solid" onClick={onTheme}>
            <Icon n={theme === "dark" ? "sun" : "moon"} />
          </IconButton>
          {verified
            ? <Avatar name="Rei Tanaka" size="md" />
            : <Button variant="primary" size="sm" onClick={onVerifyOpen}>Join</Button>}
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------- Hero --- */
function Hero({ items, onVerifyOpen }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useRef(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    if (paused || reduce.current) return;
    const t = setInterval(() => setIdx(i => (i + 1) % items.length), 6000);
    return () => clearInterval(t);
  }, [paused, items.length]);
  const f = items[idx];
  const bg = f.banner ? { backgroundImage: `url(${f.banner})` } : phStyle(f.title);
  return (
    <section className="hero" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className={"hero__bg" + (f.adult ? " is-adult" : "")} style={bg} />
      <div className="wrap hero__in">
        <div className="hero__content">
          <span className="ic-eyebrow">Featured · {(f.source || "MangaDex").toLowerCase()}</span>
          <h1 className="hero__title">{f.title}</h1>
          <p className="hero__blurb">{f.blurb}</p>
          <div className="hero__meta">
            {f.score != null && <ScoreBadge score={f.score} onCover />}
            <Badge variant="neutral">{f.status}</Badge>
            <RatingChip rating={f.rating} />
          </div>
          <div className="hero__cta">
            <Button variant="primary" size="lg" iconStart={<Icon n="book-open" s={18} />}>Read now</Button>
            <Button variant="secondary" size="lg" style={{ background: "rgba(255,255,255,.1)", color: "#fff", borderColor: "rgba(255,255,255,.25)" }}>Details</Button>
          </div>
        </div>
      </div>
      <div className="hero__dots">
        <div className="hero__navbtns">
          <IconButton label="Previous" variant="ghost-scrim" onClick={() => setIdx(i => (i - 1 + items.length) % items.length)}><Icon n="chevron-left" /></IconButton>
          <IconButton label="Next" variant="ghost-scrim" onClick={() => setIdx(i => (i + 1) % items.length)}><Icon n="chevron-right" /></IconButton>
        </div>
        {items.map((_, i) => <button key={i} className={"dot" + (i === idx ? " is-active" : "")} aria-label={"Featured " + (i + 1)} onClick={() => setIdx(i)} />)}
      </div>
    </section>
  );
}

/* ------------------------------------------------------- Continue reading --- */
function ContinueReading({ items }) {
  return (
    <section className="section">
      <div className="section__head">
        <div className="section__titles">
          <span className="ic-eyebrow">Pick up where you left off</span>
          <h2 className="section__heading">Continue reading</h2>
        </div>
        <span className="seeall">Your library <Icon n="arrow-right" s={15} /></span>
      </div>
      <div className="continue">
        {items.map((c, i) => (
          <button className="cont-card" key={i}>
            <PosterThumb title={c.title} className="cont-card__thumb" style={{ position: "relative" }} />
            <div className="cont-card__body">
              <div className="cont-card__title">{c.title}</div>
              <div className="cont-card__ch">{c.chapter} · {c.progress}%</div>
              <ProgressBar value={c.progress} />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Adult card --- */
function AdultCover({ item, verified, onLocked }) {
  const [hover, setHover] = useState(false);
  return (
    <span onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <CoverCard {...item} adult revealed={verified && hover}
        onClick={() => { if (!verified) onLocked(); }} />
    </span>
  );
}

/* ----------------------------------------------------------------- Shelf ---- */
function Shelf({ shelf, verified, onLocked, query }) {
  let items = shelf.items;
  if (query.length >= 2) {
    items = items.filter(x => x.title.toLowerCase().includes(query.toLowerCase()));
    if (items.length === 0) return null;
  }
  return (
    <section className="section">
      <div className="section__head">
        <div className="section__titles">
          <span className="ic-eyebrow">{shelf.eyebrow}</span>
          <h2 className="section__heading">{shelf.heading}{shelf.personalized && <span className="pz">personalized</span>}</h2>
        </div>
        <span className="seeall">See all <Icon n="arrow-right" s={15} /></span>
      </div>
      <div className="shelf">
        {items.map((it, i) =>
          it.adult
            ? <AdultCover key={i} item={it} verified={verified} onLocked={onLocked} />
            : <CoverCard key={i} {...it} />
        )}
      </div>
    </section>
  );
}

/* --------------------------------------------------------- Skeleton shelf --- */
function SkeletonShelf() {
  return (
    <section className="section">
      <div className="section__head"><div className="section__titles">
        <span className="sk sk-line" style={{ width: 90 }} />
        <span className="sk sk-line" style={{ width: 150, height: 20, marginTop: 10 }} />
      </div></div>
      <div className="shelf">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}><div className="sk sk-cover" /><div className="sk sk-line" style={{ width: "85%" }} /><div className="sk sk-line" style={{ width: "55%" }} /></div>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- Infinite grid -- */
function MoreTitles({ pool, query }) {
  const [count, setCount] = useState(12);
  const [loading, setLoading] = useState(false);
  let pl = pool;
  if (query.length >= 2) pl = pool.filter(x => x.title.toLowerCase().includes(query.toLowerCase()));
  const shown = pl.slice(0, count);
  const done = count >= pl.length;
  const loadMore = () => { setLoading(true); setTimeout(() => { setCount(c => c + 12); setLoading(false); }, 650); };
  return (
    <section className="section">
      <div className="section__head"><div className="section__titles">
        <span className="ic-eyebrow">Discover</span>
        <h2 className="section__heading">More titles</h2>
      </div></div>
      <div className="mtgrid">
        {shown.map((it, i) => <CoverCard key={it._k || i} {...it} />)}
      </div>
      {loading && <div className="mt-loadwrap"><span className="ic-eyebrow"><Icon n="loader" s={14} style={{ marginRight: 6 }} /> Loading more…</span></div>}
      {!loading && !done && <div className="mt-loadwrap"><Button variant="secondary" onClick={loadMore} iconStart={<Icon n="plus" s={16} />}>Load more</Button></div>}
      {done && <div className="mt-end">You're all caught up</div>}
    </section>
  );
}

/* ---------------------------------------------------------------- Footer ---- */
function Footer() {
  const links = ["Guides", "Reading hub", "FAQ", "Library", "About", "Privacy", "Terms"];
  return (
    <footer className="ftr">
      <div className="wrap ftr__in">
        <div style={{ maxWidth: 420 }}>
          <Logo size={24} />
          <p className="ftr__note">Read manga, manhwa, webtoons and comics from across the web in one place. Results are cached briefly — repeats won't hammer the API. icomics.wiki is independent — not MangaDex.org.</p>
          <div className="ftr__copy">© 2026 iComics.wiki</div>
        </div>
        <div className="ftr__links">{links.map(l => <a href="#" key={l}>{l}</a>)}</div>
      </div>
    </footer>
  );
}

/* ----------------------------------------------------------- Age dialog ----- */
function AgeDialog({ onClose, onVerify }) {
  return (
    <div className="ic-dialog-scrim" onClick={onClose}>
      <div className="ic-dialog" onClick={e => e.stopPropagation()}>
        <div className="ic-dialog__title">Mature content</div>
        <div className="ic-dialog__body">
          Some shelves and sources contain adult material. Confirm you are 18 or older to view them. We remember this on this device for about 24 hours — change it anytime in Settings.
        </div>
        <div className="ic-dialog__actions">
          <Button variant="ghost" onClick={onClose}>Not now</Button>
          <Button variant="primary" onClick={onVerify}>I'm 18 or older</Button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- App ---- */
function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("icw-theme") || "dark");
  const [lang, setLang] = useState("EN");
  const [verified, setVerified] = useState(() => localStorage.getItem("icw-verified") === "1");
  const [query, setQuery] = useState("");
  const [dialog, setDialog] = useState(false);
  const [demo, setDemo] = useState("content");

  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem("icw-theme", theme); }, [theme]);
  useEffect(() => { refreshIcons(); });

  const allTitles = D.shelves.flatMap(s => s.adultOnly && !verified ? [] : s.items);
  const shelves = D.shelves.filter(s => !s.adultOnly || verified);

  const doVerify = () => { setVerified(true); localStorage.setItem("icw-verified", "1"); setDialog(false); };

  return (
    <div className="home">
      <Header theme={theme} onTheme={() => setTheme(t => t === "dark" ? "light" : "dark")}
        lang={lang} onLang={() => setLang(l => LANGS[(LANGS.indexOf(l) + 1) % LANGS.length])}
        query={query} setQuery={setQuery} allTitles={allTitles}
        onVerifyOpen={() => setDialog(true)} verified={verified} />

      {query.length < 2 && <Hero items={D.featured} onVerifyOpen={() => setDialog(true)} />}

      <div className="wrap">
        {query.length < 2 && demo === "content" && <ContinueReading items={D.continueReading} />}

        {demo === "loading" && <><SkeletonShelf /><SkeletonShelf /></>}

        {demo === "empty" && (
          <section className="section"><div className="state-block">
            <Icon n="library-big" s={28} />
            <h4>Nothing on this shelf right now</h4>
            <p>A source came back empty. Browse the full catalog in the Library while it refreshes.</p>
            <Button variant="secondary" iconStart={<Icon n="arrow-right" s={16} />}>Open Library</Button>
          </div></section>
        )}

        {demo === "error" && (
          <section className="section"><div className="state-block">
            <Icon n="cloud-off" s={28} />
            <h4>Showing cached picks</h4>
            <p>We couldn't reach a source, so these are recent cached results. We'll refresh automatically — nothing is broken.</p>
            <Button variant="secondary" iconStart={<Icon n="refresh-cw" s={16} />}>Retry now</Button>
          </div></section>
        )}

        {demo === "content" && shelves.map(s => (
          <Shelf key={s.id} shelf={s} verified={verified} onLocked={() => setDialog(true)} query={query} />
        ))}

        {demo === "content" && query.length < 2 && <MoreTitles pool={D.grid} query={query} />}
      </div>

      <Footer />

      {dialog && <AgeDialog onClose={() => setDialog(false)} onVerify={doVerify} />}

      {/* Kit affordance — demonstrate Home's loading / empty / error states */}
      <div className="demobar">
        <span className="demobar__label">State</span>
        <SegmentedControl value={demo} onChange={setDemo}
          options={[{ value: "content", label: "Content" }, { value: "loading", label: "Loading" }, { value: "empty", label: "Empty" }, { value: "error", label: "Error" }]} />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
refreshIcons();
