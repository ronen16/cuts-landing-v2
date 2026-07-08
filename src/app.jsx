// Main app: BOLD variation only + tweaks integration

// Floating size control shown when a headline (or any element) is clicked in
// move mode. Scales the element's font-size live and persists via elementOffsets.
function ScaleControl({ el, scale, onScale, onReset, onClose }) {
  const pct = Math.round(scale * 100);
  // Measure the selected text's actual rendered size after each change so the
  // reading is exact (the DOM font-size is set imperatively one effect later).
  const [px, setPx] = React.useState(null);
  React.useEffect(() => {
    if (!el) { setPx(null); return; }
    const raf = requestAnimationFrame(() =>
      setPx(Math.round(parseFloat(getComputedStyle(el).fontSize)))
    );
    return () => cancelAnimationFrame(raf);
  }, [el, scale]);
  const clampS = (v) => Math.min(3, Math.max(0.3, v));
  // Nudge the scale so the rendered size changes by ~delta pixels (at this view).
  const stepPx = (delta) => {
    if (!px) return;
    const next = clampS((scale * (px + delta)) / px);
    onScale(Math.round(next * 1000) / 1000);
  };
  return (
    <div className="scale-control" dir="rtl">
      <span className="scale-control__label">גודל טקסט</span>
      <button type="button" className="scale-control__btn" onClick={() => stepPx(-2)} aria-label="הקטן">−</button>
      <span className="scale-control__val">{px != null ? `${px}px` : "…"}</span>
      <button type="button" className="scale-control__btn" onClick={() => stepPx(2)} aria-label="הגדל">+</button>
      <span className="scale-control__sub">{pct}%</span>
      <button type="button" className="scale-control__reset" onClick={onReset}>איפוס</button>
      <button type="button" className="scale-control__close" onClick={onClose} aria-label="סגור">✕</button>
    </div>
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
  const [scaleTarget, setScaleTarget] = React.useState(null);
  React.useEffect(() => {
    if (!window.__cutsAttachMoveListeners) return;
    const rootEl = document.getElementById("root");
    return window.__cutsAttachMoveListeners(
      rootEl, admin.movingElements, admin.updateElementOffset,
      (id, el) => setScaleTarget({ id, el })
    );
  }, [admin.movingElements, admin.updateElementOffset]);
  React.useEffect(() => { if (!admin.movingElements) setScaleTarget(null); }, [admin.movingElements]);
  // Outline the currently selected element so it's clear what stays selected —
  // every size edit applies to it until another element is clicked.
  React.useEffect(() => {
    const el = scaleTarget && scaleTarget.el;
    if (!el) return;
    el.classList.add("admin-scale-selected");
    return () => el.classList.remove("admin-scale-selected");
  }, [scaleTarget]);

  // In text-edit mode, track the current text selection so a size control can
  // resize just the selected words/letters.
  const [textSel, setTextSel] = React.useState(null);
  React.useEffect(() => {
    if (!admin.editingText) { setTextSel(null); return; }
    const handler = () => {
      const s = window.__cutsGetSelectionFontSize ? window.__cutsGetSelectionFontSize() : null;
      setTextSel((prev) => {
        if (!s) return prev === null ? prev : null;
        if (prev && prev.px === s.px) return prev;
        return { px: s.px };
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
      {admin.editingText && textSel &&
        <div className="scale-control" dir="rtl" onMouseDown={(e) => e.preventDefault()}>
          <span className="scale-control__label">גודל טקסט מסומן</span>
          <button type="button" className="scale-control__btn" onMouseDown={(e) => e.preventDefault()}
            onClick={() => window.__cutsNudgeSelectionFontSize(-2)} aria-label="הקטן">−</button>
          <span className="scale-control__val">{textSel.px}px</span>
          <button type="button" className="scale-control__btn" onMouseDown={(e) => e.preventDefault()}
            onClick={() => window.__cutsNudgeSelectionFontSize(2)} aria-label="הגדל">+</button>
        </div>
      }
      {admin.movingElements && scaleTarget &&
        <ScaleControl
          el={scaleTarget.el}
          scale={(effOffsets[scaleTarget.id] && effOffsets[scaleTarget.id].s) || 1}
          onScale={(s) => admin.updateElementScale(scaleTarget.id, s)}
          onReset={() => admin.resetElementOffset(scaleTarget.id)}
          onClose={() => setScaleTarget(null)}
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
