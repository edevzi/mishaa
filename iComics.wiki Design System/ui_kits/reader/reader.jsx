/* iComics.wiki — Reader (classic / journal / flow + LTR/RTL + full controls). */
const RNS = window.IComicsWikiDesignSystem_3734a1;
const { Button, IconButton, SegmentedControl, Badge, ScoreBadge, ProgressBar, Logo } = RNS;
const { useState, useEffect, useRef, useCallback } = React;

const RIcon = ({ n, s = 18, style }) => <i data-lucide={n} style={{ width: s, height: s, display: "inline-flex", ...style }} />;
const rIcons = () => setTimeout(() => window.lucide && window.lucide.createIcons(), 20);

const CHAPTERS = [
  { n: 1, title: "The star that fell", pages: 16 },
  { n: 2, title: "Ashes of the academy", pages: 20 },
  { n: 3, title: "A blade remembered", pages: 18 },
  { n: 4, title: "Official chapter (VIZ)", pages: 0, external: true },
  { n: 5, title: "Return to the foothills", pages: 14 },
];
const ZMIN = 0.6, ZMAX = 2.6;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lastSpreadStart = (P) => { if (P <= 1) return 0; let s = P - 1; if (s % 2 === 0) s -= 1; return Math.max(1, s); };

/* ---- placeholder page art ---- */
function PageArt({ n, spread }) {
  const layouts = [
    "1fr 1fr / 1fr",
    "1.4fr 1fr / 1fr 1fr",
    "1fr / 1fr",
    "1fr 1.2fr / 1fr 1fr",
  ];
  const tmpl = layouts[n % layouts.length];
  const cells = (n % 4 === 2) ? 1 : (n % 4 === 1 || n % 4 === 3) ? 4 : 2;
  return (
    <div className={"page" + (spread ? " page--spread" : "")}>
      <span className="page__no">P. {n + 1}</span>
      <div className="page__panels" style={{ gridTemplate: tmpl }}>
        {Array.from({ length: cells }).map((_, i) => <div className={"panel" + (i % 2 ? " dark" : "")} key={i} />)}
      </div>
      <div className="page__caption">— placeholder page —</div>
    </div>
  );
}

function MiniArt() {
  return <div className="thumb__mini" style={{ gridTemplate: "1fr 1fr / 1fr" }}><div className="panel" /><div className="panel" /></div>;
}

