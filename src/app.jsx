// Main app: BOLD variation only + tweaks integration

// Floating size control shown when a headline (or any element) is clicked in
// move mode. Scales the element's font-size live and persists via elementOffsets.
function ScaleControl({ el, entry, count, onNudge, onReset, onClose }) {
  // Measure the primary element for display, deferred to rAF so it reads the
  // values applied imperatively by the offsets effect. Re-runs when entry changes.
  const [m, setM] = React.useState(null);
  React.useEffect(() => {
    if (!el) { setM(null); return; }
    const raf = requestAnimationFrame(() => {
      const cs = getComputedStyle(el);
      const fs = parseFloat(cs.fontSize) || 16;
      let lhPx = parseFloat(cs.lineHeight);
      if (isNaN(lhPx)) lhPx = fs * 1.2;
      const ls = cs.letterSpacing === "normal" ? 0 : (parseFloat(cs.letterSpacing) || 0);
      setM({ px: Math.round(fs), lh: Math.round((lhPx / fs) * 100) / 100, ls: Math.round(ls * 10) / 10 });
    });
    return () => cancelAnimationFrame(raf);
  }, [el, entry]);
  const scale = (entry && entry.s) || 1;
  const rows = [
    { label: "גודל", value: m ? `${Math.round(m.px * scale)}px` : "…", prop: "size", d: 2 },
    { label: "מרווח שורות", value: m ? m.lh.toFixed(2) : "…", prop: "line", d: 0.1 },
    { label: "מרווח אותיות", value: m ? `${m.ls}px` : "…", prop: "letter", d: 0.5 },
  ];
  return (
    <div className="scale-control scale-control--panel" dir="rtl">
      <div className="scale-control__title">{count > 1 ? `${count} נבחרו — משנה יחד` : "אלמנט נבחר"}</div>
      {rows.map((r) =>
        <div key={r.prop} className="scale-control__row">
          <span className="scale-control__label">{r.label}</span>
          <button type="button" className="scale-control__btn" onClick={() => onNudge(r.prop, -r.d)} aria-label="הקטן">−</button>
          <span className="scale-control__val">{r.value}</span>
          <button type="button" className="scale-control__btn" onClick={() => onNudge(r.prop, r.d)} aria-label="הגדל">+</button>
        </div>
      )}
      <div className="scale-control__row scale-control__actions">
        <button type="button" className="scale-control__reset" onClick={onReset}>איפוס</button>
        <button type="button" className="scale-control__close" onClick={onClose} aria-label="סגור">✕</button>
      </div>
    </div>
  );
}

// Red side-guides marking the narrowest-phone safe content width (~320px phone
// minus page padding). Keep headline lines inside these while editing and they
// will never overflow on the smallest phone.
const SAFE_CONTENT_WIDTH = 285;
function SafeZoneGuides({ canvasRef }) {
  const [cx, setCx] = React.useState(null);
  React.useEffect(() => {
    const measure = () => {
      const el = canvasRef.current;
      if (el) { const r = el.getBoundingClientRect(); setCx(r.left + r.width / 2); }
    };
    measure();
    window.addEventListener("resize", measure);
    const id = setInterval(measure, 500);
    return () => { window.removeEventListener("resize", measure); clearInterval(id); };
  }, []);
  if (cx == null) return null;
  const half = SAFE_CONTENT_WIDTH / 2;
  return (
    <React.Fragment>
      <div className="safe-guide" style={{ left: cx - half }} />
      <div className="safe-guide" style={{ left: cx + half }} />
    </React.Fragment>
  );
}

