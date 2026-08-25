// Self-hosted heatmap collector — clicks + scroll depth, nothing else.
// No cookies, no PII: coordinates and section ids only, keyed by a random
// session id that lives in sessionStorage and dies with the tab.
//
// Every handler is wrapped so a failure here can never touch the page —
// same capture-first ethos as the lead form, but inverted: the page's job
// is leads; analytics must never get in its way.
(function () {
  "use strict";

  var ENDPOINT = "/api/heatmap";
  var FLUSH_AT = 25;      // send a batch every N click events
  var SESSION_CAP = 200;  // hard ceiling per session
  var MOBILE_MAX = 600;   // matches the site's @container breakpoint

  // The viewer embeds the site with ?hm_view=1 — never record ourselves.
  if (/[?&]hm_view=1/.test(location.search)) return;

  try {
    // Ronen editing in admin mode must not pollute the data.
    var adminState = JSON.parse(localStorage.getItem("cuts_admin_v1") || "{}");
    if (adminState.unlocked) return;
  } catch (e) { /* storage blocked — keep collecting, it's anonymous */ }

  // Page identity. /a /b /c /d are rewrites of the home page, so they all
  // collapse to "/" — the variant column already carries that distinction.
  var PAGE = (function () {
    try {
      var p = location.pathname || "/";
      if (/^\/(?:[abcd])?\/?$/.test(p)) return "/";
      p = p.replace(/\/+$/, "");
      return p ? p.slice(0, 80) : "/";
    } catch (e) { return "/"; }
  })();

  function variant() {
    // A/B variants exist only on the home page; elsewhere the split is noise.
    if (PAGE !== "/") return "-";
    try {
      if (window.__cutsGetVariant) return window.__cutsGetVariant();
      var m = location.pathname.match(/^\/([abcd])(?:\/|$)/);
      return m ? m[1] : "c"; // root serves variant c
    } catch (e) { return "c"; }
  }

  function clamp01(n) {
    return n < 0 ? 0 : n > 1 ? 1 : n;
  }

  function device() {
    return window.innerWidth < MOBILE_MAX ? "mobile" : "desktop";
  }

  var sessionId;
  try {
    sessionId = sessionStorage.getItem("cuts_hm_sid");
    if (!sessionId) {
      sessionId = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem("cuts_hm_sid", sessionId);
    }
  } catch (e) {
    sessionId = Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  var pending = [];
  var sentCount = 0;

  function flush() {
    if (!pending.length) return;
    var batch = pending.splice(0, pending.length);
    try {
      var body = JSON.stringify({ session_id: sessionId, events: batch });
      // sendBeacon survives page unload; fetch keepalive is the fallback.
      var ok = navigator.sendBeacon &&
        navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "application/json" }));
      if (!ok) {
        fetch(ENDPOINT, {
          method: "POST", body: body, keepalive: true,
          headers: { "Content-Type": "application/json" },
        }).catch(function () {});
      }
    } catch (e) { /* never the page's problem */ }
  }

  function record(ev) {
    if (sentCount + pending.length >= SESSION_CAP) return;
    pending.push(ev);
    if (pending.length >= FLUSH_AT) {
      sentCount += pending.length;
      flush();
    }
  }

  // ── clicks / taps ─────────────────────────────────────────────────────────
  document.addEventListener("pointerdown", function (e) {
    try {
      if (!e.target || !e.target.closest) return;
      // The consent banner floats over the page — dismissing it isn't engagement.
      // Consent UI (banner + reopen button) is chrome, not page engagement.
      if (e.target.closest('[id^="cuts-consent"]')) return;

      var sectionId, relX, relY;
      var section = e.target.closest("[data-section-id]");
      if (section) {
        var r = section.getBoundingClientRect();
        if (r.width < 1 || r.height < 1) return;
        relX = (e.clientX - r.left) / r.width;
        relY = (e.clientY - r.top) / r.height;
        if (relX < 0 || relX > 1 || relY < 0 || relY > 1) return;
        sectionId = section.getAttribute("data-section-id");
      } else {
        // No section markup — anchor against the document, so a plain page
        // like thank-you.html is measurable without touching its HTML.
        var doc = document.documentElement;
        if (doc.scrollWidth < 1 || doc.scrollHeight < 1) return;
        relX = clamp01((e.clientX + (window.scrollX || doc.scrollLeft || 0)) / doc.scrollWidth);
        relY = clamp01((e.clientY + (window.scrollY || doc.scrollTop || 0)) / doc.scrollHeight);
        sectionId = "__page";
      }

      record({
        kind: "click",
        page: PAGE,
        variant: variant(),
        device: device(),
        section_id: sectionId,
        rel_x: Math.round(relX * 1000) / 1000,
        rel_y: Math.round(relY * 1000) / 1000,
      });
    } catch (err) { /* swallow */ }
  }, { passive: true, capture: true });

  // ── scroll depth ──────────────────────────────────────────────────────────
  var maxPct = 0;
  var deepestSection = null;
  var scrollScheduled = false;

  function measureScroll() {
    scrollScheduled = false;
    try {
      var doc = document.documentElement;
      var total = doc.scrollHeight - window.innerHeight;
      if (total > 0) {
        var pct = Math.min(100, Math.round(((window.scrollY || doc.scrollTop) / total) * 100));
        if (pct > maxPct) maxPct = pct;
      }
      var viewBottom = (window.scrollY || doc.scrollTop) + window.innerHeight;
      var sections = document.querySelectorAll("[data-section-id]");
      for (var i = 0; i < sections.length; i++) {
        var top = sections[i].getBoundingClientRect().top + (window.scrollY || doc.scrollTop);
        if (top < viewBottom) deepestSection = sections[i].getAttribute("data-section-id");
      }
    } catch (e) { /* swallow */ }
  }

  window.addEventListener("scroll", function () {
    if (scrollScheduled) return;
    scrollScheduled = true;
    (window.requestIdleCallback || window.requestAnimationFrame)(measureScroll);
  }, { passive: true });

  var scrollSent = false;
  function sendScrollRecord() {
    if (scrollSent || maxPct === 0) return;
    scrollSent = true;
    record({
      kind: "scroll",
      page: PAGE,
      variant: variant(),
      device: device(),
      scroll_pct: maxPct,
      reached_section: deepestSection,
    });
  }

  // Flush on leave. visibilitychange→hidden is the only reliable mobile signal.
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
      sendScrollRecord();
      flush();
      // Allow a fresh scroll record if the visitor comes back to the tab.
      scrollSent = false;
    }
  });
  window.addEventListener("pagehide", function () {
    sendScrollRecord();
    flush();
  });

  measureScroll(); // capture the landing viewport before any scroll
})();
