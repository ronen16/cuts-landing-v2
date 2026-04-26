// Tweaks panel: primary color, font family, dark/light mode
// Communicates with host via postMessage for persistence

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primaryColor": "#FFD500",
  "fontFamily": "Heebo + Assistant",
  "dark": true
}/*EDITMODE-END*/;

const COLOR_OPTIONS = [
  { name: "Cuts Yellow", value: "#FFD500" },
  { name: "Neon Green", value: "#C6FF3D" },
  { name: "Hot Coral", value: "#FF5E3A" },
  { name: "Electric Blue", value: "#3D7BFF" },
  { name: "Magenta", value: "#FF3DBD" },
];

const FONT_OPTIONS = [
  { name: "Heebo + Assistant", display: "'Heebo', sans-serif", body: "'Assistant', sans-serif" },
  { name: "Rubik + Assistant", display: "'Rubik', sans-serif", body: "'Assistant', sans-serif" },
  { name: "Heebo + Rubik", display: "'Heebo', sans-serif", body: "'Rubik', sans-serif" },
];

function TweaksPanel({ open, tweaks, setTweaks }) {
  if (!open) return null;

  const setKey = (k, v) => {
    const next = { ...tweaks, [k]: v };
    setTweaks(next);
    // Persist to host
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [k]: v } }, "*");
  };

  return (
    <div className="tweaks-panel">
      <h3>Tweaks</h3>

      <div className="row">
        <label>צבע ראשי</label>
        <div className="swatches">
          {COLOR_OPTIONS.map(c => (
            <button key={c.value}
              className={"sw" + (tweaks.primaryColor === c.value ? " active" : "")}
              onClick={() => setKey("primaryColor", c.value)}
              style={{ background: c.value }}
              title={c.name}
            />
          ))}
        </div>
      </div>

      <div className="row">
        <label>גופנים</label>
        <select value={tweaks.fontFamily} onChange={e => setKey("fontFamily", e.target.value)}>
          {FONT_OPTIONS.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
        </select>
      </div>

      <div className="row">
        <label>מצב תצוגה</label>
        <button className={"toggle" + (tweaks.dark ? " on" : "")} onClick={() => setKey("dark", !tweaks.dark)}>
          <span>{tweaks.dark ? "DARK MODE" : "LIGHT MODE"}</span>
          <span className="knob"></span>
        </button>
      </div>
    </div>
  );
}

function applyTweaksToDOM(tweaks) {
  const root = document.documentElement;
  root.style.setProperty("--primary", tweaks.primaryColor);

  const font = FONT_OPTIONS.find(f => f.name === tweaks.fontFamily) || FONT_OPTIONS[0];
  root.style.setProperty("--font-display", font.display);
  root.style.setProperty("--font-body", font.body);
}

Object.assign(window, { TWEAK_DEFAULTS, TweaksPanel, applyTweaksToDOM, COLOR_OPTIONS, FONT_OPTIONS });
