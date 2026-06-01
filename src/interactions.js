// Global interactive layer: scroll progress, cursor glow, reveal-on-scroll, magnetic CTAs.
// Non-invasive — injects overlays and upgrades existing elements via event listeners.

(function () {
  // --- 1. Cursor glow (desktop only — no mouse on mobile) ---
  if (!("ontouchstart" in window)) {
    const cursor = document.createElement("div");
    cursor.id = "cursor-glow";
    Object.assign(cursor.style, {
      position: "fixed", top: "0", left: "0",
      width: "360px", height: "360px", borderRadius: "50%",
      background: "radial-gradient(circle, rgba(255,213,0,0.14), rgba(255,213,0,0) 70%)",
      pointerEvents: "none", zIndex: "1",
      transform: "translate(-50%, -50%)",
      transition: "opacity .4s ease",
      opacity: "0", mixBlendMode: "screen",
    });
    document.body.appendChild(cursor);

    let cx = 0, cy = 0, tx = 0, ty = 0;
    window.addEventListener("mousemove", (e) => {
      tx = e.clientX; ty = e.clientY;
      cursor.style.opacity = "1";
    });
    window.addEventListener("mouseleave", () => cursor.style.opacity = "0");

    (function loop() {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      cursor.style.left = cx + "px";
      cursor.style.top = cy + "px";
      requestAnimationFrame(loop);
    })();
  }


  // --- 4. Reveal on scroll ---
  function setupReveal() {
    const targets = document.querySelectorAll(
      "section > .wrap > *, section > div:not([id]) > *, section h1, section h2, section h3"
    );
    const style = document.createElement("style");
    style.textContent = `
      .reveal-init { opacity: 0; transform: translateY(30px); transition: opacity .7s ease, transform .7s cubic-bezier(.2,.8,.2,1); }
      .reveal-in { opacity: 1; transform: none; }
    `;
    document.head.appendChild(style);

    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("reveal-in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -60px 0px" });

    targets.forEach((el) => {
      // Skip fixed/sticky stuff and nav
      const cs = getComputedStyle(el);
      if (cs.position === "fixed" || cs.position === "sticky") return;
      if (el.closest("nav")) return;
      // Skip buttons and elements containing buttons/forms — the reveal
      // opacity:0 + transform:translateY breaks iOS hit-testing on interactive
      // children, making buttons unresponsive until the transition completes.
      if (el.matches("button, a, input, select, textarea, form, [type='submit'], .btn")) return;
      if (el.querySelector("button, a[href], input, form, [type='submit'], .btn")) return;
      el.classList.add("reveal-init");
      io.observe(el);
    });
  }

  // --- 5. Gentle hover grow on primary CTAs ---
  // Hover grow is now handled entirely by CSS:
  //   @media (hover: hover) { .btn:hover { transform: scale(1.04); } }
  // The old JS version added mouseenter/mouseleave listeners that set
  // inline transform on EVERY .btn-primary — including on mobile, where
  // iOS fires mouseenter on the first tap, scaling the button mid-tap
  // and swallowing the click event.  Removed to fix the iOS multi-tap bug.
  function setupMagnetic() {}

  // --- 6. Tilt on step / testimonial cards ---
  function setupTilt() {
    const cards = document.querySelectorAll(
      '[style*="border-radius: 20px"][style*="var(--card)"], details.faq'
    );
    // Keep it subtle; skip for now to preserve readability
  }

  // --- 7. Animated number counters on stats ---
  function setupCounters() {
    const stats = document.querySelectorAll(".display");
    stats.forEach(el => {
      const text = el.textContent.trim();
      const m = text.match(/^(\+?)(\d+(?:\.\d+)?)(M|K|ש׳|\+)?$/);
      if (!m) return;
      const prefix = m[1] || "";
      const value = parseFloat(m[2]);
      const suffix = m[3] || "";
      el.dataset.final = text;

      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          const start = performance.now();
          const dur = 1100;
          const step = (now) => {
            const t = Math.min(1, (now - start) / dur);
            const eased = 1 - Math.pow(1 - t, 3);
            const v = value * eased;
            const display = value % 1 === 0 ? Math.round(v) : v.toFixed(1);
            el.textContent = prefix + display + suffix;
            if (t < 1) requestAnimationFrame(step);
            else el.textContent = el.dataset.final;
          };
          requestAnimationFrame(step);
        });
      }, { threshold: 0.3 });
      io.observe(el);
    });
  }

  // Wait for React to render
  function init() {
    setTimeout(() => {
      setupReveal();
      setupMagnetic();
      setupCounters();
    }, 600);
    // Re-run magnetic when variation changes (root re-renders)
    const mo = new MutationObserver(() => {
      clearTimeout(init._debounce);
      init._debounce = setTimeout(() => {
        setupMagnetic();
        setupCounters();
      }, 400);
    });
    const root = document.getElementById("root");
    if (root) mo.observe(root, { childList: true, subtree: false });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // --- 8. Delegated CTA tap handler (iOS backup) ---
  // React's synthetic onClick may not fire reliably on iOS WKWebView when
  // the override system rewrites innerHTML of parent elements (disconnects
  // React fibers). This native delegated handler catches clicks on CTA
  // buttons that live OUTSIDE forms and scrolls to #cta directly.
  document.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest(".btn-primary");
    if (!btn) return;
    // Form submit buttons are handled by native <form> submission — skip them.
    if (btn.closest("form")) return;
    var target = document.querySelector("#cta");
    if (!target) return;
    var top = target.getBoundingClientRect().top + window.scrollY - 80;
    // Try smooth scroll first; fall back to instant if the browser chokes.
    try { window.scrollTo({ top: top, behavior: "smooth" }); }
    catch (_) { window.scrollTo(0, top); }
  }, false);

  // --- 9. On-screen tap diagnostic (only with ?diag=1) ---
  // Captures the real iOS touch->click sequence and prints it on the page so we
  // can see WHY a tap doesn't register, without a desktop console.
  if (/[?&]diag=1/.test(location.search)) {
    var panel = document.createElement("div");
    Object.assign(panel.style, {
      position: "fixed", top: "0", left: "0", right: "0",
      maxHeight: "42vh", overflow: "auto", zIndex: "2147483647",
      background: "rgba(0,0,0,0.88)", color: "#fff", pointerEvents: "none",
      font: "11px/1.35 monospace", padding: "8px 10px", direction: "ltr",
      whiteSpace: "pre-wrap", borderBottom: "2px solid #FFD500",
    });
    document.body.appendChild(panel);
    var lines = [];
    function log(s, color) {
      lines.unshift("<div style='color:" + (color || "#9fe") + "'>" + s + "</div>");
      if (lines.length > 14) lines.pop();
      panel.innerHTML = lines.join("");
    }
    function desc(el) {
      if (!el) return "null";
      var c = (el.className && el.className.baseVal != null) ? el.className.baseVal : (el.className || "");
      return el.tagName.toLowerCase() + (c ? "." + String(c).trim().split(/\s+/).slice(0, 2).join(".") : "");
    }
    function nearestBtn(el) { return el && el.closest ? el.closest(".btn, .btn-primary, button") : null; }
    log("DIAG ready — tap a yellow button", "#FFD500");

    var pending = null;
    document.addEventListener("touchstart", function (e) {
      var t = e.touches[0]; if (!t) return;
      var startTarget = e.target;
      var atPoint = document.elementFromPoint(t.clientX, t.clientY);
      var btn = nearestBtn(startTarget) || nearestBtn(atPoint);
      if (!btn) return; // only care about taps on/near buttons
      var topEl = document.elementFromPoint(t.clientX, t.clientY);
      var overlay = topEl && !btn.contains(topEl) && topEl !== btn && !(btn.contains(topEl));
      pending = { t0: Date.now(), btn: btn, startY: window.scrollY, clicked: false,
        startHref: location.href,
        startDesc: desc(startTarget), topDesc: desc(topEl), overlay: overlay };
      log("TOUCH on " + desc(btn) + " | topEl=" + desc(topEl) +
          (overlay ? "  ⚠OVERLAY-INTERCEPT" : ""), overlay ? "#ff6" : "#9fe");
    }, { passive: true, capture: true });

    document.addEventListener("click", function (e) {
      var btn = nearestBtn(e.target);
      if (!btn) return;
      if (pending && pending.btn === btn) pending.clicked = true;
      var moved = window.scrollY - (pending ? pending.startY : window.scrollY);
      log("CLICK ✓ fired on " + desc(btn) + " (dt=" +
          (pending ? Date.now() - pending.t0 : "?") + "ms, scroll∆=" + moved + ")", "#7f7");
    }, true);

    // After each tap, report whether the ACTION happened. The app now acts on
    // touchend (React onTouchEnd) and preventDefault()s the click, so "no click"
    // is EXPECTED on success — judge by real effect (scroll moved / form submitted
    // / url changed), not by whether a click fired.
    document.addEventListener("touchend", function () {
      var p = pending; if (!p) return;
      var sameNode = p.btn.isConnected; // false => DOM was torn down mid-tap
      setTimeout(function () {
        var moved = window.scrollY - p.startY;
        var errs = document.querySelectorAll('[class*="err"]').length;
        var acted = p.clicked || Math.abs(moved) > 4 || errs > 0 ||
                    location.href !== p.startHref;
        log((acted ? "ACTED ✓" : "NO-OP ✗") + " on " + desc(p.btn) +
            " | btnStillInDOM=" + sameNode +
            " | scroll∆=" + moved +
            " | errs=" + errs +
            (p.overlay ? " | ⚠hadOverlay" : ""),
            acted ? "#7f7" : "#f88");
        if (pending === p) pending = null;
      }, 500);
    }, { passive: true, capture: true });

    // Universal tap tracker for NON-button controls (inputs, checkbox label,
    // links). These rely on native focus/click — which iOS cancels if the DOM
    // near the control is torn down mid-tap. A transient MutationObserver over
    // the tap window records exactly that, and we report whether focus landed.
    document.addEventListener("touchstart", function (e) {
      var t = e.touches[0]; if (!t) return;
      var el = document.elementFromPoint(t.clientX, t.clientY) || e.target;
      var ctl = el && el.closest ? el.closest("input, textarea, select, label, a[href]") : null;
      if (!ctl) return;
      if (ctl.closest(".btn, .btn-primary, button")) return; // buttons covered above
      var watch = ctl.closest("form, section, .wrap") || document.body;
      var muts = 0, tally = {};
      var mo = new MutationObserver(function (recs) {
        for (var i = 0; i < recs.length; i++) {
          var r = recs[i];
          if (!watch.contains(r.target)) continue;
          muts++;
          var key = r.type === "attributes"
            ? ("attr:" + r.attributeName + " @" + desc(r.target))
            : r.type === "characterData"
              ? ("text @" + desc(r.target.parentNode))
              : ("child -" + r.removedNodes.length + "+" + r.addedNodes.length + " @" + desc(r.target));
          tally[key] = (tally[key] || 0) + 1;
        }
      });
      mo.observe(watch, { childList: true, subtree: true, characterData: true, attributes: true });
      var startActive = document.activeElement;
      log("TAP-CTL " + desc(ctl), "#9cf");
      setTimeout(function () {
        mo.disconnect();
        var ae = document.activeElement;
        var focused = ae && ae !== document.body && ae !== startActive;
        var top = Object.keys(tally).sort(function (a, b) { return tally[b] - tally[a]; })[0];
        log((focused ? "FOCUS ✓" : "NO-FOCUS ✗") + " " + desc(ctl) +
            " | active=" + desc(ae) +
            " | muts=" + muts + (top ? " TOP[" + tally[top] + "x " + top + "]" : ""),
            focused ? "#7f7" : "#f88");
      }, 700);
    }, { passive: true, capture: true });
  }
})();
