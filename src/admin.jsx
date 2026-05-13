// Admin Mode — inline text editor + section drag-to-reorder
// Unlock: 5 clicks on logo within 3s + password prompt
// Persistence: localStorage["cuts_admin_v1"]

const ADMIN_STORAGE_KEY = "cuts_admin_v1";
const ADMIN_PASSWORD_HASH = "86e2b4e7068dff297e717358659f5e2ef4376e37019d3427bc68339869b9e224";
const LOGO_CLICK_WINDOW_MS = 5000;
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
    if (!raw) return { unlocked: false, overrides: {}, sectionOrder: null };
    const parsed = JSON.parse(raw);
    return {
      unlocked: !!parsed.unlocked,
      overrides: parsed.overrides || {},
      sectionOrder: Array.isArray(parsed.sectionOrder) ? parsed.sectionOrder : null,
    };
  } catch (e) {
    return { unlocked: false, overrides: {}, sectionOrder: null };
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
      })
    );
  } catch (e) {
    console.warn("admin: failed to save state", e);
  }
}

// ---------- logo click counter ----------

let clickTimestamps = [];

function showClickToast(count) {
  let toast = document.getElementById("__cuts-click-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "__cuts-click-toast";
    toast.style.cssText =
      "position:fixed;top:80px;left:50%;transform:translateX(-50%);" +
      "background:rgba(0,0,0,0.85);color:#FFD500;border:1px solid #FFD500;" +
      "padding:10px 18px;border-radius:999px;font:600 14px 'JetBrains Mono',monospace;" +
      "letter-spacing:0.1em;z-index:10000;pointer-events:none;direction:ltr;" +
      "transition:opacity 0.3s ease;opacity:0;";
    document.body.appendChild(toast);
  }
  toast.textContent = `${count} / ${LOGO_CLICK_THRESHOLD}`;
  toast.style.opacity = "1";
  clearTimeout(toast.__hideTimer);
  toast.__hideTimer = setTimeout(() => {
    toast.style.opacity = "0";
  }, 1500);
}

function handleLogoClick() {
  const now = Date.now();
  clickTimestamps = clickTimestamps.filter((t) => now - t < LOGO_CLICK_WINDOW_MS);
  clickTimestamps.push(now);
  const count = clickTimestamps.length;
  console.info(`[cuts-admin] logo click ${count}/${LOGO_CLICK_THRESHOLD}`);
  showClickToast(count);
  if (count < LOGO_CLICK_THRESHOLD) return;
  clickTimestamps = [];
  const toast = document.getElementById("__cuts-click-toast");
  if (toast) toast.style.opacity = "0";
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

// ---------- useAdminMode hook ----------

function useAdminMode() {
  const initial = React.useMemo(loadAdminState, []);
  const [unlocked, setUnlocked] = React.useState(initial.unlocked);
  const [editingText, setEditingText] = React.useState(false);
  const [draggingSections, setDraggingSections] = React.useState(false);
  const [overrides, setOverrides] = React.useState(initial.overrides);
  const [sectionOrder, setSectionOrder] = React.useState(initial.sectionOrder);

  React.useEffect(() => {
    const onUnlock = () => setUnlocked(true);
    window.addEventListener("cuts-admin-unlock", onUnlock);
    return () => window.removeEventListener("cuts-admin-unlock", onUnlock);
  }, []);

  React.useEffect(() => {
    saveAdminState({ unlocked, overrides, sectionOrder });
  }, [unlocked, overrides, sectionOrder]);

  // mutual exclusion
  const setEditingTextSafe = React.useCallback((v) => {
    setEditingText(v);
    if (v) setDraggingSections(false);
  }, []);
  const setDraggingSectionsSafe = React.useCallback((v) => {
    setDraggingSections(v);
    if (v) setEditingText(false);
  }, []);

  const updateOverride = React.useCallback((id, text) => {
    setOverrides((prev) => ({ ...prev, [id]: text }));
  }, []);

  const updateSectionOrder = React.useCallback((order) => {
    setSectionOrder(order);
  }, []);

  const resetAll = React.useCallback(() => {
    setOverrides({});
    setSectionOrder(null);
  }, []);

  const exitAdmin = React.useCallback(() => {
    setUnlocked(false);
    setEditingText(false);
    setDraggingSections(false);
  }, []);

  return {
    unlocked,
    editingText,
    draggingSections,
    overrides,
    sectionOrder,
    setEditingText: setEditingTextSafe,
    setDraggingSections: setDraggingSectionsSafe,
    updateOverride,
    updateSectionOrder,
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
  const text = (el.textContent || "").trim().slice(0, 60);
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
  if (el.closest(".admin-button, .admin-toolbar")) return false;
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
    const id = computeEditId(el);
    if (!id) continue;
    el.setAttribute("data-edit-id", id);
    // Capture original text the first time we see this element
    if (!el.hasAttribute("data-edit-original")) {
      el.setAttribute("data-edit-original", el.textContent || "");
    }
    const original = el.getAttribute("data-edit-original");
    if (Object.prototype.hasOwnProperty.call(overrides, id)) {
      const desired = overrides[id];
      if (el.textContent !== desired) el.textContent = desired;
    } else {
      // No override → ensure DOM matches original (restore if previously edited)
      if (el.textContent !== original) el.textContent = original;
    }
  }
}

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

