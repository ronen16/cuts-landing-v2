// Admin Mode — inline text editor + section drag-to-reorder
// Unlock: 5 clicks on logo within 3s + password prompt
// Persistence: localStorage["cuts_admin_v1"]

const ADMIN_STORAGE_KEY = "cuts_admin_v1";
const PUBLISH_SETTINGS_KEY = "cuts_publish_settings_v1";
const ADMIN_PASSWORD_HASH = "86e2b4e7068dff297e717358659f5e2ef4376e37019d3427bc68339869b9e224";
const LOGO_CLICK_WINDOW_MS = 10000;
const LOGO_CLICK_THRESHOLD = 5;
const DEFAULT_PUBLISH_SETTINGS = {
  owner: "ronen16",
  repo: "cuts-landing-v2",
  branch: "main",
  path: "live-overrides.json",
  token: "",
};

// ---------- crypto helper ----------

async function sha256Hex(input) {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ---------- storage helpers ----------

const MAX_VERSIONS = 10;

function loadAdminState() {
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!raw) return { unlocked: false, overrides: {}, sectionOrder: null, elementOffsets: {}, hiddenSections: [], videoOrder: null, hiddenVideos: [], videoItems: null, podcastOrder: null, hiddenPodcasts: [], podcastItems: null, publishedVersions: [] };
    const parsed = JSON.parse(raw);
    return {
      unlocked: !!parsed.unlocked,
      overrides: parsed.overrides || {},
      sectionOrder: Array.isArray(parsed.sectionOrder) ? parsed.sectionOrder : null,
      elementOffsets: parsed.elementOffsets || {},
      hiddenSections: Array.isArray(parsed.hiddenSections) ? parsed.hiddenSections : [],
      videoOrder: Array.isArray(parsed.videoOrder) ? parsed.videoOrder : null,
      hiddenVideos: Array.isArray(parsed.hiddenVideos) ? parsed.hiddenVideos : [],
      videoItems: Array.isArray(parsed.videoItems) ? parsed.videoItems : null,
      podcastOrder: Array.isArray(parsed.podcastOrder) ? parsed.podcastOrder : null,
      hiddenPodcasts: Array.isArray(parsed.hiddenPodcasts) ? parsed.hiddenPodcasts : [],
      podcastItems: Array.isArray(parsed.podcastItems) ? parsed.podcastItems : null,
      publishedVersions: Array.isArray(parsed.publishedVersions) ? parsed.publishedVersions : [],
    };
  } catch (e) {
    return { unlocked: false, overrides: {}, sectionOrder: null, elementOffsets: {}, hiddenSections: [], videoOrder: null, hiddenVideos: [], videoItems: null, podcastOrder: null, hiddenPodcasts: [], podcastItems: null, publishedVersions: [] };
  }
}

function loadPublishSettings() {
  try {
    const raw = localStorage.getItem(PUBLISH_SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_PUBLISH_SETTINGS };
    return { ...DEFAULT_PUBLISH_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    return { ...DEFAULT_PUBLISH_SETTINGS };
  }
}

function savePublishSettings(settings) {
  try {
    localStorage.setItem(PUBLISH_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn("admin: failed to save publish settings", e);
  }
}

// GitHub Contents API — commit JSON to {owner}/{repo}/{path} on {branch}.
async function pushToGitHub(settings, payload) {
  if (!settings.token) throw new Error("missing-token");
  const apiBase = `https://api.github.com/repos/${settings.owner}/${settings.repo}/contents/${encodeURIComponent(settings.path)}`;
  const headers = {
    Authorization: `Bearer ${settings.token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  // GET current sha (if file exists) — bypass any HTTP cache so we always
  // see the latest committed sha, otherwise PUT will fail with a 409 mismatch.
  let sha = undefined;
  try {
    const getRes = await fetch(
      `${apiBase}?ref=${encodeURIComponent(settings.branch)}&_=${Date.now()}`,
      { headers, cache: "no-store" }
    );
    if (getRes.ok) {
      const cur = await getRes.json();
      sha = cur.sha;
    } else if (getRes.status === 401 || getRes.status === 403) {
      throw new Error(`auth-${getRes.status}`);
    }
  } catch (e) {
    if (String(e.message).startsWith("auth-")) throw e;
    // 404 is fine — file just doesn't exist yet
  }

  const contentB64 = btoa(unescape(encodeURIComponent(JSON.stringify(payload, null, 2))));
  const body = {
    message: `chore: publish overrides ${new Date().toISOString()}`,
    content: contentB64,
    branch: settings.branch,
  };
  if (sha) body.sha = sha;

  const putRes = await fetch(apiBase, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!putRes.ok) {
    const text = await putRes.text();
    throw new Error(`put-${putRes.status}: ${text.slice(0, 200)}`);
  }
  return await putRes.json();
}

// Fetch live overrides on page boot.
// Uses api.github.com (no CDN cache) instead of raw.githubusercontent.com
// (which has ~5 min Fastly cache and delays publishes from showing up).
// Falls back to raw.githubusercontent.com on rate-limit / network error.
async function fetchLiveOverrides(settings) {
  if (!settings || !settings.owner || !settings.repo) return null;
  const apiUrl = `https://api.github.com/repos/${settings.owner}/${settings.repo}/contents/${encodeURIComponent(settings.path)}?ref=${encodeURIComponent(settings.branch)}&_=${Date.now()}`;
  try {
    const res = await fetch(apiUrl, {
      headers: { Accept: "application/vnd.github.raw" },
      cache: "no-store",
    });
    if (res.ok) return await res.json();
    if (res.status !== 404) {
      // Fallback to raw.githubusercontent.com (may be stale up to ~5 min)
      const rawUrl = `https://raw.githubusercontent.com/${settings.owner}/${settings.repo}/${settings.branch}/${encodeURI(settings.path)}?_=${Date.now()}`;
      const raw = await fetch(rawUrl, { cache: "no-store" });
      if (raw.ok) return await raw.json();
    }
    return null;
  } catch (e) {
    return null;
  }
}

window.__cutsFetchLiveOverrides = fetchLiveOverrides;
window.__cutsLoadPublishSettings = loadPublishSettings;

function saveAdminState(state) {
  try {
    localStorage.setItem(
      ADMIN_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        updated: new Date().toISOString(),
        unlocked: state.unlocked,
        overrides: state.overrides,
        sectionOrder: state.sectionOrder,
        elementOffsets: state.elementOffsets || {},
        hiddenSections: state.hiddenSections || [],
        videoOrder: state.videoOrder || null,
        hiddenVideos: state.hiddenVideos || [],
        videoItems: state.videoItems || null,
        podcastOrder: state.podcastOrder || null,
        hiddenPodcasts: state.hiddenPodcasts || [],
        podcastItems: state.podcastItems || null,
        publishedVersions: state.publishedVersions || [],
      })
    );
  } catch (e) {
    console.warn("admin: failed to save state", e);
  }
}

// ---------- logo click counter ----------

let clickTimestamps = [];
let lastHandlerAt = 0;
function handleLogoClick() {
  const now = Date.now();
  // Dedupe: pointerdown + click + React onClick all fire on a single tap.
  // Ignore extra triggers within 120ms of the previous count.
  if (now - lastHandlerAt < 120) return;
  lastHandlerAt = now;
  clickTimestamps = clickTimestamps.filter((t) => now - t < LOGO_CLICK_WINDOW_MS);
  clickTimestamps.push(now);
  const count = clickTimestamps.length;
  console.info(`[cuts-admin] logo click ${count}/${LOGO_CLICK_THRESHOLD}`);
  if (count < LOGO_CLICK_THRESHOLD) return;
  clickTimestamps = [];
  window.dispatchEvent(new CustomEvent("cuts-admin-prompt"));
}

window.__cutsLogoClick = handleLogoClick;

async function verifyPasswordAndUnlock(entered) {
  if (entered == null) return { ok: false, reason: "cancel" };
  let hash;
  try {
    hash = await sha256Hex(entered);
  } catch (e) {
    console.error("[cuts-admin] hashing failed (need HTTPS/localhost for crypto.subtle):", e);
    return { ok: false, reason: "crypto" };
  }
  if (hash !== ADMIN_PASSWORD_HASH) return { ok: false, reason: "wrong" };
  const state = loadAdminState();
  state.unlocked = true;
  saveAdminState(state);
  window.dispatchEvent(new CustomEvent("cuts-admin-unlock"));
  return { ok: true };
}

// keyboard shortcut: Ctrl/Cmd + Shift + A → open admin prompt directly
window.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "A" || e.key === "a")) {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("cuts-admin-prompt"));
  }
});

