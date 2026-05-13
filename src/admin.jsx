// Admin Mode — inline text editor + section drag-to-reorder
// Unlock: 5 clicks on logo within 3s + password prompt
// Persistence: localStorage["cuts_admin_v1"]

const ADMIN_STORAGE_KEY = "cuts_admin_v1";
const ADMIN_PASSWORD_HASH = "86e2b4e7068dff297e717358659f5e2ef4376e37019d3427bc68339869b9e224";
const LOGO_CLICK_WINDOW_MS = 10000;
const LOGO_CLICK_THRESHOLD = 5;

// ---------- crypto helper ----------

async function sha256Hex(input) {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ---------- storage helpers ----------

function loadAdminState() {
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!raw) return { unlocked: false, overrides: {}, sectionOrder: null, elementOffsets: {}, hiddenSections: [] };
    const parsed = JSON.parse(raw);
    return {
      unlocked: !!parsed.unlocked,
      overrides: parsed.overrides || {},
      sectionOrder: Array.isArray(parsed.sectionOrder) ? parsed.sectionOrder : null,
      elementOffsets: parsed.elementOffsets || {},
      hiddenSections: Array.isArray(parsed.hiddenSections) ? parsed.hiddenSections : [],
    };
  } catch (e) {
    return { unlocked: false, overrides: {}, sectionOrder: null, elementOffsets: {}, hiddenSections: [] };
  }
}

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

  React.useEffect(() => {
    const onUnlock = () => setUnlocked(true);
    window.addEventListener("cuts-admin-unlock", onUnlock);
    return () => window.removeEventListener("cuts-admin-unlock", onUnlock);
  }, []);

  React.useEffect(() => {
    saveAdminState({ unlocked, overrides, sectionOrder, elementOffsets, hiddenSections });
  }, [unlocked, overrides, sectionOrder, elementOffsets, hiddenSections]);

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

  const resetAll = React.useCallback(() => {
    setOverrides({});
    setSectionOrder(null);
    setElementOffsets({});
    setHiddenSections([]);
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
    setEditingText: setEditingTextSafe,
    setDraggingSections: setDraggingSectionsSafe,
    setMovingElements: setMovingElementsSafe,
    updateOverride,
    updateSectionOrder,
    updateElementOffset,
    toggleSectionHidden,
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
  const parts = [];
  let cur = el;
  while (cur && cur !== root && cur.parentElement) {
    const parent = cur.parentElement;
    const siblings = Array.from(parent.children).filter(
      (c) => c.tagName === cur.tagName
    );
    const idx = siblings.indexOf(cur);
    parts.unshift(`${cur.tagName.toLowerCase()}[${idx}]`);
    cur = parent;
  }
  const path = parts.join(">");
  // Hash from the ORIGINAL text (captured before any edits) so the id stays
  // stable while the user types. Fallback to current text on first encounter.
  const text = (el.getAttribute("data-edit-original") || el.textContent || "").trim().slice(0, 60);
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = (h * 31 + text.charCodeAt(i)) | 0;
  }
  const hashHex = (h >>> 0).toString(16).padStart(8, "0");
  return `${path}#h:${hashHex}`;
}

window.__cutsComputeEditId = computeEditId;

// ---------- editable element identification ----------

const EDITABLE_TAGS = new Set([
  "H1", "H2", "H3", "H4", "H5", "H6",
  "P", "SPAN", "LI", "A", "BUTTON", "STRONG", "EM", "LABEL", "FIGCAPTION",
]);

function isLeafTextElement(el) {
  if (!el || el.nodeType !== 1) return false;
  if (!EDITABLE_TAGS.has(el.tagName)) return false;
  if (el.closest(".admin-button, .admin-toolbar, .admin-modal-backdrop, .admin-modal, .tweaks-panel")) return false;
  if (el.getAttribute("aria-hidden") === "true") return false;
  const text = (el.textContent || "").trim();
  if (!text) return false;
  // must be a "leaf" — no child element with non-empty text
  const childWithText = Array.from(el.children).find(
    (c) => (c.textContent || "").trim().length > 0
  );
  if (childWithText) return false;
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
    // Capture original text the first time we see this element
    // (must happen BEFORE computeEditId so the id hash is based on original)
    if (!el.hasAttribute("data-edit-original")) {
      el.setAttribute("data-edit-original", el.textContent || "");
    }
    const id = computeEditId(el);
    if (!id) continue;
    el.setAttribute("data-edit-id", id);
    if (Object.prototype.hasOwnProperty.call(overrides, id)) {
      const desired = overrides[id];
      if (el.textContent !== desired) el.textContent = desired;
    }
    // Do NOT auto-restore non-overridden elements during normal renders —
    // that would clobber in-progress edits. Reset is handled separately via
    // restoreOriginals() in admin.resetAll.
  }
}

function restoreOriginals() {
  const elements = getAllEditableElements();
  for (const el of elements) {
    const original = el.getAttribute("data-edit-original");
    if (original != null && el.textContent !== original) {
      el.textContent = original;
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

  const onBlur = (e) => {
    const el = e.target;
    if (!el || !el.hasAttribute || !el.hasAttribute("data-edit-id")) return;
    const id = el.getAttribute("data-edit-id");
    const newText = (el.textContent || "").replace(/\s+$/g, "");
    onChange(id, newText);
  };

  const onKeydown = (e) => {
    if (!e.target || !e.target.hasAttribute || !e.target.hasAttribute("data-edit-id")) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.target.blur();
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
  rootEl.addEventListener("keydown", onKeydown, true);
  cleanup.push(() => rootEl.removeEventListener("blur", onBlur, true));
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
  let cur = document.getElementById("root");
  for (const seg of segments) {
    if (!cur) return null;
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

