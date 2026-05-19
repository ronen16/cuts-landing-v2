// Accessibility widget — Israeli-law oriented (IS 5568 / WCAG 2.0 AA helpers).
// Floating button bottom-left → opens a panel of adjustments.

const A11Y_KEY = "cuts_a11y_v1";
const A11Y_DEFAULT = {
  textScale: 0,
  grayscale: false,
  invert: false,
  contrast: false,
  light: false,
  links: false,
  headings: false,
  readable: false,
  bigCursor: false,
  stopAnim: false,
};

const A11Y_CSS = `
html.a11y-grayscale { filter: grayscale(1) !important; }
html.a11y-invert { filter: invert(1) hue-rotate(180deg) !important; }
html.a11y-invert img, html.a11y-invert video, html.a11y-invert iframe { filter: invert(1) hue-rotate(180deg) !important; }
html.a11y-contrast body, html.a11y-contrast body * {
  background-color: #000 !important;
  color: #fff !important;
  border-color: #fff !important;
}
html.a11y-contrast a, html.a11y-contrast a * { color: #ffe600 !important; }
html.a11y-light body, html.a11y-light body * {
  background-color: #fff !important;
  color: #111 !important;
  border-color: #999 !important;
}
html.a11y-light a, html.a11y-light a * { color: #0044cc !important; }
html.a11y-links a { text-decoration: underline !important; outline: 2px solid #ffd500 !important; outline-offset: 2px; }
html.a11y-headings h1, html.a11y-headings h2, html.a11y-headings h3, html.a11y-headings h4 {
  outline: 2px dashed #ffd500 !important; outline-offset: 3px;
}
html.a11y-readable body, html.a11y-readable body * {
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif !important;
  letter-spacing: 0.03em !important;
  line-height: 1.7 !important;
}
html.a11y-bigcursor, html.a11y-bigcursor * {
  cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'><path d='M6 4 L6 40 L16 30 L22 44 L28 41 L22 28 L36 28 Z' fill='%23ffd500' stroke='%23000' stroke-width='2'/></svg>") 6 4, auto !important;
}
html.a11y-stopanim *, html.a11y-stopanim *::before, html.a11y-stopanim *::after {
  animation: none !important;
  transition: none !important;
  scroll-behavior: auto !important;
}
`;

function applyA11y(state) {
  const root = document.documentElement;
  const cls = {
    "a11y-grayscale": state.grayscale,
    "a11y-invert": state.invert,
    "a11y-contrast": state.contrast,
    "a11y-light": state.light,
    "a11y-links": state.links,
    "a11y-headings": state.headings,
    "a11y-readable": state.readable,
    "a11y-bigcursor": state.bigCursor,
    "a11y-stopanim": state.stopAnim,
  };
  Object.entries(cls).forEach(([k, v]) => root.classList.toggle(k, !!v));
  const scale = Math.max(-2, Math.min(5, state.textScale || 0));
  document.body.style.zoom = scale === 0 ? "" : String(1 + scale * 0.1);
}

function loadA11y() {
  try {
    const raw = localStorage.getItem(A11Y_KEY);
    if (!raw) return { ...A11Y_DEFAULT };
    return { ...A11Y_DEFAULT, ...JSON.parse(raw) };
  } catch (e) {
    return { ...A11Y_DEFAULT };
  }
}

function AccessibilityWidget() {
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState(loadA11y);

  React.useEffect(() => {
    // Inject the rules once.
    if (!document.getElementById("a11y-style")) {
      const s = document.createElement("style");
      s.id = "a11y-style";
      s.textContent = A11Y_CSS;
      document.head.appendChild(s);
    }
  }, []);

  React.useEffect(() => {
    applyA11y(state);
    try { localStorage.setItem(A11Y_KEY, JSON.stringify(state)); } catch (e) {}
  }, [state]);

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const set = (k, v) => setState((p) => ({ ...p, [k]: v }));
  const toggle = (k) => setState((p) => ({ ...p, [k]: !p[k] }));
  const bumpText = (d) =>
    setState((p) => ({ ...p, textScale: Math.max(-2, Math.min(5, (p.textScale || 0) + d)) }));
  const reset = () => setState({ ...A11Y_DEFAULT });

  const Row = ({ label, active, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={!!active}
      className={"a11y-row" + (active ? " is-on" : "")}>
      <span className="a11y-row__dot" aria-hidden="true" />
      {label}
    </button>
  );

  return (
    <React.Fragment>
      <button
        type="button"
        className="a11y-fab"
        aria-label="פתיחת תפריט נגישות"
        aria-expanded={open}
        title="נגישות"
        onClick={() => setOpen((v) => !v)}>
        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="3.6" r="2.1" />
          <path d="M21 7.5c0 .7-.5 1.2-1.2 1.3l-4.3.6v3.1l2.6 7.2c.2.7-.1 1.4-.8 1.7-.7.2-1.4-.1-1.7-.8L12 15.4l-3.6 4.9c-.3.6-1 .9-1.7.7-.7-.3-1-1-.8-1.7l2.6-7.2V9.4l-4.3-.6C3.5 8.7 3 8.2 3 7.5c0-.8.7-1.4 1.5-1.3L12 7.2l7.5-1c.8-.1 1.5.5 1.5 1.3z" />
        </svg>
      </button>

      {open && (
        <div className="a11y-panel" role="dialog" aria-label="אפשרויות נגישות" dir="rtl">
          <div className="a11y-panel__head">
            <span>תפריט נגישות</span>
            <button type="button" className="a11y-close" aria-label="סגירה" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="a11y-text-ctrl">
            <button type="button" aria-label="הקטנת טקסט" onClick={() => bumpText(-1)}>A−</button>
            <span>גודל טקסט</span>
            <button type="button" aria-label="הגדלת טקסט" onClick={() => bumpText(1)}>A+</button>
          </div>

          <Row label="ניגודיות גבוהה" active={state.contrast} onClick={() => toggle("contrast")} />
          <Row label="ניגודיות הפוכה" active={state.invert} onClick={() => toggle("invert")} />
          <Row label="גווני אפור" active={state.grayscale} onClick={() => toggle("grayscale")} />
          <Row label="רקע בהיר" active={state.light} onClick={() => toggle("light")} />
          <Row label="הדגשת קישורים" active={state.links} onClick={() => toggle("links")} />
          <Row label="הדגשת כותרות" active={state.headings} onClick={() => toggle("headings")} />
          <Row label="פונט קריא" active={state.readable} onClick={() => toggle("readable")} />
          <Row label="סמן גדול" active={state.bigCursor} onClick={() => toggle("bigCursor")} />
          <Row label="עצירת אנימציות" active={state.stopAnim} onClick={() => toggle("stopAnim")} />

          <button type="button" className="a11y-reset" onClick={reset}>איפוס הגדרות נגישות</button>
          <a className="a11y-statement" href="accessibility.html" target="_blank" rel="noopener noreferrer">
            הצהרת נגישות
          </a>
        </div>
      )}
    </React.Fragment>
  );
}

window.AccessibilityWidget = AccessibilityWidget;
