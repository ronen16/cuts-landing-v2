// Main app: BOLD variation only + tweaks integration

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
      const data = await window.__cutsFetchLiveOverrides(settings);
      if (!cancelled && data) setLiveOverrides(data);
    })();
    return () => { cancelled = true; };
  }, []);

  // Merge: live values are the baseline; user's local overrides win on top.
  const mergedOverrides = React.useMemo(() => {
    if (!liveOverrides) return admin.overrides;
    return { ...(liveOverrides.overrides || {}), ...(admin.overrides || {}) };
  }, [liveOverrides, admin.overrides]);

  // Apply content overrides on every render + watch for re-renders
  React.useEffect(() => {
    if (!window.__cutsApplyOverrides) return;
    const apply = () => window.__cutsApplyOverrides(mergedOverrides);
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
  }, [mergedOverrides]);

  // Wire inline editing
  React.useEffect(() => {
    if (!window.__cutsAttachInlineEditing) return;
    const rootEl = document.getElementById("root");
    return window.__cutsAttachInlineEditing(rootEl, admin.editingText, admin.updateOverride);
  }, [admin.editingText, admin.updateOverride]);

  // Wire element-move dragging
  React.useEffect(() => {
    if (!window.__cutsAttachMoveListeners) return;
    const rootEl = document.getElementById("root");
    return window.__cutsAttachMoveListeners(rootEl, admin.movingElements, admin.updateElementOffset);
  }, [admin.movingElements, admin.updateElementOffset]);

  // Apply saved element offsets to the DOM on render (live + local)
  const mergedOffsets = React.useMemo(() => {
    if (!liveOverrides) return admin.elementOffsets;
    return { ...(liveOverrides.elementOffsets || {}), ...(admin.elementOffsets || {}) };
  }, [liveOverrides, admin.elementOffsets]);

  React.useEffect(() => {
    if (!window.__cutsApplyElementOffsets) return;
    window.__cutsApplyElementOffsets(mergedOffsets);
  }, [mergedOffsets]);

  // Body class for admin mode (used by CSS to style editable elements)
  React.useEffect(() => {
    const cls = document.body.classList;
    cls.toggle("admin-editing-text", admin.editingText);
    cls.toggle("admin-dragging-sections", admin.draggingSections);
    cls.toggle("admin-moving-elements", admin.movingElements);
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
  const AdminPublishSettingsModal = window.AdminPublishSettingsModal;

  // Dark/light class — BOLD is dark by default; light is the inverted mode
  const dark = tweaks.dark;
  const modeClass = !dark ? "light" : "";

  // Merge live + local for section order + hidden sections so visitors see
  // the published structure even without any localStorage.
  const effectiveAdmin = React.useMemo(() => {
    if (!liveOverrides) return admin;
    const liveOrder = Array.isArray(liveOverrides.sectionOrder) ? liveOverrides.sectionOrder : null;
    const liveHidden = Array.isArray(liveOverrides.hiddenSections) ? liveOverrides.hiddenSections : [];
    const localOrder = Array.isArray(admin.sectionOrder) ? admin.sectionOrder : null;
    const localHidden = Array.isArray(admin.hiddenSections) ? admin.hiddenSections : [];
    const liveVideoOrder = Array.isArray(liveOverrides.videoOrder) ? liveOverrides.videoOrder : null;
    const liveHiddenVideos = Array.isArray(liveOverrides.hiddenVideos) ? liveOverrides.hiddenVideos : [];
    const localVideoOrder = Array.isArray(admin.videoOrder) ? admin.videoOrder : null;
    const localHiddenVideos = Array.isArray(admin.hiddenVideos) ? admin.hiddenVideos : [];
    const livePodcastOrder = Array.isArray(liveOverrides.podcastOrder) ? liveOverrides.podcastOrder : null;
    const liveHiddenPodcasts = Array.isArray(liveOverrides.hiddenPodcasts) ? liveOverrides.hiddenPodcasts : [];
    const localPodcastOrder = Array.isArray(admin.podcastOrder) ? admin.podcastOrder : null;
    const localHiddenPodcasts = Array.isArray(admin.hiddenPodcasts) ? admin.hiddenPodcasts : [];
    const liveVideoItems = Array.isArray(liveOverrides.videoItems) ? liveOverrides.videoItems : null;
    const localVideoItems = Array.isArray(admin.videoItems) ? admin.videoItems : null;
    const livePodcastItems = Array.isArray(liveOverrides.podcastItems) ? liveOverrides.podcastItems : null;
    const localPodcastItems = Array.isArray(admin.podcastItems) ? admin.podcastItems : null;
    return {
      ...admin,
      sectionOrder: localOrder || liveOrder,
      hiddenSections: Array.from(new Set([...(liveHidden || []), ...(localHidden || [])])),
      videoOrder: localVideoOrder || liveVideoOrder,
      hiddenVideos: Array.from(new Set([...(liveHiddenVideos || []), ...(localHiddenVideos || [])])),
      videoItems: localVideoItems || liveVideoItems,
      podcastOrder: localPodcastOrder || livePodcastOrder,
      hiddenPodcasts: Array.from(new Set([...(liveHiddenPodcasts || []), ...(localHiddenPodcasts || [])])),
      podcastItems: localPodcastItems || livePodcastItems,
    };
  }, [admin, liveOverrides]);

  return (
    <div className={`theme-bold ${modeClass}`}>
      <Variant onCTAClick={onCTAClick} form={form} admin={effectiveAdmin} />
      <TweaksPanel open={tweaksOpen} tweaks={tweaks} setTweaks={setTweaks} />
      {AdminPanel && <AdminPanel admin={admin} />}
      {AdminPasswordModal && <AdminPasswordModal />}
      {AdminVersionsModal && <AdminVersionsModal admin={admin} />}
      {AdminVideosModal && <AdminVideosModal admin={admin} />}
      {AdminPodcastsModal && <AdminPodcastsModal admin={admin} />}
      {AdminPublishSettingsModal && <AdminPublishSettingsModal />}
      {window.AccessibilityWidget && <window.AccessibilityWidget />}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
