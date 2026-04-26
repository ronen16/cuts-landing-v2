// Main app: variation switcher + tweaks integration

const VARIATIONS = [
  { key: "bold", label: "BOLD", className: "theme-bold", component: "BoldVariation" },
  { key: "editorial", label: "EDITORIAL", className: "theme-editorial", component: "EditorialVariation" },
  { key: "cinematic", label: "CINEMATIC", className: "theme-cinematic", component: "CinematicVariation" },
];

function App() {
  const [variation, setVariation] = React.useState(() => localStorage.getItem("cuts_variation") || "bold");
  const [tweaks, setTweaks] = React.useState(window.TWEAK_DEFAULTS);
  const [tweaksOpen, setTweaksOpen] = React.useState(false);
  const form = useForm();

  React.useEffect(() => {
    localStorage.setItem("cuts_variation", variation);
  }, [variation]);

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

  const onCTAClick = () => scrollToId("#cta");

  const variant = VARIATIONS.find(v => v.key === variation);
  const Variant = window[variant.component];

  // Dark/light class
  // bold & cinematic are dark by default; editorial is light by default
  const dark = tweaks.dark;
  let modeClass = "";
  if (variant.key === "editorial" && dark) modeClass = "dark";
  if ((variant.key === "bold" || variant.key === "cinematic") && !dark) modeClass = "light";

  return (
    <div className={`${variant.className} ${modeClass}`} key={variation}>
      <Variant onCTAClick={onCTAClick} form={form} />

      {/* Variation switcher (always visible) */}
      <div className="var-switch">
        {VARIATIONS.map(v => (
          <button key={v.key}
            className={variation === v.key ? "active" : ""}
            onClick={() => { setVariation(v.key); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            {v.label}
          </button>
        ))}
      </div>

      <TweaksPanel open={tweaksOpen} tweaks={tweaks} setTweaks={setTweaks} />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
