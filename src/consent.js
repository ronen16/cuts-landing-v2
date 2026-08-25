// Cookie consent gate for the Meta Pixel.
//
// המשמעות המשפטית: הפיקסל של Meta הוא מעקב פרסומי — הוא נטען רק אחרי
// הסכמה אקטיבית. אין pre-ticked, אין "המשך גלישה = הסכמה", ושני
// הכפתורים באותו משקל ויזואלי (אישור ודחייה שווי-ערך).
// הסטטיסטיקה האנונימית (src/heatmap.js) לא נשענת על עוגיות ולא על מזהים
// אישיים, ולכן היא לא נכללת בגייט הזה.
//
// Same capture-first ethos as src/heatmap.js: every path is wrapped so a
// failure here can never touch the page or block the lead form.
(function () {
  "use strict";

  var STORAGE_KEY = "cuts_consent";
  var PIXEL_ID = "646207438565937";
  var BANNER_ID = "cuts-consent"; // exact id — analytics excludes this subtree
  var REOPEN_ID = "cuts-consent-reopen";
  var STYLE_ID = "cuts-consent-style";
  var A11Y_FAB_CLEARANCE = 86; // px — the accessibility FAB owns the corner

  if (window.__cutsConsentInit) return;
  window.__cutsConsentInit = true;

  // currentScript exists only while this file runs synchronously, so the
  // event name must be read now — not inside a later callback.
  var fbEvent = "PageView";
  try {
    var own = document.currentScript ||
      document.querySelector("script[src*='consent.js']");
    var attr = own && own.getAttribute("data-fb-event");
    if (attr) fbEvent = attr;
  } catch (e) { /* PageView stays as the default */ }

  // ── storage ───────────────────────────────────────────────────────────────
  // Blocked storage (private mode, strict browsers) reads as "no choice yet":
  // we ask again rather than assume consent.
  function readChoice() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (parsed && (parsed.choice === "granted" || parsed.choice === "denied")) {
        return parsed.choice;
      }
    } catch (e) { /* unreadable — treat as unasked */ }
    return null;
  }

  function persistChoice(choice) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        choice: choice,
        ts: Date.now(),
      }));
    } catch (e) { /* write blocked — the banner will simply ask again */ }
  }

  function forgetChoice() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
  }

  // ── pixel ─────────────────────────────────────────────────────────────────
  function loadPixel() {
    if (window.__cutsPixelLoaded) return;
    window.__cutsPixelLoaded = true;
    try {
      /* eslint-disable */
      !function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0";
        n.queue = []; t = b.createElement(e); t.async = !0;
        t.src = v; s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      }(window, document, "script",
        "https://connect.facebook.net/en_US/fbevents.js");
      /* eslint-enable */
      window.fbq("init", PIXEL_ID);
      window.fbq("track", fbEvent);
    } catch (e) { /* never the page's problem */ }
  }

  // ── state broadcast ───────────────────────────────────────────────────────
  function emit(choice) {
    window.__cutsConsent = choice;
    try {
      document.dispatchEvent(new CustomEvent("cuts-consent", { detail: choice }));
    } catch (e) { /* old browser without CustomEvent — state is still readable */ }
  }

  // ── styles ────────────────────────────────────────────────────────────────
  var CSS = [
    // left offset keeps the accessibility FAB reachable while the banner is up —
    // the visitor who needs larger text is exactly the one facing this banner.
    "#" + BANNER_ID + "{position:fixed;left:" + A11Y_FAB_CLEARANCE + "px;right:0;bottom:0;z-index:2147483000;",
    "direction:rtl;box-sizing:border-box;display:flex;flex-wrap:wrap;gap:10px;",
    "align-items:center;justify-content:space-between;",
    "padding:12px 16px;padding-bottom:calc(12px + env(safe-area-inset-bottom,0px));",
    "background:#141414;border-top:1px solid rgba(255,213,0,0.28);",
    "border-radius:14px 0 0 0;box-shadow:0 -10px 30px rgba(0,0,0,0.5);",
    "font-family:'FbTypograph2',system-ui,sans-serif;}",
    "#" + BANNER_ID + " .cc-text{flex:1 1 240px;margin:0;font-size:12.5px;",
    "line-height:1.5;color:rgba(255,255,255,0.78);}",
    "#" + BANNER_ID + " .cc-text a{color:#FFD500;text-decoration:underline;}",
    "#" + BANNER_ID + " .cc-actions{display:flex;gap:8px;flex:0 0 auto;}",
    "#" + BANNER_ID + " .cc-btn{min-width:104px;padding:9px 18px;border-radius:999px;",
    "font-family:inherit;font-size:13px;font-weight:700;line-height:1;cursor:pointer;}",
    "#" + BANNER_ID + " .cc-btn--accept{background:#FFD500;color:#0A0A0A;",
    "border:1px solid #FFD500;}",
    "#" + BANNER_ID + " .cc-btn--reject{background:transparent;color:#FFFFFF;",
    "border:1px solid rgba(255,255,255,0.55);}",
    "#" + BANNER_ID + " .cc-btn:focus-visible{outline:3px solid #FFD500;outline-offset:2px;}",
    "@media (max-width:460px){#" + BANNER_ID + " .cc-actions{flex:1 1 100%;}",
    "#" + BANNER_ID + " .cc-btn{flex:1 1 0;min-width:0;}}",
    "#" + REOPEN_ID + "{position:fixed;bottom:28px;left:" + A11Y_FAB_CLEARANCE + "px;",
    "z-index:2147483000;background:none;border:0;padding:4px;cursor:pointer;",
    "font-family:'FbTypograph2',system-ui,sans-serif;font-size:11px;",
    "color:#FFFFFF;opacity:0.45;}",
    "#" + REOPEN_ID + ":hover,#" + REOPEN_ID + ":focus-visible{opacity:1;}",
  ].join("");

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = CSS;
    (document.head || document.documentElement).appendChild(style);
  }

  // ── DOM ───────────────────────────────────────────────────────────────────
  function remove(id) {
    var el = document.getElementById(id);
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function button(label, modifier, onClick) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cc-btn cc-btn--" + modifier;
    btn.textContent = label;
    btn.addEventListener("click", function () {
      try { onClick(); } catch (e) { /* swallow */ }
    });
    return btn;
  }

  function renderBanner() {
    if (document.getElementById(BANNER_ID)) return;
    injectStyle();

    var box = document.createElement("section");
    box.id = BANNER_ID;
    box.setAttribute("dir", "rtl");
    box.setAttribute("role", "region");
    box.setAttribute("aria-label", "הסכמה לשימוש בפיקסל פרסומי");

    var text = document.createElement("p");
    text.className = "cc-text";
    text.appendChild(document.createTextNode(
      "אנחנו משתמשים בפיקסל של Meta לשיפור הפרסום. " +
      "סטטיסטיקה אנונימית ללא עוגיות פועלת תמיד. "
    ));
    var link = document.createElement("a");
    link.href = "privacy.html";
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "מדיניות פרטיות";
    text.appendChild(link);

    var actions = document.createElement("div");
    actions.className = "cc-actions";
    actions.appendChild(button("מאשר", "accept", function () { choose("granted"); }));
    actions.appendChild(button("דוחה", "reject", function () { choose("denied"); }));

    box.appendChild(text);
    box.appendChild(actions);
    document.body.appendChild(box);
  }

  function renderReopen() {
    if (document.getElementById(REOPEN_ID)) return;
    injectStyle();
    var btn = document.createElement("button");
    btn.id = REOPEN_ID;
    btn.type = "button";
    btn.textContent = "ניהול עוגיות";
    btn.addEventListener("click", function () {
      try {
        // Reopening clears the stored decision so the banner asks again; the
        // previous decision keeps applying to this page load until they pick.
        forgetChoice();
        remove(REOPEN_ID);
        renderBanner();
      } catch (e) { /* swallow */ }
    });
    document.body.appendChild(btn);
  }

  function choose(choice) {
    persistChoice(choice);
    emit(choice);
    // Choosing "דוחה" after a previous "מאשר" cannot unload an already-running
    // pixel — it simply won't load on the next page. Acceptable, and the
    // stored state is what governs from here on.
    if (choice === "granted") loadPixel();
    remove(BANNER_ID);
    renderReopen();
  }

  function onReady(fn) {
    if (document.body) { fn(); return; }
    document.addEventListener("DOMContentLoaded", function () {
      try { fn(); } catch (e) { /* swallow */ }
    });
  }

  // ── boot ──────────────────────────────────────────────────────────────────
  try {
    var stored = readChoice();
    window.__cutsConsent = stored; // consumers read this, then listen for changes
    if (stored === "granted") loadPixel();
    onReady(function () {
      if (stored) renderReopen();
      else renderBanner();
    });
  } catch (e) { /* consent UI failed — no pixel loads, which is the safe side */ }
})();