// Native delegated pointer listener — fires even if React's onClick is swallowed.
// Triggers on the logo <img> or its parent anchor.
function isLogoTarget(target) {
  if (!target) return false;
  const img = target.closest("nav img[alt='Cuts']");
  if (img) return true;
  const anchor = target.closest("nav a[href='#']");
  if (anchor && anchor.querySelector("img[alt='Cuts']")) return true;
  return false;
}

let lastNativeClickAt = 0;
function nativeLogoTap(e) {
  if (!isLogoTarget(e.target)) return;
  // Debounce duplicate events for the same tap (pointerdown + click on same gesture)
  const now = Date.now();
  if (now - lastNativeClickAt < 80) return;
  lastNativeClickAt = now;
  handleLogoClick();
  // Prevent navigation only if the user is actively counting
  if (clickTimestamps.length > 0) {
    e.preventDefault();
    e.stopPropagation();
  }
}
document.addEventListener("pointerdown", nativeLogoTap, true);
document.addEventListener("click", nativeLogoTap, true);

// ---------- useAdminMode hook ----------

function useAdminMode() {
  const initial = React.useMemo(loadAdminState, []);
  const [unlocked, setUnlocked] = React.useState(initial.unlocked);
  const [editingText, setEditingText] = React.useState(false);
  const [draggingSections, setDraggingSections] = React.useState(false);
  const [movingElements, setMovingElements] = React.useState(false);
  const [overrides, setOverrides] = React.useState(initial.overrides);
  const [sectionOrder, setSectionOrder] = React.useState(initial.sectionOrder);
  const [elementOffsets, setElementOffsets] = React.useState(initial.elementOffsets);
  const [hiddenSections, setHiddenSections] = React.useState(initial.hiddenSections);
  const [videoOrder, setVideoOrder] = React.useState(initial.videoOrder);
  const [hiddenVideos, setHiddenVideos] = React.useState(initial.hiddenVideos);
  const [videoItems, setVideoItems] = React.useState(initial.videoItems);
  const [podcastOrder, setPodcastOrder] = React.useState(initial.podcastOrder);
  const [hiddenPodcasts, setHiddenPodcasts] = React.useState(initial.hiddenPodcasts);
  const [podcastItems, setPodcastItems] = React.useState(initial.podcastItems);
  const [publishedVersions, setPublishedVersions] = React.useState(initial.publishedVersions);

  React.useEffect(() => {
    const onUnlock = () => setUnlocked(true);
    window.addEventListener("cuts-admin-unlock", onUnlock);
    return () => window.removeEventListener("cuts-admin-unlock", onUnlock);
  }, []);

  React.useEffect(() => {
    saveAdminState({ unlocked, overrides, sectionOrder, elementOffsets, hiddenSections, videoOrder, hiddenVideos, videoItems, podcastOrder, hiddenPodcasts, podcastItems, publishedVersions });
  }, [unlocked, overrides, sectionOrder, elementOffsets, hiddenSections, videoOrder, hiddenVideos, videoItems, podcastOrder, hiddenPodcasts, podcastItems, publishedVersions]);

  // mutual exclusion
  const setEditingTextSafe = React.useCallback((v) => {
    setEditingText(v);
    if (v) { setDraggingSections(false); setMovingElements(false); }
  }, []);
  const setDraggingSectionsSafe = React.useCallback((v) => {
    setDraggingSections(v);
    if (v) { setEditingText(false); setMovingElements(false); }
  }, []);
  const setMovingElementsSafe = React.useCallback((v) => {
    setMovingElements(v);
    if (v) { setEditingText(false); setDraggingSections(false); }
  }, []);

  const updateOverride = React.useCallback((id, text) => {
    setOverrides((prev) => ({ ...prev, [id]: text }));
  }, []);

  const updateSectionOrder = React.useCallback((order) => {
    setSectionOrder(order);
  }, []);

  const updateElementOffset = React.useCallback((id, x, y) => {
    setElementOffsets((prev) => ({ ...prev, [id]: { x, y } }));
  }, []);

  const toggleSectionHidden = React.useCallback((id) => {
    setHiddenSections((prev) => {
      const set = new Set(prev);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return Array.from(set);
    });
  }, []);

  const updateVideoOrder = React.useCallback((order) => {
    setVideoOrder(order);
  }, []);

  const toggleVideoHidden = React.useCallback((id) => {
    setHiddenVideos((prev) => {
      const set = new Set(prev);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return Array.from(set);
    });
  }, []);

  const updatePodcastOrder = React.useCallback((order) => {
    setPodcastOrder(order);
  }, []);

  const togglePodcastHidden = React.useCallback((id) => {
    setHiddenPodcasts((prev) => {
      const set = new Set(prev);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return Array.from(set);
    });
  }, []);

  const updatePodcastItems = React.useCallback((items) => {
    setPodcastItems(items);
  }, []);
  const updateVideoItems = React.useCallback((items) => {
    setVideoItems(items);
  }, []);

  // Snapshot current state into the versions list (cap at MAX_VERSIONS).
  // Reads fresh from localStorage to avoid stale React closure bugs (edits
  // made just before clicking Publish need to be included).
  const publishToLive = React.useCallback(async () => {
    const current = loadAdminState();
    const liveOverrides = current.overrides || {};
    const liveSectionOrder = current.sectionOrder;
    const liveElementOffsets = current.elementOffsets || {};
    const liveHiddenSections = current.hiddenSections || [];
    const liveVideoOrder = current.videoOrder || null;
    const liveHiddenVideos = current.hiddenVideos || [];
    const liveVideoItems = current.videoItems || null;
    const livePodcastOrder = current.podcastOrder || null;
    const liveHiddenPodcasts = current.hiddenPodcasts || [];
    const livePodcastItems = current.podcastItems || null;

    const snapshot = {
      id: "v-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8),
      timestamp: new Date().toISOString(),
      label: new Date().toLocaleString("he-IL"),
      overrides: liveOverrides,
      sectionOrder: liveSectionOrder,
      elementOffsets: liveElementOffsets,
      hiddenSections: liveHiddenSections,
      videoOrder: liveVideoOrder,
      hiddenVideos: liveHiddenVideos,
      videoItems: liveVideoItems,
      podcastOrder: livePodcastOrder,
      hiddenPodcasts: liveHiddenPodcasts,
      podcastItems: livePodcastItems,
    };
    setPublishedVersions((prev) => [snapshot, ...prev].slice(0, MAX_VERSIONS));

    // Try to actually push to GitHub
    const settings = loadPublishSettings();
    if (!settings.token) {
      window.dispatchEvent(new CustomEvent("cuts-publish-need-settings"));
      return { snapshot, published: false, reason: "missing-token" };
    }
    try {
      const payload = {
        version: 1,
        publishedAt: snapshot.timestamp,
        overrides: liveOverrides,
        sectionOrder: liveSectionOrder,
        elementOffsets: liveElementOffsets,
        hiddenSections: liveHiddenSections,
        videoOrder: liveVideoOrder,
        hiddenVideos: liveHiddenVideos,
        videoItems: liveVideoItems,
        podcastOrder: livePodcastOrder,
        hiddenPodcasts: liveHiddenPodcasts,
        podcastItems: livePodcastItems,
      };
      const commit = await pushToGitHub(settings, payload);
      return { snapshot, published: true, commitUrl: commit.commit && commit.commit.html_url };
    } catch (err) {
      const msg = String(err.message || err);
      if (msg.startsWith("auth-")) {
        window.dispatchEvent(new CustomEvent("cuts-publish-need-settings"));
        return { snapshot, published: false, reason: "auth" };
      }
      console.error("[cuts-admin] publish failed:", err);
      return { snapshot, published: false, reason: msg };
    }
  }, []);

  const restoreVersion = React.useCallback((id) => {
    const v = publishedVersions.find((x) => x.id === id);
    if (!v) return;
    setOverrides(v.overrides || {});
    setSectionOrder(v.sectionOrder || null);
    setElementOffsets(v.elementOffsets || {});
    setHiddenSections(v.hiddenSections || []);
    setVideoOrder(v.videoOrder || null);
    setHiddenVideos(v.hiddenVideos || []);
    setVideoItems(v.videoItems || null);
    setPodcastOrder(v.podcastOrder || null);
    setHiddenPodcasts(v.hiddenPodcasts || []);
    setPodcastItems(v.podcastItems || null);
  }, [publishedVersions]);

  const deleteVersion = React.useCallback((id) => {
    setPublishedVersions((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const resetAll = React.useCallback(() => {
    setOverrides({});
    setSectionOrder(null);
    setElementOffsets({});
    setHiddenSections([]);
    setVideoOrder(null);
    setHiddenVideos([]);
    setVideoItems(null);
    setPodcastOrder(null);
    setHiddenPodcasts([]);
    setPodcastItems(null);
    if (window.__cutsRestoreOriginals) window.__cutsRestoreOriginals();
    if (window.__cutsClearAllTransforms) window.__cutsClearAllTransforms();
  }, []);

  const exitAdmin = React.useCallback(() => {
    setUnlocked(false);
    setEditingText(false);
    setDraggingSections(false);
    setMovingElements(false);
  }, []);

  return {
    unlocked,
    editingText,
    draggingSections,
    movingElements,
    overrides,
    sectionOrder,
    elementOffsets,
    hiddenSections,
    videoOrder,
    hiddenVideos,
    videoItems,
    podcastOrder,
    hiddenPodcasts,
    podcastItems,
    publishedVersions,
    setEditingText: setEditingTextSafe,
    setDraggingSections: setDraggingSectionsSafe,
    setMovingElements: setMovingElementsSafe,
    updateOverride,
    updateSectionOrder,
    updateElementOffset,
    toggleSectionHidden,
    updateVideoOrder,
    toggleVideoHidden,
    updateVideoItems,
    updatePodcastOrder,
    togglePodcastHidden,
    updatePodcastItems,
    publishToLive,
    restoreVersion,
    deleteVersion,
    resetAll,
    exitAdmin,
  };
}

window.useAdminMode = useAdminMode;

// ---------- edit-id computation ----------

function computeEditId(el) {
  if (!el || el.nodeType !== 1) return null;
  const root = document.getElementById("root");
  if (!root) return null;
  // Walk up to the nearest [data-section-id] ancestor — that's our anchor.
  // The path BELOW the section is stable across hidden/reordered sections,
  // unlike the path from #root which shifts every time the layout changes.
  const sectionAncestor = el.closest("[data-section-id]");
  const anchor = sectionAncestor || root;
  const anchorTag = sectionAncestor
    ? `sec:${sectionAncestor.getAttribute("data-section-id")}`
    : "root";
  const parts = [];
  let cur = el;
  while (cur && cur !== anchor && cur.parentElement) {
    const parent = cur.parentElement;
    const siblings = Array.from(parent.children).filter(
      (c) => c.tagName === cur.tagName
    );
    const idx = siblings.indexOf(cur);
    parts.unshift(`${cur.tagName.toLowerCase()}[${idx}]`);
    cur = parent;
  }
  const path = parts.join(">");
  const text = (el.getAttribute("data-edit-original") || el.textContent || "").trim().slice(0, 60);
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = (h * 31 + text.charCodeAt(i)) | 0;
  }
  const hashHex = (h >>> 0).toString(16).padStart(8, "0");
  return `${anchorTag}>${path}#h:${hashHex}`;
}

window.__cutsComputeEditId = computeEditId;

// ---------- editable element identification ----------

// Tags we never tag as editable (decorative / structural / media)
const NON_EDITABLE_TAGS = new Set([
  "SCRIPT", "STYLE", "BR", "HR", "META", "LINK",
  "INPUT", "TEXTAREA", "SELECT", "OPTION", "PROGRESS", "METER",
  "IMG", "VIDEO", "AUDIO", "PICTURE", "SOURCE", "TRACK", "CANVAS",
  "SVG", "PATH", "CIRCLE", "RECT", "ELLIPSE", "LINE", "POLYGON",
  "POLYLINE", "USE", "DEFS", "G", "TEXT", "TSPAN", "FOREIGNOBJECT",
  "MASK", "CLIPPATH", "PATTERN", "FILTER", "STOP", "LINEARGRADIENT",
  "RADIALGRADIENT", "SYMBOL", "MARKER", "TITLE", "DESC",
]);

function isLeafTextElement(el) {
  if (!el || el.nodeType !== 1) return false;
  // tagName for HTML is uppercase, for SVG it's lowercase — normalize.
  if (NON_EDITABLE_TAGS.has(el.tagName.toUpperCase())) return false;
  // Anything inside an <svg> is decorative graphics, not editable text.
  if (el.closest("svg")) return false;
  if (el.closest(".admin-button, .admin-toolbar, .admin-modal-backdrop, .admin-modal, .tweaks-panel")) return false;
  if (el.getAttribute("aria-hidden") === "true") return false;
  if (el.getAttribute("contenteditable") === "false") return false;
  // Must have at least one DIRECT text-node child with non-whitespace content.
  // (children may also include element children — we still allow it; the user
  // gets to pick the edit target by clicking the right spot.)
  const hasDirectText = Array.from(el.childNodes).some(
    (n) => n.nodeType === 3 && (n.textContent || "").trim().length > 0
  );
  if (!hasDirectText) return false;
  return true;
}

function getAllEditableElements() {
  const root = document.getElementById("root");
  if (!root) return [];
  return Array.from(root.querySelectorAll("*")).filter(isLeafTextElement);
}

window.__cutsGetEditableElements = getAllEditableElements;

// ---------- apply overrides to DOM ----------

function applyOverridesToDOM(overrides) {
  if (!overrides) overrides = {};
  const elements = getAllEditableElements();
  for (const el of elements) {
    // Skip the element currently being edited — never overwrite the user's cursor
    if (document.activeElement === el) continue;
    // Capture original text + html the first time we see this element.
    if (!el.hasAttribute("data-edit-original")) {
      el.setAttribute("data-edit-original", el.textContent || "");
    }
    if (el.dataset.editOriginalHtml == null) {
      el.dataset.editOriginalHtml = el.innerHTML;
    }
    const id = computeEditId(el);
    if (!id) continue;
    el.setAttribute("data-edit-id", id);
    if (Object.prototype.hasOwnProperty.call(overrides, id)) {
      const desired = overrides[id];
      if (el.innerHTML !== desired) el.innerHTML = desired;
    }
    // Do NOT auto-restore non-overridden elements during normal renders —
    // that would clobber in-progress edits. Reset is handled separately via
    // restoreOriginals() in admin.resetAll.
  }
}

function restoreOriginals() {
  const elements = getAllEditableElements();
  for (const el of elements) {
    const originalHtml = el.dataset.editOriginalHtml;
    if (originalHtml != null && el.innerHTML !== originalHtml) {
      el.innerHTML = originalHtml;
    }
  }
}

window.__cutsRestoreOriginals = restoreOriginals;

window.__cutsApplyOverrides = applyOverridesToDOM;

// ---------- Password Modal ----------

function AdminPasswordModal() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState("");
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    const onPrompt = () => {
      setValue("");
      setError("");
      setOpen(true);
      setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
    };
    window.addEventListener("cuts-admin-prompt", onPrompt);
    return () => window.removeEventListener("cuts-admin-prompt", onPrompt);
  }, []);

  if (!open) return null;

  const submit = async () => {
    const result = await verifyPasswordAndUnlock(value);
    if (result.ok) {
      setOpen(false);
      return;
    }
    if (result.reason === "wrong") setError("סיסמה שגויה");
    else if (result.reason === "crypto") setError("Crypto API לא זמין. השתמש ב־http://localhost");
    else setError("");
  };

  const onKey = (e) => {
    if (e.key === "Enter") { e.preventDefault(); submit(); }
    else if (e.key === "Escape") { e.preventDefault(); setOpen(false); }
  };

  return React.createElement("div", {
    className: "admin-modal-backdrop",
    onClick: () => setOpen(false)
  },
    React.createElement("div", {
      className: "admin-modal",
      onClick: (e) => e.stopPropagation(),
      dir: "rtl"
    },
      React.createElement("h3", { className: "admin-modal__title" }, "כניסת מנהל"),
      React.createElement("input", {
        ref: inputRef,
        type: "password",
        className: "admin-modal__input",
        placeholder: "סיסמה",
        value: value,
        onChange: (e) => setValue(e.target.value),
        onKeyDown: onKey,
        autoComplete: "off"
      }),
      error && React.createElement("div", { className: "admin-modal__error" }, error),
      React.createElement("div", { className: "admin-modal__actions" },
        React.createElement("button", { type: "button", className: "admin-modal__btn admin-modal__btn--ghost", onClick: () => setOpen(false) }, "ביטול"),
        React.createElement("button", { type: "button", className: "admin-modal__btn admin-modal__btn--primary", onClick: submit }, "כניסה")
      )
    )
  );
}