function Reader({ start, onExit }) {
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

  useEffect(() => { localStorage.setItem("icw-rmode", mode); }, [mode]);
  useEffect(() => { localStorage.setItem("icw-rdir", dir); }, [dir]);
  useEffect(() => { localStorage.setItem("icw-rtheme", rtheme); }, [rtheme]);
  useEffect(() => { localStorage.setItem("icw-rzoom", String(zoom)); }, [zoom]);
  useEffect(() => { localStorage.setItem("icw-rpos", JSON.stringify({ ch, page })); }, [ch, page]);
  useEffect(() => { rIcons(); });

  /* ---- auto-hide UI ---- */
  const showUI = useCallback(() => {
    setUiHidden(false);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setUiHidden(true), 2800);
  }, []);
  useEffect(() => { showUI(); return () => clearTimeout(hideTimer.current); }, [showUI]);
  useEffect(() => { if (anyOverlay) { setUiHidden(false); clearTimeout(hideTimer.current); } }, [anyOverlay]);

  /* ---- chapter movement ---- */
  const gotoChapter = (nc, landLast) => {
    if (nc < 0 || nc >= CHAPTERS.length) return;
    const np = landLast ? (CHAPTERS[nc].external ? 0 : (mode === "journal" ? lastSpreadStart(CHAPTERS[nc].pages) : CHAPTERS[nc].pages - 1)) : 0;
    setCh(nc); setPage(Math.max(0, np));
    if (stageRef.current && mode === "flow") stageRef.current.scrollTop = landLast ? stageRef.current.scrollHeight : 0;
  };

  /* ---- reading-order forward / back (paged modes) ---- */
  const forward = useCallback(() => {
    if (cur.external) { gotoChapter(ch + 1, false); return; }
    if (mode === "journal") {
      const next = page === 0 ? 1 : page + 2;
      if (next > P - 1) gotoChapter(ch + 1, false); else setPage(next);
    } else {
      const next = page + 1;
      if (next > P - 1) gotoChapter(ch + 1, false); else setPage(next);
    }
  }, [mode, page, P, ch, cur]);

  const backward = useCallback(() => {
    if (cur.external) { gotoChapter(ch - 1, true); return; }
    if (mode === "journal") {
      if (page === 0) gotoChapter(ch - 1, true);
      else setPage(page === 1 ? 0 : page - 2);
    } else {
      if (page === 0) gotoChapter(ch - 1, true); else setPage(page - 1);
    }
  }, [mode, page, ch, cur]);

  /* ---- keyboard ---- */
  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || e.target.isContentEditable) return;
      showUI();
      const k = e.key;
      if (k === "Escape") { if (anyOverlay) { setSheet(false); setThumbs(false); setHelp(false); setChmenu(false); } else onExit(); return; }
      if (k === "f" || k === "F") { e.preventDefault(); toggleFs(); return; }
      if (mode !== "flow" && (k === "0")) { setZoom(1); return; }
      if (mode !== "flow" && (k === "+" || k === "=")) { setZoom(z => clamp(+(z + 0.15).toFixed(2), ZMIN, ZMAX)); return; }
      if (mode !== "flow" && (k === "-" || k === "_")) { setZoom(z => clamp(+(z - 0.15).toFixed(2), ZMIN, ZMAX)); return; }
      if (k === "Home") { e.preventDefault(); setPage(0); if (stageRef.current) stageRef.current.scrollTop = 0; return; }
      if (k === "End") { e.preventDefault(); if (mode === "flow") { if (stageRef.current) stageRef.current.scrollTop = stageRef.current.scrollHeight; } else setPage(mode === "journal" ? lastSpreadStart(P) : P - 1); return; }
      if (mode === "flow") {
        if (k === "ArrowDown" || k === "PageDown" || k === " ") { e.preventDefault(); stageRef.current.scrollBy({ top: window.innerHeight * 0.85 }); }
        if (k === "ArrowUp" || k === "PageUp") { e.preventDefault(); stageRef.current.scrollBy({ top: -window.innerHeight * 0.85 }); }
        return;
      }
      if (k === " ") { e.preventDefault(); forward(); return; }
      if (k === "ArrowRight") { e.preventDefault(); dir === "ltr" ? forward() : backward(); }
      if (k === "ArrowLeft") { e.preventDefault(); dir === "ltr" ? backward() : forward(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, dir, forward, backward, anyOverlay, showUI, P]);

  /* ---- ctrl/cmd + wheel zoom (paged) ---- */
  useEffect(() => {
    const el = rootRef.current; if (!el) return;
    const onWheel = (e) => {
      if (mode === "flow") return;
      if (e.ctrlKey || e.metaKey) { e.preventDefault(); setZoom(z => clamp(+(z - Math.sign(e.deltaY) * 0.12).toFixed(2), ZMIN, ZMAX)); }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [mode]);

  /* ---- swipe (touch) ---- */
  const touch = useRef(null);
  const onTouchStart = (e) => { const t = e.touches[0]; touch.current = { x: t.clientX, y: t.clientY }; };
  const onTouchEnd = (e) => {
    if (!touch.current || mode === "flow") return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touch.current.x, dy = t.clientY - touch.current.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      const swipeLeft = dx < 0;
      if (swipeLeft) dir === "ltr" ? forward() : backward();
      else dir === "ltr" ? backward() : forward();
    }
    touch.current = null;
  };

  /* ---- fullscreen ---- */
  const toggleFs = () => {
    const el = rootRef.current;
    if (!document.fullscreenElement) { el.requestFullscreen && el.requestFullscreen().then(() => setFs(true)).catch(() => {}); }
    else { document.exitFullscreen && document.exitFullscreen(); setFs(false); }
  };
  useEffect(() => { const h = () => setFs(!!document.fullscreenElement); document.addEventListener("fullscreenchange", h); return () => document.removeEventListener("fullscreenchange", h); }, []);

  /* ---- flow scroll progress + chapter boundaries ---- */
  const onScroll = () => {
    const el = stageRef.current; if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setScrollPct(max > 0 ? Math.round((el.scrollTop / max) * 100) : 0);
  };
  useEffect(() => { if (mode === "flow" && stageRef.current) { stageRef.current.scrollTop = 0; setScrollPct(0); } }, [mode, ch]);

  /* ---- zones ---- */
  const zoneEdge = (side) => {
    // side 'l' or 'r'
    if (side === "r") dir === "ltr" ? forward() : backward();
    else dir === "ltr" ? backward() : forward();
  };

  /* ---- progress label + fraction ---- */
  const N = CHAPTERS.length;
  let label, frac;
  if (cur.external) { label = `Ch ${ch + 1}/${N} · external`; frac = (ch + 0.5) / N; }
  else if (mode === "flow") { label = `Ch ${ch + 1}/${N} · ${scrollPct}%`; frac = (ch + scrollPct / 100) / N; }
  else { label = `Ch ${ch + 1}/${N} · ${page + 1}/${P}`; frac = (ch + (page + 1) / P) / N; }

  /* ---- page view (classic / journal) ---- */
  const renderPaged = () => {
    if (cur.external) return (
      <div className="external">
        <RIcon n="external-link" s={30} />
        <h3>Read on the official platform</h3>
        <p>This chapter is licensed and read on the publisher's site — there are no in-app pages for it. Your progress still tracks at the chapter level.</p>
        <Button variant="primary" iconStart={<RIcon n="external-link" s={16} />}>Open official reader</Button>
      </div>
    );
    let pages;
    if (mode === "journal") {
      pages = page === 0 ? [0] : [page, page + 1].filter(p => p <= P - 1);
    } else {
      pages = [page];
    }
    return (
      <div className={"pageview" + (mode === "journal" && dir === "rtl" ? " pageview--rtl" : "")} style={{ transform: `scale(${zoom})` }}>
        {pages.map(p => <PageArt key={p} n={p} spread={mode === "journal" && pages.length > 1} />)}
      </div>
    );
  };

  return (
    <div className={"reader" + (uiHidden && !anyOverlay ? " ui-hidden" : "")} data-reader={rtheme} ref={rootRef}
      onMouseMove={showUI} onTouchStart={(e) => { showUI(); onTouchStart(e); }} onTouchEnd={onTouchEnd}>

      {/* stage */}
      {mode === "flow" && !cur.external ? (
        <div className="stage stage--flow" ref={stageRef} onScroll={onScroll}>
          <div style={{ padding: "64px 0 96px" }}>
            {Array.from({ length: P }).map((_, p) => (
              <div className="page flowpage" key={p} style={{ width: "min(640px,94vw)", aspectRatio: "2/3" }}>
                <span className="page__no">P. {p + 1}</span>
                <div className="page__panels" style={{ gridTemplate: "1fr 1fr / 1fr" }}><div className="panel" /><div className="panel dark" /></div>
                <div className="page__caption">— placeholder strip —</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="stage">{renderPaged()}</div>
      )}

      {/* click / tap zones (paged only) */}
      {mode !== "flow" && !cur.external && (
        <div className="zones">
          <div className="zone zone--edge" onClick={() => zoneEdge("l")}><span className="zonehint zonehint--l"><RIcon n={dir === "ltr" ? "chevron-left" : "chevron-right"} /></span></div>
          <div className="zone zone--center" onClick={() => setUiHidden(h => !h)} />
          <div className="zone zone--edge" onClick={() => zoneEdge("r")}><span className="zonehint zonehint--r"><RIcon n={dir === "ltr" ? "chevron-right" : "chevron-left"} /></span></div>
        </div>
      )}

      {/* top bar */}
      <div className="rbar rbar--top">
        <IconButton label="Back to title" variant="ghost-scrim" onClick={onExit}><RIcon n="arrow-left" /></IconButton>
        <div className="rtitle">
          <b>Byeoreul Pumeun Swordmaster</b>
          <span>CH. {cur.n} · {cur.title.toUpperCase()}</span>
        </div>
        <div className="rspacer" />
        <div className="rtools">
          <button className="gbtn" onClick={() => setChmenu(v => !v)} aria-label="Chapters"><RIcon n="list" /></button>
          <button className="gbtn" onClick={() => setThumbs(true)} aria-label="Page overview"><RIcon n="layout-grid" /></button>
          <button className="gbtn" onClick={() => setHelp(true)} aria-label="Keyboard shortcuts"><RIcon n="keyboard" /></button>
          <button className={"gbtn" + (fs ? " is-on" : "")} onClick={toggleFs} aria-label="Fullscreen"><RIcon n={fs ? "minimize" : "maximize"} /></button>
          <button className="gbtn" onClick={() => setSheet(true)} aria-label="Reader settings"><RIcon n="settings-2" /></button>
        </div>
      </div>

      {/* bottom progress bar */}
      <div className="rbar rbar--bottom">
        <div className="rprog">
          <button className="gbtn" onClick={() => dir === "ltr" ? backward() : forward()} aria-label="Previous"><RIcon n="chevron-left" s={20} /></button>
          <div className="rprog__bar"><div className="rprog__fill" style={{ width: clamp(frac * 100, 0, 100) + "%" }} /></div>
          <span className="rprog__label">{label}</span>
          <button className="gbtn" onClick={() => dir === "ltr" ? forward() : backward()} aria-label="Next"><RIcon n="chevron-right" s={20} /></button>
        </div>
      </div>

      {/* chapter menu */}
      {chmenu && (
        <div className="chmenu">
          {CHAPTERS.map((c, i) => (
            <div className={"chitem" + (i === ch ? " is-current" : "")} key={i} onClick={() => { gotoChapter(i, false); setChmenu(false); }}>
              <span>Ch. {c.n} · {c.title}</span>
              <em>{c.external ? "ext" : c.pages + "p"}</em>
            </div>
          ))}
        </div>
      )}

      {/* resume prompt */}
      {resume && (
        <div className="resume">
          <span>Continue from Ch. {resume.ch + 1}, page {resume.page + 1}?</span>
          <Button size="sm" variant="primary" onClick={() => { setCh(resume.ch); setPage(resume.page); setResume(null); }}>Resume</Button>
          <Button size="sm" variant="ghost" onClick={() => { setResume(null); }}>Start over</Button>
        </div>
      )}

      {/* settings sheet */}
      {sheet && (
        <div className="sheet-scrim" onClick={() => setSheet(false)}>
          <div className="sheet" onClick={e => e.stopPropagation()}>
            <div className="sheet__head"><h3>Reader settings</h3><IconButton label="Close" variant="ghost" onClick={() => setSheet(false)}><RIcon n="x" /></IconButton></div>

            <div className="setrow"><span className="ic-eyebrow">View mode</span>
              <SegmentedControl value={mode} onChange={setMode} options={[
                { value: "classic", label: "Classic", icon: <RIcon n="square" s={15} /> },
                { value: "journal", label: "Journal", icon: <RIcon n="book-open" s={15} /> },
                { value: "flow", label: "Flow", icon: <RIcon n="scroll-text" s={15} /> },
              ]} />
            </div>

            <div className="setrow"><span className="ic-eyebrow">Reading direction</span>
              <SegmentedControl accent value={dir} onChange={setDir} options={[
                { value: "ltr", label: "Left → Right" }, { value: "rtl", label: "Right → Left" },
              ]} />
            </div>

            <div className="setrow"><span className="ic-eyebrow">Reader theme</span>
              <SegmentedControl value={rtheme} onChange={setRtheme} options={[
                { value: "light", label: "Light" }, { value: "sepia", label: "Sepia" }, { value: "dark", label: "Dark" },
              ]} />
            </div>

            <div className="setrow"><span className="ic-eyebrow">Zoom {mode === "flow" ? "(paged modes only)" : ""}</span>
              <div className="zoomctl">
                <IconButton label="Zoom out" variant="solid" onClick={() => setZoom(z => clamp(+(z - 0.15).toFixed(2), ZMIN, ZMAX))} disabled={mode === "flow"}><RIcon n="minus" /></IconButton>
                <b>{Math.round(zoom * 100)}%</b>
                <IconButton label="Zoom in" variant="solid" onClick={() => setZoom(z => clamp(+(z + 0.15).toFixed(2), ZMIN, ZMAX))} disabled={mode === "flow"}><RIcon n="plus" /></IconButton>
                <Button variant="ghost" size="sm" onClick={() => setZoom(1)} disabled={mode === "flow"}>Reset</Button>
              </div>
            </div>

            <div className="setrow">
              <div className="setrow__inline">
                <Button variant="secondary" block iconStart={<RIcon n="layout-grid" s={16} />} onClick={() => { setThumbs(true); setSheet(false); }}>Page overview</Button>
              </div>
              <div className="setrow__inline">
                <Button variant="secondary" block iconStart={<RIcon n="keyboard" s={16} />} onClick={() => { setHelp(true); setSheet(false); }}>Keyboard shortcuts</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* thumbnails */}
      {thumbs && (
        <div className="thumbs-scrim" onClick={() => setThumbs(false)}>
          <div className="thumbs-grid" onClick={e => e.stopPropagation()}>
            {Array.from({ length: Math.max(P, 1) }).map((_, p) => (
              <div className={"thumb" + (p === page ? " is-current" : "")} key={p}
                onClick={() => { setPage(mode === "journal" && p > 0 ? (p % 2 ? p : p - 1) : p); setThumbs(false); }}>
                <MiniArt /><span className="thumb__no">{p + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* help */}
      {help && (
        <div className="help-scrim" onClick={() => setHelp(false)}>
          <div className="help" onClick={e => e.stopPropagation()}>
            <h3>Keyboard & gestures</h3>
            <div className="help__grid">
              <div className="help__row"><span>Next / previous page</span><span><span className="kbd">←</span> <span className="kbd">→</span></span></div>
              <div className="help__row"><span>Page forward</span><span className="kbd">Space</span></div>
              <div className="help__row"><span>Scroll (flow)</span><span><span className="kbd">↑</span> <span className="kbd">↓</span></span></div>
              <div className="help__row"><span>First / last page</span><span><span className="kbd">Home</span> <span className="kbd">End</span></span></div>
              <div className="help__row"><span>Zoom in / out (paged)</span><span><span className="kbd">+</span> <span className="kbd">−</span></span></div>
              <div className="help__row"><span>Reset zoom</span><span className="kbd">0</span></div>
              <div className="help__row"><span>Fullscreen</span><span className="kbd">F</span></div>
              <div className="help__row"><span>Exit to title</span><span className="kbd">Esc</span></div>
              <div className="help__row"><span>Tap zones</span><span>L · prev — C · UI — R · next</span></div>
              <div className="help__row"><span>Swipe (touch)</span><span>horizontal, direction-aware</span></div>
            </div>
            <p style={{ marginTop: 18, fontSize: 12, opacity: .6, fontFamily: "var(--font-mono)" }}>Direction-aware controls flip with RTL.</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------------------- launcher (fake detail → reader) ------- */
function App() {
  const [open, setOpen] = useState(false);
  const saved = (() => { try { return JSON.parse(localStorage.getItem("icw-rpos")); } catch (e) { return null; } })();
  const startFresh = { ch: 0, page: 0, resume: null };
  const startResume = saved && (saved.ch > 0 || saved.page > 0) ? { ch: 0, page: 0, resume: saved } : startFresh;
  useEffect(() => { rIcons(); });
  if (open) return <Reader start={open === "resume" ? startResume : startFresh} onExit={() => setOpen(false)} />;
  return (
    <div className="launch">
      <div style={{ maxWidth: 460, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 18, padding: 24 }}>
        <Logo size={28} />
        <div style={{ width: 150, aspectRatio: "2/3", borderRadius: 8, boxShadow: "var(--cover-frame), var(--shadow-md)", background: "linear-gradient(155deg, oklch(0.45 0.12 30), oklch(0.24 0.07 60))" }} />
        <h1 className="ic-display" style={{ fontSize: 40 }}>Byeoreul Pumeun Swordmaster</h1>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <ScoreBadge score={8.2} /><Badge variant="neutral">Ongoing</Badge>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.6 }}>Open the reader to try Classic, Journal and Flow modes, LTR/RTL, zoom, themes, the page grid, and keyboard shortcuts.</p>
        <div style={{ display: "flex", gap: 12 }}>
          <Button variant="primary" size="lg" iconStart={<RIcon n="book-open" s={18} />} onClick={() => setOpen("fresh")}>Start reading</Button>
          {saved && (saved.ch > 0 || saved.page > 0) &&
            <Button variant="secondary" size="lg" onClick={() => setOpen("resume")}>Continue · Ch {saved.ch + 1}</Button>}
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
rIcons();
