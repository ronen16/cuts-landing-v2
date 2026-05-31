// Global interactive layer: scroll progress, cursor glow, reveal-on-scroll, magnetic CTAs.
// Non-invasive — injects overlays and upgrades existing elements via event listeners.

(function () {
  // --- 1. FastClick for iOS (Safari + Chrome = WKWebView) ---
  // iOS's touch-to-click synthesis is unreliable: the first tap often
  // triggers :hover/mouseenter instead of click, or the click is delayed
  // or swallowed entirely.  This intercepts touchend on buttons and fires
  // btn.click() immediately, bypassing the entire native click pipeline.
  // Same proven technique as FastClick.js — no double-fire risk because
  // preventDefault() on touchend cancels the native click chain.
  // TEMP diagnostic badge — shows version + tap feedback. REMOVE after debug.
  var _dbg = document.createElement("div");
  _dbg.id = "tap-dbg";
  _dbg.textContent = "v6";
  Object.assign(_dbg.style, {
    position: "fixed", bottom: "80px", right: "12px", zIndex: "999999",
    background: "#222", color: "#FFD500", padding: "6px 14px",
    borderRadius: "20px", fontSize: "13px", fontWeight: "700",
    fontFamily: "monospace", pointerEvents: "none", opacity: "0.85",
    transition: "background 0.2s, color 0.2s",
  });
  document.body.appendChild(_dbg);

  function _dbgFlash(txt) {
    _dbg.textContent = txt;
    _dbg.style.background = "#00c853";
    _dbg.style.color = "#fff";
    clearTimeout(_dbg._t);
    _dbg._t = setTimeout(function () {
      _dbg.textContent = "v6";
      _dbg.style.background = "#222";
      _dbg.style.color = "#FFD500";
    }, 1500);
  }

  if ("ontouchstart" in window) {
    var _tapTarget = null, _tapXY = null;
    document.addEventListener("touchstart", function (e) {
      var btn = e.target.closest && e.target.closest(
        "button, .btn, a[href], [type='submit'], [data-legal-open], summary"
      );
      if (btn) {
        _tapTarget = btn;
        _tapXY = [e.touches[0].clientX, e.touches[0].clientY];
      }
    }, { passive: true });

    document.addEventListener("touchend", function (e) {
      if (!_tapTarget || !_tapXY) return;
      var t = e.changedTouches[0];
      var moved = Math.abs(t.clientX - _tapXY[0]) > 10 ||
                  Math.abs(t.clientY - _tapXY[1]) > 10;
      var btn = _tapTarget;
      _tapTarget = null;
      _tapXY = null;
      if (moved) return;
      e.preventDefault();
      btn.focus();
      btn.click();
      _dbgFlash("TAP ✓ " + (btn.textContent || "").trim().slice(0, 12));
    }, { passive: false });
  }

  // --- 2. Cursor glow (desktop only — no mouse on mobile) ---
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
})();