window.AdminPasswordModal = AdminPasswordModal;

// ---------- Versions Modal ----------

function AdminVersionsModal({ admin }) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("cuts-admin-versions", onOpen);
    return () => window.removeEventListener("cuts-admin-versions", onOpen);
  }, []);

  if (!open) return null;

  const versions = admin.publishedVersions || [];

  return React.createElement("div", {
    className: "admin-modal-backdrop",
    onClick: () => setOpen(false)
  },
    React.createElement("div", {
      className: "admin-modal admin-modal--wide",
      onClick: (e) => e.stopPropagation(),
      dir: "rtl"
    },
      React.createElement("h3", { className: "admin-modal__title" }, "ניהול גרסאות"),
      React.createElement("p", { className: "admin-modal__hint" },
        versions.length === 0
          ? "עוד לא העלית גרסה ללייב. לחץ על \"העלאה ללייב\" כדי לשמור snapshot."
          : `${versions.length} גרסאות אחרונות. שחזור מחיל את ה־snapshot על המצב הנוכחי.`
      ),
      versions.length > 0 && React.createElement("ul", { className: "admin-versions" },
        versions.map((v) =>
          React.createElement("li", { key: v.id, className: "admin-versions__row" },
            React.createElement("div", { className: "admin-versions__info" },
              React.createElement("div", { className: "admin-versions__label" }, v.label),
              React.createElement("div", { className: "admin-versions__meta" },
                `${Object.keys(v.overrides || {}).length} עריכות · ` +
                `${Object.keys(v.elementOffsets || {}).length} הזזות · ` +
                `${(v.hiddenSections || []).length} מוסתרים`
              )
            ),
            React.createElement("div", { className: "admin-versions__actions" },
              React.createElement("button", {
                type: "button",
                className: "admin-versions__btn",
                onClick: () => {
                  if (window.confirm("לשחזר את הגרסה הזאת? המצב הנוכחי יוחלף.")) {
                    admin.restoreVersion(v.id);
                    setOpen(false);
                  }
                }
              }, "שחזר"),
              React.createElement("button", {
                type: "button",
                className: "admin-versions__btn admin-versions__btn--danger",
                onClick: () => {
                  if (window.confirm("למחוק את הגרסה הזאת?")) admin.deleteVersion(v.id);
                }
              }, "מחק")
            )
          )
        )
      ),
      React.createElement("div", { className: "admin-modal__actions" },
        React.createElement("button", {
          type: "button",
          className: "admin-modal__btn admin-modal__btn--primary",
          onClick: () => setOpen(false)
        }, "סגור")
      )
    )
  );
}