function App() {
  const [tweaks, setTweaks] = React.useState(window.TWEAK_DEFAULTS);
  const [tweaksOpen, setTweaksOpen] = React.useState(false);
  const form = useForm();
  const admin = window.useAdminMode();

  // Apply tweaks whenever they change
  React.useEffect(() => {
    applyTweaksToDOM(tweaks);
  }, [tweaks]);

  // Communicate tweaks availability to host
  React.useEffect(() => {
    const handler = (e) => {
      if (!e.data || typeof e.data !== "object") return;
      if (e.data.type === "__activate_edit_mode") setTweaksOpen(true);
      if (e.data.type === "__deactivate_edit_mode") setTweaksOpen(false);
    };
    window.addEventListener("message", handler);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", handler);
  }, []);

  // On boot, fetch live overrides from GitHub (raw.githubusercontent.com)
  // and merge with the user's local overrides so the deployed site reflects
  // the latest published state without any browser localStorage.
  const [liveOverrides, setLiveOverrides] = React.useState(null);
  React.useEffect(() => {
    if (!window.__cutsFetchLiveOverrides || !window.__cutsLoadPublishSettings) return;
    let cancelled = false;
    (async () => {
      const settings = window.__cutsLoadPublishSettings();
      if (window.__cutsGetVariant && window.__cutsVariantPath) {
        settings.path = window.__cutsVariantPath(window.__cutsGetVariant());
      }
      const data = await window.__cutsFetchLiveOverrides(settings);
      if (!cancelled && data) setLiveOverrides(data);
    })();
    return () => { cancelled = true; };
  }, []);

  // Is the rendered view mobile? Measured from the .site-canvas width so it's
  // true both for a real phone (canvas = viewport) and the admin mobile preview
  // (canvas forced to 402). The 600px breakpoint matches the @container layout
  // rules — so the content layer and the layout flip together.
  const canvasRef = React.useRef(null);
  const [canvasMobile, setCanvasMobile] = React.useState(false);
  React.useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const measure = () => setCanvasMobile(el.clientWidth > 0 && el.clientWidth <= 600);
    measure();
    let ro;
    if (window.ResizeObserver) { ro = new ResizeObserver(measure); ro.observe(el); }
    window.addEventListener("resize", measure);
    return () => { window.removeEventListener("resize", measure); if (ro) ro.disconnect(); };
  }, []);

  // Merge: live values are the baseline; user's local overrides win on top.
  // Base (shared/desktop) layer:
  const mergedOverrides = React.useMemo(() => {
    if (!liveOverrides) return admin.overrides;
    return { ...(liveOverrides.overrides || {}), ...(admin.overrides || {}) };
  }, [liveOverrides, admin.overrides]);
  // Per-device override layers (applied on top of the shared base for that
  // device only): desktop layer on wide views, mobile layer on narrow views.
  const mergedOverridesDesktop = React.useMemo(() => {
    return { ...((liveOverrides && liveOverrides.overridesDesktop) || {}), ...(admin.overridesDesktop || {}) };
  }, [liveOverrides, admin.overridesDesktop]);
  const mergedOverridesMobile = React.useMemo(() => {
    return { ...((liveOverrides && liveOverrides.overridesMobile) || {}), ...(admin.overridesMobile || {}) };
  }, [liveOverrides, admin.overridesMobile]);
  // Effective text overrides for the current view.
  const effOverrides = React.useMemo(() => {
    return canvasMobile
      ? { ...mergedOverrides, ...mergedOverridesMobile }
      : { ...mergedOverrides, ...mergedOverridesDesktop };
  }, [canvasMobile, mergedOverrides, mergedOverridesDesktop, mergedOverridesMobile]);

  // Apply content overrides on every render + watch for re-renders
  React.useEffect(() => {
    if (!window.__cutsApplyOverrides) return;
    const apply = () => window.__cutsApplyOverrides(effOverrides);
    apply();
    const rootEl = document.getElementById("root");
    if (!rootEl) return;
    let timer = null;
    const obs = new MutationObserver(() => {
      if (timer) return;
      timer = setTimeout(() => {
        timer = null;
        apply();
      }, 50);
    });
    obs.observe(rootEl, { childList: true, subtree: true, characterData: true });
    return () => {
      obs.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [effOverrides]);

  // When the view flips device, reset all editable elements to their original
  // first, then re-apply — otherwise a value that only exists in one layer
  // (e.g. a mobile-only text edit) would linger after switching back.
  React.useEffect(() => {
    if (!window.__cutsApplyOverrides) return;
    if (window.__cutsRestoreOriginals) window.__cutsRestoreOriginals();
    window.__cutsApplyOverrides(effOverrides);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasMobile]);

  // Wire inline editing
  React.useEffect(() => {
    if (!window.__cutsAttachInlineEditing) return;
    const rootEl = document.getElementById("root");
    return window.__cutsAttachInlineEditing(rootEl, admin.editingText, admin.updateOverride);
  }, [admin.editingText, admin.updateOverride]);

  // Wire element-move dragging. A click without a drag selects the element for
  // scaling (the floating size control below acts on it).
  // Multi-select: each click toggles an element in/out of the set, and the size
  // controls apply to every selected element together (e.g. 2 of 3 headline lines).
  const [selection, setSelection] = React.useState([]);
  React.useEffect(() => {
    if (!window.__cutsAttachMoveListeners) return;
    const rootEl = document.getElementById("root");
    return window.__cutsAttachMoveListeners(
      rootEl, admin.movingElements, admin.updateElementOffset,
      (id, el) => setSelection((prev) => {
        const i = prev.findIndex((s) => s.id === id);
        if (i >= 0) return prev.filter((s) => s.id !== id);
        return [...prev, { id, el }];
      })
    );
  }, [admin.movingElements, admin.updateElementOffset]);
  React.useEffect(() => { if (!admin.movingElements) setSelection([]); }, [admin.movingElements]);
  // Outline every selected element so it's clear what the controls act on.
  React.useEffect(() => {
    selection.forEach((s) => s.el && s.el.classList.add("admin-scale-selected"));
    return () => selection.forEach((s) => s.el && s.el.classList.remove("admin-scale-selected"));
  }, [selection]);

  // In text-edit mode, track the current text selection so a size control can
  // resize just the selected words/letters.
  const [textSel, setTextSel] = React.useState(null);
  React.useEffect(() => {
    if (!admin.editingText) { setTextSel(null); return; }
    const handler = () => {
      const s = window.__cutsGetSelectionStyle ? window.__cutsGetSelectionStyle() : null;
      setTextSel((prev) => {
        if (!s) return prev === null ? prev : null;
        if (prev && prev.px === s.px && prev.lh === s.lh && prev.ls === s.ls) return prev;
        return s;
      });
    };
    document.addEventListener("selectionchange", handler);
    return () => document.removeEventListener("selectionchange", handler);
  }, [admin.editingText]);

  // Apply saved element offsets to the DOM on render (live + local).
  const mergedOffsets = React.useMemo(() => {
    if (!liveOverrides) return admin.elementOffsets;
    return { ...(liveOverrides.elementOffsets || {}), ...(admin.elementOffsets || {}) };
  }, [liveOverrides, admin.elementOffsets]);
  const mergedOffsetsDesktop = React.useMemo(() => {
    return { ...((liveOverrides && liveOverrides.elementOffsetsDesktop) || {}), ...(admin.elementOffsetsDesktop || {}) };
  }, [liveOverrides, admin.elementOffsetsDesktop]);
  const mergedOffsetsMobile = React.useMemo(() => {
    return { ...((liveOverrides && liveOverrides.elementOffsetsMobile) || {}), ...(admin.elementOffsetsMobile || {}) };
  }, [liveOverrides, admin.elementOffsetsMobile]);
  // Effective offsets — applyElementOffsets clears transforms for ids not in
  // the map, so switching device cleanly drops the other layer's positions.
  const effOffsets = React.useMemo(() => {
    return canvasMobile
      ? { ...mergedOffsets, ...mergedOffsetsMobile }
      : { ...mergedOffsets, ...mergedOffsetsDesktop };
  }, [canvasMobile, mergedOffsets, mergedOffsetsDesktop, mergedOffsetsMobile]);

  React.useEffect(() => {
    if (!window.__cutsApplyElementOffsets) return;
    window.__cutsApplyElementOffsets(effOffsets);
  }, [effOffsets]);

  // Apply a size / line-height / letter-spacing nudge to every selected element,
  // read fresh per element so each keeps its own value and moves by the same step.
  const nudgeSelection = React.useCallback((prop, delta) => {
    selection.forEach(({ id, el }) => {
      const cs = getComputedStyle(el);
      const fs = parseFloat(cs.fontSize) || 16;
      if (prop === "size") {
        // Scale is a transform multiplier of the (unchanged) base font-size, so a
        // delta-px step is delta/base added to the current scale.
        const s = (effOffsets[id] && effOffsets[id].s) || 1;
        admin.updateElementScale(id, Math.round(Math.min(4, Math.max(0.3, s + delta / fs)) * 1000) / 1000);
      } else if (prop === "line") {
        let lhPx = parseFloat(cs.lineHeight); if (isNaN(lhPx)) lhPx = fs * 1.2;
        admin.updateElementEntry(id, { lh: Math.max(0.7, Math.round((lhPx / fs + delta) * 100) / 100) });
      } else if (prop === "letter") {
        const ls = cs.letterSpacing === "normal" ? 0 : (parseFloat(cs.letterSpacing) || 0);
        admin.updateElementEntry(id, { ls: Math.round((ls + delta) * 10) / 10 });
      }
    });
  }, [selection, effOffsets, admin]);

  // Body class for admin mode (used by CSS to style editable elements)
  React.useEffect(() => {
    const cls = document.body.classList;
    cls.toggle("admin-editing-text", admin.editingText);
    cls.toggle("admin-dragging-sections", admin.draggingSections);
    cls.toggle("admin-moving-elements", admin.movingElements);
    window.__cutsEditingText = admin.editingText;
  }, [admin.editingText, admin.draggingSections, admin.movingElements]);

  // Stable identity — otherwise BoldVariation's DEFAULT_SECTIONS useMemo
  // re-creates every Comp each render, remounting all sections (which
  // resets in-section state like the podcast carousel index).
  const onCTAClick = React.useCallback(() => scrollToId("#cta"), []);

  const Variant = window.BoldVariation;
  const AdminPanel = window.AdminPanel;
  const AdminPasswordModal = window.AdminPasswordModal;
  const AdminVersionsModal = window.AdminVersionsModal;
  const AdminVideosModal = window.AdminVideosModal;
  const AdminPodcastsModal = window.AdminPodcastsModal;
  const AdminLogosModal = window.AdminLogosModal;
  const AdminGuestsModal = window.AdminGuestsModal;
  const AdminPublishSettingsModal = window.AdminPublishSettingsModal;

  // Dark/light class — BOLD is dark by default; light is the inverted mode
  const dark = tweaks.dark;
  const modeClass = !dark ? "light" : "";

  // Resolve list/section content for the CURRENT VIEW (canvasMobile). Each
  // field = its per-device layer (local wins over live) if that layer defines
  // it, else the shared base (local wins / hidden = union, as before). This is
  // what makes a real mobile visitor and the mobile preview show the mobile
  // arrangement while desktop shows its own.
  const effectiveAdmin = React.useMemo(() => {
    const live = liveOverrides || {};
    const cb = admin.contentBase || {};
    const liveLayerD = live.layerDesktop || {};
    const liveLayerM = live.layerMobile || {};
    const locLayerD = admin.layerDesktop || {};
    const locLayerM = admin.layerMobile || {};
    // The device layer value (local-then-live) if the field is defined there.
    const layerFor = (field) => {
      if (canvasMobile) {
        if (field in locLayerM) return locLayerM[field];
        if (field in liveLayerM) return liveLayerM[field];
      } else {
        if (field in locLayerD) return locLayerD[field];
        if (field in liveLayerD) return liveLayerD[field];
      }
      return undefined;
    };
    // Shared base (matches the previous merge: local wins for order/items;
    // hidden lists are unioned).
    const baseArr = (field) => {
      if (Array.isArray(cb[field])) return cb[field];
      return Array.isArray(live[field]) ? live[field] : null;
    };
    const baseHidden = (field) => Array.from(new Set([
      ...(Array.isArray(live[field]) ? live[field] : []),
      ...(Array.isArray(cb[field]) ? cb[field] : []),
    ]));
    const withLayer = (field, baseVal) => {
      const lv = layerFor(field);
      return lv !== undefined ? lv : baseVal;
    };
    return {
      ...admin,
      sectionOrder: withLayer("sectionOrder", baseArr("sectionOrder")),
      hiddenSections: withLayer("hiddenSections", baseHidden("hiddenSections")),
      videoOrder: withLayer("videoOrder", baseArr("videoOrder")),
      hiddenVideos: withLayer("hiddenVideos", baseHidden("hiddenVideos")),
      videoItems: withLayer("videoItems", baseArr("videoItems")),
      podcastOrder: withLayer("podcastOrder", baseArr("podcastOrder")),
      hiddenPodcasts: withLayer("hiddenPodcasts", baseHidden("hiddenPodcasts")),
      podcastItems: withLayer("podcastItems", baseArr("podcastItems")),
      logoItems: withLayer("logoItems", baseArr("logoItems")),
      hiddenLogos: withLayer("hiddenLogos", baseHidden("hiddenLogos")),
      guestsRow1Items: withLayer("guestsRow1Items", baseArr("guestsRow1Items")),
      hiddenGuestsRow1: withLayer("hiddenGuestsRow1", baseHidden("hiddenGuestsRow1")),
      guestsRow2Items: withLayer("guestsRow2Items", baseArr("guestsRow2Items")),
      hiddenGuestsRow2: withLayer("hiddenGuestsRow2", baseHidden("hiddenGuestsRow2")),
    };
  }, [admin, liveOverrides, canvasMobile]);

  // Editor preview device — constrains the rendered site to a phone-width
  // container (via .site-canvas--mobile) so the admin can preview mobile on a
  // desktop. The canvas establishes a CSS container so @container rules — the
  // same ones a real phone triggers — fire at the 402px width. FABs/panels stay
  // OUTSIDE the canvas so their position:fixed anchors to the viewport.
  const previewMobile = admin.previewDevice === "mobile";
  const canvasClass = "site-canvas" + (previewMobile ? " site-canvas--mobile" : "");

  return (
    <div className={`theme-bold ${modeClass}`}>
      <div className={canvasClass} ref={canvasRef}>
        <Variant onCTAClick={onCTAClick} form={form} admin={effectiveAdmin} />
      </div>
      <TweaksPanel open={tweaksOpen} tweaks={tweaks} setTweaks={setTweaks} />
      {(admin.editingText || admin.movingElements) && <SafeZoneGuides canvasRef={canvasRef} />}
      {admin.editingText && textSel &&
        <div className="scale-control scale-control--panel" dir="rtl" onMouseDown={(e) => e.preventDefault()}>
          <div className="scale-control__title">טקסט מסומן</div>
          {[
            { label: "גודל", value: `${textSel.px}px`, prop: "size", d: 2 },
            { label: "מרווח שורות", value: textSel.lh.toFixed(2), prop: "line", d: 0.1 },
            { label: "מרווח אותיות", value: `${textSel.ls}px`, prop: "letter", d: 0.5 },
          ].map((r) =>
            <div key={r.prop} className="scale-control__row">
              <span className="scale-control__label">{r.label}</span>
              <button type="button" className="scale-control__btn" onMouseDown={(e) => e.preventDefault()}
                onClick={() => window.__cutsNudgeSelectionStyle(r.prop, -r.d)} aria-label="הקטן">−</button>
              <span className="scale-control__val">{r.value}</span>
              <button type="button" className="scale-control__btn" onMouseDown={(e) => e.preventDefault()}
                onClick={() => window.__cutsNudgeSelectionStyle(r.prop, r.d)} aria-label="הגדל">+</button>
            </div>
          )}
        </div>
      }
      {admin.movingElements && selection.length > 0 &&
        <ScaleControl
          el={selection[0].el}
          entry={effOffsets[selection[0].id] || {}}
          count={selection.length}
          onNudge={nudgeSelection}
          onReset={() => selection.forEach((s) => admin.resetElementOffset(s.id))}
          onClose={() => setSelection([])}
        />
      }
      {AdminPanel && <AdminPanel admin={admin} />}
      {AdminPasswordModal && <AdminPasswordModal />}
      {AdminVersionsModal && <AdminVersionsModal admin={admin} />}
      {AdminVideosModal && <AdminVideosModal admin={admin} />}
      {AdminPodcastsModal && <AdminPodcastsModal admin={admin} />}
      {AdminLogosModal && <AdminLogosModal admin={admin} />}
      {AdminGuestsModal && <AdminGuestsModal admin={admin} />}
      {AdminPublishSettingsModal && <AdminPublishSettingsModal />}
      {window.AccessibilityWidget && <window.AccessibilityWidget />}
      {window.LegalModal && <window.LegalModal />}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
