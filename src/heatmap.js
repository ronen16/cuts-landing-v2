// Self-hosted heatmap collector — clicks + scroll depth, nothing else.
// No cookies, no PII: coordinates and section ids only, keyed by a random
// session id that lives in sessionStorage and dies with the tab.
//
// Every handler is wrapped so a failure here can never touch the page —
// same capture-first ethos as the lead form, but inverted: the page's job
// is leads; analytics must never get in its way.
(function () {
  "use strict";

  // What made this file expensive was never the code — it was the DOM
  // measuring: the first measureScroll() and the section sweep landed inside
  // React's first render and forced ~1s of layout on the critical path
  // (Lighthouse blamed ~1030ms of mobile boot CPU on it). Deferring the whole
  // collector fixed the cost and introduced a worse problem: nothing was
  // listening yet, so a visitor who left inside the first couple of seconds
  // produced no session at all. That silently deleted the fastest-bouncing
  // traffic there is — people arriving from an ad — and made paid visits look
  // like a third of what Ads Manager reported.
  //
  // So the split is by what actually costs, not by convenience: registering
  // listeners and reading the URL are free and happen now, so every visit is
  // counted and attributed from the first moment. Only the two calls that
  // touch layout wait for an idle slot after load.
  var whenIdle = function (fn) {
    var run = function () {
      if (window.requestIdleCallback) window.requestIdleCallback(fn, { timeout: 1500 });
      else setTimeout(fn, 200);
    };
    if (document.readyState === "complete") run();
    else window.addEventListener("load", run, { once: true });
  };

  var ENDPOINT = "/api/heatmap";
  var FLUSH_AT = 40;      // send a batch every N events — move samples burst
  var SESSION_CAP = 200;  // hard ceiling per session
  var MOBILE_MAX = 600;   // matches the site's @container breakpoint

  var RAGE_MIN_CLICKS = 3;
  var RAGE_RADIUS_PX = 48;
  var RAGE_WINDOW_MS = 1200;
  var RAGE_COOLDOWN_MS = 2000; // one burst is one event, not a stream

  var MOVE_CAP = 60;           // move samples allowed per session
  var MOVE_SAMPLE_MS = 400;
  var MOVE_GRID_PX = 40;
  // Moves are ambient noise next to clicks and funnel steps, so they stop
  // early: this many slots of the session cap stay reserved for the rest.
  var MOVE_RESERVED_SLOTS = 40;

  var LATE_RENDER_MS = 3000;   // React sections that mount after boot

  // The viewer embeds the site with ?hm_view=1 — never record ourselves.
  if (/[?&]hm_view=1/.test(location.search)) return;

  try {
    // Ronen editing in admin mode must not pollute the data.
    var adminState = JSON.parse(localStorage.getItem("cuts_admin_v1") || "{}");
    if (adminState.unlocked) return;

    // Visiting ?hm_optout=1 once marks this browser as ours for good — the
    // team browsing its own site was showing up as visitor behaviour.
    if (/[?&]hm_optout=1/.test(location.search)) {
      localStorage.setItem("cuts_hm_optout", "1");
    }
    if (localStorage.getItem("cuts_hm_optout") === "1") return;
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

  // ── traffic source ────────────────────────────────────────────────────────
  // "c:" means the visit came from a paid campaign, "r:" from an organic
  // referral, bare "direct" from neither. The API filters on that prefix, so
  // it's a contract: the shape may gain values, never a different grammar.
  var SOURCE_MAX = 40;

  function cleanToken(value) {
    // Hebrew and spaces are allowed because Meta's {{campaign.name}} and
    // {{ad.name}} expand to the names Ronen typed in Ads Manager — stripping
    // them left "קמפיין 25.08.26" as a bare "25.08.26", or nothing at all.
    return String(value || "").toLowerCase().replace(/[^a-z0-9֐-׿._:\- ]/g, "").trim();
  }

  // A referrer only counts when it's someone else's site — our own pages
  // linking to each other say nothing about where the visitor came from.
  function externalHost(url) {
    if (!url) return "";
    try {
      var here = String(location.hostname || "").toLowerCase().replace(/^www\./, "");
      var host = new URL(url, location.href).hostname.toLowerCase().replace(/^www\./, "");
      if (!host || host === here) return "";
      return cleanToken(host);
    } catch (e) { return ""; }
  }

  // primitives.jsx caches the first landing's params, but the collector also
  // runs on pages it never loads (thank-you.html), so the URL is read too.
  var attribution = (function () {
    var attr = {};
    try {
      attr = JSON.parse(sessionStorage.getItem("cuts_attribution") || "{}") || {};
    } catch (e) { attr = {}; }

    var params = null;
    try { params = new URLSearchParams(location.search); } catch (e) { /* swallow */ }

    return { attr: attr, params: params };
  })();

  function attribute(name) {
    if (attribution.attr && attribution.attr[name]) return attribution.attr[name];
    return (attribution.params && attribution.params.get(name)) || "";
  }

  var SOURCE = (function () {
    var attr = attribution.attr;

    var utmSource = cleanToken(attribute("utm_source"));
    if (utmSource) return ("c:" + utmSource).slice(0, SOURCE_MAX);
    // A click id without a utm_source still names the network that sent it.
    if (attribute("fbclid")) return "c:facebook";
    if (attribute("gclid")) return "c:google";
    if (attribute("ttclid")) return "c:tiktok";

    var host = "";
    try { host = externalHost(document.referrer); } catch (e) { host = ""; }
    if (!host) host = externalHost(attr && attr.referrer);
    if (host) return ("r:" + host).slice(0, SOURCE_MAX);

    return "direct";
  })();

  // The source names the network that sent the visit; the campaign names the
  // specific ad inside it. utm_content is the fallback because some link
  // builders put the ad's name there and leave utm_campaign empty. Organic
  // traffic has no campaign at all, and "" is exactly that.
  var CAMPAIGN = (function () {
    var name = cleanToken(attribute("utm_campaign"));
    if (!name) name = cleanToken(attribute("utm_content"));
    return name.slice(0, SOURCE_MAX);
  })();

  function clamp01(n) {
    return n < 0 ? 0 : n > 1 ? 1 : n;
  }

  function device() {
    return window.innerWidth < MOBILE_MAX ? "mobile" : "desktop";
  }

  function round3(n) {
    return Math.round(n * 1000) / 1000;
  }

  // Shared anchoring for clicks, rage bursts and move samples: a point in
  // client coords becomes section-relative, or document-relative when the
  // page carries no section markup. Returns null when the point is
  // unmeasurable (collapsed box, outside its own section).
  function anchorAt(clientX, clientY, el) {
    var section = el && el.closest ? el.closest("[data-section-id]") : null;
    if (section) {
      var r = section.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return null;
      var offsetX = clientX - r.left;
      var offsetY = clientY - r.top;
      if (offsetX < 0 || offsetX > r.width) return null;
      if (offsetY < 0 || offsetY > r.height) return null;
      return {
        sectionId: section.getAttribute("data-section-id"),
        relX: offsetX / r.width,
        relY: offsetY / r.height,
        cellX: Math.floor(offsetX / MOVE_GRID_PX),
        cellY: Math.floor(offsetY / MOVE_GRID_PX),
      };
    }
    var doc = document.documentElement;
    if (doc.scrollWidth < 1 || doc.scrollHeight < 1) return null;
    var pageX = clientX + (window.scrollX || doc.scrollLeft || 0);
    var pageY = clientY + (window.scrollY || doc.scrollTop || 0);
    return {
      sectionId: "__page",
      relX: clamp01(pageX / doc.scrollWidth),
      relY: clamp01(pageY / doc.scrollHeight),
      cellX: Math.floor(pageX / MOVE_GRID_PX),
      cellY: Math.floor(pageY / MOVE_GRID_PX),
    };
  }

  // Funnel steps must survive an in-tab reload, so their fired sets live in
  // sessionStorage; blocked storage degrades to in-memory once-per-load.
  function loadFiredSet(key) {
    var set = {};
    try {
      var list = JSON.parse(sessionStorage.getItem(key) || "[]");
      for (var i = 0; i < list.length; i++) set[list[i]] = true;
    } catch (e) { /* swallow */ }
    return set;
  }

  function persistFiredSet(key, set) {
    try {
      var list = [];
      for (var k in set) {
        if (Object.prototype.hasOwnProperty.call(set, k)) list.push(k);
      }
      sessionStorage.setItem(key, JSON.stringify(list));
    } catch (e) { /* swallow */ }
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

  // opts.lowPriority marks move samples, which give up their slot long
  // before the real signal does. Returns whether the event was queued.
  function record(ev, opts) {
    var ceiling = opts && opts.lowPriority
      ? SESSION_CAP - MOVE_RESERVED_SLOTS
      : SESSION_CAP;
    if (sentCount + pending.length >= ceiling) return false;
    pending.push(ev);
    if (pending.length >= FLUSH_AT) {
      sentCount += pending.length;
      flush();
    }
    return true;
  }

  function flushImmediate() {
    sentCount += pending.length;
    flush();
  }

  // ── clicks / taps ─────────────────────────────────────────────────────────
  // A touch that starts a scroll fires pointerdown too, so counting those as
  // clicks fills the map with swipe marks down the side of the screen where a
  // thumb rests. A click is only a click if the pointer went down and came up
  // in the same spot, quickly — anything else is a scroll or a drag.
  var TAP_MAX_MOVE_PX = 12;
  var TAP_MAX_MS = 700;
  var pendingTap = null;

  document.addEventListener("pointerdown", function (e) {
    try {
      if (!e.target || !e.target.closest) return;
      // Consent UI (banner + reopen button) is chrome, not page engagement.
      if (e.target.closest('[id^="cuts-consent"]')) return;
      pendingTap = { x: e.clientX, y: e.clientY, t: Date.now(), target: e.target };
    } catch (err) { pendingTap = null; }
  }, { passive: true, capture: true });

  document.addEventListener("pointerup", function (e) {
    try {
      var down = pendingTap;
      pendingTap = null;
      if (!down) return;
      if (Date.now() - down.t > TAP_MAX_MS) return;
      if (Math.abs(e.clientX - down.x) > TAP_MAX_MOVE_PX) return;
      if (Math.abs(e.clientY - down.y) > TAP_MAX_MOVE_PX) return;

      var at = anchorAt(down.x, down.y, down.target);
      if (!at) return;

      record({
        kind: "click",
        page: PAGE,
        variant: variant(),
        device: device(),
        source: SOURCE,
        campaign: CAMPAIGN,
        section_id: at.sectionId,
        rel_x: round3(at.relX),
        rel_y: round3(at.relY),
      });

      trackRage({ clientX: down.x, clientY: down.y, target: down.target });
    } catch (err) { /* swallow */ }
  }, { passive: true, capture: true });

  // A pointer that leaves the surface mid-gesture never becomes a tap.
  document.addEventListener("pointercancel", function () { pendingTap = null; },
    { passive: true, capture: true });

  // ── rage clicks ───────────────────────────────────────────────────────────
  // Repeated stabs at the same spot mean something looks clickable and isn't.
  var rageBuffer = [];
  var rageQuietUntil = 0;

  function trackRage(e) {
    var now = Date.now();
    if (now < rageQuietUntil) return;

    var fresh = [];
    for (var i = 0; i < rageBuffer.length; i++) {
      if (now - rageBuffer[i].t <= RAGE_WINDOW_MS) fresh.push(rageBuffer[i]);
    }
    fresh.push({ x: e.clientX, y: e.clientY, t: now, target: e.target });
    rageBuffer = fresh;

    var cluster = [];
    for (var j = 0; j < rageBuffer.length; j++) {
      var dx = rageBuffer[j].x - e.clientX;
      var dy = rageBuffer[j].y - e.clientY;
      if (dx * dx + dy * dy <= RAGE_RADIUS_PX * RAGE_RADIUS_PX) cluster.push(rageBuffer[j]);
    }
    if (cluster.length < RAGE_MIN_CLICKS) return;

    var sumX = 0, sumY = 0;
    for (var k = 0; k < cluster.length; k++) {
      sumX += cluster[k].x;
      sumY += cluster[k].y;
    }
    var centroidX = sumX / cluster.length;
    var centroidY = sumY / cluster.length;

    // The centroid belongs to no single click, so ask the page what sits
    // there; the last click's target is the fallback when hit-testing fails.
    var host = null;
    try {
      host = document.elementFromPoint(centroidX, centroidY);
    } catch (err) { /* swallow */ }
    if (!host || !host.closest) host = e.target;

    var at = anchorAt(centroidX, centroidY, host);
    rageBuffer = [];
    rageQuietUntil = now + RAGE_COOLDOWN_MS;
    if (!at) return;

    record({
      kind: "rage",
      page: PAGE,
      variant: variant(),
      device: device(),
      source: SOURCE,
      campaign: CAMPAIGN,
      section_id: at.sectionId,
      rel_x: round3(at.relX),
      rel_y: round3(at.relY),
    });
  }

  // ── funnel: form sections coming into view ────────────────────────────────
  var FORM_VIEW_KEY = "cuts_hm_fv";
  var formViewsFired = loadFiredSet(FORM_VIEW_KEY);

  var formObserver = null;

  function watchFormSections() {
    try {
      if (!formObserver) return;
      var sections = document.querySelectorAll("[data-section-id]");
      for (var i = 0; i < sections.length; i++) {
        var id = sections[i].getAttribute("data-section-id");
        if (!id || formViewsFired[id]) continue;
        if (!sections[i].querySelector("form")) continue;
        formObserver.observe(sections[i]);
      }
    } catch (e) { /* swallow */ }
  }

  try {
    if (window.IntersectionObserver) {
      formObserver = new IntersectionObserver(function (entries) {
        try {
          for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            if (!entry.isIntersecting || entry.intersectionRatio < 0.5) continue;
            var id = entry.target.getAttribute("data-section-id");
            formObserver.unobserve(entry.target);
            if (!id || formViewsFired[id]) continue;
            formViewsFired[id] = true;
            persistFiredSet(FORM_VIEW_KEY, formViewsFired);
            record({
              kind: "form_view",
              page: PAGE,
              variant: variant(),
              device: device(),
              source: SOURCE,
              campaign: CAMPAIGN,
              section_id: id,
            });
          }
        } catch (err) { /* swallow */ }
      }, { threshold: 0.5 });
    }
  } catch (e) { /* no IntersectionObserver — skip this signal entirely */ }

  // Both sweeps read geometry, so both wait for an idle slot after load.
  whenIdle(function () {
    watchFormSections();
    // React can mount the form section after us; one late sweep catches it.
    setTimeout(watchFormSections, LATE_RENDER_MS);
  });

  // ── funnel: lead submitted ────────────────────────────────────────────────
  var LEAD_KEY = "cuts_hm_lead";
  var leadFired = false;
  try {
    leadFired = sessionStorage.getItem(LEAD_KEY) === "1";
  } catch (e) { /* swallow */ }

  document.addEventListener("cuts:lead", function () {
    try {
      if (leadFired) return;
      leadFired = true;
      try { sessionStorage.setItem(LEAD_KEY, "1"); } catch (err) { /* swallow */ }
      record({
        kind: "lead",
        page: PAGE,
        variant: variant(),
        device: device(),
        source: SOURCE,
        campaign: CAMPAIGN,
      });
      // A lead usually means a redirect is a heartbeat away.
      flushImmediate();
    } catch (err) { /* swallow */ }
  });

  // ── form fields ───────────────────────────────────────────────────────────
  // Field *contents* are never read — only whether the box was left empty.
  var FIELD_TAGS = { INPUT: true, TEXTAREA: true };
  var NON_FIELD_TYPES = {
    hidden: true, submit: true, button: true, reset: true, image: true,
  };
  var fieldFocusFired = {};
  var fieldResults = {};

  function fieldNameOf(el) {
    var name = el.getAttribute("name") || el.id || el.type || "field";
    return String(name).slice(0, 40);
  }

  function trackedField(target) {
    if (!target || !target.tagName || !FIELD_TAGS[target.tagName]) return null;
    if (target.tagName === "INPUT" && NON_FIELD_TYPES[target.type]) return null;
    if (!target.closest || !target.closest("form")) return null;
    return target;
  }

  document.addEventListener("focusin", function (e) {
    try {
      var field = trackedField(e.target);
      if (!field) return;
      var name = fieldNameOf(field);
      if (fieldFocusFired[name]) return;
      fieldFocusFired[name] = true;
      record({
        kind: "form_field",
        page: PAGE,
        variant: variant(),
        device: device(),
        source: SOURCE,
        campaign: CAMPAIGN,
        section_id: name,
        reached_section: "focus",
      });
    } catch (err) { /* swallow */ }
  }, true);

  document.addEventListener("focusout", function (e) {
    try {
      var field = trackedField(e.target);
      if (!field) return;
      var name = fieldNameOf(field);
      var outcome = String(field.value || "").trim() ? "complete" : "abandon";
      // First result wins, except that filling in an abandoned field later
      // is real progress and gets its own event.
      if (fieldResults[name] === outcome) return;
      if (fieldResults[name] === "complete") return;
      fieldResults[name] = outcome;
      record({
        kind: "form_field",
        page: PAGE,
        variant: variant(),
        device: device(),
        source: SOURCE,
        campaign: CAMPAIGN,
        section_id: name,
        reached_section: outcome,
      });
    } catch (err) { /* swallow */ }
  }, true);

  // ── move map (desktop only) ───────────────────────────────────────────────
  var moveCount = 0;
  var lastMoveSampleAt = 0;
  var lastMoveCell = "";

  document.addEventListener("mousemove", function (e) {
    try {
      if (moveCount >= MOVE_CAP) return;
      if (device() !== "desktop") return;
      var now = Date.now();
      if (now - lastMoveSampleAt < MOVE_SAMPLE_MS) return;
      lastMoveSampleAt = now;

      var at = anchorAt(e.clientX, e.clientY, e.target);
      if (!at) return;
      // A cursor resting in one cell says nothing new.
      var cell = at.sectionId + ":" + at.cellX + ":" + at.cellY;
      if (cell === lastMoveCell) return;
      lastMoveCell = cell;

      var queued = record({
        kind: "move",
        page: PAGE,
        variant: variant(),
        device: device(),
        source: SOURCE,
        campaign: CAMPAIGN,
        section_id: at.sectionId,
        rel_x: round3(at.relX),
        rel_y: round3(at.relY),
      }, { lowPriority: true });
      if (queued) moveCount++;
    } catch (err) { /* swallow */ }
  }, { passive: true });

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
    // 0% still counts — a visitor who never scrolls is a session too, and
    // the funnel's denominator is built from these records.
    if (scrollSent) return;
    scrollSent = true;
    record({
      kind: "scroll",
      page: PAGE,
      variant: variant(),
      device: device(),
      source: SOURCE,
      campaign: CAMPAIGN,
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

  // The only other layout read at boot. Until it runs the session is already
  // recorded and attributed — it just has a scroll depth of 0, which is the
  // truth for anyone who leaves this early.
  whenIdle(measureScroll);
})();