window.AdminVersionsModal = AdminVersionsModal;

// ---------- Media link parsers ----------

function parseYouTubeId(input) {
  const s = String(input || "").trim();
  if (!s) return "";
  let m;
  if ((m = s.match(/[?&]v=([^&#]+)/))) return m[1];
  if ((m = s.match(/youtu\.be\/([^?&#/]+)/))) return m[1];
  if ((m = s.match(/\/embed\/([^?&#/]+)/))) return m[1];
  if ((m = s.match(/\/shorts\/([^?&#/]+)/))) return m[1];
  if ((m = s.match(/\/live\/([^?&#/]+)/))) return m[1];
  return s; // assume raw id
}

function parseVimeoId(input) {
  const s = String(input || "").trim();
  if (!s) return "";
  let m;
  if ((m = s.match(/vimeo\.com\/(?:video\/)?(\d+)/))) return m[1];
  if ((m = s.match(/player\.vimeo\.com\/video\/(\d+)/))) return m[1];
  if ((m = s.match(/(\d{6,})/))) return m[1];
  return s;
}

// ---------- Videos Manager Modal (testimonials · Vimeo) ----------

function AdminVideosModal({ admin }) {
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState([]);

  const derive = React.useCallback(() => {
    const all = (window.__cutsTestimonialVideos || []).slice();
    const byId = new Map(all.map((v) => [v.vimeoId, v]));
    const ord = Array.isArray(admin.videoOrder) ? admin.videoOrder : null;
    let list = all;
    if (ord && ord.length) {
      const seen = new Set();
      list = [];
      for (const id of ord) { if (byId.has(id) && !seen.has(id)) { list.push(byId.get(id)); seen.add(id); } }
      for (const v of all) if (!seen.has(v.vimeoId)) list.push(v);
    }
    return list.map((v) => ({ vimeoId: v.vimeoId || "", name: v.name || "", role: v.role || "" }));
  }, [admin.videoOrder]);

  React.useEffect(() => {
    const onOpen = () => {
      const base = Array.isArray(admin.videoItems) && admin.videoItems.length
        ? admin.videoItems.map((v) => ({ vimeoId: v.vimeoId || "", name: v.name || "", role: v.role || "" }))
        : derive();
      setItems(base);
      setOpen(true);
    };
    window.addEventListener("cuts-admin-videos", onOpen);
    return () => window.removeEventListener("cuts-admin-videos", onOpen);
  }, [admin.videoItems, derive]);

  if (!open) return null;

  const hidden = new Set(admin.hiddenVideos || []);
  const sync = (next) => { setItems(next); admin.updateVideoItems(next); };
  const setId = (i, val) => { const n = items.slice(); n[i] = { ...n[i], vimeoId: parseVimeoId(val) }; sync(n); };
  const setName = (i, val) => { const n = items.slice(); n[i] = { ...n[i], name: val }; sync(n); };
  const move = (i, dir) => {
    const t = i + dir; if (t < 0 || t >= items.length) return;
    const n = items.slice(); const tmp = n[i]; n[i] = n[t]; n[t] = tmp; sync(n);
  };
  const del = (i) => { if (window.confirm("למחוק את הסרטון הזה?")) sync(items.filter((_, x) => x !== i)); };
  const add = () => { sync([...items, { vimeoId: "", name: "", role: "" }]); };

  const inputStyle = {
    width: "100%", padding: "7px 10px", borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.04)",
    color: "#fff", font: "600 12px 'FbTypograph2', system-ui, sans-serif", direction: "ltr", textAlign: "left",
  };

  return (
    <div className="admin-modal-backdrop" onClick={() => setOpen(false)}>
      <div className="admin-modal admin-modal--wide" onClick={(e) => e.stopPropagation()} dir="rtl">
        <h3 className="admin-modal__title">ניהול סרטוני עדויות</h3>
        <p className="admin-modal__hint">
          ערוך קישור Vimeo, סדר, הסתר או מחק. "➕ הוסף קישור" מוסיף סרטון חדש. שינויים נשמרים אוטומטית — לחץ "העלאה ללייב" כדי לפרסם.
        </p>
        <ul className="admin-videos">
          {items.map((v, idx) => {
            const isHidden = hidden.has(v.vimeoId);
            return (
              <li key={idx} className={"admin-videos__row" + (isHidden ? " is-hidden" : "")}>
                <span className="admin-videos__idx">{idx + 1}</span>
                <div className="admin-videos__info" style={{ gap: 6 }}>
                  <input
                    style={inputStyle}
                    value={v.vimeoId}
                    placeholder="https://vimeo.com/123456789 או ID"
                    onChange={(e) => setId(idx, e.target.value)} />
                  <input
                    style={{ ...inputStyle, direction: "rtl", textAlign: "right", opacity: 0.85 }}
                    value={v.name}
                    placeholder="שם הלקוח (אופציונלי)"
                    onChange={(e) => setName(idx, e.target.value)} />
                </div>
                <div className="admin-videos__actions">
                  <button type="button" className="admin-videos__btn" disabled={idx === 0} title="הזז למעלה" onClick={() => move(idx, -1)}>↑</button>
                  <button type="button" className="admin-videos__btn" disabled={idx === items.length - 1} title="הזז למטה" onClick={() => move(idx, 1)}>↓</button>
                  <button type="button" className={"admin-videos__btn" + (isHidden ? " is-on" : "")} title={isHidden ? "הצג" : "הסתר"} onClick={() => { admin.toggleVideoHidden(v.vimeoId); }}>{isHidden ? "מוסתר" : "מוצג"}</button>
                  <button type="button" className="admin-videos__btn is-on" title="מחק" onClick={() => del(idx)}>✕</button>
                </div>
              </li>
            );
          })}
        </ul>
        <button type="button" className="admin-modal__btn admin-modal__btn--ghost" style={{ marginBottom: 14 }} onClick={add}>➕ הוסף קישור</button>
        <div className="admin-modal__actions">
          <button
            type="button"
            className="admin-modal__btn admin-modal__btn--ghost"
            onClick={() => {
              if (window.confirm("לאפס את רשימת הסרטונים וההסתרות לברירת מחדל?")) {
                admin.updateVideoItems(null);
                (admin.hiddenVideos || []).slice().forEach((id) => admin.toggleVideoHidden(id));
                setItems(derive());
              }
            }}>איפוס</button>
          <button type="button" className="admin-modal__btn admin-modal__btn--primary" onClick={() => setOpen(false)}>סגור</button>
        </div>
      </div>
    </div>
  );
}

window.AdminVideosModal = AdminVideosModal;

// ---------- Podcasts Manager Modal (Results · YouTube) ----------

function AdminPodcastsModal({ admin }) {
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState([]);

  const derive = React.useCallback(() => {
    const all = (window.__cutsPodcastVideos || []).slice();
    const byId = new Map(all.map((v) => [v.youtubeId, v]));
    const ord = Array.isArray(admin.podcastOrder) ? admin.podcastOrder : null;
    let list = all;
    if (ord && ord.length) {
      const seen = new Set();
      list = [];
      for (const id of ord) { if (byId.has(id) && !seen.has(id)) { list.push(byId.get(id)); seen.add(id); } }
      for (const v of all) if (!seen.has(v.youtubeId)) list.push(v);
    }
    return list.map((v) => ({ youtubeId: v.youtubeId || "", title: v.title || "" }));
  }, [admin.podcastOrder]);

  React.useEffect(() => {
    const onOpen = () => {
      const base = Array.isArray(admin.podcastItems) && admin.podcastItems.length
        ? admin.podcastItems.map((v) => ({ youtubeId: v.youtubeId || "", title: v.title || "" }))
        : derive();
      setItems(base);
      setOpen(true);
    };
    window.addEventListener("cuts-admin-podcasts", onOpen);
    return () => window.removeEventListener("cuts-admin-podcasts", onOpen);
  }, [admin.podcastItems, derive]);

  if (!open) return null;

  const hidden = new Set(admin.hiddenPodcasts || []);
  const sync = (next) => { setItems(next); admin.updatePodcastItems(next); };
  const setId = (i, val) => { const n = items.slice(); n[i] = { ...n[i], youtubeId: parseYouTubeId(val) }; sync(n); };
  const move = (i, dir) => {
    const t = i + dir; if (t < 0 || t >= items.length) return;
    const n = items.slice(); const tmp = n[i]; n[i] = n[t]; n[t] = tmp; sync(n);
  };
  const del = (i) => { if (window.confirm("למחוק את הפרק הזה?")) sync(items.filter((_, x) => x !== i)); };
  const add = () => { sync([...items, { youtubeId: "", title: "" }]); };

  const inputStyle = {
    width: "100%", padding: "7px 10px", borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.04)",
    color: "#fff", font: "600 12px 'FbTypograph2', system-ui, sans-serif", direction: "ltr", textAlign: "left",
  };

  return (
    <div className="admin-modal-backdrop" onClick={() => setOpen(false)}>
      <div className="admin-modal admin-modal--wide" onClick={(e) => e.stopPropagation()} dir="rtl">
        <h3 className="admin-modal__title">ניהול פרקי פודקאסט</h3>
        <p className="admin-modal__hint">
          ערוך קישור YouTube, סדר, הסתר או מחק. "➕ הוסף קישור" מוסיף פרק חדש. שינויים נשמרים אוטומטית — לחץ "העלאה ללייב" כדי לפרסם.
        </p>
        <ul className="admin-videos">
          {items.map((v, idx) => {
            const isHidden = hidden.has(v.youtubeId);
            return (
              <li key={idx} className={"admin-videos__row" + (isHidden ? " is-hidden" : "")}>
                <span className="admin-videos__idx">{idx + 1}</span>
                <div className="admin-videos__info">
                  <input
                    style={inputStyle}
                    value={v.youtubeId}
                    placeholder="https://www.youtube.com/watch?v=... או ID"
                    onChange={(e) => setId(idx, e.target.value)} />
                </div>
                <div className="admin-videos__actions">
                  <button type="button" className="admin-videos__btn" disabled={idx === 0} title="הזז למעלה" onClick={() => move(idx, -1)}>↑</button>
                  <button type="button" className="admin-videos__btn" disabled={idx === items.length - 1} title="הזז למטה" onClick={() => move(idx, 1)}>↓</button>
                  <button type="button" className={"admin-videos__btn" + (isHidden ? " is-on" : "")} title={isHidden ? "הצג" : "הסתר"} onClick={() => { admin.togglePodcastHidden(v.youtubeId); }}>{isHidden ? "מוסתר" : "מוצג"}</button>
                  <button type="button" className="admin-videos__btn is-on" title="מחק" onClick={() => del(idx)}>✕</button>
                </div>
              </li>
            );
          })}
        </ul>
        <button type="button" className="admin-modal__btn admin-modal__btn--ghost" style={{ marginBottom: 14 }} onClick={add}>➕ הוסף קישור</button>
        <div className="admin-modal__actions">
          <button
            type="button"
            className="admin-modal__btn admin-modal__btn--ghost"
            onClick={() => {
              if (window.confirm("לאפס את רשימת הפרקים וההסתרות לברירת מחדל?")) {
                admin.updatePodcastItems(null);
                (admin.hiddenPodcasts || []).slice().forEach((id) => admin.togglePodcastHidden(id));
                setItems(derive());
              }
            }}>איפוס</button>
          <button type="button" className="admin-modal__btn admin-modal__btn--primary" onClick={() => setOpen(false)}>סגור</button>
        </div>
      </div>
    </div>
  );
}

window.AdminPodcastsModal = AdminPodcastsModal;

// ---------- Publish Settings Modal ----------

function AdminPublishSettingsModal() {
  const [open, setOpen] = React.useState(false);
  const [settings, setSettings] = React.useState(() => loadPublishSettings());
  const [savedToast, setSavedToast] = React.useState(false);

  React.useEffect(() => {
    const onOpen = () => {
      setSettings(loadPublishSettings());
      setOpen(true);
    };
    window.addEventListener("cuts-publish-need-settings", onOpen);
    return () => window.removeEventListener("cuts-publish-need-settings", onOpen);
  }, []);

  if (!open) return null;

  const update = (k, v) => setSettings((s) => ({ ...s, [k]: v }));

  const save = () => {
    savePublishSettings(settings);
    setSavedToast(true);
    setTimeout(() => { setSavedToast(false); setOpen(false); }, 700);
  };

  const tokenUrl = `https://github.com/settings/personal-access-tokens/new?name=cuts-admin-publish&target_name=${encodeURIComponent(settings.owner)}&description=Publish+overrides+from+admin+UI`;

  return React.createElement("div", {
    className: "admin-modal-backdrop",
    onClick: () => setOpen(false)
  },
    React.createElement("div", {
      className: "admin-modal admin-modal--wide",
      onClick: (e) => e.stopPropagation(),
      dir: "rtl"
    },
      React.createElement("h3", { className: "admin-modal__title" }, "הגדרות פרסום ללייב"),
      React.createElement("p", { className: "admin-modal__hint" },
        "הגדר פעם אחת. הכפתור 'העלאה ללייב' יעשה commit ישיר ל־GitHub והאתר הלייב יעדכן עצמו אוטומטית."
      ),
      React.createElement("div", { className: "admin-field" },
        React.createElement("label", { className: "admin-field__label" }, "GitHub User / Org"),
        React.createElement("input", {
          type: "text", className: "admin-modal__input",
          value: settings.owner,
          onChange: (e) => update("owner", e.target.value)
        })
      ),
      React.createElement("div", { className: "admin-field" },
        React.createElement("label", { className: "admin-field__label" }, "שם הריפו"),
        React.createElement("input", {
          type: "text", className: "admin-modal__input",
          value: settings.repo,
          onChange: (e) => update("repo", e.target.value)
        })
      ),
      React.createElement("div", { className: "admin-field" },
        React.createElement("label", { className: "admin-field__label" }, "Branch"),
        React.createElement("input", {
          type: "text", className: "admin-modal__input",
          value: settings.branch,
          onChange: (e) => update("branch", e.target.value)
        })
      ),
      React.createElement("div", { className: "admin-field" },
        React.createElement("label", { className: "admin-field__label" }, "נתיב הקובץ"),
        React.createElement("input", {
          type: "text", className: "admin-modal__input",
          value: settings.path,
          onChange: (e) => update("path", e.target.value)
        })
      ),
      React.createElement("div", { className: "admin-field" },
        React.createElement("label", { className: "admin-field__label" },
          "GitHub Token (PAT)",
          React.createElement("a", {
            href: tokenUrl, target: "_blank", rel: "noopener noreferrer",
            className: "admin-field__link"
          }, "צור Token חדש →")
        ),
        React.createElement("input", {
          type: "password", className: "admin-modal__input",
          placeholder: "github_pat_...",
          value: settings.token || "",
          onChange: (e) => update("token", e.target.value)
        }),
        React.createElement("p", { className: "admin-field__caption" },
          "הרשאה נדרשת: Contents · Read and write עבור הריפו הזה."
        )
      ),
      savedToast && React.createElement("div", { className: "admin-modal__success" }, "נשמר ✓"),
      React.createElement("div", { className: "admin-modal__actions" },
        React.createElement("button", {
          type: "button",
          className: "admin-modal__btn admin-modal__btn--ghost",
          onClick: () => setOpen(false)
        }, "ביטול"),
        React.createElement("button", {
          type: "button",
          className: "admin-modal__btn admin-modal__btn--primary",
          onClick: save
        }, "שמור")
      )
    )
  );
}

window.AdminPublishSettingsModal = AdminPublishSettingsModal;

// ---------- AdminPanel UI ----------

function AdminPanel({ admin }) {
  const [open, setOpen] = React.useState(false);

  if (!admin.unlocked) return null;

  const button = (
    React.createElement("button", {
      type: "button",
      className: "admin-button",
      "aria-label": "Admin",
      onClick: () => setOpen((v) => !v),
      title: "Admin",
    },
      React.createElement("svg", { viewBox: "0 0 24 24", width: 22, height: 22, fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" },
        React.createElement("path", { d: "M12 20h9" }),
        React.createElement("path", { d: "M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" })
      )
    )
  );

  const toolbar = open && React.createElement("div", { className: "admin-toolbar", dir: "rtl" },
    React.createElement(ToolbarRow, {
      icon: "✏️",
      label: "עריכת טקסט",
      active: admin.editingText,
      onClick: () => admin.setEditingText(!admin.editingText)
    }),
    React.createElement(ToolbarRow, {
      icon: "↕️",
      label: "גרירת סקשנים",
      active: admin.draggingSections,
      onClick: () => admin.setDraggingSections(!admin.draggingSections)
    }),
    React.createElement(ToolbarRow, {
      icon: "✋",
      label: "הזזת אלמנטים",
      active: admin.movingElements,
      onClick: () => admin.setMovingElements(!admin.movingElements)
    }),
    React.createElement(ToolbarRow, {
      icon: "🎬",
      label: "ניהול סרטונים",
      onClick: () => window.dispatchEvent(new CustomEvent("cuts-admin-videos"))
    }),
    React.createElement(ToolbarRow, {
      icon: "🎧",
      label: "ניהול פרקים",
      onClick: () => window.dispatchEvent(new CustomEvent("cuts-admin-podcasts"))
    }),
    React.createElement("div", { className: "admin-toolbar__sep" }),
    React.createElement(ToolbarRow, {
      icon: "🚀",
      label: "העלאה ללייב",
      onClick: async () => {
        // Force-blur the active editable element so any in-flight edit is
        // captured in localStorage before publishToLive reads it.
        const active = document.activeElement;
        if (active && active.hasAttribute && active.hasAttribute("data-edit-id")) {
          active.blur();
          await new Promise((r) => setTimeout(r, 50));
        }
        if (!window.confirm("אתה בטוח שאתה רוצה להעלות את השינויים האלה ללייב?\nהכל יוצג לכל מבקר באתר.")) return;
        const result = await admin.publishToLive();
        if (result.published) {
          const url = result.commitUrl;
          window.alert("פורסם ללייב בהצלחה ✓" + (url ? "\n\nקישור ל־commit:\n" + url : ""));
        } else if (result.reason === "missing-token" || result.reason === "auth") {
          // Settings modal will open via cuts-publish-need-settings event
        } else {
          window.alert("הפרסום נכשל: " + result.reason);
        }
      }
    }),
    React.createElement(ToolbarRow, {
      icon: "🕓",
      label: "ניהול גרסאות",
      onClick: () => window.dispatchEvent(new CustomEvent("cuts-admin-versions"))
    }),
    React.createElement(ToolbarRow, {
      icon: "⚙️",
      label: "הגדרות פרסום",
      onClick: () => window.dispatchEvent(new CustomEvent("cuts-publish-need-settings"))
    }),
    React.createElement("div", { className: "admin-toolbar__sep" }),
    React.createElement(ToolbarRow, {
      icon: "💾",
      label: "Export JSON",
      onClick: () => exportJSON(admin)
    }),
    React.createElement(ToolbarRow, {
      icon: "📥",
      label: "Import JSON",
      onClick: () => importJSON(admin)
    }),
    React.createElement(ToolbarRow, {
      icon: "🔄",
      label: "Reset All",
      onClick: () => {
        if (window.confirm("למחוק את כל השינויים?")) admin.resetAll();
      }
    }),
    React.createElement("div", { className: "admin-toolbar__sep" }),
    React.createElement(ToolbarRow, {
      icon: "🚪",
      label: "Exit Admin",
      onClick: () => {
        admin.exitAdmin();
        setOpen(false);
      }
    })
  );

  return React.createElement(React.Fragment, null, button, toolbar);
}

function ToolbarRow({ icon, label, active, onClick }) {
  return React.createElement("button", {
    type: "button",
    className: "admin-toolbar__row" + (active ? " is-active" : ""),
    onClick
  },
    React.createElement("span", { className: "admin-toolbar__icon" }, icon),
    React.createElement("span", { className: "admin-toolbar__label" }, label)
  );
}

window.AdminPanel = AdminPanel;

// ---------- Export / Import JSON ----------

function exportJSON(admin) {
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    overrides: admin.overrides,
    sectionOrder: admin.sectionOrder,
    elementOffsets: admin.elementOffsets,
    hiddenSections: admin.hiddenSections,
    videoOrder: admin.videoOrder,
    hiddenVideos: admin.hiddenVideos,
    videoItems: admin.videoItems,
    podcastOrder: admin.podcastOrder,
    hiddenPodcasts: admin.hiddenPodcasts,
    podcastItems: admin.podcastItems,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const today = new Date().toISOString().slice(0, 10);
  a.download = `cuts-overrides-${today}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function importJSON(admin) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json,.json";
  input.onchange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (parsed.overrides && typeof parsed.overrides === "object") {
        Object.entries(parsed.overrides).forEach(([id, t]) => admin.updateOverride(id, t));
      }
      if (Array.isArray(parsed.sectionOrder)) {
        admin.updateSectionOrder(parsed.sectionOrder);
      }
      if (parsed.elementOffsets && typeof parsed.elementOffsets === "object") {
        Object.entries(parsed.elementOffsets).forEach(([id, p]) => {
          if (p && typeof p.x === "number" && typeof p.y === "number") admin.updateElementOffset(id, p.x, p.y);
        });
      }
      if (Array.isArray(parsed.hiddenSections)) {
        // Reset current and apply each from import
        const cur = new Set(admin.hiddenSections);
        parsed.hiddenSections.forEach((id) => { if (!cur.has(id)) admin.toggleSectionHidden(id); });
      }
      if (Array.isArray(parsed.videoOrder)) {
        admin.updateVideoOrder(parsed.videoOrder);
      }
      if (Array.isArray(parsed.hiddenVideos)) {
        const cur = new Set(admin.hiddenVideos);
        parsed.hiddenVideos.forEach((id) => { if (!cur.has(id)) admin.toggleVideoHidden(id); });
      }
      if (Array.isArray(parsed.podcastOrder)) {
        admin.updatePodcastOrder(parsed.podcastOrder);
      }
      if (Array.isArray(parsed.hiddenPodcasts)) {
        const cur = new Set(admin.hiddenPodcasts);
        parsed.hiddenPodcasts.forEach((id) => { if (!cur.has(id)) admin.togglePodcastHidden(id); });
      }
      if (Array.isArray(parsed.videoItems)) admin.updateVideoItems(parsed.videoItems);
      if (Array.isArray(parsed.podcastItems)) admin.updatePodcastItems(parsed.podcastItems);
      window.alert("Imported successfully.");
    } catch (err) {
      window.alert("Failed to import: " + err.message);
    }
  };
  input.click();
}

// ---------- Inline text editing wiring ----------

function attachInlineEditing(rootEl, editing, onChange) {
  if (!rootEl) return () => {};
  let cleanup = [];

  // Persist the in-progress edit to localStorage ONLY (no React setState),
  // so Publish can read fresh from localStorage even mid-typing. Avoiding
  // setOverrides on every keystroke prevents the re-render that would wipe
  // out the contenteditable cursor.
  const persistEditToStorage = (el) => {
    if (!el || !el.hasAttribute || !el.hasAttribute("data-edit-id")) return;
    const id = el.getAttribute("data-edit-id");
    const newHtml = (el.innerHTML || "").replace(/(?:&nbsp;|\s)+$/g, "");
    try {
      const cur = JSON.parse(localStorage.getItem(ADMIN_STORAGE_KEY) || "{}");
      cur.overrides = cur.overrides || {};
      cur.overrides[id] = newHtml;
      cur.updated = new Date().toISOString();
      cur.version = 1;
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(cur));
    } catch (_) {}
  };

  // On blur: also sync the value into React state (one re-render at most).
  const onBlur = (e) => {
    const el = e.target;
    if (!el || !el.hasAttribute || !el.hasAttribute("data-edit-id")) return;
    persistEditToStorage(el);
    const id = el.getAttribute("data-edit-id");
    const newHtml = (el.innerHTML || "").replace(/(?:&nbsp;|\s)+$/g, "");
    onChange(id, newHtml);
  };

  // On every keystroke: just localStorage, no setState — keeps cursor alive.
  const onInput = (e) => { persistEditToStorage(e.target); };

  const onKeydown = (e) => {
    if (!e.target || !e.target.hasAttribute || !e.target.hasAttribute("data-edit-id")) return;
    // Enter → insert newline (use <br> for single-line elements to keep layout clean)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      document.execCommand("insertLineBreak");
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.target.blur();
    }
  };

  function refresh() {
    const elements = getAllEditableElements();
    for (const el of elements) {
      // Ensure data-edit-original is captured first so id hash uses original text
      if (!el.hasAttribute("data-edit-original")) {
        el.setAttribute("data-edit-original", el.textContent || "");
      }
      const id = computeEditId(el);
      if (!id) continue;
      if (el.getAttribute("data-edit-id") !== id) {
        el.setAttribute("data-edit-id", id);
      }
      if (editing) {
        el.setAttribute("contenteditable", "true");
        el.setAttribute("spellcheck", "false");
      } else {
        el.removeAttribute("contenteditable");
        el.removeAttribute("spellcheck");
      }
    }
  }

  refresh();
  rootEl.addEventListener("blur", onBlur, true);
  rootEl.addEventListener("input", onInput, true);
  rootEl.addEventListener("keydown", onKeydown, true);
  cleanup.push(() => rootEl.removeEventListener("blur", onBlur, true));
  cleanup.push(() => rootEl.removeEventListener("input", onInput, true));
  cleanup.push(() => rootEl.removeEventListener("keydown", onKeydown, true));

  // MutationObserver — re-tag and re-apply on React re-renders
  let timer = null;
  const obs = new MutationObserver(() => {
    if (timer) return;
    timer = setTimeout(() => {
      timer = null;
      refresh();
    }, 50);
  });
  obs.observe(rootEl, { childList: true, subtree: true, characterData: false });
  cleanup.push(() => obs.disconnect());

  return () => cleanup.forEach((fn) => fn());
}

window.__cutsAttachInlineEditing = attachInlineEditing;

// ---------- Move-any-element drag ----------

function applyElementOffsets(offsets) {
  if (!offsets) return;
  const root = document.getElementById("root");
  if (!root) return;
  // First, clear stale transforms from elements that no longer have an offset
  root.querySelectorAll("[data-move-id]").forEach((el) => {
    const id = el.getAttribute("data-move-id");
    if (!offsets[id]) {
      el.style.transform = "";
      el.style.willChange = "";
    }
  });
  // Then, apply current offsets
  for (const [id, { x, y }] of Object.entries(offsets)) {
    // Try to find the element by path
    const el = findElementByPath(id);
    if (!el) continue;
    el.setAttribute("data-move-id", id);
    el.style.transform = `translate(${x}px, ${y}px)`;
    el.style.willChange = "transform";
  }
}

function findElementByPath(id) {
  if (!id) return null;
  const pathPart = id.split("#h:")[0];
  const segments = pathPart.split(">").filter(Boolean);
  if (segments.length === 0) return null;
  // First segment is the anchor — either "sec:<id>" or "root"
  const first = segments[0];
  let cur;
  if (first.startsWith("sec:")) {
    const sectionId = first.slice(4);
    cur = document.querySelector(`[data-section-id="${CSS.escape(sectionId)}"]`);
    if (!cur) return null;
  } else if (first === "root") {
    cur = document.getElementById("root");
  } else {
    // Legacy id without anchor prefix — assume root-relative
    cur = document.getElementById("root");
    segments.unshift(""); // pad so the loop below picks up from segment 0 again
    segments[0] = ""; // first segment is the placeholder we'll skip
  }
  for (let i = 1; i < segments.length; i++) {
    if (!cur) return null;
    const seg = segments[i];
    const m = seg.match(/^([a-z0-9]+)\[(\d+)\]$/i);
    if (!m) return null;
    const tag = m[1].toUpperCase();
    const idx = parseInt(m[2], 10);
    const sameTag = Array.from(cur.children).filter((c) => c.tagName === tag);
    cur = sameTag[idx];
  }
  return cur || null;
}

function clearAllTransforms() {
  const root = document.getElementById("root");
  if (!root) return;
  root.querySelectorAll("[data-move-id]").forEach((el) => {
    el.style.transform = "";
    el.style.willChange = "";
    el.removeAttribute("data-move-id");
  });
}

window.__cutsApplyElementOffsets = applyElementOffsets;
window.__cutsClearAllTransforms = clearAllTransforms;

// Drag state — module-level (single drag at a time)
let moveDragState = null;

function isInsideAdminUI(el) {
  return !!(el && el.closest && el.closest(".admin-button, .admin-toolbar, .admin-modal, .admin-modal-backdrop, .tweaks-panel"));
}

function pickMoveTarget(start) {
  // Walk up from the click target until we find an element inside #root.
  // Skip text-leaf spans (those are for text editing); prefer block-level
  // ancestors when the user clicks directly on text.
  const root = document.getElementById("root");
  if (!root || !root.contains(start)) return null;
  let el = start;
  // If the target is a leaf text element (h1>span, etc.), use its parent
  // unless the user clicked a button/anchor directly (those are usually
  // standalone moveable units).
  if (el.tagName === "SPAN" || el.tagName === "STRONG" || el.tagName === "EM") {
    el = el.parentElement || el;
  }
  return el;
}

function attachMoveListeners(rootEl, moving, onCommit) {
  if (!rootEl) return () => {};
  const cleanup = [];

  function onPointerDown(e) {
    if (!moving) return;
    if (e.button !== undefined && e.button !== 0) return;
    if (isInsideAdminUI(e.target)) return;
    const target = pickMoveTarget(e.target);
    if (!target) return;

    // Compute or read move id
    let moveId = target.getAttribute("data-move-id");
    if (!moveId) {
      // Reuse the edit-id scheme so persistence keys are stable
      if (!target.hasAttribute("data-edit-original")) {
        target.setAttribute("data-edit-original", target.textContent || "");
      }
      moveId = computeEditId(target);
      if (!moveId) return;
      target.setAttribute("data-move-id", moveId);
    }

    // Read current offset from inline transform
    const cur = target.style.transform || "";
    const m = cur.match(/translate\(\s*(-?\d+(?:\.\d+)?)px\s*,\s*(-?\d+(?:\.\d+)?)px\s*\)/);
    const startX = m ? parseFloat(m[1]) : 0;
    const startY = m ? parseFloat(m[2]) : 0;

    moveDragState = {
      el: target,
      id: moveId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startX,
      startY,
    };

    target.classList.add("admin-moving");
    document.body.classList.add("admin-moving-active");

    e.preventDefault();
    e.stopPropagation();
  }

  function onPointerMove(e) {
    if (!moveDragState) return;
    const dx = e.clientX - moveDragState.startClientX;
    const dy = e.clientY - moveDragState.startClientY;
    const x = moveDragState.startX + dx;
    const y = moveDragState.startY + dy;
    moveDragState.el.style.transform = `translate(${x}px, ${y}px)`;
    moveDragState.el.style.willChange = "transform";
    moveDragState.latestX = x;
    moveDragState.latestY = y;
    e.preventDefault();
  }

  function onPointerUp(e) {
    if (!moveDragState) return;
    const { el, id, latestX, latestY, startX, startY } = moveDragState;
    const finalX = latestX != null ? latestX : startX;
    const finalY = latestY != null ? latestY : startY;
    el.classList.remove("admin-moving");
    document.body.classList.remove("admin-moving-active");
    moveDragState = null;
    onCommit(id, finalX, finalY);
    e.preventDefault();
  }

  // Suppress click events that follow drags (so buttons inside don't fire)
  function suppressClick(e) {
    if (!moving) return;
    if (isInsideAdminUI(e.target)) return;
    e.preventDefault();
    e.stopPropagation();
  }

  rootEl.addEventListener("pointerdown", onPointerDown, true);
  window.addEventListener("pointermove", onPointerMove, true);
  window.addEventListener("pointerup", onPointerUp, true);
  rootEl.addEventListener("click", suppressClick, true);

  cleanup.push(() => rootEl.removeEventListener("pointerdown", onPointerDown, true));
  cleanup.push(() => window.removeEventListener("pointermove", onPointerMove, true));
  cleanup.push(() => window.removeEventListener("pointerup", onPointerUp, true));
  cleanup.push(() => rootEl.removeEventListener("click", suppressClick, true));

  return () => cleanup.forEach((fn) => fn());
}

window.__cutsAttachMoveListeners = attachMoveListeners;

