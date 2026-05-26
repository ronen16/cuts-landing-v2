// BOLD variation — REBUILT to match the new landing page brief structure.
// Sections (14):
//  1. Navigation
//  2. Hero (no video — image placeholder on right)
//  3. Social Proof Bar #1
//  4. Social Proof Section (3 proof cards + CTA)
//  5. Pain Point (centered headline + paragraph + CTA)
//  6. Big Benefit #1 (image right, text left, CTA)
//  7. Big Benefit #2 (text right, image left — zigzag)
//  8. Big Benefit #3 (image right, text left)
//  9. Social Proof #2 (single wide proof card + CTA)
//  10. 6 Differentiators (3x2 grid + CTA)
//  11. How It Works (3 steps + CTA)
//  12. (REMOVED — was Meet The Team)
//  13. Guarantee (single wide card + CTA)
//  14. FAQ (6 questions accordion)
//  15. Final CTA (checklist + form + image)
//  16. Footer

// ---------- Reusable bits ----------

function CTAButton({ onCTAClick, label = "הפעולה המרכזית שצריך לבצע", style }) {
  return (
    <button className="btn btn-primary" onClick={onCTAClick} style={{
      padding: "22px 44px",
      fontSize: 18,
      fontWeight: 700,
      borderRadius: 10,
      ...style
    }}>
      {label} ←
    </button>);

}

function SectionLabel({ n, children }) {
  return (
    <div className="mono" style={{
      fontSize: 12, letterSpacing: "0.2em",
      color: "var(--accent)", opacity: 0.85,
      marginBottom: 18
    }}>
      <span style={{ opacity: 0.5 }}>{String(n).padStart(2, "0")} /</span> {children}
    </div>);

}

function VisualPlaceholder({ label = "תמונה או ויזואל שמחזק את הצעת הערך המרכזית", height = 530, dashed = true }) {
  return (
    <div style={{
      width: "100%", minHeight: height, height,
      background: "var(--card)",
      border: `${dashed ? "2px dashed" : "2px solid"} var(--line2)`,
      borderRadius: 18,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 40, position: "relative", overflow: "hidden"
    }}>
      {/* Diagonal hatch hint */}
      <svg aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.07 }}>
        <defs>
          <pattern id={`hatch-${height}`} patternUnits="userSpaceOnUse" width="14" height="14" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="14" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#hatch-${height})`} />
      </svg>

      <div style={{
        textAlign: "center", color: "var(--fg)",
        opacity: 0.7, position: "relative", zIndex: 2,
        maxWidth: 360
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          border: "2px solid var(--accent)",
          margin: "0 auto 18px",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--accent)", fontSize: 28, fontWeight: 900
        }}>📷</div>
        <div className="mono" style={{
          fontSize: 11, letterSpacing: "0.2em",
          color: "var(--accent)", marginBottom: 10, fontWeight: 700
        }}>מקום לתמונה</div>
        <div style={{ fontSize: 15, lineHeight: 1.5, fontWeight: 600 }}>
          {label}
        </div>
      </div>
    </div>);

}

// ---------- 02 · HERO ----------

function Hero({ onCTAClick }) {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 80);
    return () => clearInterval(id);
  }, []);

  // 64 waveform bars — pseudo-random heights animated by tick
  const bars = React.useMemo(() => Array.from({ length: 64 }, (_, i) => i), []);
  // 140 bars for full-width waveform
  const wideBars = React.useMemo(() => Array.from({ length: 140 }, (_, i) => i), []);

  return (
    <section style={{
      position: "relative",
      padding: "80px 0 88px",
      overflow: "hidden",
      borderBottom: "1px solid var(--line2)"
    }}>
      {/* Radial yellow glow */}
      <div aria-hidden="true" style={{
        position: "absolute",
        top: "30%", right: "20%",
        width: 700, height: 700,
        background: "radial-gradient(ellipse, rgba(255,213,0,0.10), transparent 65%)",
        filter: "blur(60px)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      <div className="wrap" style={{ position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", textAlign: "center" }}>
          {/* EYEBROW — live REC studio location */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 14,
            padding: "10px 18px",
            background: "rgba(255,213,0,0.06)",
            border: "1px solid rgba(255,213,0,0.3)",
            borderRadius: 999,
            marginBottom: 36
          }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8
            }}>
              <span className="mono" style={{
                fontSize: 11, fontWeight: 700, letterSpacing: "0.22em",
                color: "var(--accent)"
              }}>LIVE</span>
            </span>
            <span style={{
              width: 1, height: 14, background: "rgba(255,213,0,0.35)"
            }} />
            <span className="mono" style={{
              fontWeight: 600, letterSpacing: "0.18em",
              color: "rgba(255,213,0,0.85)", fontSize: "16px"
            }}>שחם 8, פתח תקווה</span>
          </div>

          {/* HEADLINE — refined cinematic */}
          <div style={{ position: "relative", margin: "0 auto 32px", maxWidth: 1160, padding: "12px 28px" }}>
            {/* ambient glow behind headline */}
            <div aria-hidden="true" style={{
              position: "absolute", inset: "-40px -20px",
              background: "radial-gradient(ellipse at 50% 50%, rgba(255,213,0,0.10), transparent 60%)",
              filter: "blur(30px)", pointerEvents: "none", zIndex: 0
            }} />

            {/* eyebrow — camera viewfinder frame */}
            <div className="hero-eyebrow" style={{
              display: "inline-block",
              position: "relative",
              padding: "26px 78px",
              marginBottom: 40,
              zIndex: 2,
              maxWidth: "100%"
            }}>
              {/* outer glow halo */}
              <span aria-hidden="true" style={{
                position: "absolute", inset: -24,
                background: "radial-gradient(ellipse at center, rgba(255,213,0,0.22), transparent 65%)",
                filter: "blur(24px)",
                pointerEvents: "none",
                animation: "heroEyebrowPulse 2.6s ease-in-out infinite"
              }} />

              {/* corner brackets — viewfinder */}
              {[
              { top: 0, right: 0, brT: 3, brR: 3 },
              { top: 0, left: 0, brT: 3, brL: 3 },
              { bottom: 0, right: 0, brB: 3, brR: 3 },
              { bottom: 0, left: 0, brB: 3, brL: 3 }].
              map((p, i) =>
              <span key={i} aria-hidden="true" style={{
                position: "absolute",
                top: p.top, right: p.right, bottom: p.bottom, left: p.left,
                width: 26, height: 26,
                borderTop: p.brT ? `3px solid var(--accent)` : "none",
                borderRight: p.brR ? `3px solid var(--accent)` : "none",
                borderBottom: p.brB ? `3px solid var(--accent)` : "none",
                borderLeft: p.brL ? `3px solid var(--accent)` : "none",
                filter: "drop-shadow(0 0 10px rgba(255,213,0,0.85))"
              }} />
              )}

              {/* faint inner background */}
              <span aria-hidden="true" style={{
                position: "absolute", inset: 8,
                background: "radial-gradient(ellipse at center, rgba(255,213,0,0.14), transparent 72%)",
                pointerEvents: "none"
              }} />

              {/* content row */}
              <div className="hero-eyebrow-row" style={{
                display: "inline-flex", alignItems: "center", gap: 20,
                position: "relative", zIndex: 1
              }}>
                {/* REC indicator */}
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 9
                }}>
                  <span style={{
                    width: 12, height: 12, borderRadius: "50%",
                    background: "#ff3b3b",
                    boxShadow: "0 0 16px #ff3b3b, 0 0 28px rgba(255,59,59,0.7)",
                    animation: "heroRec 1.4s ease-in-out infinite"
                  }} />
                  <span className="mono" style={{
                    fontSize: 13, fontWeight: 900, letterSpacing: "0.26em",
                    color: "#ff3b3b",
                    textShadow: "0 0 10px rgba(255,59,59,0.6)"
                  }}>REC</span>
                </span>

                <span className="hero-eyebrow-extra" style={{ width: 1, height: 22, background: "rgba(255,213,0,0.4)" }} />

                {/* microphone icon */}
                <svg className="hero-eyebrow-extra" width="22" height="28" viewBox="0 0 16 20" fill="none" style={{
                  filter: "drop-shadow(0 0 6px rgba(255,213,0,0.7))"
                }}>
                  <rect x="5" y="1" width="6" height="10" rx="3" stroke="var(--accent)" strokeWidth="1.6" />
                  <path d="M2 9c0 3.3 2.7 6 6 6s6-2.7 6-6" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M8 15v3M5 18h6" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" />
                </svg>

                {/* label */}
                <span className="mono hero-eyebrow-label" style={{
                  fontSize: 22, letterSpacing: "0.30em", fontWeight: 900,
                  color: "var(--accent)",
                  textShadow: "0 0 24px rgba(255,213,0,0.7), 0 0 48px rgba(255,213,0,0.35)",
                  animation: "heroLabelPulse 2.6s ease-in-out infinite"
                }}>
                  דמיינו את זה לרגע
                </span>

                {/* audio level bars */}
                <span className="hero-eyebrow-extra" style={{
                  display: "inline-flex", alignItems: "center", gap: 4, height: 26
                }}>
                  {[0.6, 0.9, 0.45, 0.8, 0.55].map((h, i) =>
                  <span key={i} style={{
                    width: 3.5,
                    height: `${h * 100}%`,
                    background: "var(--accent)",
                    borderRadius: 2,
                    animation: `audioBar 0.${6 + i}s ease-in-out ${i * 0.08}s infinite alternate`,
                    boxShadow: "0 0 6px rgba(255,213,0,0.8)"
                  }} />
                  )}
                </span>
              </div>
            </div>

            <h1 className="display" style={{
              fontSize: "clamp(44px, 6.6cqw, 112px)",
              margin: 0,
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              textWrap: "balance",
              position: "relative", zIndex: 2
            }}>
              {/* Line 1 */}
              <span style={{ display: "block", marginBottom: 10 }}>הליד הבא שלכם מגיע לפגישה

              </span>

              {/* Line 2 — explosive highlight */}
              <span style={{ display: "block", marginBottom: 10 }}>
                <span style={{
                  color: "var(--accent)",
                  position: "relative", display: "inline-block",
                  paddingInline: "0.18em",
                  textShadow: "0 0 40px rgba(255,213,0,0.45)"
                }}>
                  כשהוא כבר יודע מי אתם
                  {/* soft underline glow */}
                  <span aria-hidden="true" style={{
                    position: "absolute", left: "2%", right: "2%", bottom: "-0.08em",
                    height: 5,
                    background: "linear-gradient(90deg, transparent, var(--accent) 15%, var(--accent) 85%, transparent)",
                    opacity: 0.5,
                    borderRadius: 3,
                    filter: "blur(0.5px)"
                  }} />
                </span>
              </span>

              {/* Line 3 — soft white with subtle background swatch */}
              <span style={{
                display: "block",
                opacity: 0.72, fontWeight: 700, marginBottom: 10,
                color: "rgb(255, 255, 255)",
                position: "relative"
              }}>

              </span>

              {/* Line 4 — closer, italic with sparkle */}
              <span style={{ display: "block" }}>
                ורק רוצה לדעת{" "}
                <span style={{
                  color: "var(--accent)",
                  fontStyle: "italic",
                  position: "relative", display: "inline-block",
                  textShadow: "0 0 30px rgba(255,213,0,0.55)"
                }}>
                  איך מתחילים.
                  {/* underline dash */}
                  <span aria-hidden="true" style={{
                    position: "absolute", left: 0, right: 0, bottom: "-0.04em",
                    height: 3,
                    background: "var(--accent)",
                    opacity: 0.7,
                    borderRadius: 3,
                    transform: "scaleX(0.7)", transformOrigin: "right"
                  }} />
                </span>
              </span>
            </h1>

          </div>

          <p style={{ fontSize: "clamp(18px, 1.6cqw, 24px)",
            lineHeight: 1.5,
            margin: "0 auto 44px",
            opacity: 0.82,
            maxWidth: 820
          }}>
            פעם הייתם צריכים להסביר מי אתם בכל שיחת מכירה. עם פודקאסט — הם כבר יודעים.
            
            <span style={{ color: "var(--accent)", fontWeight: 700 }}></span>
          </p>

          {/* CTA — centered */}
          <div style={{
            display: "flex", justifyContent: "center",
            marginBottom: 28
          }}>
            <CTAButton onCTAClick={onCTAClick} label="בוא נדבר על הפודקאסט שלך" />
          </div>

          <p style={{
            fontSize: 13, opacity: 0.5, margin: 0,
            display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
            justifyContent: "center"
          }}>
            <span>אין שיחת מכירה לוחצת</span>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent)", opacity: 0.6 }} />
            <span>30 דקות, ללא עלות</span>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent)", opacity: 0.6 }} />
            <span>נחזור אליך תוך 24 שעות</span>
          </p>
        </div>
      </div>




      <style>{`
        @keyframes heroRec {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(0.7); }
        }
        @keyframes audioBar {
          0% { transform: scaleY(0.3); }
          100% { transform: scaleY(1); }
        }
        @keyframes wfPulse {
          0% { transform: scaleX(0.4); opacity: 0.4; }
          100% { transform: scaleX(1); opacity: 1; }
        }
        @keyframes filmScan {
          0% { top: -20px; }
          100% { top: 100%; }
        }
        @keyframes heroEyebrowPulse {
          0%, 100% { opacity: 0.85; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.04); }
        }
        @keyframes heroLabelPulse {
          0%, 100% { text-shadow: 0 0 24px rgba(255,213,0,0.7), 0 0 48px rgba(255,213,0,0.35); }
          50% { text-shadow: 0 0 32px rgba(255,213,0,0.95), 0 0 64px rgba(255,213,0,0.5); }
        }
      `}</style>
    </section>);

}

// ---------- 03 · SOCIAL PROOF BAR #1 ----------

function SocialProofBar1() {
  return (
    <section style={{ padding: "48px 0", borderTop: "1px solid var(--line2)", borderBottom: "1px solid var(--line2)", fontSize: "1px" }}>
      <div className="wrap" style={{ textAlign: "center" }}>
        <p className="display" style={{ fontSize: 32, margin: 0, fontWeight: 700, opacity: 0.85 }}>

        </p>
      </div>
    </section>);

}

// ---------- 04 · SOCIAL PROOF SECTION (3 proof cards + CTA) ----------

// === עדויות וידאו ===
// name = השם שמופיע על הכרטיס.
// role = התיאור מתחת לשם (תפקיד / עסק). תמלא בעצמך — ריק = לא מוצג.
//        לדוגמה: role: "מייסד · DavidovTech"
// vimeoId = ה-ID מתוך לינק Vimeo. https://vimeo.com/123456789 → "123456789"
const TESTIMONIAL_VIDEOS = [
{ name: "תמיר מנדבוסקי", role: "מייסד · סטודיו תמיר", tag: "", duration: "", vimeoId: "1108140265" },
{ name: "עומר מיראן", role: "יזם · נדל\"ן ופיננסים", tag: "", duration: "", vimeoId: "1108139977" },
{ name: "מור פאר", role: "מאמנת עסקית", tag: "", duration: "", vimeoId: "1108139897" },
{ name: "שגיא גורניק", role: "מנכ\"ל · קבוצת גורניק", tag: "", duration: "", vimeoId: "1190079907" },
{ name: "רם יצחק שדה", role: "יועץ אסטרטגי לעסקים", tag: "", duration: "", vimeoId: "1190079851" },
{ name: "עופר ברקן", role: "מייסד · ברקן דיגיטל", tag: "", duration: "", vimeoId: "1190079801" },
{ name: "רון לנדסמן", role: "סמנכ\"ל שיווק", tag: "", duration: "", vimeoId: "1190079774" },
{ name: "בן לביא", role: "יזם · לביא טכנולוגיות", tag: "", duration: "", vimeoId: "1108139530" }];

// נחשוף לפאנל האדמין כדי לאפשר סידור/הסתרה
if (typeof window !== "undefined") window.__cutsTestimonialVideos = TESTIMONIAL_VIDEOS;

function orderAndFilterVideos(admin) {
  const hidden = new Set((admin && admin.hiddenVideos) || []);
  // Admin-edited list (add/edit links) is the source of truth when present.
  const items = admin && Array.isArray(admin.videoItems) ? admin.videoItems : null;
  if (items) {
    return items
      .filter((v) => v && v.vimeoId && !hidden.has(v.vimeoId));
  }
  const order = admin && Array.isArray(admin.videoOrder) ? admin.videoOrder : null;
  let list = TESTIMONIAL_VIDEOS;
  if (order && order.length) {
    const byId = new Map(TESTIMONIAL_VIDEOS.map((v) => [v.vimeoId, v]));
    const seen = new Set();
    const ordered = [];
    for (const id of order) {
      const v = byId.get(id);
      if (v && !seen.has(id)) { ordered.push(v); seen.add(id); }
    }
    for (const v of TESTIMONIAL_VIDEOS) if (!seen.has(v.vimeoId)) ordered.push(v);
    list = ordered;
  }
  return list.filter((v) => !hidden.has(v.vimeoId));
}

function SocialProofSection({ onCTAClick, admin }) {
  const videos = React.useMemo(
    () => orderAndFilterVideos(admin),
    [admin && admin.videoOrder, admin && admin.hiddenVideos]
  );

  // איזה כרטיס מנגן כרגע (לפי index בלולאה האינסופית)
  const [playingIdx, setPlayingIdx] = React.useState(null);
  const [loadedIdx, setLoadedIdx] = React.useState(null);

  // טאמבנייל לכל סרטון — נטען דרך Vimeo oEmbed (JSON קטן, בלי iframe)
  const [thumbs, setThumbs] = React.useState({});
  React.useEffect(() => {
    const ids = Array.from(new Set(videos.map((v) => v.vimeoId).filter(Boolean)));
    let cancelled = false;
    Promise.all(
      ids.map(async (id) => {
        try {
          const res = await fetch(
            `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${id}&width=640`
          );
          if (!res.ok) return null;
          const data = await res.json();
          return data && data.thumbnail_url ? [id, data.thumbnail_url] : null;
        } catch {
          return null;
        }
      })
    ).then((pairs) => {
      if (cancelled) return;
      const next = {};
      pairs.forEach((p) => { if (p) next[p[0]] = p[1]; });
      setThumbs(next);
    });
    return () => { cancelled = true; };
  }, []);



  const scrollerRef = React.useRef(null);
  const canPrev = true;
  const canNext = true;
  const N = videos.length;
  // Render 3 copies for seamless infinite scroll
  const loopVideos = [...videos, ...videos, ...videos];

  // On a narrow canvas (mobile / mobile-preview) stack the videos vertically
  // (one after another) instead of the horizontal carousel — measured from the
  // carousel width so it matches the real phone and the admin preview alike.
  const carouselRef = React.useRef(null);
  const [stacked, setStacked] = React.useState(false);
  React.useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const measure = () => setStacked(el.clientWidth > 0 && el.clientWidth <= 600);
    measure();
    let ro;
    if (window.ResizeObserver) { ro = new ResizeObserver(measure); ro.observe(el); }
    window.addEventListener("resize", measure);
    return () => { window.removeEventListener("resize", measure); if (ro) ro.disconnect(); };
  }, []);
  const renderList = stacked ? videos : loopVideos;

  // Helper: compute step size + section width (for one copy of videos)
  const getMetrics = () => {
    const el = scrollerRef.current;
    if (!el) return null;
    const card = el.querySelector("[data-vid-card]");
    if (!card) return null;
    const step = card.clientWidth + 20;
    const sectionW = step * N;
    return { step, sectionW };
  };

  // On mount: position scroller at start of middle copy (no animation)
  React.useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const m = getMetrics();
    if (!m) return;
    // RTL → scrollLeft is negative. Middle copy starts at -sectionW
    el.scrollLeft = -m.sectionW;
  }, []);

  const scrollBy = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    const m = getMetrics();
    if (!m) return;
    // RTL: scrollLeft <= 0. dir +1 = next (visually left, more negative), dir -1 = prev
    el.scrollBy({ left: -dir * m.step, behavior: "smooth" });
  };

  // After each scroll settles: if we drifted out of the middle copy, silently
  // snap back to the equivalent position inside the middle copy — invisible jump.
  React.useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let timer = null;
    const onScroll = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        const m = getMetrics();
        if (!m) return;
        const sl = el.scrollLeft; // negative in RTL
        // We want sl to stay roughly within [-2*sectionW, -sectionW]
        if (sl > -m.sectionW + 4) {
          // drifted into first copy → jump forward one section
          el.scrollLeft = sl - m.sectionW;
        } else if (sl < -2 * m.sectionW - 4) {
          // drifted into third copy → jump back one section
          el.scrollLeft = sl + m.sectionW;
        }
      }, 180);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <section style={{ padding: "76px 0 52px", background: "var(--card)", borderTop: "1px solid var(--line2)", borderBottom: "1px solid var(--line2)", position: "relative", overflow: "hidden" }}>
      <div aria-hidden="true" style={{
        position: "absolute", top: "10%", left: "20%",
        width: 500, height: 500,
        background: "radial-gradient(ellipse, rgba(255,213,0,0.05), transparent 65%)",
        filter: "blur(70px)", pointerEvents: "none"
      }} />

      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 64, maxWidth: 900, marginLeft: "auto", marginRight: "auto" }}>
          <p className="mono" style={{
            fontSize: 12, letterSpacing: "0.25em", fontWeight: 700,
            color: "var(--accent)", margin: "0 0 18px"
          }}>

          </p>
          <h2 className="display socialproof-headline" style={{
            fontSize: "clamp(36px, 5.5cqw, 64px)",
            margin: 0, fontWeight: 900, lineHeight: 1,
            textWrap: "balance"
          }}>
            <span style={{ display: "block", opacity: 0.92 }}>
              אל תאמינו למילה שאנחנו אומרים.
            </span>
            <span style={{ display: "block", position: "relative" }}>
              <span style={{
                color: "var(--accent)",
                textShadow: "0 0 50px rgba(255,213,0,0.45), 0 0 90px rgba(255,213,0,0.2)",
                position: "relative",
                display: "inline-block",
                paddingInline: "0.2em"
              }}>
                זה מה שהלקוחות שלנו מספרים.
                {/* soft underline */}
                <span aria-hidden="true" style={{
                  position: "absolute", left: "3%", right: "3%", bottom: "-0.06em",
                  height: 5,
                  background: "linear-gradient(90deg, transparent, var(--accent) 15%, var(--accent) 85%, transparent)",
                  opacity: 0.55,
                  borderRadius: 3,
                  filter: "blur(0.5px)"
                }} />
              </span>
            </span>
          </h2>
        </div>
      </div>

      {/* Carousel — videos in single row, 9:16, with arrows.
          On a narrow canvas this becomes a vertical stack (.is-stacked). */}
      <div ref={carouselRef} className={"vid-carousel" + (stacked ? " is-stacked" : "")} style={{
        position: "relative",
        marginBottom: 0,
        maxWidth: 1280,
        marginInline: "auto",
        paddingInline: 80
      }}>
        {/* Edge fades */}
        <div aria-hidden="true" className="vid-fade" style={{
          position: "absolute", top: 0, bottom: 0, right: 80, width: 40, zIndex: 3,
          pointerEvents: "none",
          background: "linear-gradient(to left, var(--card), transparent)"
        }} />
        <div aria-hidden="true" className="vid-fade" style={{
          position: "absolute", top: 0, bottom: 0, left: 80, width: 40, zIndex: 3,
          pointerEvents: "none",
          background: "linear-gradient(to right, var(--card), transparent)"
        }} />

        {/* Prev arrow (right in RTL) */}
        <button
          type="button"
          onClick={(e) => {
            const b = e.currentTarget;
            b.classList.remove("nudge-prev");
            void b.offsetWidth;
            b.classList.add("nudge-prev");
            scrollBy(-1);
          }}
          disabled={!canPrev}
          aria-label="הקודם"
          className="vid-nav-btn vid-nav-prev"
          style={{
            position: "absolute", top: "50%", right: 12,
            zIndex: 4,
            width: 52, height: 52, borderRadius: "50%",
            background: canPrev ? "var(--accent)" : "rgba(255,255,255,0.06)",
            border: canPrev ? "1px solid var(--accent)" : "1px solid var(--line2)",
            color: canPrev ? "#0A0A0A" : "rgba(255,255,255,0.3)",
            cursor: canPrev ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: canPrev ? "0 8px 24px rgba(255,213,0,0.3)" : "none",
            transition: "all 0.2s ease"
          }}>
          
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Next arrow (left in RTL) */}
        <button
          type="button"
          onClick={(e) => {
            const b = e.currentTarget;
            b.classList.remove("nudge-next");
            void b.offsetWidth;
            b.classList.add("nudge-next");
            scrollBy(1);
          }}
          disabled={!canNext}
          aria-label="הבא"
          className="vid-nav-btn vid-nav-next"
          style={{
            position: "absolute", top: "50%", left: 12,
            zIndex: 4,
            width: 52, height: 52, borderRadius: "50%",
            background: canNext ? "var(--accent)" : "rgba(255,255,255,0.06)",
            border: canNext ? "1px solid var(--accent)" : "1px solid var(--line2)",
            color: canNext ? "#0A0A0A" : "rgba(255,255,255,0.3)",
            cursor: canNext ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: canNext ? "0 8px 24px rgba(255,213,0,0.3)" : "none",
            transition: "all 0.2s ease"
          }}>
          
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Scroller */}
        <div
          ref={scrollerRef}
          className="testimonial-video-scroller"
          style={{
            display: "flex",
            gap: 20,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollPaddingInline: 0,
            padding: "70px 6px 96px",
            scrollbarWidth: "none"
          }}>
          
          {renderList.map((v, i) => {
          const hasVideo = Boolean(v.vimeoId);
          const isPlaying = playingIdx === i;
          return (
          <div
            key={i}
            data-vid-card="true"
            className="vid-card"
            onClick={() => { if (hasVideo) { setPlayingIdx(i); setLoadedIdx(null); } }}
            style={{
              flex: "0 0 calc((100% - 60px) / 4)",
              aspectRatio: "9 / 16",
              background: "var(--bg)",
              borderRadius: 18,
              position: "relative",
              overflow: "hidden",
              cursor: hasVideo ? "pointer" : "default",
              scrollSnapAlign: "start",
              scrollSnapStop: "always",
              border: "1px solid var(--line2)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 10px 30px rgba(0,0,0,0.5), 0 8px 44px rgba(255,213,0,0.09), 0 0 80px rgba(255,213,0,0.045)"
            }}>

              {isPlaying &&
              <React.Fragment>
                <iframe
                  src={`https://player.vimeo.com/video/${v.vimeoId}?autoplay=1&title=0&byline=0&portrait=0&dnt=1`}
                  title={v.name}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  onLoad={() => setLoadedIdx(i)}
                  style={{
                    position: "absolute", inset: 0,
                    width: "100%", height: "100%",
                    border: "none", zIndex: 5,
                    background: "#000"
                  }} />
                {loadedIdx !== i &&
                <div aria-hidden="true" style={{
                  position: "absolute", inset: 0, zIndex: 6,
                  background: "#000",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <span style={{
                    width: 44, height: 44, borderRadius: "50%",
                    border: "3px solid rgba(255,213,0,0.25)",
                    borderTopColor: "var(--accent)",
                    animation: "vidSpin 0.8s linear infinite"
                  }} />
                </div>
                }
              </React.Fragment>
              }

              {!isPlaying && thumbs[v.vimeoId] &&
              <React.Fragment>
                <img
                  src={thumbs[v.vimeoId]}
                  alt={v.name}
                  loading="lazy"
                  style={{
                    position: "absolute", inset: 0,
                    width: "100%", height: "100%",
                    objectFit: "cover",
                    zIndex: 1
                  }} />
                <span aria-hidden="true" style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.35) 100%)",
                  zIndex: 1
                }} />
              </React.Fragment>
              }

              {/* refined frame: gradient ring + 4 corner brackets */}
              <span aria-hidden="true" className="vid-card__ring" style={{
              position: "absolute", inset: 0, borderRadius: 18,
              zIndex: 4, pointerEvents: "none"
            }} />

              {v.duration &&
              <div style={{
              position: "absolute", top: 22, left: 22,
              zIndex: 2
            }}>
                <span className="mono" style={{
                fontSize: 10, letterSpacing: "0.15em",
                color: "rgba(255,255,255,0.55)", fontWeight: 600
              }}>{v.duration}</span>
              </div>
              }

              <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 2,
              flexDirection: "column", gap: 18
            }}>
                {!thumbs[v.vimeoId] &&
                <svg width="90" height="90" viewBox="0 0 90 90" fill="none" aria-hidden="true">
                  <circle cx="45" cy="32" r="18" stroke="rgba(255,213,0,0.35)" strokeWidth="1.5" strokeDasharray="3 3" />
                  <path d="M14 84 C 14 64, 30 56, 45 56 C 60 56, 76 64, 76 84"
                stroke="rgba(255,213,0,0.35)" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
                </svg>
                }

                <div className="vid-play-btn" style={{
                position: "relative",
                width: 50, height: 50, borderRadius: "50%",
                background: "var(--accent)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 10px 30px rgba(255,213,0,0.45)"
              }}>
                  <span aria-hidden="true" className="vid-play-ring" style={{
                  position: "absolute", inset: -8,
                  borderRadius: "50%",
                  border: "1.5px solid rgba(255,213,0,0.5)"
                }} />
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path d="M6 4 L16 10 L6 16 Z" fill="#0A0A0A" />
                  </svg>
                </div>
              </div>

              <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              padding: "100px 22px 30px",
              background: "linear-gradient(to top, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.82) 46%, rgba(0,0,0,0.28) 80%, transparent 100%)",
              zIndex: 2
            }}>
                {v.tag &&
                <span className="mono" style={{
                display: "inline-block", marginBottom: 12,
                padding: "3px 9px",
                background: "rgba(255,213,0,0.12)",
                border: "1px solid rgba(255,213,0,0.3)",
                borderRadius: 999,
                fontSize: 9, letterSpacing: "0.1em", fontWeight: 700,
                color: "var(--accent)"
              }}>{v.tag}</span>
                }
                <div style={{ display: "flex", alignItems: "stretch", gap: 13 }}>
                  <span aria-hidden="true" style={{
                  flex: "0 0 4px", borderRadius: 4,
                  background: "linear-gradient(180deg, var(--accent), rgba(255,213,0,0.3))",
                  boxShadow: "0 0 16px rgba(255,213,0,0.65)"
                }} />
                  <div style={{ minWidth: 0 }}>
                    <div className="display" style={{
                    fontSize: 26, fontWeight: 900, lineHeight: 1.1,
                    color: "#fff", letterSpacing: "-0.015em",
                    textShadow: "0 2px 14px rgba(0,0,0,0.8)"
                  }}>{v.name}</div>
                    {v.role &&
                    <div style={{
                    marginTop: 3, fontSize: 16, lineHeight: 1.3,
                    color: "var(--accent)", fontWeight: 700,
                    letterSpacing: "0.01em",
                    textShadow: "0 1px 8px rgba(0,0,0,0.7)"
                  }}>{v.role}</div>
                    }
                  </div>
                </div>
              </div>
            </div>);
        })}
        </div>
      </div>

      <style>{`
        .testimonial-video-scroller::-webkit-scrollbar { display: none; }
        @keyframes vidSpin { to { transform: rotate(360deg); } }

        .vid-nav-btn {
          transform: translateY(-50%);
          transition: transform 0.2s cubic-bezier(0.2,0.8,0.2,1),
                      box-shadow 0.2s ease, background 0.2s ease;
        }
        .vid-nav-btn:hover {
          transform: translateY(-50%) scale(1.12);
          box-shadow: 0 12px 30px rgba(255,213,0,0.5);
        }
        .vid-nav-btn:active {
          transform: translateY(-50%) scale(0.84);
          box-shadow: 0 4px 12px rgba(255,213,0,0.4);
        }
        .vid-nav-btn svg { transition: transform 0.18s ease; }
        .vid-nav-btn.nudge-prev svg { animation: navNudgePrev 0.42s cubic-bezier(0.34,1.56,0.64,1); }
        .vid-nav-btn.nudge-next svg { animation: navNudgeNext 0.42s cubic-bezier(0.34,1.56,0.64,1); }
        @keyframes navNudgePrev {
          0%   { transform: translateX(0) scale(1); }
          40%  { transform: translateX(16px) scale(1.35); }
          100% { transform: translateX(0) scale(1); }
        }
        @keyframes navNudgeNext {
          0%   { transform: translateX(0) scale(1); }
          40%  { transform: translateX(-16px) scale(1.35); }
          100% { transform: translateX(0) scale(1); }
        }

        .vid-card {
          box-shadow: 0 12px 30px -14px rgba(0,0,0,0.7);
          transition: transform 0.35s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.35s ease;
        }
        .vid-card:hover {
          transform: translateY(-5px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.05),
                      0 22px 48px -12px rgba(0,0,0,0.7),
                      0 14px 60px -6px rgba(255,213,0,0.14),
                      0 0 110px rgba(255,213,0,0.06);
        }
        .vid-card__ring { display: none; }
        .vid-play-btn { transition: transform 0.3s cubic-bezier(0.2,0.8,0.2,1); }
        [data-vid-card]:hover .vid-play-btn { transform: scale(1.08); }
        .vid-play-ring { animation: vidPlayPulse 2.4s ease-in-out infinite; }
        @keyframes vidPlayPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50%      { transform: scale(1.14); opacity: 0; }
        }
        .pod-play-btn { transition: transform 0.3s cubic-bezier(0.2,0.8,0.2,1); }
        [data-case-card]:hover .pod-play-btn { transform: scale(1.08); }
        .pod-play-ring { animation: vidPlayPulse 2.4s ease-in-out infinite; }
        @container (max-width: 900px) {
          .testimonial-video-scroller > [data-vid-card] {
            flex: 0 0 calc((100% - 20px) / 2) !important;
          }
        }
        /* Mobile: stack the videos vertically (one after another). The
           .is-stacked class is toggled by JS when the carousel is ≤600px, so
           no breakpoint mismatch — these rules just style that mode. */
        .vid-carousel.is-stacked { padding-inline: 24px !important; }
        .vid-carousel.is-stacked .testimonial-video-scroller {
          flex-direction: column !important;
          overflow: visible !important;
          gap: 18px !important;
          padding: 8px 0 !important;
          scroll-snap-type: none !important;
        }
        .vid-carousel.is-stacked .testimonial-video-scroller > [data-vid-card] {
          flex: none !important;
          width: 100% !important;
        }
        .vid-carousel.is-stacked .vid-nav-prev,
        .vid-carousel.is-stacked .vid-nav-next,
        .vid-carousel.is-stacked .vid-fade { display: none !important; }
      `}</style>
    </section>);

}

// ---------- 05 · PAIN POINT (centered) ----------

function PainPoint({ onCTAClick }) {
  return (
    <section style={{ padding: "76px 0" }}>
      <div className="wrap" style={{ maxWidth: 900, textAlign: "center" }}>
        <h2 className="display" style={{
          fontSize: "clamp(36px, 5cqw, 56px)",
          margin: "0 0 24px", fontWeight: 800, lineHeight: 1.15
        }}>
          התייחס לכאב הגדול ביותר שאתה פותר ולעולם של{" "}
          <span style={{ color: "var(--accent)" }}>״הדרך הישנה״</span>, תוך שילוב היתרון הייחודי שלך
        </h2>

        <p style={{ fontSize: 18, lineHeight: 1.7, opacity: 0.78, margin: "0 auto 40px", maxWidth: 740 }}>
          השתמש בסקשן הזה כדי לצייר תמונה חיה של נקודות הכאב של הלקוח האידיאלי ולחשוף את הפגמים של המצב הקיים,
          כדי שיבין שאתה יודע במה הוא נמצא. השלם את זה עם הצעת הערך והבידול הייחודי שלך.
        </p>

        <CTAButton onCTAClick={onCTAClick} />
      </div>
    </section>);

}

// ---------- 06 · BIG BENEFIT #1 (image right · text left) ----------
// 07 · BIG BENEFIT #2 (text right · image left)
// 08 · BIG BENEFIT #3 (image right · text left)
// All share BigBenefitRow, just flip imageSide.

function BigBenefitRow({ n, imageSide = "right", summary, headline, body, onCTAClick, alt = false }) {
  const Visual =
  <div style={{ width: "100%" }}>
      <VisualPlaceholder
      label="תמונה שמשלימה ומחזקת את הצעת הערך המרכזית"
      height={500} />
    
    </div>;


  const Text =
  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 32 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span className="mono" style={{
          fontSize: 12, letterSpacing: "0.2em",
          color: "var(--accent)", fontWeight: 700
        }}>יתרון · 0{n}</span>
          <span style={{ flex: 1, height: 1, background: "var(--line2)" }} />
        </div>

        <p className="mono" style={{
        fontSize: 14, opacity: 0.7, margin: 0,
        letterSpacing: "0.06em", textTransform: "uppercase"
      }}>
          {summary}
        </p>

        <h2 className="display" style={{
        fontSize: "clamp(32px, 4.2cqw, 56px)",
        margin: 0, fontWeight: 800, lineHeight: 1.1
      }}>
          {headline}
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.7, opacity: 0.8, margin: 0 }}>
          {body}
        </p>
      </div>

      <div>
        <CTAButton onCTAClick={onCTAClick} />
      </div>
    </div>;


  // RTL note: in RTL, "right" is the start side. We use grid-template-columns to control order.
  // imageSide="right" → visual on right (start in RTL = column 1), text on left (column 2)
  const cols = imageSide === "right" ? [Visual, Text] : [Text, Visual];

  return (
    <section style={{
      padding: "68px 0",
      background: alt ? "var(--card)" : "transparent",
      borderTop: alt ? "1px solid var(--line2)" : "none",
      borderBottom: alt ? "1px solid var(--line2)" : "none"
    }}>
      <div className="wrap">
        <div className="cq-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          {cols[0]}
          {cols[1]}
        </div>
      </div>
    </section>);

}

function BigBenefit1({ onCTAClick }) {
  return (
    <BigBenefitRow
      n={1}
      imageSide="right"
      summary="תמצית התוצאה האידיאלית"
      headline={<>הצעת הערך ויתרון מרכזי #1<br /><span style={{ color: "var(--accent)" }}>(מה יצא ללקוח?)</span></>}
      body="הפתרון שלנו עושה X, Y, Z — נסחו כאן את היתרון המרכזי שאתם מספקים והסבירו איך אתם עושים זאת בדרך עצמאית או ייחודית."
      onCTAClick={onCTAClick} />);


}

function BigBenefit2({ onCTAClick }) {
  return (
    <BigBenefitRow
      n={2}
      imageSide="left"
      summary="תמצית התוצאה האידיאלית"
      headline={<>הצעת הערך ויתרון מרכזי #2<br /><span style={{ color: "var(--accent)" }}>(מה יצא ללקוח?)</span></>}
      body="הפתרון שלנו עושה X, Y, Z — נסחו כאן את היתרון המרכזי שאתם מספקים והסבירו איך אתם עושים זאת בדרך עצמאית או ייחודית."
      onCTAClick={onCTAClick}
      alt />);


}

function BigBenefit3({ onCTAClick }) {
  return (
    <BigBenefitRow
      n={3}
      imageSide="right"
      summary="תמצית התוצאה האידיאלית"
      headline={<>הצעת הערך ויתרון מרכזי #3<br /><span style={{ color: "var(--accent)" }}>(מה יצא ללקוח?)</span></>}
      body="הפתרון שלנו עושה X, Y, Z — נסחו כאן את היתרון המרכזי שאתם מספקים והסבירו איך אתם עושים זאת בדרך עצמאית או ייחודית."
      onCTAClick={onCTAClick} />);


}

// ---------- 09 · SOCIAL PROOF #2 — REMOVED per request ----------

// ---------- 10 · 6 DIFFERENTIATORS ----------

function Differentiators({ onCTAClick }) {
  const items = [1, 2, 3, 4, 5, 6];
  return (
    <section style={{ padding: "76px 0" }}>
      <div className="wrap">
        <h2 className="display" style={{
          fontSize: "clamp(36px, 5cqw, 56px)",
          textAlign: "center", margin: "0 auto 64px", maxWidth: 900,
          fontWeight: 800, lineHeight: 1.15
        }}>
          כותרת מבוססת יתרון —{" "}
          <span style={{ color: "var(--accent)" }}>איך אתם עושים זאת ומה הופך אתכם לשונים.</span>
        </h2>

        <div className="cq-stack" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 32, marginBottom: 56
        }}>
          {items.map((i) =>
          <div key={i} style={{
            background: "var(--card)",
            border: "2px solid var(--line2)",
            borderRadius: 16,
            minHeight: 320,
            padding: 40,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            textAlign: "center", gap: 16,
            position: "relative", overflow: "hidden"
          }}>
              <div className="mono" style={{
              fontSize: 11, letterSpacing: "0.2em",
              color: "var(--accent)", fontWeight: 700
            }}>0{i}</div>
              <h3 className="display" style={{ fontSize: 26, margin: 0, fontWeight: 800 }}>
                בידול {i}
              </h3>
              <p style={{ fontSize: 16, lineHeight: 1.6, opacity: 0.7, margin: 0 }}>
                טקסט גוף — פסקה קצרה שמסבירה איך הבידול הזה משפיע על הלקוח.
              </p>
            </div>
          )}
        </div>

        <div style={{ textAlign: "center" }}>
          <CTAButton onCTAClick={onCTAClick} />
        </div>
      </div>
    </section>);

}

// ---------- 11 · HOW IT WORKS (3 steps + CTA) ----------

function HowItWorks({ onCTAClick }) {
  const steps = [1, 2, 3];
  return (
    <section id="how" style={{ padding: "76px 0", background: "var(--card)", borderTop: "1px solid var(--line2)", borderBottom: "1px solid var(--line2)" }}>
      <div className="wrap">
        <h2 className="display" style={{
          fontSize: "clamp(36px, 5cqw, 56px)",
          textAlign: "center", margin: "0 auto 64px", maxWidth: 900,
          fontWeight: 800, lineHeight: 1.15
        }}>
          איך זה עובד?{" "}
          <span style={{ color: "var(--accent)" }}>
            (הפכו את התפיסת הסיכויים להצלחה לגבוהה ולחסרת מאמץ.)
          </span>
        </h2>

        <div className="cq-stack" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 32, marginBottom: 56
        }}>
          {steps.map((i) =>
          <div key={i} style={{
            background: "var(--bg)",
            border: "2px solid var(--line2)",
            borderRadius: 16,
            minHeight: 320,
            padding: 40,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            textAlign: "center", gap: 18,
            position: "relative"
          }}>
              <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "var(--accent)", color: "#0A0A0A",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, fontWeight: 900, fontFamily: "var(--font-display)"
            }}>{i}</div>
              <h3 className="display" style={{ fontSize: 26, margin: 0, fontWeight: 800 }}>
                כותרת
              </h3>
              <p style={{ fontSize: 16, lineHeight: 1.6, opacity: 0.7, margin: 0 }}>
                טקסט גוף — פסקה קצרה שמתארת את השלב הזה בתהליך.
              </p>
            </div>
          )}
        </div>

        <div style={{ textAlign: "center" }}>
          <CTAButton onCTAClick={onCTAClick} />
        </div>
      </div>
    </section>);

}

// ---------- 13 · GUARANTEE (single wide card + CTA) ----------

function CountdownDigit({ value, label }) {
  const [prevValue, setPrevValue] = React.useState(value);
  const [flipping, setFlipping] = React.useState(false);

  React.useEffect(() => {
    if (value !== prevValue) {
      setFlipping(true);
      const t = setTimeout(() => {
        setPrevValue(value);
        setFlipping(false);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [value, prevValue]);

  const display = String(value).padStart(2, "0");

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        position: "relative",
        width: "clamp(80px, 10cqw, 130px)",
        height: "clamp(96px, 12cqw, 160px)",
        perspective: 600
      }}>
        {/* Static bg card */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)",
          border: "1px solid var(--line2)",
          borderRadius: 14,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 10px 30px rgba(0,0,0,0.5)"
        }} />
        {/* Center divider line */}
        <div style={{
          position: "absolute", left: 0, right: 0, top: "50%",
          height: 1, background: "rgba(0,0,0,0.6)",
          boxShadow: "0 1px 0 rgba(255,255,255,0.04)",
          zIndex: 3
        }} />
        {/* Digit */}
        <div className="display" style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "clamp(48px, 6.5cqw, 92px)",
          fontWeight: 900,
          color: "var(--accent)",
          letterSpacing: "-0.04em",
          fontVariantNumeric: "tabular-nums",
          textShadow: "0 0 30px rgba(255,213,0,0.3)",
          transform: flipping ? "scale(0.92)" : "scale(1)",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
          zIndex: 2
        }}>{display}</div>
        {/* Corner brackets */}
        <span aria-hidden="true" style={{
          position: "absolute", top: 8, right: 8, width: 12, height: 12,
          borderTop: "1.5px solid var(--accent)", borderRight: "1.5px solid var(--accent)",
          opacity: 0.5, zIndex: 4
        }} />
        <span aria-hidden="true" style={{
          position: "absolute", bottom: 8, left: 8, width: 12, height: 12,
          borderBottom: "1.5px solid var(--accent)", borderLeft: "1.5px solid var(--accent)",
          opacity: 0.5, zIndex: 4
        }} />
      </div>
      <div className="mono" style={{
        fontSize: 11, letterSpacing: "0.28em",
        opacity: 0.55, marginTop: 14, fontWeight: 700
      }}>{label}</div>
    </div>);

}

function Guarantee({ onCTAClick }) {
  const sectionRef = React.useRef(null);
  const [inView, setInView] = React.useState(false);
  const [time, setTime] = React.useState({ h: 95, m: 59, s: 59 });

  React.useEffect(() => {
    if (!sectionRef.current) return;
    const io = new IntersectionObserver(
      ([e]) => {if (e.isIntersecting) setInView(true);},
      { threshold: 0.2 }
    );
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  // Countdown logic — GLOBAL: same value for every visitor at any moment.
  // Cycles between 96 hours (max) and 12 hours (min) — when remaining hits 12h, resets to 96h.
  // No localStorage, no per-user anchor. Pure function of the current wall-clock time.
  React.useEffect(() => {
    const HOUR = 60 * 60 * 1000;
    const CYCLE = 84 * HOUR; // counts down 84 hours (96h → 12h) then resets
    const MAX_REMAINING = 96 * HOUR;
    // Fixed global anchor — everyone computes against the same moment.
    const ANCHOR = Date.UTC(2026, 0, 5, 0, 0, 0); // Jan 5 2026 00:00 UTC

    const tick = () => {
      const now = Date.now();
      const elapsed = ((now - ANCHOR) % CYCLE + CYCLE) % CYCLE; // 0 .. CYCLE
      const diff = MAX_REMAINING - elapsed; // 96h .. 12h
      const h = Math.floor(diff / HOUR);
      const m = Math.floor(diff % HOUR / 60000);
      const s = Math.floor(diff % 60000 / 1000);
      setTime({ h, m, s });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section ref={sectionRef} style={{ padding: "96px 0", position: "relative", overflow: "hidden" }}>
      {/* Animated glow */}
      <div aria-hidden="true" style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: 1100, height: 700,
        background: "radial-gradient(ellipse, rgba(255,213,0,0.10), transparent 65%)",
        filter: "blur(100px)", pointerEvents: "none",
        animation: "guaranteeGlow 6s ease-in-out infinite"
      }} />

      {/* Subtle grid background */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
        pointerEvents: "none"
      }} />

      <style>{`
        @keyframes guaranteeGlow {
          0%, 100% { opacity: 0.7; transform: translate(-50%,-50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%,-50%) scale(1.05); }
        }
        @keyframes urgentPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,213,0,0.4); }
          50% { transform: scale(1.04); box-shadow: 0 0 0 8px rgba(255,213,0,0); }
        }
        @keyframes urgentBadgePulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 4px rgba(255,213,0,0.18), 0 0 32px rgba(255,213,0,0.45), 0 12px 32px rgba(0,0,0,0.45);
          }
          50% {
            transform: scale(1.035);
            box-shadow: 0 0 0 8px rgba(255,213,0,0.0), 0 0 48px rgba(255,213,0,0.6), 0 14px 36px rgba(0,0,0,0.5);
          }
        }
        @keyframes urgentBadgeShine {
          0%   { transform: translateX(-260%) skewX(-22deg); }
          45%  { transform: translateX(360%) skewX(-22deg); }
          100% { transform: translateX(360%) skewX(-22deg); }
        }
        .urgent-badge {
          animation: urgentBadgePulse 2.6s ease-in-out infinite;
        }
        .urgent-badge__shine {
          position: absolute;
          top: 0; bottom: 0; left: 0; width: 30%;
          background: linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%);
          transform: translateX(-260%) skewX(-22deg);
          animation: urgentBadgeShine 3.6s linear infinite;
          pointer-events: none;
          z-index: 0;
        }

        /* === 3-step "How it works" cards === */
        .guarantee-step {
          position: relative;
          padding: 24px 22px 22px;
          background:
            radial-gradient(120% 80% at 100% 0%, rgba(255, 213, 0, 0.05), transparent 55%),
            linear-gradient(180deg, #131313 0%, #0E0E0E 60%, #0C0C0C 100%);
          border: 1px solid var(--line2);
          border-radius: 14px;
          overflow: hidden;
          isolation: isolate;
          will-change: transform, border-color, box-shadow;
          transition:
            transform 0.32s cubic-bezier(0.2,0.8,0.2,1),
            border-color 0.3s ease,
            box-shadow 0.35s ease;
        }
        .guarantee-step__glow {
          position: absolute;
          top: -40%; right: -25%;
          width: 80%; height: 120%;
          background: radial-gradient(ellipse at center, rgba(255,213,0,0.10), transparent 60%);
          filter: blur(28px);
          opacity: 0.55;
          pointer-events: none;
          transition: opacity 0.45s ease, transform 0.6s ease;
          z-index: 0;
        }
        .guarantee-step:hover .guarantee-step__glow {
          opacity: 1;
          transform: translate(-4%, 4%);
        }
        .guarantee-step__edge {
          position: absolute;
          top: 30px; bottom: 30px; right: 0;
          width: 2px;
          background: linear-gradient(180deg, transparent, rgba(255,213,0,0.55), transparent);
          opacity: 0.45;
          pointer-events: none;
          transition: opacity 0.35s ease, width 0.3s ease, box-shadow 0.35s ease;
          z-index: 1;
        }
        .guarantee-step:hover .guarantee-step__edge {
          opacity: 1;
          width: 3px;
          box-shadow: 0 0 18px rgba(255,213,0,0.45);
        }
        .guarantee-step__corner {
          position: absolute;
          width: 16px; height: 16px;
          border: 2px solid var(--accent);
          opacity: 0;
          transition: opacity 0.35s ease, transform 0.4s cubic-bezier(0.2,0.8,0.2,1);
          z-index: 2;
        }
        .guarantee-step__corner--tr {
          top: 10px; right: 10px;
          border-left: none; border-bottom: none;
          transform: translate(6px, -6px);
        }
        .guarantee-step__corner--bl {
          left: 10px; bottom: 10px;
          border-right: none; border-top: none;
          transform: translate(-6px, 6px);
        }
        .guarantee-step:hover .guarantee-step__corner {
          opacity: 1;
          transform: translate(0, 0);
        }
        .guarantee-step__bar {
          position: absolute;
          left: 50%; bottom: 0;
          width: 0%; height: 2px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          box-shadow: 0 0 18px rgba(255,213,0,0.6);
          transform: translateX(-50%);
          opacity: 0;
          z-index: 2;
          transition: width 0.4s ease, opacity 0.3s ease;
        }
        .guarantee-step:hover .guarantee-step__bar {
          width: 88%;
          opacity: 1;
        }
        .guarantee-step:hover {
          transform: translateY(-6px);
          border-color: var(--accent);
          box-shadow:
            0 18px 50px -10px rgba(0,0,0,0.55),
            0 0 0 1px rgba(255,213,0,0.35) inset,
            0 0 60px -10px rgba(255,213,0,0.35);
        }
        .guarantee-step__num {
          position: relative; z-index: 1;
          font-size: 12px; letter-spacing: 0.22em; font-weight: 800;
          color: var(--accent);
          margin-bottom: 12px;
          display: inline-block;
          text-shadow: 0 0 10px rgba(255,213,0,0.25);
        }
        .guarantee-step__title {
          position: relative; z-index: 1;
          font-size: clamp(16px, 1.4cqw, 19px); font-weight: 800;
          margin-bottom: 6px; line-height: 1.3;
        }
        .guarantee-step__sub {
          position: relative; z-index: 1;
          font-size: clamp(13px, 1.05cqw, 14px);
          opacity: 0.62; line-height: 1.5;
        }

        /* === Reassurance outcome cards (mirrors the verdict-card pattern) === */
        .guarantee-row {
          position: relative;
          padding: 32px 32px 30px;
          text-align: right;
          border-radius: 20px;
          overflow: hidden;
          isolation: isolate;
          will-change: transform, border-color, box-shadow;
          transition:
            transform 0.45s cubic-bezier(0.2,0.8,0.2,1),
            border-color 0.4s ease,
            box-shadow 0.4s ease,
            opacity 0.4s ease;
        }
        /* NO — muted, cold */
        .guarantee-row--no {
          background: #0E0E0E;
          border: 1px solid var(--line2);
          opacity: 0.78;
        }
        .guarantee-row--no:hover {
          transform: translateY(-4px);
          opacity: 1;
          border-color: rgba(255,255,255,0.22);
          box-shadow:
            0 18px 46px -12px rgba(0,0,0,0.6),
            inset 0 0 60px rgba(255,255,255,0.02);
        }
        /* YES — bright, warm, pulsing glow halo */
        .guarantee-row--yes {
          background: linear-gradient(180deg, rgba(255,213,0,0.08), rgba(255,213,0,0.025) 70%, transparent);
          border: 1.5px solid var(--accent);
          animation: guaranteeYesPulse 4.2s ease-in-out infinite;
        }
        .guarantee-row--yes:hover {
          animation-play-state: paused;
          transform: translateY(-6px);
          box-shadow:
            0 24px 60px -12px rgba(0,0,0,0.55),
            0 0 80px -8px rgba(255,213,0,0.5),
            inset 0 0 80px rgba(255,213,0,0.10);
        }
        @keyframes guaranteeYesPulse {
          0%, 100% {
            box-shadow:
              0 0 48px rgba(255,213,0,0.20),
              inset 0 0 60px rgba(255,213,0,0.06);
          }
          50% {
            box-shadow:
              0 0 64px rgba(255,213,0,0.34),
              inset 0 0 80px rgba(255,213,0,0.10);
          }
        }
        /* Aurora warm blob (YES only) */
        .guarantee-row__aurora {
          position: absolute;
          top: -40%; right: -25%;
          width: 90%; height: 140%;
          background: radial-gradient(
            ellipse at center,
            rgba(255,213,0,0.18) 0%,
            rgba(255,213,0,0.07) 35%,
            transparent 65%
          );
          filter: blur(30px);
          pointer-events: none;
          animation: guaranteeAurora 14s linear infinite, guaranteeDrift 5s ease-in-out infinite;
          z-index: 0;
        }
        @keyframes guaranteeAurora {
          0%   { transform: translate(0%, 0%) rotate(0deg); }
          50%  { transform: translate(6%, -4%) rotate(180deg); }
          100% { transform: translate(0%, 0%) rotate(360deg); }
        }
        @keyframes guaranteeDrift {
          0%, 100% { transform: translateY(0); opacity: 0.06; }
          50%      { transform: translateY(-6px); opacity: 0.12; }
        }
        /* Sheen sweep */
        .guarantee-row__sheen {
          position: absolute; inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .guarantee-row__sheen--yes {
          background: linear-gradient(
            115deg,
            transparent 0%, transparent 38%,
            rgba(255,213,0,0.14) 50%,
            transparent 62%, transparent 100%
          );
          transform: translateX(-130%) skewX(-18deg);
          animation: guaranteeSheen 5.5s ease-in-out infinite;
          animation-delay: 1.2s;
        }
        .guarantee-row__sheen--no {
          background: linear-gradient(
            115deg,
            transparent 0%, transparent 40%,
            rgba(255,255,255,0.045) 50%,
            transparent 60%, transparent 100%
          );
          transform: translateX(-130%) skewX(-18deg);
          animation: guaranteeSheen 7.5s ease-in-out infinite;
        }
        @keyframes guaranteeSheen {
          0%   { transform: translateX(-130%) skewX(-18deg); }
          60%  { transform: translateX(150%) skewX(-18deg); }
          100% { transform: translateX(150%) skewX(-18deg); }
        }
        .guarantee-row:hover .guarantee-row__sheen { animation-duration: 2.4s; }

        /* Corner brackets */
        .guarantee-row__corner {
          position: absolute;
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.4);
          opacity: 0;
          transition: opacity 0.35s ease, transform 0.4s cubic-bezier(0.2,0.8,0.2,1);
          z-index: 2;
        }
        .guarantee-row--yes .guarantee-row__corner { border-color: var(--accent); }
        .guarantee-row__corner--tr {
          top: 12px; right: 12px;
          border-left: none; border-bottom: none;
          transform: translate(6px, -6px);
        }
        .guarantee-row__corner--bl {
          left: 12px; bottom: 12px;
          border-right: none; border-top: none;
          transform: translate(-6px, 6px);
        }
        .guarantee-row:hover .guarantee-row__corner {
          opacity: 1;
          transform: translate(0, 0);
        }

        /* Big watermark check (YES) — slowly tilts + glows on hover */
        .guarantee-row__check {
          opacity: 0.08;
          transform-origin: center;
          animation: guaranteeCheckTilt 6s ease-in-out infinite alternate;
          transition: opacity 0.4s ease, filter 0.4s ease;
        }
        .guarantee-row--yes:hover .guarantee-row__check {
          opacity: 0.20;
          filter: drop-shadow(0 0 24px rgba(255,213,0,0.55));
        }
        @keyframes guaranteeCheckTilt {
          from { transform: rotate(-3deg) scale(1); }
          to   { transform: rotate(3deg) scale(1.04); }
        }
        /* Big watermark X (NO) */
        .guarantee-row__xmark {
          opacity: 0.06;
          transform-origin: center;
          animation: guaranteeCheckTilt 7s ease-in-out infinite alternate-reverse;
          transition: opacity 0.4s ease, filter 0.4s ease;
        }
        .guarantee-row--no:hover .guarantee-row__xmark {
          opacity: 0.14;
          filter: drop-shadow(0 0 18px rgba(255,255,255,0.18));
        }

        .guarantee-row__content { position: relative; z-index: 1; }

        /* Label pill */
        .guarantee-row__label {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: "Heebo", system-ui, sans-serif;
          font-size: 12px; letter-spacing: 0.20em; font-weight: 800;
          padding: 7px 14px;
          border-radius: 999px;
          margin-bottom: 18px;
        }
        .guarantee-row--no .guarantee-row__label {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.6);
        }
        .guarantee-row--no .guarantee-row__label::before {
          content: "✗"; color: rgba(255,255,255,0.5);
          font-size: 12px;
        }
        .guarantee-row--yes .guarantee-row__label {
          background: var(--accent);
          color: #0A0A0A;
          box-shadow: 0 0 24px rgba(255,213,0,0.4);
        }
        .guarantee-row--yes .guarantee-row__label::before {
          content: "✓"; color: #0A0A0A;
          font-size: 11px; font-weight: 900;
        }

        /* Main + sub copy */
        .guarantee-row__main {
          font-size: clamp(18px, 1.5cqw, 22px);
          font-weight: 800;
          line-height: 1.35;
        }
        .guarantee-row--no .guarantee-row__main { color: rgba(255,255,255,0.85); }
        .guarantee-row--yes .guarantee-row__main { color: #fff; }
        .guarantee-row--yes .guarantee-row__main .yes-highlight {
          color: var(--accent);
          text-shadow: 0 0 24px rgba(255,213,0,0.4);
        }
        .guarantee-row__sub {
          font-size: clamp(13px, 1.05cqw, 15px);
          margin-top: 10px;
          line-height: 1.55;
          color: rgba(255,255,255,0.55);
        }

        @container (max-width: 768px) {
          .guarantee-row { padding: 24px 22px 22px; }
          .guarantee-row__main { font-size: 17px; }
        }
        @keyframes secondsPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes bonusFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes bonusGlowSweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes freeBlink {
          0%, 100% { text-shadow: 0 0 0 rgba(255,213,0,0); }
          50% { text-shadow: 0 0 16px rgba(255,213,0,0.7); }
        }
        @keyframes popularSweep {
          0% { left: -50%; }
          100% { left: 150%; }
        }
        @keyframes monthBadgeFloat {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-3px); }
        }
        @keyframes bonusEnter {
          0% { opacity: 0; transform: translateY(24px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes timerGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,213,0,0); }
          50% { box-shadow: 0 0 32px 8px rgba(255,213,0,0.08); }
        }
        @keyframes strikeReveal {
          0% { width: 0; }
          100% { width: 100%; }
        }
        @keyframes urgencyDot {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px rgba(255,213,0,0.8); }
          50% { opacity: 0.4; box-shadow: 0 0 0 rgba(255,213,0,0); }
        }
        @keyframes depleteBar {
          0% { transform: scaleX(1); }
          100% { transform: scaleX(0); }
        }
        @keyframes freePop {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes arrowSlide {
          0%, 100% { transform: translateX(0); opacity: 0.8; }
          50% { transform: translateX(-8px); opacity: 1; }
        }
        @keyframes underlineSweep {
          0%, 100% { opacity: 0.4; transform: scaleX(0.7); }
          50% { opacity: 1; transform: scaleX(1); }
        }
        /* === Week-only attention banner === */
        .week-only-banner {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          margin: -8px auto 0;
          padding: 18px 36px;
          max-width: 860px;
          background:
            linear-gradient(180deg, var(--accent) 0%, #ffc800 100%);
          color: #0A0A0A;
          border-radius: 999px;
          font-weight: 900;
          letter-spacing: 0.04em;
          box-shadow:
            0 14px 38px -8px rgba(255,213,0,0.55),
            inset 0 0 0 2px rgba(0,0,0,0.08);
          overflow: hidden;
          isolation: isolate;
          animation: weekBannerPulse 2.4s ease-in-out infinite;
        }
        @keyframes weekBannerPulse {
          0%, 100% {
            box-shadow:
              0 14px 32px -10px rgba(255,213,0,0.45),
              inset 0 0 0 2px rgba(0,0,0,0.08);
            transform: translateY(0) scale(1);
          }
          50% {
            box-shadow:
              0 18px 44px -8px rgba(255,213,0,0.75),
              inset 0 0 0 2px rgba(0,0,0,0.08);
            transform: translateY(-1px) scale(1.005);
          }
        }
        .week-only-banner__sheen {
          position: absolute;
          inset: 0;
          background: linear-gradient(110deg,
            transparent 30%,
            rgba(255,255,255,0.55) 50%,
            transparent 70%);
          transform: translateX(-100%);
          animation: weekBannerSheen 3.6s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes weekBannerSheen {
          0%   { transform: translateX(-130%); }
          55%  { transform: translateX(130%); }
          100% { transform: translateX(130%); }
        }
        .week-only-banner__dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: #0A0A0A;
          flex-shrink: 0;
          animation: urgencyDot 1.1s ease-in-out infinite;
        }
        .week-only-banner__bolt {
          color: #0A0A0A;
          flex-shrink: 0;
          width: 28px; height: 28px;
          animation: boltShake 2.2s ease-in-out infinite;
          filter: drop-shadow(0 1px 0 rgba(255,255,255,0.4));
        }
        @keyframes boltShake {
          0%, 100% { transform: rotate(-6deg) scale(1); }
          25%      { transform: rotate(6deg) scale(1.08); }
          50%      { transform: rotate(-4deg) scale(1); }
          75%      { transform: rotate(4deg) scale(1.05); }
        }
        .week-only-banner__text {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .week-only-banner__pill {
          display: inline-block;
          padding: 7px 20px;
          background: #0A0A0A;
          color: var(--accent);
          border-radius: 999px;
          font-size: 18px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-shadow: 0 0 14px rgba(255,213,0,0.55);
        }
        .week-only-banner__sep {
          font-size: 20px;
          opacity: 0.55;
          font-weight: 900;
        }
        .week-only-banner__sub {
          font-size: 18px;
          font-weight: 900;
          letter-spacing: 0.01em;
        }
        @container (max-width: 640px) {
          .week-only-banner {
            padding: 14px 20px;
            gap: 10px;
          }
          .week-only-banner__pill { font-size: 14px; padding: 5px 14px; }
          .week-only-banner__bolt { width: 22px; height: 22px; }
          .week-only-banner__sep { display: none; }
          .week-only-banner__sub {
            display: block;
            font-size: 14px;
            line-height: 1.35;
            text-align: center;
            max-width: 240px;
          }
        }

        /* === "Only this week" stamp on each bonus card === */
        .bonus-card__week-stamp {
          position: absolute;
          top: 12px; left: 12px;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 9px;
          background: rgba(255,80,80,0.10);
          border: 1px solid rgba(255,80,80,0.45);
          color: #ff8a8a;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          animation: weekStampPulse 2.4s ease-in-out infinite;
        }
        .bonus-card__week-stamp::before {
          content: "";
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #ff5050;
          box-shadow: 0 0 8px rgba(255,80,80,0.8);
          animation: urgencyDot 1.1s ease-in-out infinite;
        }
        @keyframes weekStampPulse {
          0%, 100% { border-color: rgba(255,80,80,0.45); }
          50%      { border-color: rgba(255,80,80,0.85); }
        }

        /* === Bonus cards === */
        .bonus-card {
          position: relative;
          padding: 28px 26px 24px;
          background: var(--card);
          border: 1px solid rgba(255,213,0,0.18);
          border-radius: 16px;
          text-align: right;
          overflow: hidden;
          isolation: isolate;
          display: flex;
          flex-direction: column;
          gap: 12px;
          will-change: transform, border-color, box-shadow;
          transition:
            transform 0.32s cubic-bezier(0.2,0.8,0.2,1),
            border-color 0.3s ease,
            box-shadow 0.35s ease;
        }
        /* Glowing accent edges (top + bottom) on every card */
        .bonus-card::before,
        .bonus-card::after {
          content: "";
          position: absolute;
          left: 12%; right: 12%;
          height: 2px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(255,213,0,0.85) 50%,
            transparent 100%);
          box-shadow: 0 0 14px rgba(255,213,0,0.45);
          opacity: 0.85;
          pointer-events: none;
          z-index: 1;
          transition: opacity 0.35s ease, left 0.5s ease, right 0.5s ease, box-shadow 0.35s ease;
        }
        .bonus-card::before { top: 0; }
        .bonus-card::after  { bottom: 0; }
        .bonus-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255,213,0,0.55);
          box-shadow: 0 16px 40px -10px rgba(0,0,0,0.55),
                      0 0 32px -8px rgba(255,213,0,0.3);
        }
        .bonus-card:hover::before,
        .bonus-card:hover::after {
          opacity: 1;
          left: 4%; right: 4%;
          box-shadow: 0 0 22px rgba(255,213,0,0.7);
        }
        /* Yellow corner brackets — 4 corners */
        .bonus-card__corner {
          position: absolute;
          width: 16px; height: 16px;
          border: 1.5px solid var(--accent);
          opacity: 0.7;
          pointer-events: none;
          z-index: 2;
          transition: opacity 0.3s ease, width 0.3s ease, height 0.3s ease;
        }
        .bonus-card__corner--tl { top: 10px; left: 10px; border-right: none; border-bottom: none; border-top-left-radius: 4px; }
        .bonus-card__corner--tr { top: 10px; right: 10px; border-left: none; border-bottom: none; border-top-right-radius: 4px; }
        .bonus-card__corner--bl { bottom: 10px; left: 10px; border-right: none; border-top: none; border-bottom-left-radius: 4px; }
        .bonus-card__corner--br { bottom: 10px; right: 10px; border-left: none; border-top: none; border-bottom-right-radius: 4px; }
        .bonus-card:hover .bonus-card__corner {
          opacity: 1;
          width: 22px; height: 22px;
        }
        .bonus-card__num-watermark {
          position: absolute;
          bottom: -28px; left: -14px;
          font-family: inherit;
          font-size: 180px;
          font-weight: 900;
          line-height: 0.8;
          background: linear-gradient(180deg, rgba(255,213,0,0.16), rgba(255,213,0,0.02));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          pointer-events: none;
          letter-spacing: -0.06em;
          z-index: 0;
        }
        .bonus-card__ribbon {
          position: absolute;
          top: 14px; right: -38px;
          background: var(--accent);
          color: #0A0A0A;
          padding: 4px 42px;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.28em;
          transform: rotate(45deg);
          transform-origin: center;
          box-shadow: 0 4px 14px rgba(255,213,0,0.45);
          z-index: 3;
          pointer-events: none;
        }
        .bonus-card__ribbon::before,
        .bonus-card__ribbon::after {
          content: "";
          position: absolute;
          width: 0; height: 0;
          border-style: solid;
        }
        .bonus-card__head {
          position: relative; z-index: 1;
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px;
        }
        .bonus-card__tag {
          display: inline-block;
          font-size: 11px; letter-spacing: 0.22em; font-weight: 800;
          color: var(--accent);
          padding: 5px 12px;
          border: 1px solid rgba(255,213,0,0.45);
          border-radius: 999px;
          background: rgba(255,213,0,0.06);
        }
        .bonus-card__popular-pill {
          display: inline-block;
          background: var(--accent);
          color: #0A0A0A;
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 11px; font-weight: 900;
          letter-spacing: 0.14em;
          box-shadow: 0 0 16px rgba(255,213,0,0.5);
          animation: popularBlink 2.6s ease-in-out infinite;
        }
        @keyframes popularBlink {
          0%, 100% { box-shadow: 0 0 16px rgba(255,213,0,0.5); }
          50%      { box-shadow: 0 0 28px rgba(255,213,0,0.85); }
        }
        .bonus-card__title {
          position: relative; z-index: 1;
          font-size: clamp(18px, 1.5cqw, 21px);
          font-weight: 800;
          line-height: 1.3;
          color: #fff;
          margin-top: 4px;
        }
        .bonus-card__sub {
          position: relative; z-index: 1;
          font-size: 13.5px;
          opacity: 0.58;
          line-height: 1.55;
          flex: 1;
        }
        .bonus-card__value-row {
          position: relative; z-index: 1;
          margin-top: 8px;
          padding-top: 18px;
          border-top: 1px dashed rgba(255,213,0,0.22);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }
        .bonus-card__value-old {
          display: inline-flex;
          align-items: baseline;
          gap: 6px;
        }
        .bonus-card__value-label {
          font-size: 11px;
          letter-spacing: 0.16em;
          opacity: 0.5;
          font-weight: 700;
        }
        .bonus-card__value-num {
          font-size: 22px;
          font-weight: 900;
          color: #fff;
          opacity: 0.78;
          text-decoration: line-through;
          text-decoration-color: rgba(255,80,80,0.8);
          text-decoration-thickness: 3px;
          letter-spacing: -0.01em;
        }
        .bonus-card__value-arrow {
          color: var(--accent);
          font-size: 22px;
          opacity: 0.85;
          animation: arrowSlide 1.8s ease-in-out infinite;
        }
        .bonus-card__value-new {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: var(--accent);
          color: #0A0A0A;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 900;
          letter-spacing: 0.02em;
          box-shadow: 0 0 28px rgba(255,213,0,0.55);
          animation: bonusFreePulse 2.4s ease-in-out infinite;
        }
        @keyframes bonusFreePulse {
          0%, 100% { box-shadow: 0 0 20px rgba(255,213,0,0.45); transform: scale(1); }
          50%      { box-shadow: 0 0 32px rgba(255,213,0,0.7); transform: scale(1.03); }
        }

        /* === Bonus TOTAL — value summary === */
        .bonus-total {
          margin-top: 36px;
          padding: 34px 36px 30px;
          position: relative;
          background:
            radial-gradient(120% 80% at 50% 0%, rgba(255,213,0,0.10), transparent 60%),
            var(--card);
          border: 1.5px solid rgba(255,213,0,0.55);
          border-radius: 18px;
          overflow: hidden;
          isolation: isolate;
        }
        .bonus-total__corner {
          position: absolute;
          width: 18px; height: 18px;
          border: 2px solid var(--accent);
          opacity: 0.85;
          z-index: 2;
        }
        .bonus-total__corner--tl { top: 12px; left: 12px; border-right: none; border-bottom: none; }
        .bonus-total__corner--tr { top: 12px; right: 12px; border-left: none; border-bottom: none; }
        .bonus-total__corner--bl { bottom: 12px; left: 12px; border-right: none; border-top: none; }
        .bonus-total__corner--br { bottom: 12px; right: 12px; border-left: none; border-top: none; }
        .bonus-total__inner {
          position: relative;
          z-index: 1;
          text-align: center;
        }
        .bonus-total__pill {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 7px 18px;
          background: rgba(255,213,0,0.10);
          border: 1px solid rgba(255,213,0,0.45);
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.3em;
          color: var(--accent);
          margin-bottom: 24px;
        }
        .bonus-total__pill-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 8px var(--accent);
          animation: urgencyDot 1.1s ease-in-out infinite;
        }
        .bonus-total__compare {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(24px, 4cqw, 48px);
          flex-wrap: wrap;
        }
        .bonus-total__col { text-align: center; }
        .bonus-total__col-label {
          font-size: 11px;
          letter-spacing: 0.24em;
          opacity: 0.5;
          font-weight: 700;
          margin-bottom: 10px;
        }
        .bonus-total__col-label--accent {
          color: var(--accent);
          opacity: 1;
          font-weight: 800;
        }
        .bonus-total__regular-num {
          color: #fff;
          font-size: clamp(48px, 6cqw, 80px);
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.03em;
          opacity: 0.7;
          text-decoration: line-through;
          text-decoration-color: rgba(255,80,80,0.85);
          text-decoration-thickness: 4px;
          display: inline-block;
        }
        .bonus-total__arrow {
          color: var(--accent);
          font-size: clamp(28px, 3cqw, 44px);
          margin-top: 22px;
          opacity: 0.85;
          animation: arrowSlide 1.8s ease-in-out infinite;
        }
        .bonus-total__free-wrap {
          position: relative;
          display: inline-block;
          animation: freePop 2.6s ease-in-out infinite;
        }
        .bonus-total__free {
          display: inline-block;
          font-size: clamp(64px, 8cqw, 112px);
          font-weight: 900;
          color: var(--accent);
          line-height: 1;
          letter-spacing: -0.03em;
          text-shadow:
            0 0 28px rgba(255,213,0,0.55),
            0 0 60px rgba(255,213,0,0.3);
        }
        .bonus-total__free-underline {
          position: absolute;
          left: 4%; right: 4%; bottom: -8px;
          height: 4px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          border-radius: 4px;
          box-shadow: 0 0 12px rgba(255,213,0,0.6);
          animation: underlineSweep 2.6s ease-in-out infinite;
        }
        .bonus-total__savings {
          margin-top: 28px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 22px;
          background: rgba(255,213,0,0.08);
          border: 1px solid rgba(255,213,0,0.4);
          border-radius: 999px;
          font-size: clamp(14px, 1.1cqw, 16px);
          font-weight: 800;
          color: #fff;
        }
        .bonus-total__savings svg { color: var(--accent); }
        .bonus-total__savings-amount {
          color: var(--accent);
          font-weight: 900;
          font-size: 1.1em;
        }

        @container (max-width: 768px) {
          .bonus-card__num-watermark { font-size: 120px; }
          .bonus-card__title { font-size: 17px; }
          .bonus-card__value-num { font-size: 16px; }
          .bonus-card__value-new { font-size: 14px; padding: 7px 14px; }
          .bonus-total { padding: 24px 20px 22px; }
          .bonus-total__compare { gap: 16px; }
          .bonus-total__arrow { display: none; }
        }
      `}</style>

      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        {/* Urgent badge — bold yellow chip with shine sweep + rotating ring */}
        <div style={{
          display: "flex", justifyContent: "center", marginBottom: 36,
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(8px)",
          transition: "all 0.6s ease 0.05s"
        }}>
          <div className="urgent-badge" style={{
            position: "relative",
            display: "inline-flex", alignItems: "center", gap: 12,
            padding: "12px 26px",
            background: "var(--accent)",
            color: "#0A0A0A",
            borderRadius: 999,
            boxShadow: "0 0 0 4px rgba(255,213,0,0.18), 0 0 32px rgba(255,213,0,0.45), 0 12px 32px rgba(0,0,0,0.45)",
            overflow: "hidden",
            isolation: "isolate"
          }}>
            <span aria-hidden="true" className="urgent-badge__shine" />
            <span style={{
              width: 9, height: 9, borderRadius: "50%",
              background: "#0A0A0A",
              animation: "studioRec 1.05s ease-in-out infinite",
              position: "relative", zIndex: 1
            }} />
            <span style={{
              fontSize: 13, letterSpacing: "0.22em",
              fontWeight: 900,
              fontFamily: "'Heebo', system-ui, sans-serif",
              position: "relative", zIndex: 1
            }}>מבצע לזמן מוגבל</span>
          </div>
        </div>

        {/* Headline — same centered + accent + glow + soft underline pattern */}
        <div style={{
          textAlign: "center", margin: "0 auto 24px", maxWidth: 1100,
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.7s ease 0.15s, transform 0.7s cubic-bezier(0.2,0.8,0.2,1) 0.15s"
        }}>
          <h2 className="display" style={{
            fontSize: "clamp(40px, 6cqw, 84px)",
            margin: 0, fontWeight: 900, lineHeight: 1,
            textWrap: "balance"
          }}>
            <span style={{ display: "block", opacity: 0.92 }}>
              פרק ניסיון בלי התחייבות.
            </span>
            <span style={{ display: "block", position: "relative", marginTop: 6 }}>
              <span style={{
                color: "var(--accent)",
                textShadow: "0 0 50px rgba(255,213,0,0.45), 0 0 90px rgba(255,213,0,0.2)",
                position: "relative",
                display: "inline-block"
              }}>
                אפס סיכון.
                <span aria-hidden="true" style={{
                  position: "absolute", left: "3%", right: "3%", bottom: "-0.06em",
                  height: 5,
                  background: "linear-gradient(90deg, transparent, var(--accent) 15%, var(--accent) 85%, transparent)",
                  opacity: 0.55,
                  borderRadius: 3,
                  filter: "blur(0.5px)"
                }} />
              </span>
            </span>
          </h2>
        </div>

        <p style={{ fontSize: "clamp(16px, 1.4cqw, 20px)",
          textAlign: "center", margin: "0 auto 56px", maxWidth: 600,
          opacity: inView ? 0.6 : 0, lineHeight: 1.6,
          transform: inView ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s"
        }}>
          לא צריך להאמין לנו על המילה — תנו לתוצאה לדבר בעצמה.
        </p>

        {/* How it works — 3 steps */}
        <div className="cq-stack" style={{
          maxWidth: 1100, margin: "0 auto 36px",
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16,
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s"
        }}>
          {[
          { n: "01", t: "מקליטים פרק ניסיון.", s: "במחיר היכרות מיוחד." },
          { n: "02", t: "אתם רואים את התוצאה.", s: "פרק מוגמר עם 2 רילסים." },
          { n: "03", t: "אתם מחליטים.", s: "ממשיכים או עוצרים — בחירתכם." }].
          map((step, i) =>
          <div
            key={i}
            className="guarantee-step"
            style={{ ["--step-delay"]: `${i * 0.7}s`, textAlign: "right" }}
          >
              <span aria-hidden="true" className="guarantee-step__glow" />
              <span aria-hidden="true" className="guarantee-step__edge" />
              <span aria-hidden="true" className="guarantee-step__corner guarantee-step__corner--tr" />
              <span aria-hidden="true" className="guarantee-step__corner guarantee-step__corner--bl" />
              <span aria-hidden="true" className="guarantee-step__bar" />
              <div className="mono guarantee-step__num">{step.n}</div>
              <div className="guarantee-step__title">{step.t}</div>
              <div className="guarantee-step__sub">{step.s}</div>
            </div>
          )}
        </div>

        {/* Reassurance pair — two outcome cards */}
        <div className="cq-stack" style={{
          maxWidth: 980, margin: "0 auto 56px",
          display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18,
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.7s ease 0.4s, transform 0.7s ease 0.4s"
        }}>
          {[
          {
            kind: "no",
            label: "אם לא אהבתם",
            main: <>עוצרים. בלי שאלות, בלי לחץ.</>,
            sub: "אנחנו לא מאמינים בלקוחות שנשארים כי הם חייבים."
          },
          {
            kind: "yes",
            label: "אם אהבתם",
            main: <>ממשיכים עם חבילה מותאמת <span className="yes-highlight">+ 15% הנחה.</span></>,
            sub: "כי סמכתם עלינו מהצעד הראשון."
          }].
          map((row, i) =>
          <div key={i} className={`guarantee-row guarantee-row--${row.kind}`} style={{ ["--row-delay"]: `${i * 0.6}s` }}>
              {row.kind === "yes" && <span aria-hidden="true" className="guarantee-row__aurora" />}
              <span aria-hidden="true" className={`guarantee-row__sheen guarantee-row__sheen--${row.kind}`} />
              <span aria-hidden="true" className="guarantee-row__corner guarantee-row__corner--tr" />
              <span aria-hidden="true" className="guarantee-row__corner guarantee-row__corner--bl" />
              {row.kind === "yes" && (
                <svg aria-hidden="true" viewBox="0 0 24 24" className="guarantee-row__check"
                  style={{
                    position: "absolute", left: -10, bottom: -30,
                    width: 220, height: 220,
                    color: "var(--accent)", pointerEvents: "none"
                  }} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12 L10 18 L20 6" />
                </svg>
              )}
              {row.kind === "no" && (
                <svg aria-hidden="true" viewBox="0 0 24 24" className="guarantee-row__xmark"
                  style={{
                    position: "absolute", left: -10, bottom: -30,
                    width: 220, height: 220,
                    color: "rgba(255,255,255,0.85)", pointerEvents: "none"
                  }} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 6 L18 18 M18 6 L6 18" />
                </svg>
              )}
              <div className="guarantee-row__content">
                <div className="guarantee-row__label">{row.label}</div>
                <div className="guarantee-row__main">{row.main}</div>
                <div className="guarantee-row__sub">{row.sub}</div>
              </div>
            </div>
          )}
        </div>

        {/* Bonus pack — only for this month */}
        <div style={{
          maxWidth: 1100, margin: "0 auto 56px",
          padding: "36px 32px 32px",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid var(--line2)",
          borderRadius: 18,
          position: "relative",
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.7s ease 0.45s, transform 0.7s ease 0.45s"
        }}>
          {/* Animated glow sweep behind everything */}
          <div aria-hidden="true" style={{
            position: "absolute", inset: 0,
            borderRadius: 18,
            overflow: "hidden",
            pointerEvents: "none"
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(90deg, transparent, rgba(255,213,0,0.06), transparent)",
              transform: "translateX(-100%)",
              animation: inView ? "bonusGlowSweep 5s ease-in-out 1.2s infinite" : "none"
            }} />
          </div>

          {/* WEEK-ONLY banner — bold attention-grabbing strip */}
          <div className="week-only-banner" aria-label="רק למצטרפים השבוע">
            <span aria-hidden="true" className="week-only-banner__sheen" />
            <span aria-hidden="true" className="week-only-banner__dot week-only-banner__dot--start" />
            <span aria-hidden="true" className="week-only-banner__dot week-only-banner__dot--end" />
            <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="week-only-banner__bolt">
              <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
            </svg>
            <span className="week-only-banner__text">
              <span className="week-only-banner__pill">השבוע בלבד</span>
              <span className="week-only-banner__sub">הבונוסים האלה ניתנים רק למי שמשאיר פרטים השבוע</span>
            </span>
            <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="week-only-banner__bolt">
              <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
            </svg>
          </div>

          <h3 className="display" style={{
            fontSize: "clamp(24px, 2.4cqw, 32px)", fontWeight: 900,
            textAlign: "center", margin: "24px 0 10px", lineHeight: 1.2
          }}>
            סוגרים <span style={{ color: "var(--accent)" }}>השבוע</span> — מקבלים גם את זה.
          </h3>
          <p style={{
            textAlign: "center", maxWidth: 640, margin: "0 auto 28px",
            fontSize: 15, opacity: 0.7, lineHeight: 1.55
          }}>
            רק מי שמתחיל פרק <strong style={{ color: "var(--accent)", fontWeight: 800 }}>השבוע</strong> מקבל 4 מדריכים דיגיטליים בחינם — שיעזרו לכם להפיק את המקסימום מהפודקאסטים שלכם.
          </p>

          <div className="cq-stack" style={{
            display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14,
            marginBottom: 18
          }}>
            {[
            { t: "20 רעיונות לפרקים בתחומכם", s: "רשימה מותאמת אישית של 20 נושאים שמעניינים את הלקוחות שלכם — מוכן להקלטה.", price: "180", popular: false },
            { t: "מדריך: איך מכינים פרק שמוכר", s: "כל מה שצריך לדעת לפני ההקלטה — שאלות, מבנה, וכיצד לגרום לאורח לדבר על מה שמעניין את הקהל שלכם.", price: "290", popular: true },
            { t: "מדריך: פתיחת פודקאסט בכל הפלטפורמות", s: "Spotify, Apple, YouTube — מדריך מלא להעלאה והגדרה בכל הפלטפורמות בפעם הראשונה.", price: "220", popular: false },
            { t: "מדריך: איך עובדים עם ManyChat", s: "הגדרה מלאה של אוטומציה שמביאה לידים מהפודקאסט ישירות לוואטסאפ — צעד אחר צעד.", price: "250", popular: false }].
            map((b, i) =>
            <div key={i}
              className="bonus-card"
              style={{
                opacity: 0,
                animation: inView ? `bonusEnter 0.7s cubic-bezier(0.2,0.8,0.2,1) ${0.6 + i * 0.12}s forwards` : "none",
              }}>
                <span aria-hidden="true" className="bonus-card__num-watermark">0{i + 1}</span>
                <span aria-hidden="true" className="bonus-card__corner bonus-card__corner--tl" />
                <span aria-hidden="true" className="bonus-card__corner bonus-card__corner--tr" />
                <span aria-hidden="true" className="bonus-card__corner bonus-card__corner--bl" />
                <span aria-hidden="true" className="bonus-card__corner bonus-card__corner--br" />

                <div className="bonus-card__head">
                  <span className="bonus-card__tag">
                    בונוס 0{i + 1}
                  </span>
                </div>

                <div className="bonus-card__title">{b.t}</div>
                <div className="bonus-card__sub">{b.s}</div>

                <div className="bonus-card__value-row">
                  <div className="bonus-card__value-old">
                    <span className="bonus-card__value-label">שווי</span>
                    <span className="bonus-card__value-num">₪{b.price}</span>
                  </div>
                  <span aria-hidden="true" className="bonus-card__value-arrow">←</span>
                  <div className="bonus-card__value-new">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 12 L10 18 L20 6" />
                    </svg>
                    <span>חינם</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Countdown — sits where the bonus-total used to be */}
          <div style={{
            marginTop: 36,
            position: "relative",
            textAlign: "center"
          }}>
            <div className="display" style={{
              fontSize: "clamp(18px, 1.7cqw, 22px)", fontWeight: 800,
              lineHeight: 1.4,
              color: "rgb(255,255,255)",
              marginBottom: 18
            }}>
              ההטבה נגמרת ברגע שהשעון מגיע <span style={{
                color: "var(--accent)",
                fontWeight: 900,
                animation: "freeBlink 1.8s ease-in-out infinite",
                textShadow: "0 0 16px rgba(255,213,0,0.5)"
              }}>לאפס</span>.
            </div>

            <div style={{
              display: "flex", alignItems: "flex-start", justifyContent: "center",
              gap: "clamp(10px, 1.4cqw, 22px)"
            }}>
              <CountdownDigit value={time.s} label="שניות" />
              <div className="display" style={{
                fontSize: "clamp(40px, 5.5cqw, 76px)", fontWeight: 900,
                color: "var(--accent)", opacity: 0.5,
                lineHeight: "clamp(80px, 10cqw, 132px)",
                animation: "secondsPulse 1s ease-in-out infinite"
              }}>:</div>
              <CountdownDigit value={time.m} label="דקות" />
              <div className="display" style={{
                fontSize: "clamp(40px, 5.5cqw, 76px)", fontWeight: 900,
                color: "var(--accent)", opacity: 0.5,
                lineHeight: "clamp(80px, 10cqw, 132px)",
                animation: "secondsPulse 1s ease-in-out infinite"
              }}>:</div>
              <CountdownDigit value={time.h} label="שעות" />
            </div>
          </div>
        </div>


      </div>
    </section>);

}

// ---------- 14 · FAQ (uses real Cuts content) ----------
// (responsive helper for the Guarantee lead row)

function FAQSection() {
  const [openIdx, setOpenIdx] = React.useState(0);
  return (
    <section id="faq" style={{ padding: "76px 0", background: "var(--card)", borderTop: "1px solid var(--line2)", borderBottom: "1px solid var(--line2)" }}>
      <div className="wrap" style={{ maxWidth: 900 }}>
        <h2 className="display" style={{
          fontSize: "clamp(36px, 4.5cqw, 52px)",
          textAlign: "center", margin: "0 0 56px",
          fontWeight: 800, lineHeight: 1.15
        }}>
          שאלות <span style={{ color: "var(--accent)" }}>נפוצות</span>
        </h2>

        <div>
          {FAQ.map((f, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={i}
              onClick={() => setOpenIdx(isOpen ? -1 : i)}
              style={{
                borderTop: i === 0 ? "1px solid var(--line2)" : "none",
                borderBottom: "1px solid var(--line2)",
                padding: "26px 4px",
                cursor: "pointer",
                transition: "background .25s ease"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 16, flex: 1 }}>
                    <span className="mono" style={{
                      fontSize: 12, opacity: isOpen ? 1 : 0.5,
                      color: isOpen ? "var(--accent)" : "inherit", minWidth: 28
                    }}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="display" style={{
                      fontSize: 22, fontWeight: 700,
                      color: isOpen ? "var(--accent)" : "inherit"
                    }}>שאלה #{i + 1} — {f.q}</span>
                  </div>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    border: `1.5px solid ${isOpen ? "var(--accent)" : "var(--line2)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    transition: "transform .3s, border-color .25s",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0)",
                    background: isOpen ? "var(--accent)" : "transparent"
                  }}>
                    <span style={{ fontSize: 12, color: isOpen ? "#0A0A0A" : "currentColor" }}>▾</span>
                  </div>
                </div>
                <div style={{
                  display: "grid",
                  gridTemplateRows: isOpen ? "1fr" : "0fr",
                  transition: "grid-template-rows .35s ease",
                  marginTop: isOpen ? 16 : 0
                }}>
                  <div style={{ overflow: "hidden", paddingRight: 44 }}>
                    <p style={{ margin: 0, fontSize: 16, lineHeight: 1.75, opacity: 0.85 }}>{f.a}</p>
                  </div>
                </div>
              </div>);

          })}
        </div>
      </div>
    </section>);

}

// ---------- Consent checkbox (required before any CTA submit) ----------

function ConsentCheckbox({ form }) {
  const checked = !!form.consent;
  const err = form.errors && form.errors.consent;
  return (
    <label
      style={{
        display: "flex", alignItems: "center", gap: 11,
        cursor: "pointer", textAlign: "right",
        fontSize: 13.5, lineHeight: 1.5,
        color: err ? "#ff8a8a" : "rgba(255,255,255,0.78)",
        userSelect: "none"
      }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => form.setConsent(e.target.checked)}
        style={{
          position: "absolute", opacity: 0, width: 0, height: 0,
          pointerEvents: "none"
        }} />
      <span
        aria-hidden="true"
        style={{
          flex: "0 0 20px", width: 20, height: 20,
          borderRadius: 6,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: checked ? "var(--accent)" : "rgba(255,255,255,0.04)",
          border: checked
            ? "1.5px solid var(--accent)"
            : `1.5px solid ${err ? "rgba(255,120,120,0.6)" : "rgba(255,255,255,0.22)"}`,
          boxShadow: checked ? "0 0 0 4px rgba(255,213,0,0.14)" : "none",
          transition: "background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease"
        }}>
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="#0A0A0A" strokeWidth="3.5"
          strokeLinecap="round" strokeLinejoin="round"
          style={{
            opacity: checked ? 1 : 0,
            transform: checked ? "scale(1)" : "scale(0.5)",
            transition: "opacity 0.15s ease, transform 0.15s ease"
          }}>
          <path d="M5 12.5 L10 17.5 L19 6.5" />
        </svg>
      </span>
      <span>
        אני מאשר/ת שקראתי ואני מסכים/ה{" "}
        <a
          href="terms.html"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (window.openLegal) window.openLegal("terms"); }}
          style={{ color: "var(--accent)", textDecoration: "underline", fontWeight: 700 }}>
          לתקנון האתר
        </a>
      </span>
    </label>
  );
}

// ---------- STUDIO BOOKING — centered lead capture (between Results + GuestStrip) ----------

function StudioBookingLead({ form }) {
  const { values, setField, errors, touched, blur, submit, submitted } = form;
  const sectionRef = React.useRef(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    if (!sectionRef.current) return;
    const io = new IntersectionObserver(
      ([e]) => {if (e.isIntersecting) setInView(true);},
      { threshold: 0.15 }
    );
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="studio-section" style={{
      padding: "72px 0",
      position: "relative",
      overflow: "hidden",
      background: "var(--bg)"
    }}>
      {/* dotted grid background */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(rgba(255,213,0,0.07) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        opacity: 0.5,
        maskImage: "radial-gradient(ellipse at center, black 35%, transparent 75%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 35%, transparent 75%)",
        pointerEvents: "none"
      }} />

      {/* yellow ambient glow */}
      <div aria-hidden="true" style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: 800, height: 600,
        background: "radial-gradient(ellipse, rgba(255,213,0,0.07), transparent 70%)",
        filter: "blur(80px)", pointerEvents: "none"
      }} />

      <div className="wrap" style={{ position: "relative", zIndex: 1, maxWidth: 920 }}>
        <div className="studio-card" style={{
          background: "var(--card)",
          border: "1px solid var(--line2)",
          borderRadius: 24,
          padding: "44px 48px 40px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,213,0,0.08)"
        }}>
          {/* corner brackets */}
          <span aria-hidden="true" style={{
            position: "absolute", top: 18, right: 18, width: 22, height: 22,
            borderTop: "2px solid var(--accent)", borderRight: "2px solid var(--accent)"
          }} />
          <span aria-hidden="true" style={{
            position: "absolute", top: 18, left: 18, width: 22, height: 22,
            borderTop: "2px solid var(--accent)", borderLeft: "2px solid var(--accent)"
          }} />
          <span aria-hidden="true" style={{
            position: "absolute", bottom: 18, right: 18, width: 22, height: 22,
            borderBottom: "2px solid var(--accent)", borderRight: "2px solid var(--accent)"
          }} />
          <span aria-hidden="true" style={{
            position: "absolute", bottom: 18, left: 18, width: 22, height: 22,
            borderBottom: "2px solid var(--accent)", borderLeft: "2px solid var(--accent)"
          }} />

          {submitted ?
          <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "var(--accent)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 10px 30px rgba(255,213,0,0.35)"
            }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="display" style={{ fontSize: 32, fontWeight: 900, margin: "0 0 12px" }}>
                קיבלנו את הפרטים שלך.
              </h3>
              <p style={{ fontSize: 17, opacity: 0.7, margin: 0 }}>
                ניצור קשר תוך 24 שעות לתיאום שיחת אבחון של 30 דקות.
              </p>
            </div> :

          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 40, alignItems: "center" }} className="studio-booking-grid">
              {/* RIGHT side (in RTL = first) — pitch */}
              <div>
                {/* live availability chip */}
                <div className="studio-chip" style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "8px 14px",
                background: "rgba(255,213,0,0.1)",
                border: "1px solid rgba(255,213,0,0.3)",
                borderRadius: 999,
                marginBottom: 24,
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(8px)",
                transition: "all 0.5s ease 0.1s", fontSize: "14px"
              }}>
                  <span style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: "var(--accent)",
                  boxShadow: "0 0 10px var(--accent)",
                  animation: "studioRec 1.6s ease-in-out infinite"
                }} />
                  <span className="mono" style={{
                  fontSize: 11, letterSpacing: "0.2em", fontWeight: 700,
                  color: "var(--accent)"
                }}>זמינים השבוע</span>
                </div>

                <h2 className="display studio-pitch-title" style={{
                fontSize: "clamp(26px, 3.2cqw, 38px)",
                margin: "0 0 14px", fontWeight: 900, lineHeight: 1.1,
                textWrap: "balance"
              }}>
                  בוא נראה איך{" "}
                  <span style={{
                  color: "var(--accent)",
                  background: "linear-gradient(180deg, transparent 65%, rgba(255,213,0,0.18) 65%)",
                  padding: "0 6px"
                }}>הפודקאסט שלך</span>{" "}
                  ייראה.
                </h2>

                <p className="studio-pitch-sub" style={{
                fontSize: 16, lineHeight: 1.65, opacity: 0.78,
                margin: "0 0 28px", maxWidth: 460
              }}>
                  שיחת אבחון של 30 דקות, ללא עלות. נכיר את העסק שלך, נבדוק התאמה לפודקאסט,
                  ונראה לך דוגמאות אמיתיות מתוך האולפן.
                </p>

              </div>

              {/* LEFT side (in RTL = second) — form */}
              <form onSubmit={(e) => {e.preventDefault();submit();}}
            className="studio-form"
            style={{
              background: "var(--bg)",
              border: "1px solid var(--line2)",
              borderRadius: 18,
              padding: 32,
              display: "flex", flexDirection: "column", gap: 16,
              position: "relative"
            }}>
              
                {/* tiny header */}
                <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                paddingBottom: 14, borderBottom: "1px solid var(--line2)", marginBottom: 4
              }}>
                  <span className="mono" style={{
                  fontSize: 11, letterSpacing: "0.22em", fontWeight: 700,
                  color: "var(--accent)"
                }}></span>
                  <span className="mono" style={{
                  fontSize: 10, letterSpacing: "0.15em", opacity: 0.45
                }}></span>
                </div>

                {/* Name */}
                <div>
                  <label className="mono" style={{
                  display: "block", fontSize: 11, letterSpacing: "0.18em",
                  opacity: 0.6, marginBottom: 8, fontWeight: 600
                }}>שם מלא</label>
                  <input
                  type="text"
                  placeholder="ישראל ישראלי"
                  value={values.name || ""}
                  onChange={(e) => setField("name", e.target.value)}
                  onBlur={() => blur("name")}
                  style={{
                    width: "100%",
                    padding: "14px 18px",
                    background: "var(--card)",
                    border: `1px solid ${touched.name && errors.name ? "rgba(255,80,80,0.5)" : "var(--line2)"}`,
                    borderRadius: 10,
                    color: "var(--text)",
                    fontSize: 15,
                    fontFamily: "inherit",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s ease"
                  }}
                  onFocus={(e) => {e.target.style.borderColor = "var(--accent)";}} />
                
                  {touched.name && errors.name &&
                <span style={{ color: "rgba(255,120,120,0.9)", fontSize: 12, marginTop: 6, display: "block" }}>{errors.name}</span>
                }
                </div>

                {/* Phone */}
                <div>
                  <label className="mono" style={{
                  display: "block", fontSize: 11, letterSpacing: "0.18em",
                  opacity: 0.6, marginBottom: 8, fontWeight: 600
                }}>טלפון</label>
                  <input
                  type="tel"
                  placeholder="050-0000000"
                  dir="ltr"
                  value={values.phone || ""}
                  onChange={(e) => setField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  onBlur={() => blur("phone")}
                  style={{
                    width: "100%",
                    padding: "14px 18px",
                    background: "var(--card)",
                    border: `1px solid ${touched.phone && errors.phone ? "rgba(255,80,80,0.5)" : "var(--line2)"}`,
                    borderRadius: 10,
                    color: "var(--text)",
                    fontSize: 15,
                    fontFamily: "inherit",
                    textAlign: "right",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s ease"
                  }}
                  onFocus={(e) => {e.target.style.borderColor = "var(--accent)";}} />
                
                  {touched.phone && errors.phone &&
                <span style={{ color: "rgba(255,120,120,0.9)", fontSize: 12, marginTop: 6, display: "block" }}>{errors.phone}</span>
                }
                </div>

                {/* Consent (required) */}
                <div style={{ margin: "4px 0 14px" }}>
                  <ConsentCheckbox form={form} />
                  {touched.consent && errors.consent &&
                  <span style={{ color: "#ff8a8a", fontSize: 12, marginTop: 6, display: "block" }}>{errors.consent}</span>
                  }
                </div>

                {/* Submit */}
                <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "18px 24px",
                  background: "var(--accent)",
                  border: "none",
                  borderRadius: 12,
                  color: "#0A0A0A",
                  fontSize: 16,
                  fontWeight: 800,
                  fontFamily: "inherit",
                  cursor: "pointer",
                  marginTop: 8,
                  boxShadow: "0 8px 24px rgba(255,213,0,0.3)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(255,213,0,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(255,213,0,0.3)";
                }}>
                
                  קביעת שיחת אבחון
                  <span style={{ fontSize: 18 }}>←</span>
                </button>

                {/* footer note */}
                <p className="mono" style={{
                fontSize: 10, letterSpacing: "0.12em",
                opacity: 0.5, textAlign: "center", margin: "4px 0 0"
              }}>
                  ללא ספאם · ללא שיחות מכירה לוחצות
                </p>
              </form>
            </div>
          }
        </div>
      </div>

      <style>{`
        @keyframes studioRec {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
        @container (max-width: 880px) {
          .studio-booking-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
        /* Mobile: make the booking section far more compact (less dead space).
           Uses @container so it also applies in the admin mobile-preview frame. */
        @container (max-width: 600px) {
          .studio-section { padding: 34px 0 !important; }
          .studio-card { padding: 20px 14px !important; border-radius: 18px !important; }
          .studio-booking-grid { gap: 18px !important; }
          .studio-chip { margin-bottom: 12px !important; }
          .studio-pitch-title { margin: 0 0 8px !important; }
          .studio-pitch-sub { margin: 0 !important; font-size: 14px !important; line-height: 1.5 !important; }
          .studio-form { padding: 16px !important; gap: 10px !important; }
          /* empty decorative header row + its divider — pure dead space */
          .studio-form > div:first-of-type { display: none !important; }
          .studio-form label { margin-bottom: 4px !important; }
          .studio-form input { padding: 11px 14px !important; }
          .studio-form button[type="submit"] { padding: 14px 20px !important; margin-top: 2px !important; }
        }
      `}</style>
    </section>);

}

// ==========================================================
// ---------- MINI LEAD STRIPE — compact horizontal lead band ----------

function MiniLeadStripe({ form }) {
  const { values, setField, errors, touched, blur, submit, submitted } = form;

  return (
    <section style={{
      padding: "56px 0",
      background: "var(--bg)",
      borderTop: "1px solid var(--line2)",
      borderBottom: "1px solid var(--line2)",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* thin yellow accent line top */}
      <div aria-hidden="true" style={{
        position: "absolute", top: 0, right: "20%", left: "20%", height: 1,
        background: "linear-gradient(to right, transparent, rgba(255,213,0,0.5), transparent)"
      }} />

      <div className="wrap">
        {submitted ?
        <div style={{
          textAlign: "center",
          padding: "16px 24px",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
          flexWrap: "wrap"
        }}>
            <span style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0
          }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <span style={{ fontSize: 17, fontWeight: 700 }}>תודה! נחזור אליך תוך 24 שעות.</span>
          </div> :

        <div className="mini-lead-row" style={{
          display: "flex", alignItems: "center", gap: 24,
          flexWrap: "wrap", justifyContent: "space-between"
        }}>
            {/* Left: heading */}
            <div style={{ flex: "1 1 280px", minWidth: 0 }}>
              <div className="mono" style={{
              fontSize: 11, letterSpacing: "0.22em", fontWeight: 700,
              color: "var(--accent)", marginBottom: 8
            }}>
                שיחת אבחון · ללא עלות
              </div>
              <h3 className="display" style={{
              fontSize: "clamp(22px, 2.4cqw, 30px)",
              margin: 0, fontWeight: 900, lineHeight: 1.15
            }}>
                רוצה לראות אם זה מתאים לך?{" "}
                <span style={{ color: "var(--accent)" }}>השאר פרטים.</span>
              </h3>
            </div>

            {/* Right: inline form */}
            <form
            onSubmit={(e) => {e.preventDefault();submit();}}
            className="mini-lead-form"
            style={{
              display: "flex", gap: 10,
              flex: "1 1 520px", minWidth: 0,
              flexWrap: "wrap"
            }}>
            
              <input
              type="text"
              placeholder="שם מלא"
              value={values.name || ""}
              onChange={(e) => setField("name", e.target.value)}
              onBlur={() => blur("name")}
              style={{
                flex: "1 1 160px",
                padding: "14px 18px",
                background: "var(--card)",
                border: `1px solid ${touched.name && errors.name ? "rgba(255,80,80,0.5)" : "var(--line2)"}`,
                borderRadius: 10,
                color: "var(--text)",
                fontSize: 15,
                fontFamily: "inherit",
                outline: "none"
              }}
              onFocus={(e) => {e.target.style.borderColor = "var(--accent)";}} />
            
              <input
              type="tel"
              placeholder="טלפון"
              dir="ltr"
              value={values.phone || ""}
              onChange={(e) => setField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
              onBlur={() => blur("phone")}
              style={{
                flex: "1 1 140px",
                padding: "14px 18px",
                background: "var(--card)",
                border: `1px solid ${touched.phone && errors.phone ? "rgba(255,80,80,0.5)" : "var(--line2)"}`,
                borderRadius: 10,
                color: "var(--text)",
                fontSize: 15,
                fontFamily: "inherit",
                textAlign: "right",
                outline: "none"
              }}
              onFocus={(e) => {e.target.style.borderColor = "var(--accent)";}} />
            
              <button
              type="submit"
              style={{
                padding: "14px 28px",
                background: "var(--accent)",
                border: "none",
                borderRadius: 10,
                color: "#0A0A0A",
                fontSize: 15,
                fontWeight: 800,
                fontFamily: "inherit",
                cursor: "pointer",
                whiteSpace: "nowrap",
                boxShadow: "0 6px 20px rgba(255,213,0,0.25)",
                transition: "transform 0.2s ease"
              }}
              onMouseEnter={(e) => {e.currentTarget.style.transform = "translateY(-1px)";}}
              onMouseLeave={(e) => {e.currentTarget.style.transform = "translateY(0)";}}>
              
                שליחה ←
              </button>

              <div style={{ flex: "1 1 100%", marginTop: 2 }}>
                <ConsentCheckbox form={form} />
                {touched.consent && errors.consent &&
                <span style={{ color: "#ff8a8a", fontSize: 12, marginTop: 6, display: "block" }}>{errors.consent}</span>
                }
              </div>
            </form>
          </div>
        }
      </div>

      <style>{`
        @container (max-width: 720px) {
          .mini-lead-row { flex-direction: column; align-items: stretch !important; gap: 16px !important; }
          .mini-lead-row > div:first-child { text-align: center; }
          /* In column flow the children's "flex: 1 1 280/520px" becomes a huge
             HEIGHT — reset to content height so there's no dead space. */
          .mini-lead-row > * { flex: 0 0 auto !important; }
          /* Stack the form fields full-width at normal height (no odd wrapping) */
          .mini-lead-form { flex-direction: column !important; flex-wrap: nowrap !important; gap: 12px !important; }
          .mini-lead-form > input,
          .mini-lead-form > button { flex: 0 0 auto !important; width: 100% !important; }
        }
      `}</style>
    </section>);

}

// ==========================================================
// ---------- INLINE LEAD FORM (compact mid-page form) ----------

function InlineLeadForm({ form }) {
  const { values, setField, errors, touched, blur, submit, submitted } = form;
  return (
    <section style={{
      padding: "68px 0",
      background: "var(--bg)",
      position: "relative", overflow: "hidden"
    }}>
      {/* subtle yellow ambient glow */}
      <div aria-hidden="true" style={{
        position: "absolute", top: "50%", right: "10%", transform: "translateY(-50%)",
        width: 480, height: 480,
        background: "radial-gradient(ellipse, rgba(255,213,0,0.07), transparent 65%)",
        filter: "blur(60px)", pointerEvents: "none"
      }} />

      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        <div className="cq-stack" style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center"
        }}>
          {/* Left — pitch */}
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "8px 14px",
              background: "rgba(255,213,0,0.08)",
              border: "1px solid rgba(255,213,0,0.3)",
              borderRadius: 999, marginBottom: 22
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "var(--accent)", boxShadow: "0 0 10px var(--accent)"
              }} />
              <span className="mono" style={{
                fontSize: 11, letterSpacing: "0.18em", fontWeight: 700,
                color: "var(--accent)"
              }}>שיחת אבחון · ללא עלות</span>
            </div>

            <h2 className="display" style={{
              fontSize: "clamp(32px, 4.2cqw, 56px)",
              margin: "0 0 20px", fontWeight: 900, lineHeight: 1.1
            }}>
              מוכן לבנות פודקאסט<br />
              <span style={{ color: "var(--accent)" }}>שמייצר לך לקוחות?</span>
            </h2>

            <p style={{ fontSize: 17, lineHeight: 1.65, opacity: 0.78, margin: "0 0 28px", maxWidth: 460 }}>
              השאר פרטים, ונחזור אליך תוך 24 שעות לקביעת שיחת אבחון של 30 דקות —
              בלי שיחת מכירה לוחצת, בלי התחייבות.
            </p>

            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {["נצלול לעסק שלך ולקהל היעד.", "נבדוק אם פודקאסט מתאים לך.", "נראה לך דוגמאות אמיתיות."].map((t) =>
              <li key={t} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 15, opacity: 0.85 }}>
                  <span style={{
                  width: 20, height: 20, borderRadius: "50%",
                  background: "var(--accent)", color: "#0A0A0A",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 900, flexShrink: 0
                }}>✓</span>
                  {t}
                </li>
              )}
            </ul>
          </div>

          {/* Right — form */}
          {submitted ?
          <div style={{
            background: "var(--accent)", color: "#0A0A0A",
            borderRadius: 18, padding: 44,
            display: "flex", flexDirection: "column", justifyContent: "center",
            minHeight: 380
          }}>
              <div style={{ fontSize: 56, marginBottom: 10, fontWeight: 900 }}>✓</div>
              <h3 className="display" style={{ fontSize: 36, margin: "0 0 12px", fontWeight: 900 }}>קיבלנו!</h3>
              <p style={{ fontSize: 16, lineHeight: 1.6, opacity: 0.85, margin: 0 }}>
                נחזור אליך תוך 24 שעות לקביעת שיחה.
              </p>
            </div> :

          <form onSubmit={submit} style={{
            background: "var(--bg)",
            border: "2px solid var(--line2)",
            borderRadius: 18, padding: 32,
            display: "flex", flexDirection: "column", gap: 14
          }}>
              <div className={`field ${errors.name && touched.name ? "error" : ""}`}>
                <label>שם מלא</label>
                <input value={values.name} onChange={(e) => setField("name", e.target.value)} onBlur={() => blur("name")} placeholder="משה לוי" />
                {errors.name && touched.name && <span className="err">{errors.name}</span>}
              </div>
              <div className={`field ${errors.phone && touched.phone ? "error" : ""}`}>
                <label>טלפון</label>
                <input dir="ltr" value={values.phone} onChange={(e) => setField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} onBlur={() => blur("phone")} placeholder="054-000-0000" />
                {errors.phone && touched.phone && <span className="err">{errors.phone}</span>}
              </div>
              <div style={{ marginTop: 4 }}>
                <ConsentCheckbox form={form} />
                {touched.consent && errors.consent &&
                <span className="err" style={{ display: "block", marginTop: 6 }}>{errors.consent}</span>
                }
              </div>
              <button type="submit" className="btn btn-primary" style={{
              marginTop: 6, justifyContent: "center", padding: "18px",
              fontSize: 16, borderRadius: 10
            }}>
                בוא נקבע שיחה ←
              </button>
              <p className="mono" style={{
              fontSize: 11, opacity: 0.5, margin: "2px 0 0",
              textAlign: "center", lineHeight: 1.6
            }}>
                אין שיחת מכירה לוחצת · נחזור תוך 24 שעות
              </p>
            </form>
          }
        </div>
      </div>
    </section>);

}

// ---------- 15 · FINAL CTA (recap checklist + form + image) ----------

function FinalCTA({ form, onCTAClick }) {
  const { values, setField, errors, touched, blur, submit, submitted } = form;
  return (
    <section id="cta" style={{ padding: "56px 0" }}>
      <div className="wrap" style={{ maxWidth: 1000 }}>
        <div className="cq-stack" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 40, alignItems: "stretch" }}>
          {/* Left — recap */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 32 }}>
            <p className="mono" style={{ fontSize: 14, opacity: 0.7, margin: 0, letterSpacing: "0.06em" }}>

            </p>

            <h2 className="display" style={{
              fontSize: "clamp(28px, 3.6cqw, 42px)",
              margin: 0, fontWeight: 800, lineHeight: 1.1
            }}>
              סיכום אחרון —{" "}
              <span style={{ color: "var(--accent)" }}>
                למה אנשים זקוקים לפעול היום (יצירת דחיפות).
              </span>
            </h2>

            <p style={{ fontSize: 18, lineHeight: 1.65, opacity: 0.8, margin: 0 }}>
              נסחו את הסיבה האחת המרכזית לכך שאנשים יפנו אליך ויצרו קשר עם החברה למתן שירות או מוצר.
              זו ההזדמנות האחרונה שלכם לתפוס את תשומת לבם.
            </p>

            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {["הצעת ערך #1", "הצעת ערך #2", "הצעת ערך #3"].map((v) =>
              <li key={v} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{
                  width: 24, height: 24, borderRadius: "50%",
                  background: "var(--accent)", color: "#0A0A0A",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 900, flexShrink: 0
                }}>✓</span>
                  <span style={{ fontSize: 18, opacity: 0.9 }}>{v}</span>
                </li>
              )}
            </ul>

            {submitted ? null :
            <div style={{
              marginTop: 8,
              position: "relative",
              padding: "28px 32px",
              borderRadius: 18,
              background: "linear-gradient(135deg, rgba(255,213,0,0.08) 0%, rgba(255,213,0,0.02) 100%)",
              border: "1px solid rgba(255,213,0,0.2)",
              overflow: "hidden"
            }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                fontSize: 11, fontWeight: 700,
                letterSpacing: "0.18em",
                color: "var(--accent)",
                marginBottom: 14,
                textTransform: "uppercase"
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "var(--accent)",
                  boxShadow: "0 0 0 4px rgba(255,213,0,0.2)",
                  animation: "ctaPulse 2s ease-in-out infinite"
                }}></span>
                מקומות מוגבלים החודש
              </div>

              <h3 className="display" style={{
                fontSize: 26, fontWeight: 800, margin: "0 0 8px",
                lineHeight: 1.2, letterSpacing: "-0.01em"
              }}>
                3 מקומות פנויים לפודקאסטים חדשים
              </h3>

              <p style={{
                fontSize: 15, lineHeight: 1.55,
                opacity: 0.7, margin: "0 0 22px"
              }}>
                האולפן עובד בתפוסה מלאה. אנחנו פותחים סלוטים חדשים פעם ברבעון —
                ההזדמנות הבאה: ינואר 2025.
              </p>

              <div style={{
                display: "flex", alignItems: "center", gap: 16,
                marginTop: 4, paddingTop: 18,
                borderTop: "1px solid rgba(255,255,255,0.08)",
                fontSize: 13, opacity: 0.55, fontWeight: 500
              }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: "var(--accent)" }}>✓</span> ללא התחייבות
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: "var(--accent)" }}>✓</span> שיחת אבחון 30 דק׳
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: "var(--accent)" }}>✓</span> מענה תוך 24ש׳
                </span>
              </div>
            </div>}
          </div>

          {/* Right — form (replaces image per CTA functionality) */}
          {submitted ?
          <div style={{
            background: "var(--accent)", color: "#0A0A0A",
            borderRadius: 18, padding: 56,
            display: "flex", flexDirection: "column", justifyContent: "center",
            minHeight: 530
          }}>
              <div style={{ fontSize: 64, marginBottom: 12, fontWeight: 900 }}>✓</div>
              <h3 className="display" style={{ fontSize: 44, margin: "0 0 16px", fontWeight: 900 }}>קיבלנו!</h3>
              <p style={{ fontSize: 18, lineHeight: 1.6, opacity: 0.85, margin: 0 }}>
                נחזור אליך תוך 24 שעות לקביעת שיחה.
                אין שיחת מכירה לוחצת — רק שיחת אבחון אמיתית.
              </p>
            </div> :

          <form onSubmit={submit} style={{
            background: "linear-gradient(180deg, #161616 0%, #0F0F0F 100%)",
            border: "1px solid var(--line2)",
            borderRadius: 24, padding: 0,
            display: "flex", flexDirection: "column",
            alignSelf: "stretch",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 30px 80px -30px rgba(0,0,0,0.6)"
          }}>
              {/* Top yellow accent strip */}
              <div aria-hidden="true" style={{
              height: 4,
              background: "linear-gradient(90deg, transparent, var(--accent), transparent)"
            }} />

              {/* Header */}
              <div style={{
              padding: "32px 36px 24px",
              borderBottom: "1px solid rgba(255,255,255,0.06)"
            }}>
                <div className="mono" style={{
                fontSize: 11, fontWeight: 700,
                letterSpacing: "0.2em",
                color: "var(--accent)",
                marginBottom: 8, textTransform: "uppercase"
              }}>
                    שיחת אבחון · ללא עלות
                  </div>
                <h3 className="display" style={{
                fontSize: 24, fontWeight: 900, margin: 0,
                lineHeight: 1.15, letterSpacing: "-0.01em"
              }}>
                    קביעת פגישה
                  </h3>
              </div>

              {/* Form fields */}
              <div style={{
              padding: "32px 40px 24px",
              display: "flex", flexDirection: "column", gap: 18,
              flex: 1, justifyContent: "center"
            }}>
                <div className={`field ${errors.name && touched.name ? "error" : ""}`}>
                  <label>שם מלא</label>
                  <input id="cta-form-name" value={values.name} onChange={(e) => setField("name", e.target.value)} onBlur={() => blur("name")} placeholder="משה לוי" />
                  {errors.name && touched.name && <span className="err">{errors.name}</span>}
                </div>
                <div className={`field ${errors.phone && touched.phone ? "error" : ""}`}>
                  <label>טלפון</label>
                  <input dir="ltr" value={values.phone} onChange={(e) => setField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} onBlur={() => blur("phone")} placeholder="054-000-0000" />
                  {errors.phone && touched.phone && <span className="err">{errors.phone}</span>}
                </div>
                <div style={{ marginTop: 2 }}>
                  <ConsentCheckbox form={form} />
                  {touched.consent && errors.consent &&
                  <span className="err" style={{ display: "block", marginTop: 6 }}>{errors.consent}</span>
                  }
                </div>
                <button type="submit" className="btn btn-primary" style={{
                marginTop: 4, justifyContent: "center", padding: "20px",
                fontSize: 17, borderRadius: 12, fontWeight: 800
              }}>
                  בוא נקבע שיחה ←
                </button>
              </div>

              {/* Footer trust bar */}
              <div style={{
              padding: "20px 40px 28px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.015)"
            }}>
                <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: 12, flexWrap: "wrap",
                fontSize: 12, fontWeight: 600, opacity: 0.7
              }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: "var(--accent)" }}>✓</span> ללא התחייבות
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: "var(--accent)" }}>✓</span> 30 דקות
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: "var(--accent)" }}>✓</span> מענה תוך 24ש׳
                  </span>
                </div>
                <p className="mono" style={{
                fontSize: 10, opacity: 0.4, margin: "12px 0 0",
                textAlign: "center", lineHeight: 1.6,
                letterSpacing: "0.05em"
              }}>
                  אין שיחת מכירה לוחצת. רק שיחת אבחון אמיתית.
                </p>
              </div>
            </form>
          }
        </div>
      </div>

      <style>{`
        @keyframes ctaPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,213,0,0.5); transform: scale(1); }
          50%      { box-shadow: 0 0 0 6px rgba(255,213,0,0); transform: scale(1.15); }
        }
      `}</style>
    </section>);

}

// ---------- GUEST STRIP (from previous version — option B) ----------

// Built-in guest images for row 1. Each item has src + scale/offsetX/offsetY
// for cropping a 16:9 source into the 9:16 tile. Defaults to no transform
// (center-cover crop). Exposed on window so the admin panel can read them.
const DEFAULT_GUESTS_ROW1 = [
  { src: "assets/guests/guest-01.jpg", scale: 1, offsetX: 0, offsetY: 0 },
  { src: "assets/guests/guest-02.jpg", scale: 1, offsetX: 0, offsetY: 0 },
  { src: "assets/guests/guest-03.jpg", scale: 1, offsetX: 0, offsetY: 0 },
  { src: "assets/guests/guest-04.jpg", scale: 1, offsetX: 0, offsetY: 0 },
  { src: "assets/guests/guest-05.jpg", scale: 1, offsetX: 0, offsetY: 0 },
  { src: "assets/guests/guest-06.jpg", scale: 1, offsetX: 0, offsetY: 0 },
];
const DEFAULT_GUESTS_ROW2 = [];

// Guest framing uses object-position (NOT transform:translate) to pan, plus
// transform:scale to zoom. object-position pans WITHIN the objectFit:cover
// overflow, so the image always fully covers the tile — black edges are
// impossible at any offset. offsetX/offsetY are deltas from center, mapped to
// object-position `${50+off}%`, clamped to ±50 so the position stays in 0–100%.
// Scale floors at 1 (cover); below it would leave gaps.
function clampGuestTransform(scale, offsetX, offsetY) {
  const s = Math.max(1, Math.min(3, Number(scale) || 1));
  const clamp = (v) => Math.max(-50, Math.min(50, Number(v) || 0));
  return { scale: s, offsetX: clamp(offsetX), offsetY: clamp(offsetY) };
}

function guestObjectPosition(offsetX, offsetY) {
  const px = Math.max(0, Math.min(100, 50 + (Number(offsetX) || 0)));
  const py = Math.max(0, Math.min(100, 50 + (Number(offsetY) || 0)));
  return `${px}% ${py}%`;
}

if (typeof window !== "undefined") window.__cutsGuestObjectPosition = guestObjectPosition;

function GuestTile({ item, n, aspectStr, dup, width }) {
  const hasImg = !!(item && item.src);
  const ct = hasImg ? clampGuestTransform(item.scale, item.offsetX, item.offsetY) : null;
  return (
    <div
      aria-hidden={dup > 0 ? "true" : undefined}
      data-guest-num={n}
      style={{
        flexShrink: 0,
        width, aspectRatio: aspectStr,
        marginInlineEnd: 14,
        background: "var(--bg)",
        borderRadius: 12,
        position: "relative",
        overflow: "hidden"
      }}>
      {hasImg && (
        <img
          src={(window.__cutsDriveUrlToImage && window.__cutsDriveUrlToImage(item.src)) || item.src}
          alt=""
          draggable="false"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            objectPosition: guestObjectPosition(ct.offsetX, ct.offsetY),
            transform: `scale(${ct.scale})`,
            transformOrigin: "center",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
      )}
      {/* Feather all four edges into the section background so the bright image
          melts into the dark rather than sitting in a hard-edged black frame. */}
      {hasImg && (
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
          borderRadius: 12,
          background:
            "linear-gradient(to bottom, var(--bg), transparent 13%)," +
            "linear-gradient(to top, var(--bg), transparent 13%)," +
            "linear-gradient(to right, var(--bg), transparent 9%)," +
            "linear-gradient(to left, var(--bg), transparent 9%)"
        }} />
      )}
      {!hasImg && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 2
        }}>
          <svg width="66" height="66" viewBox="0 0 90 90" fill="none" aria-hidden="true">
            <circle cx="45" cy="32" r="18" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M14 84 C 14 64, 30 56, 45 56 C 60 56, 76 64, 76 84"
              stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
          </svg>
        </div>
      )}
    </div>
  );
}

if (typeof window !== "undefined") {
  window.__cutsGuestsRow1 = DEFAULT_GUESTS_ROW1;
  window.__cutsGuestsRow2 = DEFAULT_GUESTS_ROW2;
  window.__cutsClampGuestTransform = clampGuestTransform;
}

function orderAndFilterGuestsRow1(admin) {
  const hidden = new Set((admin && admin.hiddenGuestsRow1) || []);
  const items = admin && Array.isArray(admin.guestsRow1Items) ? admin.guestsRow1Items : null;
  const base = items && items.length ? items : DEFAULT_GUESTS_ROW1;
  return base.filter((g) => g && g.src && !hidden.has(g.src));
}

function orderAndFilterGuestsRow2(admin) {
  const hidden = new Set((admin && admin.hiddenGuestsRow2) || []);
  const items = admin && Array.isArray(admin.guestsRow2Items) ? admin.guestsRow2Items : null;
  const base = items && items.length ? items : DEFAULT_GUESTS_ROW2;
  return base.filter((g) => g && g.src && !hidden.has(g.src));
}

function GuestStrip({ admin }) {
  return (
    <section className="guest-section" style={{
      padding: "76px 0 64px",
      position: "relative", overflow: "hidden",
      background: "var(--bg)",
      borderTop: "1px solid var(--line2)"
    }}>
      <div aria-hidden="true" style={{
        position: "absolute", top: "30%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 900, height: 400,
        background: "radial-gradient(ellipse, rgba(255,213,0,0.06), transparent 70%)",
        pointerEvents: "none", filter: "blur(40px)"
      }} />

      <div className="wrap guest-heading-wrap" style={{ position: "relative", zIndex: 2, marginBottom: 56 }}>
        <div style={{ textAlign: "center", maxWidth: 1100, marginLeft: "auto", marginRight: "auto" }}>
          <h2 className="display" style={{
            fontSize: "clamp(40px, 6cqw, 84px)",
            margin: 0, fontWeight: 900, lineHeight: 1.1,
            textWrap: "balance"
          }}>
            <span style={{ opacity: 0.92 }}>כאן אנחנו הופכים </span>
            <span style={{
              color: "var(--accent)",
              textShadow: "0 0 50px rgba(255,213,0,0.45), 0 0 90px rgba(255,213,0,0.2)",
              position: "relative",
              display: "inline-block"
            }}>
              מומחים למותגים.
              <span aria-hidden="true" style={{
                position: "absolute", left: "3%", right: "3%", bottom: "-0.06em",
                height: 5,
                background: "linear-gradient(90deg, transparent, var(--accent) 15%, var(--accent) 85%, transparent)",
                opacity: 0.55,
                borderRadius: 3,
                filter: "blur(0.5px)"
              }} />
            </span>
          </h2>
        </div>
      </div>

      <div id="guest-marquee" style={{ position: "relative", display: "flex", flexDirection: "column", gap: 14, direction: "ltr", overflow: "hidden" }}>
        <div aria-hidden="true" style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: 220, zIndex: 3, pointerEvents: "none", background: "linear-gradient(to left, var(--bg), transparent)" }} />
        <div aria-hidden="true" style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: 220, zIndex: 3, pointerEvents: "none", background: "linear-gradient(to right, var(--bg), transparent)" }} />

        {/* Two-row branded marquee — rows scroll in opposite directions.
            Items are rendered 3× so the wrapper is always ≥3× wider than the
            viewport, and the animation moves exactly one set width (33.333%).
            That keeps the seam invisible AND prevents any moment where the
            wrapper's edge is inside the viewport (the "disappearing" gap). */}
        {(() => {
          const row1 = orderAndFilterGuestsRow1(admin);
          const row2 = orderAndFilterGuestsRow2(admin);
          const rows = [
            { dir: "rtl", offset: 0,  duration: 20, fillTo: 10, width: 176, aspect: "9 / 16", items: row1 },
            { dir: "ltr", offset: 10, duration: 25, fillTo: 6,  width: 462, aspect: "16 / 9", items: row2 },
          ];
          return rows.map((row, rowIdx) => {
            const items = row.items.length
              ? row.items
              : Array.from({ length: row.fillTo }, () => null); // null = placeholder
            const padded = items.length < 3 ? [...items, ...items, ...items] : items;
            return (
              <div key={rowIdx} className={"guest-marquee-row " + (row.aspect === "9 / 16" ? "guest-marquee-row--tall" : "guest-marquee-row--wide")} style={{
                direction: "ltr",
                display: "flex",
                animation: `marquee-${row.dir} ${row.duration}s linear infinite`,
                width: "max-content",
                padding: "4px 0"
              }}>
                {[...Array(3)].flatMap((_, dup) =>
                  padded.map((item, i) => {
                    const n = row.offset + (i + 1);
                    return (
                      <GuestTile
                        key={`${rowIdx}-${dup}-${i}`}
                        item={item}
                        n={n}
                        aspectStr={row.aspect}
                        dup={dup}
                        width={row.width}
                      />
                    );
                  })
                )}
              </div>
            );
          });
        })()}
      </div>

      <style>{`
        @keyframes marquee-rtl { from { transform: translateX(-33.3333%); } to { transform: translateX(0); } }
        @keyframes marquee-ltr { from { transform: translateX(0); } to { transform: translateX(-33.3333%); } }
        @keyframes guestRec {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.7); }
        }
        .guest-marquee-row:hover { animation-play-state: paused; }
        @container (max-width: 768px) {
          /* Tall (9:16) row stays compact so more faces scroll past; wide
             (16:9) row shows ~one image at a time, scrolling faster on mobile. */
          .guest-marquee-row--tall > div { width: 105px !important; }
          .guest-marquee-row--wide > div { width: 255px !important; }
          .guest-marquee-row--wide { animation-duration: 15s !important; }
          .guest-section { padding-top: 52px !important; padding-bottom: 44px !important; }
          .guest-heading-wrap { margin-bottom: 34px !important; }
        }
        @container (max-width: 420px) {
          .guest-marquee-row--tall > div { width: 92px !important; }
          .guest-marquee-row--wide > div { width: 240px !important; }
        }
      `}</style>
    </section>);

}

// ---------- RESULTS (from previous version — option B) ----------

// === פרקי פודקאסט (YouTube) ===
// title    = כותרת הפרק שמופיעה על הכרטיס.
// sub      = שורת משנה (שם האורח / הנושא). ריק = לא מוצג.
// youtubeId = ה-ID מתוך לינק יוטיוב.
//   https://youtu.be/ABC123  או  https://www.youtube.com/watch?v=ABC123  → "ABC123"
const PODCAST_VIDEOS = [
{ title: "", sub: "", youtubeId: "L-RHzPEthCM" },
{ title: "", sub: "", youtubeId: "MpOyFwCPAII" },
{ title: "", sub: "", youtubeId: "bXAmsbiZwIg" },
{ title: "", sub: "", youtubeId: "7MeWJkQZcqU" },
{ title: "", sub: "", youtubeId: "V-kwXkPtP0k" },
{ title: "", sub: "", youtubeId: "ZdbeRPiUJFo" },
{ title: "", sub: "", youtubeId: "yS0Zlpwmr3M" },
{ title: "", sub: "", youtubeId: "csBIrDweyuU" }];

// נחשוף לפאנל האדמין כדי לאפשר סידור/הסתרה
if (typeof window !== "undefined") window.__cutsPodcastVideos = PODCAST_VIDEOS;

// === לוגואים של לקוחות (רצועת לופ) ===
// כל קובץ ב-assets/logos/. מומלץ PNG/SVG שקוף בהיר (הרקע כהה).
// להוסיף לוגו חדש = להוסיף שורה כאן + הקובץ ל-assets/logos/.
// Empty by default — the marquee hides itself when there are no logos.
// Add via the admin panel ("🖼️ ניהול לוגואים" → "➕ הוסף לוגו") once cleaner
// white-on-transparent source files are ready.
const CLIENT_LOGOS = [];

// Built-in client logos, exposed for the admin panel so it can prefill the
// editor with the defaults. Each item is normalized to a single `src` field
// (relative path for static, or remote URL when added via the admin).
const DEFAULT_CLIENT_LOGOS = CLIENT_LOGOS.map((l) => ({ src: `assets/logos/${l.file}` }));
if (typeof window !== "undefined") window.__cutsClientLogos = DEFAULT_CLIENT_LOGOS;

function orderAndFilterLogos(admin) {
  const hidden = new Set((admin && admin.hiddenLogos) || []);
  const items = admin && Array.isArray(admin.logoItems) ? admin.logoItems : null;
  const base = items && items.length ? items : DEFAULT_CLIENT_LOGOS;
  return base.filter((l) => l && l.src && !hidden.has(l.src));
}

function LogoMarquee({ admin }) {
  const logos = React.useMemo(
    () => orderAndFilterLogos(admin),
    [admin && admin.logoItems, admin && admin.hiddenLogos]
  );
  if (!logos.length) return null;
  // 2 identical halves + translateX(-50%) → perfectly seamless loop.
  const reel = [...logos, ...logos];
  return (
    <div style={{ position: "relative", marginTop: 64, overflow: "hidden", direction: "ltr" }}>
      <style>{`
        @keyframes cutsLogoScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .cuts-logo-reel {
          display: flex;
          width: max-content;
          align-items: center;
          animation: cutsLogoScroll 22s linear infinite;
        }
        .cuts-logo-reel:hover { animation-play-state: paused; }
        .cuts-logo-reel img {
          /* Uniform tile so every logo lands at the same visual size
             regardless of source aspect ratio. object-fit:contain preserves
             ratio inside the box; flex:0 0 auto keeps width fixed. */
          width: 200px;
          height: 110px;
          object-fit: contain;
          object-position: center;
          margin-inline: clamp(10px, 1.6cqw, 24px);
          opacity: 0.9;
          /* brightness(0)+invert(1) = recolor any colored/black logo to pure
             white while preserving transparency. */
          filter: brightness(0) invert(1);
          transition: opacity 0.25s ease, transform 0.25s ease;
          flex: 0 0 auto;
        }
        .cuts-logo-reel img:hover {
          opacity: 1;
          transform: scale(1.05);
        }
      `}</style>
      <div aria-hidden="true" style={{
        position: "absolute", top: 0, bottom: 0, right: 0, width: 90, zIndex: 2,
        pointerEvents: "none",
        background: "linear-gradient(to left, var(--card), transparent)"
      }} />
      <div aria-hidden="true" style={{
        position: "absolute", top: 0, bottom: 0, left: 0, width: 90, zIndex: 2,
        pointerEvents: "none",
        background: "linear-gradient(to right, var(--card), transparent)"
      }} />
      <div className="cuts-logo-reel" style={{ direction: "ltr" }}>
        {reel.map((l, i) => (
          <img key={i} src={l.src} alt="" draggable="false" />
        ))}
      </div>
    </div>
  );
}

function orderAndFilterPodcasts(admin) {
  const hidden = new Set((admin && admin.hiddenPodcasts) || []);
  const items = admin && Array.isArray(admin.podcastItems) ? admin.podcastItems : null;
  if (items) {
    return items.filter((v) => v && v.youtubeId && !hidden.has(v.youtubeId));
  }
  const order = admin && Array.isArray(admin.podcastOrder) ? admin.podcastOrder : null;
  let list = PODCAST_VIDEOS;
  if (order && order.length) {
    const byId = new Map(PODCAST_VIDEOS.map((v) => [v.youtubeId, v]));
    const seen = new Set();
    const ordered = [];
    for (const id of order) {
      const v = byId.get(id);
      if (v && !seen.has(id)) { ordered.push(v); seen.add(id); }
    }
    for (const v of PODCAST_VIDEOS) if (!seen.has(v.youtubeId)) ordered.push(v);
    list = ordered;
  }
  return list.filter((v) => !hidden.has(v.youtubeId));
}

function Results({ admin }) {
  const [playingIdx, setPlayingIdx] = React.useState(null);

  const cases = React.useMemo(
    () => orderAndFilterPodcasts(admin),
    [admin && admin.podcastOrder, admin && admin.hiddenPodcasts]
  );



  // Infinite-loop transform track (no native scroll — RTL scrollLeft is
  // unreliable in this engine). Render 3 copies; start in the middle
  // copy and silently re-center on transitionend so it never hits an
  // edge — endless in both directions, no jump.
  const viewportRef = React.useRef(null);
  const GAP = 20;
  const N = cases.length;
  const loopItems = N > 0 ? [...cases, ...cases, ...cases] : [];
  const [cardW, setCardW] = React.useState(0);
  const [idx, setIdx] = React.useState(N);
  const [withAnim, setWithAnim] = React.useState(true);
  // On a narrow canvas the episodes stack vertically (one after another)
  // instead of the horizontal arrow carousel.
  const [stacked, setStacked] = React.useState(false);
  const idxRef = React.useRef(N);
  React.useEffect(() => { idxRef.current = idx; }, [idx]);
  const step = cardW + GAP;
  const renderList = stacked ? cases : loopItems;

  const measure = React.useCallback(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const w = vp.clientWidth;
    setStacked(w > 0 && w <= 600);
    // Cards per view scales with the carousel's own width — so it responds to
    // the .site-canvas mobile frame (and real phones) just like @container.
    const pv = w < 560 ? 1 : w < 900 ? 2 : 3;
    setCardW(Math.max(0, (w - (pv - 1) * GAP) / pv));
  }, []);

  React.useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    // The window doesn't resize when the canvas is toggled to mobile, so also
    // observe the viewport element's own box.
    let ro;
    if (viewportRef.current && window.ResizeObserver) {
      ro = new ResizeObserver(measure);
      ro.observe(viewportRef.current);
    }
    return () => {
      window.removeEventListener("resize", measure);
      if (ro) ro.disconnect();
    };
  }, [measure]);

  // Re-center to the middle copy whenever the list changes.
  React.useEffect(() => {
    setWithAnim(false);
    setIdx(N);
  }, [N]);

  // After a non-animated re-center, restore the transition next paint.
  React.useEffect(() => {
    if (withAnim) return;
    const t = setTimeout(() => setWithAnim(true), 30);
    return () => clearTimeout(t);
  }, [withAnim, idx]);

  const go = (dir) => {
    setWithAnim(true);
    idxRef.current = idxRef.current + dir;
    setIdx((i) => i + dir);
  };
  const onTrackTransitionEnd = (e) => {
    // Ignore transitionend bubbling up from child cards (hover etc.).
    if (e.target !== e.currentTarget || e.propertyName !== "transform") return;
    if (N <= 0) return;
    const cur = idxRef.current;
    // Keep idx inside the middle copy [N, 2N): identical visual card,
    // but room to keep scrolling either way forever.
    if (cur >= 2 * N || cur < N) {
      const norm = N + (((cur - N) % N) + N) % N;
      setWithAnim(false);
      idxRef.current = norm;
      setIdx(norm);
    }
  };
  const scrollByCard = go;
  const scrollState = { atStart: false, atEnd: false };

  return (
    <section id="results" style={{ padding: "76px 0 52px", background: "var(--card)", borderTop: "1px solid var(--line2)", borderBottom: "1px solid var(--line2)" }}>
      <div className="wrap">
        <div style={{ textAlign: "center", marginBottom: 56, maxWidth: 1100, marginLeft: "auto", marginRight: "auto" }}>
          <h2 className="display" style={{
            fontSize: "clamp(40px, 6cqw, 84px)",
            margin: 0, fontWeight: 900, lineHeight: 1.1,
            textWrap: "balance"
          }}>
            <span className="results-h-line1" style={{ opacity: 0.92 }}>ככה נראים </span>
            <span style={{
              color: "var(--accent)",
              textShadow: "0 0 50px rgba(255,213,0,0.45), 0 0 90px rgba(255,213,0,0.2)",
              position: "relative",
              display: "inline-block"
            }}>
              הפודקאסטים שלנו.
              <span aria-hidden="true" style={{
                position: "absolute", left: "3%", right: "3%", bottom: "-0.06em",
                height: 5,
                background: "linear-gradient(90deg, transparent, var(--accent) 15%, var(--accent) 85%, transparent)",
                opacity: 0.55,
                borderRadius: 3,
                filter: "blur(0.5px)"
              }} />
            </span>
          </h2>
        </div>
      </div>

      {/* Carousel — full-bleed wrapper for arrows */}
      <div style={{ position: "relative", maxWidth: 1280, marginInline: "auto", paddingInline: stacked ? 16 : 80 }}>
        {/* Prev arrow (right in RTL) — identical to testimonials */}
        {!stacked &&
        <button
          type="button"
          onClick={(e) => {
            const b = e.currentTarget;
            b.classList.remove("nudge-prev");
            void b.offsetWidth;
            b.classList.add("nudge-prev");
            scrollByCard(1);
          }}
          aria-label="הקודם"
          className="vid-nav-btn"
          style={{
            position: "absolute", top: "50%", right: 12,
            zIndex: 4,
            width: 52, height: 52, borderRadius: "50%",
            background: "var(--accent)",
            border: "1px solid var(--accent)",
            color: "#0A0A0A",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 24px rgba(255,213,0,0.3)",
            transition: "all 0.2s ease"
          }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
        }

        {/* Next arrow (left in RTL) — identical to testimonials */}
        {!stacked &&
        <button
          type="button"
          onClick={(e) => {
            const b = e.currentTarget;
            b.classList.remove("nudge-next");
            void b.offsetWidth;
            b.classList.add("nudge-next");
            scrollByCard(-1);
          }}
          aria-label="הבא"
          className="vid-nav-btn"
          style={{
            position: "absolute", top: "50%", left: 12,
            zIndex: 4,
            width: 52, height: 52, borderRadius: "50%",
            background: "var(--accent)",
            border: "1px solid var(--accent)",
            color: "#0A0A0A",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 24px rgba(255,213,0,0.3)",
            transition: "all 0.2s ease"
          }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        }

        <div
          ref={viewportRef}
          style={{ overflow: stacked ? "visible" : "hidden", paddingBlock: 10 }}>
          <div
            onTransitionEnd={onTrackTransitionEnd}
            style={stacked ? {
              display: "flex", flexDirection: "column", gap: 18, direction: "ltr"
            } : {
              display: "flex", gap: GAP,
              direction: "ltr",
              transform: `translateX(${-idx * step}px)`,
              transition: withAnim
                ? "transform 0.45s cubic-bezier(0.22,0.61,0.36,1)"
                : "none",
              willChange: "transform"
            }}>

          {renderList.map((c, i) => {
          const hasVideo = Boolean(c.youtubeId);
          const isPlaying = playingIdx === i;
          return (
          <div
            key={i}
            data-case-card
            onClick={() => { if (hasVideo) setPlayingIdx(i); }}
            style={{
              flex: stacked ? "0 0 auto" : `0 0 ${cardW}px`,
              width: stacked ? "100%" : undefined,
              background: "var(--bg)", borderRadius: 20,
              border: "1px solid var(--line2)",
              overflow: "hidden",
              color: "inherit",
              cursor: hasVideo ? "pointer" : "default",
              display: "flex", flexDirection: "column",
              transition: "transform 0.25s ease, border-color 0.25s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.borderColor = "rgba(255,213,0,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "var(--line2)";
            }}>
              {/* 16:9 video frame */}
              <div style={{
              position: "relative",
              aspectRatio: "16 / 9",
              background: "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)"
            }}>
                {isPlaying ?
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${c.youtubeId}?autoplay=1&rel=0`}
                  title={c.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: "absolute", inset: 0,
                    width: "100%", height: "100%",
                    border: "none", zIndex: 3, background: "#000"
                  }} />
                :
                <React.Fragment>
                  {hasVideo ?
                  <img
                    src={`https://img.youtube.com/vi/${c.youtubeId}/maxresdefault.jpg`}
                    alt={c.title}
                    loading="lazy"
                    onLoad={(e) => {
                      // YouTube serves a tiny 120x90 grey placeholder (not a
                      // 404) when a video has no HD thumbnail — fall back to
                      // hqdefault which always has the real frame.
                      const im = e.currentTarget;
                      if (!im.dataset.fb && im.naturalWidth > 0 && im.naturalWidth <= 121) {
                        im.dataset.fb = "1";
                        im.src = `https://img.youtube.com/vi/${c.youtubeId}/hqdefault.jpg`;
                      }
                    }}
                    onError={(e) => {
                      if (!e.currentTarget.dataset.fb) {
                        e.currentTarget.dataset.fb = "1";
                        e.currentTarget.src = `https://img.youtube.com/vi/${c.youtubeId}/hqdefault.jpg`;
                      }
                    }}
                    style={{
                      position: "absolute", inset: 0,
                      width: "100%", height: "100%",
                      objectFit: "cover"
                    }} />
                  :
                  <div aria-hidden="true" style={{
                    position: "absolute", inset: 0,
                    backgroundImage: "radial-gradient(circle at 30% 50%, rgba(255,213,0,0.08), transparent 60%)"
                  }} />
                  }

                  {/* play button */}
                  <div data-play style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: 1, zIndex: 2
                }}>
                    <div className="pod-play-btn" style={{
                    position: "relative",
                    width: 68, height: 48,
                    background: "var(--accent)",
                    borderRadius: 12,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 10px 30px rgba(255,213,0,0.45)"
                  }}>
                      <span aria-hidden="true" className="pod-play-ring" style={{
                      position: "absolute", inset: -8,
                      borderRadius: 16,
                      border: "1.5px solid rgba(255,213,0,0.5)"
                    }} />
                      <div style={{
                      width: 0, height: 0,
                      borderTop: "10px solid transparent",
                      borderBottom: "10px solid transparent",
                      borderLeft: "16px solid #0A0A0A",
                      transform: "translateX(3px)"
                    }} />
                    </div>
                  </div>
                </React.Fragment>
                }
              </div>
            </div>);
        })}
          </div>
        </div>
      </div>

      <div className="wrap" style={{ marginTop: 36, marginBottom: 24 }}>
        <LogoMarquee admin={admin} />
      </div>
    </section>);

}

// ==========================================================
// LEGACY SECTIONS — copied from previous version (sections-bold-standalone.jsx)
// Renamed to avoid collisions with current Hero/HowItWorks/FAQSection/Results.
// ==========================================================

// ---------- BRIDGE MESSAGE — between Problem and Social Proof ----------

function BridgeMessage() {
  const sectionRef = React.useRef(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    if (!sectionRef.current) return;
    const io = new IntersectionObserver(
      ([e]) => {if (e.isIntersecting) setInView(true);},
      { threshold: 0.2 }
    );
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} style={{
      padding: "88px 0",
      position: "relative",
      overflow: "hidden"
    }}>
      <div aria-hidden="true" style={{
        position: "absolute", top: "30%", right: "50%", transform: "translateX(50%)",
        width: 700, height: 700,
        background: "radial-gradient(ellipse, rgba(255,213,0,0.06), transparent 65%)",
        filter: "blur(80px)", pointerEvents: "none"
      }} />

      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        {/* Tiny mono label */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12, justifyContent: "center",
          marginBottom: 28,
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(8px)",
          transition: "all 0.6s ease 0.05s"
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: "50%",
            background: "var(--accent)",
            boxShadow: "0 0 10px var(--accent)",
            animation: "studioRec 1.6s ease-in-out infinite"
          }} />
          <span className="mono" style={{
            fontSize: 11, letterSpacing: "0.28em", color: "var(--accent)", fontWeight: 700
          }}>הבעיה האמיתית</span>
        </div>

        {/* Chips — what you tried, all crossed out */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 10,
          marginBottom: 56, justifyContent: "center",
          opacity: inView ? 1 : 0,
          transition: "opacity 0.6s ease 0.15s"
        }}>
          {[
          "סרטונים קצרים עם הוק מנצח",
          "מחלק כסף בקניון בשביל עוקבים",
          "קמפיין ממומן עם תקציב גדול",
          "אינפלואנסרים ומותגי-יוקרה"].
          map((t, i) =>
          <span key={i} style={{
            padding: "10px 18px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--line2)",
            borderRadius: 999,
            fontSize: 14,
            opacity: 0.55,
            textDecoration: "line-through",
            textDecorationColor: "rgba(255,255,255,0.3)",
            transform: inView ? "translateY(0)" : "translateY(8px)",
            transition: `transform 0.5s ease ${0.2 + i * 0.06}s, opacity 0.5s ease ${0.2 + i * 0.06}s`
          }}>{t}</span>
          )}
        </div>

        {/* Big headline — bold style with yellow highlight */}
        <h2 className="display" style={{
          fontSize: "clamp(40px, 6cqw, 84px)",
          margin: "0 auto 28px", maxWidth: 1100,
          fontWeight: 900, lineHeight: 1.08, textAlign: "center",
          textWrap: "balance",
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.7s ease 0.3s, transform 0.7s cubic-bezier(0.2,0.8,0.2,1) 0.3s"
        }}>
          ניסית הכל. השקעת כסף.{" "}
          <span style={{
            color: "var(--accent)",
            background: "linear-gradient(180deg, transparent 65%, rgba(255,213,0,0.18) 65%)",
            padding: "0 8px"
          }}>ועדיין לא קונים.</span>
        </h2>

        <p style={{
          fontSize: "clamp(17px, 1.5cqw, 21px)",
          lineHeight: 1.6, margin: "0 auto 80px", maxWidth: 680,
          textAlign: "center", opacity: 0.7,
          opacity: inView ? 0.7 : 0,
          transform: inView ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.7s ease 0.45s, transform 0.7s ease 0.45s"
        }}>
          כי אי אפשר להכיר מישהו ב־30 שניות. ולקוחות לא קונים ממי שהם לא מכירים.
        </p>

        {/* Three-stat grid — bold-style yellow numerics */}
        <div className="cq-stack-2" style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0,
          maxWidth: 1100, margin: "0 auto",
          border: "1px solid var(--line2)", borderRadius: 20,
          background: "var(--card)", overflow: "hidden",
          position: "relative",
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.8s ease 0.6s, transform 0.8s cubic-bezier(0.2,0.8,0.2,1) 0.6s"
        }}>
          {/* corner brackets */}
          <span aria-hidden="true" style={{
            position: "absolute", top: 14, right: 14, width: 18, height: 18,
            borderTop: "2px solid var(--accent)", borderRight: "2px solid var(--accent)"
          }} />
          <span aria-hidden="true" style={{
            position: "absolute", bottom: 14, left: 14, width: 18, height: 18,
            borderBottom: "2px solid var(--accent)", borderLeft: "2px solid var(--accent)"
          }} />

          {[
          { n: "30", unit: "שניות", label: "תשומת לב לפוסט" },
          { n: "0%", unit: "אמון", label: "ממי שלא מכירים אותך" },
          { n: "1", unit: "שעה", label: "לבנות קשר אמיתי" }].
          map((s, i) =>
          <div key={i} style={{
            padding: "44px 32px",
            textAlign: "center",
            borderRight: i < 2 ? "1px solid var(--line2)" : "none",
            position: "relative"
          }}>
              <div className="display" style={{
              fontSize: "clamp(56px, 7cqw, 96px)",
              fontWeight: 900, lineHeight: 1,
              color: "var(--accent)",
              letterSpacing: "-0.02em"
            }}>{s.n}</div>
              <div className="mono" style={{
              fontSize: 11, letterSpacing: "0.22em",
              opacity: 0.6, marginTop: 12, fontWeight: 600
            }}>{s.unit}</div>
              <div style={{
              fontSize: 14, opacity: 0.55, marginTop: 16, lineHeight: 1.5
            }}>{s.label}</div>
            </div>
          )}
        </div>

        {/* Closing line — quiet truth */}
        <p style={{
          fontSize: "clamp(18px, 1.6cqw, 24px)",
          lineHeight: 1.5, margin: "64px auto 0", maxWidth: 760,
          textAlign: "center", fontWeight: 600,
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.7s ease 0.85s, transform 0.7s ease 0.85s"
        }}>
          כל מי שמוכר באמת —{" "}
          <span style={{ color: "var(--accent)", fontWeight: 800 }}>בנה קודם אמון</span>.
          {" "}פודקאסט נותן לקהל שלך את השעה הזאת.
        </p>
      </div>
    </section>);

}

function ProblemOld() {
  const sectionRef = React.useRef(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    if (!sectionRef.current) return;
    const io = new IntersectionObserver(
      ([e]) => {if (e.isIntersecting) setInView(true);},
      { threshold: 0.15 }
    );
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  // Ticker for the "3 years" chart
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setTick((t) => (t + 1) % 100), 60);
    return () => clearInterval(id);
  }, [inView]);

  // Stat: animated count-up
  const useCountUp = (target, duration = 1400) => {
    const [v, setV] = React.useState(0);
    React.useEffect(() => {
      if (!inView) return;
      const start = performance.now();
      let raf;
      const step = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setV(Math.round(target * eased));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      return () => cancelAnimationFrame(raf);
    }, [target, duration, inView]);
    return v;
  };

  const cpcUp = useCountUp(25); // Google Ads CPL +25% YoY (Wordstream 2024)
  const convRate = useCountUp(223); // B2B avg conversion rate 2.23% (WebFX) — shown as 2.23%
  const attention = useCountUp(47); // Avg screen attention 47s, down from 2.5min (Nielsen/Microsoft 2025)

  // Line chart for CPC rising 2022 → 2027 — LTR: '22 left (low/past), '27 right (high/future)
  const chartPoints = React.useMemo(() => {
    const vals = [0.12, 0.22, 0.34, 0.52, 0.78, 0.96];
    const years = ["'22", "'23", "'24", "'25", "'26", "'27"];
    return vals.map((v, i) => ({ v, year: years[i] }));
  }, []);

  // Chart geometry. On a narrow canvas we compress the width (and bump the
  // in-SVG font/badge sizes) so labels stay legible instead of scaling down
  // to ~28% with the whole 1080px-wide desktop chart.
  const chartBoxRef = React.useRef(null);
  const [chartW, setChartW] = React.useState(1080);
  React.useEffect(() => {
    const measure = () => {
      const el = chartBoxRef.current;
      if (!el) return;
      setChartW(el.clientWidth < 560 ? 560 : 1080);
    };
    measure();
    window.addEventListener("resize", measure);
    let ro;
    if (chartBoxRef.current && window.ResizeObserver) {
      ro = new ResizeObserver(measure);
      ro.observe(chartBoxRef.current);
    }
    return () => { window.removeEventListener("resize", measure); if (ro) ro.disconnect(); };
  }, []);

  const CHART_W = chartW;
  const CHART_H = 210;
  const chartMob = CHART_W < 700; // compressed (mobile) layout
  const pathD = React.useMemo(() => {
    const n = chartPoints.length;
    return chartPoints.
    map((p, i) => {
      const x = i / (n - 1) * CHART_W;
      const y = CHART_H - p.v * CHART_H;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).
    join(" ");
  }, [chartPoints, CHART_W]);

  const areaD = pathD + ` L ${CHART_W} ${CHART_H} L 0 ${CHART_H} Z`;

  return (
    <section ref={sectionRef} style={{ padding: "96px 0 76px", background: "var(--card)", borderTop: "1px solid var(--line2)", borderBottom: "1px solid var(--line2)", position: "relative", overflow: "hidden" }}>
      {/* atmospheric red glow — warning tone */}
      <div aria-hidden="true" style={{
        position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)",
        width: "60%", height: "60%",
        background: "radial-gradient(ellipse at center, rgba(239,68,68,0.08) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />

      <div className="wrap" style={{ position: "relative" }}>
        {/* Eyebrow tag */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12, justifyContent: "center",
          marginBottom: 28,
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 0.6s ease, transform 0.6s ease"
        }}>
          <span aria-hidden="true" style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#ef4444",
            boxShadow: "0 0 0 4px rgba(239,68,68,0.18)",
            animation: "warnPulse 1.6s ease-in-out infinite"
          }} />
          <span className="mono" style={{
            fontSize: 12, letterSpacing: "0.28em", fontWeight: 700,
            color: "#ef4444", textTransform: "uppercase"
          }}>
            אזהרה · המציאות החדשה של 2026
          </span>
        </div>

        {/* Big headline — fear tone with red highlight on consequence */}
        <h2 className="display" style={{
          fontSize: "clamp(40px, 6.4cqw, 92px)",
          margin: "0 auto 28px", maxWidth: 1180,
          fontWeight: 900, lineHeight: 0.98, textAlign: "center",
          textWrap: "balance", letterSpacing: "-0.015em"
        }}>
          <span style={{
            display: "block",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease 0.15s, transform 0.7s cubic-bezier(0.2,0.8,0.2,1) 0.15s"
          }}>
            המשחק של הפרסום הממומן השתנה.
          </span>
          <span style={{
            display: "block",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease 0.35s, transform 0.7s cubic-bezier(0.2,0.8,0.2,1) 0.35s"
          }}>
            מי שלא מבין את זה,
          </span>
          <span style={{
            display: "block",
            position: "relative",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease 0.6s, transform 0.8s cubic-bezier(0.2,0.8,0.2,1) 0.6s"
          }}>
            <span style={{
              color: "#ef4444",
              textShadow: "0 0 50px rgba(239,68,68,0.45), 0 0 90px rgba(239,68,68,0.2)",
              position: "relative",
              display: "inline-block",
              paddingInline: "0.2em"
            }}>
              ימשיך לשלם יותר ולסגור פחות.
              {/* soft underline glow */}
              <span aria-hidden="true" style={{
                position: "absolute", left: "3%", right: "3%", bottom: "-0.06em",
                height: 5,
                background: "linear-gradient(90deg, transparent, #ef4444 15%, #ef4444 85%, transparent)",
                opacity: 0.55,
                borderRadius: 3,
                filter: "blur(0.5px)"
              }} />
            </span>
          </span>
        </h2>

        {/* Sub-line — quiet, factual sting */}
        <p style={{
          fontSize: "clamp(16px, 1.5cqw, 20px)",
          lineHeight: 1.6, margin: "0 auto 64px", maxWidth: 640,
          textAlign: "center", opacity: inView ? 0.65 : 0,
          transform: inView ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.7s ease 0.85s, transform 0.7s ease 0.85s"
        }}>
          הנתונים מהשנה האחרונה לא משאירים מקום לפרשנות.
        </p>

        <style>{`
          @keyframes warnPulse {
            0%, 100% { box-shadow: 0 0 0 4px rgba(239,68,68,0.18); }
            50% { box-shadow: 0 0 0 8px rgba(239,68,68,0.05); }
          }
        `}</style>

        {/* Three live stats — restructured per reference */}
        <div className="cq-stack" style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: 18, marginBottom: 36
        }}>
          {[
          { tag: "↑ עולה", n: `+${cpcUp}%`, label: "עליית מחיר ליד בגוגל",
            desc: "כל שנה אתם משלמים יותר — ומקבלים לידים פחות רלוונטיים" },
          { tag: "↓ יורד", n: `${(convRate / 100).toFixed(2)}%`, label: "אחוז המרה ממוצע ב־B2B",
            desc: "מתוך 100 אנשים שרואים את המודעה — 98 גוללים הלאה בלי לעצור" },
          { tag: "↑ עולה", n: `96%`, label: "נוטשים את האתר שלכם",
            desc: "מתוך 100 אנשים שנכנסים — 96 עוזבים בלי להשאיר פרטים. כי הם עוד לא סומכים עליכם" }].
          map((s, i) =>
          <div key={i} className="warn-stat-card"
          style={{
            padding: "32px 26px 28px",
            background: "var(--bg)",
            border: "1px solid rgba(239,68,68,0.18)",
            borderRadius: 20,
            position: "relative", overflow: "hidden",
            textAlign: "center",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(28px)",
            transition: `opacity 0.75s ease ${1.0 + i * 0.14}s, transform 0.75s cubic-bezier(0.2,0.8,0.2,1) ${1.0 + i * 0.14}s, border-color 0.3s ease, background 0.3s ease`
          }}>
              {/* corner glow */}
              <div aria-hidden="true" style={{
              position: "absolute", top: "-40%", left: "50%", transform: "translateX(-50%)",
              width: 320, height: 320,
              background: "radial-gradient(circle, rgba(239,68,68,0.10), transparent 65%)",
              pointerEvents: "none", borderRadius: "50%",
              filter: "blur(8px)"
            }} />
              {/* tag */}
              <div className="mono" style={{
              fontSize: 11, fontWeight: 800, letterSpacing: "0.14em",
              color: "#ef4444", marginBottom: 10,
              position: "relative", zIndex: 1
            }}>{s.tag}</div>
              {/* big number */}
              <div className="display" style={{
              fontSize: "clamp(36px, 3.6cqw, 52px)",
              fontWeight: 900, lineHeight: 1, color: "#ef4444",
              marginBottom: 14,
              fontVariantNumeric: "tabular-nums",
              textShadow: "0 0 36px rgba(239,68,68,0.4)",
              letterSpacing: "-0.025em",
              position: "relative", zIndex: 1
            }}>{s.n}</div>
              {/* label */}
              <div style={{
              fontSize: 14, fontWeight: 700, marginBottom: 10,
              position: "relative", zIndex: 1
            }}>{s.label}</div>
              {/* divider */}
              <div aria-hidden="true" style={{
              width: 28, height: 1, margin: "0 auto 10px",
              background: "rgba(239,68,68,0.4)"
            }} />
              {/* description */}
              <div style={{
              fontSize: 14, lineHeight: 1.65, opacity: 0.55,
              position: "relative", zIndex: 1,
              textWrap: "pretty", maxWidth: 260, marginInline: "auto"
            }}>{s.desc}</div>
            </div>
          )}
        </div>

        <style>{`
          .warn-stat-card:hover {
            border-color: rgba(239,68,68,0.45) !important;
            transform: translateY(-4px) !important;
            background: #0d0808 !important;
          }
        `}</style>

        {/* Paragraph card — centered, climactic */}
        <div className="problem-paragraph-card" style={{
          background: "var(--bg)",
          border: "1px solid rgba(239,68,68,0.16)",
          borderRadius: 22,
          padding: "56px 56px 52px",
          marginBottom: 36,
          position: "relative", overflow: "hidden",
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.8s ease 1.6s, transform 0.8s cubic-bezier(0.2,0.8,0.2,1) 1.6s"
        }}>
          <div aria-hidden="true" style={{
            position: "absolute", top: "-30%", left: "50%", transform: "translateX(-50%)",
            width: "70%", height: "70%",
            background: "radial-gradient(ellipse, rgba(239,68,68,0.07), transparent 70%)",
            pointerEvents: "none", filter: "blur(20px)"
          }} />
          <div ref={chartBoxRef} style={{
            fontSize: "clamp(18px, 1.55cqw, 22px)",
            lineHeight: 1.85,
            textAlign: "center",
            maxWidth: 880, margin: "0 auto",
            position: "relative", zIndex: 1,
            textWrap: "pretty"
          }}>
            <p style={{ margin: "0 0 18px", opacity: 0.85 }}>
              כל בעל עסק מרגיש את זה עכשיו: <strong style={{ color: "#fff", fontWeight: 800 }}>מחירי הלידים מזנקים, אחוזי ההמרה צונחים.</strong><br />אנשים גוללים הלאה לפני שהם בכלל יודעים מי אתה.<br />זה לא מצב זמני, מחירי הלידים עולים כל שנה - <strong style={{ color: "#fff", fontWeight: 800 }}>ואין סיבה שזה יעצור.</strong><br />כל עוד אתם משלמים על תשומת לב - <strong style={{ color: "#fff", fontWeight: 800 }}>מישהו אחר יכול להציע יותר ולקחת אותה מכם.</strong><br />
            </p>
            <p className="problem-punchline" style={{
              margin: 0,
              color: "#ef4444",
              fontWeight: 800,

              textShadow: "0 0 36px rgba(239,68,68,0.5)",
              position: "relative", display: "inline-block",
              paddingInline: "0.2em", fontSize: "36px"
            }}>
              יש רק דרך אחת לצאת מהמשחק הזה.
              <span aria-hidden="true" style={{
                position: "absolute", left: "3%", right: "3%", bottom: "-0.18em",
                height: 4,
                background: "linear-gradient(90deg, transparent, #ef4444 15%, #ef4444 85%, transparent)",
                opacity: 0.55, borderRadius: 3, filter: "blur(0.5px)"
              }} />
            </p>
          </div>

          {/* divider between message + chart */}
          <div aria-hidden="true" style={{
            height: 1, margin: "48px 0 36px",
            background: "linear-gradient(90deg, transparent, rgba(239,68,68,0.28), transparent)",
            position: "relative", zIndex: 1,
            opacity: inView ? 1 : 0,
            transition: "opacity 0.6s ease 1.9s"
          }} />

          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "baseline",
            marginBottom: 28, position: "relative", zIndex: 1,
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.85s ease 1.95s, transform 0.85s cubic-bezier(0.2,0.8,0.2,1) 1.95s"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                display: "inline-block", width: 12, height: 2, background: "#ef4444",
                boxShadow: "0 0 8px rgba(239,68,68,0.7)"
              }} />
              <span className="mono" style={{
                fontSize: 12, opacity: 0.65, letterSpacing: "0.18em", fontWeight: 600
              }}>מחיר ליד ממוצע</span>
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, opacity: 0.9 }}>

            </div>
          </div>

          <svg viewBox={`0 0 ${CHART_W} ${CHART_H + 96}`}
          style={{ width: "100%", height: "auto", overflow: "visible", display: "block", position: "relative", zIndex: 1 }}>
            <defs>
              <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="lineGrad" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="rgba(239,68,68,0.55)" />
                <stop offset="55%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#fca5a5" />
              </linearGradient>
              <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" />
              </filter>
            </defs>

            {/* gridlines */}
            {[0.2, 0.4, 0.6, 0.8].map((g, i) =>
            <line key={i}
            x1={0} x2={CHART_W}
            y1={CHART_H * g} y2={CHART_H * g}
            stroke="rgba(255,255,255,0.05)"
            strokeDasharray="2 5"
            style={{
              opacity: inView ? 1 : 0,
              transition: `opacity 0.5s ease ${2.05 + i * 0.06}s`
            }} />
            )}

            {/* forecast shade — RIGHT portion (future, since LTR) */}
            <rect
              x={CHART_W * 0.6} y={0}
              width={CHART_W * 0.4} height={CHART_H}
              fill="rgba(239,68,68,0.05)"
              style={{
                transformOrigin: `${CHART_W}px 0`,
                transform: inView ? "scaleX(1)" : "scaleX(0)",
                transition: "transform 0.7s cubic-bezier(0.2,0.8,0.2,1) 2.3s"
              }} />
            <line
              x1={CHART_W * 0.6} x2={CHART_W * 0.6}
              y1={0} y2={CHART_H}
              stroke="rgba(239,68,68,0.32)"
              strokeDasharray="3 5"
              style={{
                opacity: inView ? 1 : 0,
                transition: "opacity 0.4s ease 2.6s"
              }} />
            {!chartMob &&
            <text x={CHART_W * 0.6 - 12} y={20}
            textAnchor="end"
            fill="rgba(239,68,68,0.85)"
            style={{
              fontSize: 13, fontFamily: "ui-monospace, monospace", letterSpacing: "0.12em",
              fontWeight: 700, direction: "rtl",
              opacity: inView ? 1 : 0,
              transition: "opacity 0.5s ease 2.8s"
            }}>
              תחזית →
            </text>
            }

            {/* area fill — animated reveal from right (past) to left (future) */}
            <path d={areaD} fill="url(#areaFill)" style={{
              transition: "opacity 1.4s ease 2.7s",
              opacity: inView ? 1 : 0
            }} />

            {/* main line — draws on RTL */}
            <path d={pathD} fill="none" stroke="url(#lineGrad)" strokeWidth="3.5"
            strokeLinecap="round" strokeLinejoin="round"
            filter="url(#lineGlow)"
            style={{
              strokeDasharray: 2400,
              strokeDashoffset: inView ? 0 : 2400,
              transition: "stroke-dashoffset 2.2s cubic-bezier(0.65,0,0.35,1) 2.4s"
            }} />

            {/* moving glow head */}
            {inView &&
            <circle r="6" fill="#ef4444" filter="url(#dotGlow)" opacity="0.95">
                <animateMotion dur="2.2s" begin="2.4s" fill="freeze" path={pathD} rotate="auto" />
                <animate attributeName="opacity" from="1" to="0" begin="4.5s" dur="0.5s" fill="freeze" />
              </circle>
            }

            {/* year dots */}
            {chartPoints.map((p, i) => {
              const x = i / (chartPoints.length - 1) * CHART_W;
              const y = CHART_H - p.v * CHART_H;
              const isFirst = i === 0; // '27 — high, left
              const isLast = i === chartPoints.length - 1; // '22 — low, right
              const isAnchor = isFirst || isLast;
              const dotDelay = 2.5 + (1 - i / (chartPoints.length - 1)) * 1.8;
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r={isAnchor ? 7 : 4}
                  fill={isAnchor ? "#ef4444" : "#0A0A0A"}
                  stroke="#ef4444" strokeWidth={isAnchor ? 0 : 2}
                  style={{
                    transformOrigin: `${x}px ${y}px`,
                    transform: inView ? "scale(1)" : "scale(0)",
                    transition: `transform 0.55s cubic-bezier(0.34,1.56,0.64,1) ${dotDelay}s`
                  }} />
                  {isAnchor && inView &&
                  <>
                      <circle cx={x} cy={y} r={7} fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.7">
                        <animate attributeName="r" from="7" to="26" dur="1.8s" begin={`${dotDelay + 0.4}s`} repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.7" to="0" dur="1.8s" begin={`${dotDelay + 0.4}s`} repeatCount="indefinite" />
                      </circle>
                      <circle cx={x} cy={y} r={10} fill="#ef4444" opacity="0.25" filter="url(#dotGlow)">
                        <animate attributeName="opacity" values="0.15;0.4;0.15" dur="2.2s" begin={`${dotDelay + 0.4}s`} repeatCount="indefinite" />
                      </circle>
                    </>
                  }
                  {/* year label — every year, same as desktop.
                      On mobile keep edge years middle-anchored but nudged in
                      from the SVG edge so '22 / '27 aren't clipped. */}
                  <text x={chartMob && isFirst ? x + 18 : chartMob && isLast ? x - 18 : x} y={CHART_H + (chartMob ? 40 : 28)}
                  textAnchor="middle"
                  fill={isAnchor ? "rgba(239,68,68,0.9)" : "rgba(255,255,255,0.42)"}
                  style={{
                    fontSize: chartMob ? 19 : 13, fontFamily: "ui-monospace, monospace", letterSpacing: "0.05em",
                    fontWeight: isAnchor ? 800 : 500,
                    opacity: inView ? 1 : 0,
                    transition: `opacity 0.4s ease ${dotDelay + 0.1}s`
                  }}>
                    {p.year}
                  </text>
                </g>);
            })}

            {/* LOW-LEFT badge — "שילמתם 10₪ לליד" ('22 — past) */}
            {(() => {
              const px = 0;
              const py = CHART_H - chartPoints[0].v * CHART_H;
              const badgeW = chartMob ? 232 : 188, badgeH = chartMob ? 50 : 38;
              const badgeX = px + 24;
              // Mobile: park in the free top-left corner (the line is low here)
              const badgeY = chartMob ? 12 : py + 24;
              return (
                <g style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(-10px)",
                  transition: "opacity 0.55s ease 4.0s, transform 0.55s cubic-bezier(0.2,0.8,0.2,1) 4.0s"
                }}>
                  {/* connector */}
                  <line
                    x1={badgeX + 18} x2={px + 4}
                    y1={chartMob ? badgeY + badgeH : badgeY} y2={chartMob ? py - 6 : py + 6}
                    stroke="rgba(239,68,68,0.55)" strokeWidth="1.5"
                    strokeDasharray="3 3" />
                  {/* badge */}
                  <rect x={badgeX} y={badgeY} width={badgeW} height={badgeH} rx={10}
                  fill="rgba(239,68,68,0.18)" stroke="#ef4444" strokeWidth="1.5"
                  filter="url(#lineGlow)" />
                  <text x={badgeX + badgeW / 2} y={badgeY + badgeH / 2 + (chartMob ? 8 : 6)}
                  textAnchor="middle"
                  fill="#fff"
                  style={{ fontSize: chartMob ? 23 : 15, fontWeight: 800, direction: "rtl" }}>
                    שילמתם 10₪ לליד
                  </text>
                </g>);
            })()}

            {/* HIGH-RIGHT badge — "תשלמו 300₪+ לליד" ('27 — future) */}
            {(() => {
              const lastIdx = chartPoints.length - 1;
              const px = CHART_W;
              const py = CHART_H - chartPoints[lastIdx].v * CHART_H;
              const badgeW = chartMob ? 232 : 188, badgeH = chartMob ? 50 : 38;
              const badgeX = px - badgeW - 24;
              // Mobile: park in the free bottom-right corner (the line is high here)
              const badgeY = chartMob ? CHART_H - badgeH - 4 : py - 14;
              return (
                <g style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(10px)",
                  transition: "opacity 0.55s ease 4.2s, transform 0.55s cubic-bezier(0.2,0.8,0.2,1) 4.2s"
                }}>
                  <line
                    x1={badgeX + badgeW - 18} x2={px - 4}
                    y1={chartMob ? badgeY : badgeY + badgeH} y2={py + 4}
                    stroke="rgba(239,68,68,0.55)" strokeWidth="1.5"
                    strokeDasharray="3 3" />
                  <rect x={badgeX} y={badgeY} width={badgeW} height={badgeH} rx={10}
                  fill="rgba(239,68,68,0.18)" stroke="#ef4444" strokeWidth="1.5"
                  filter="url(#lineGlow)" />
                  <text x={badgeX + badgeW / 2} y={badgeY + badgeH / 2 + (chartMob ? 8 : 6)}
                  textAnchor="middle"
                  fill="#fff"
                  style={{ fontSize: chartMob ? 23 : 15, fontWeight: 800, direction: "rtl" }}>
                    תשלמו 300₪+ לליד
                  </text>
                </g>);
            })()}
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>);

}

function SolutionOld() {
  const [hoveredPillar, setHoveredPillar] = React.useState(-1);

  // Concrete examples revealed on hover
  const PILLAR_EXAMPLES = [
  {
    icon: "🎙",
    lines: [
    "לקוח מאזין בדרך לעבודה.",
    "שומע אותך נאבק בסוגיה שגם הוא נאבק בה.",
    "מרגיש שהוא מכיר אותך חודשים לפני פגישה."]

  },
  {
    icon: "📚",
    lines: [
    "פרק על טעות נפוצה בתחום שלך.",
    "לקוח מגגל את הבעיה, מוצא את הפרק.",
    "הוא פונה אליך — לא למתחרה."]

  },
  {
    icon: "🤝",
    lines: [
    "״שמעתי את הפרק על…״.",
    "במקום ״תשכנע אותי למה אתה״.",
    "שיחת מכירה הופכת לשיחת הצטרפות."]

  }];


  return (
    <section style={{ padding: "76px 0", position: "relative", overflow: "hidden" }}>
      {/* ambient backdrop glows */}
      <div aria-hidden="true" style={{
        position: "absolute", top: "10%", right: "-10%",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,213,0,0.10), transparent 60%)",
        filter: "blur(60px)", pointerEvents: "none", zIndex: 0
      }} />
      <div aria-hidden="true" style={{
        position: "absolute", bottom: "5%", left: "-5%",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,213,0,0.06), transparent 60%)",
        filter: "blur(50px)", pointerEvents: "none", zIndex: 0
      }} />

      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        <h2 className="display solution-headline" style={{
          fontSize: "clamp(42px, 7.4cqw, 112px)",
          margin: "0 auto 48px",
          fontWeight: 900,
          textAlign: "center",
          lineHeight: 0.98,
          letterSpacing: "-0.02em",
          textWrap: "balance",
          maxWidth: 1180,
          position: "relative"
        }}>
          <span style={{ display: "block", opacity: 0.96 }}>
            <span style={{ position: "relative", display: "inline-block" }}>
              מפסיקים{" "}
              <span style={{
                position: "relative",
                display: "inline-block",
                color: "#fff"
              }}>
                למכור בכוח
                {/* strikethrough effect */}
                <span aria-hidden="true" style={{
                  position: "absolute", left: "-4%", right: "-4%",
                  top: "52%",
                  height: 6,
                  background: "linear-gradient(90deg, transparent, #ff3b3b 12%, #ff3b3b 88%, transparent)",
                  transform: "rotate(-2deg)",
                  borderRadius: 3,
                  opacity: 0.85,
                  boxShadow: "0 0 16px rgba(255,59,59,0.5)"
                }} />
              </span>
            </span>
          </span>

          <span style={{ display: "block", position: "relative" }}>
            <span style={{
              color: "var(--accent)",
              textShadow: "0 0 50px rgba(255,213,0,0.45), 0 0 90px rgba(255,213,0,0.2)",
              position: "relative",
              display: "inline-block",
              paddingInline: "0.2em"
            }}>
              גורמים ללקוחות לבוא אליכם.
              {/* soft underline */}
              <span aria-hidden="true" style={{
                position: "absolute", left: "3%", right: "3%", bottom: "-0.06em",
                height: 5,
                background: "linear-gradient(90deg, transparent, var(--accent) 15%, var(--accent) 85%, transparent)",
                opacity: 0.55,
                borderRadius: 3,
                filter: "blur(0.5px)"
              }} />
            </span>
          </span>
        </h2>

        {/* Lead paragraph — centered, hierarchic */}
        <div style={{ textAlign: "center", maxWidth: 880, margin: "0 auto 64px" }}>
          <p style={{
            fontSize: "clamp(18px, 1.6cqw, 22px)",
            lineHeight: 1.6,
            opacity: 0.9,
            margin: 0,
            textWrap: "balance"
          }}>
            פודקאסט הוא הכלי השיווקי <span style={{ color: "var(--accent)", fontWeight: 700 }}>היחיד</span> שמייצר שלושה דברים{" "}
            <span style={{ color: "#fff", fontWeight: 700, borderBottom: "2px solid rgba(255,213,0,0.5)", paddingBottom: 2 }}>בו־זמנית</span>,
            <br />
            שאף פורמט אחר לא נותן:
          </p>
        </div>

        {/* Interactive Pillar cards */}
        <div className="cq-stack" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {PILLARS.map((p, i) => {
            const isHover = hoveredPillar === i;
            const ex = PILLAR_EXAMPLES[i];
            return (
              <div
                key={i}
                onMouseEnter={() => setHoveredPillar(i)}
                onMouseLeave={() => setHoveredPillar(-1)}
                style={{
                  background: isHover ? "#111" : "var(--card)",
                  borderRadius: 20, padding: 36,
                  border: `1px solid ${isHover ? "rgba(255,213,0,0.45)" : "var(--line2)"}`,
                  position: "relative", overflow: "hidden",
                  cursor: "pointer",
                  minHeight: 360,
                  display: "flex", flexDirection: "column",
                  transform: isHover ? "translateY(-6px)" : "translateY(0)",
                  boxShadow: isHover ?
                  "0 20px 50px -20px rgba(255,213,0,0.28)" :
                  "0 0 0 0 rgba(0,0,0,0)",
                  transition: "transform 0.35s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.35s ease, border-color 0.3s ease, background 0.3s ease"
                }}>
                
                {/* Giant ghost number */}
                <div style={{
                  position: "absolute", left: -20, bottom: -60,
                  fontFamily: "var(--font-display)", fontWeight: 900,
                  fontSize: 200, color: "var(--accent)",
                  opacity: isHover ? 0.16 : 0.08, lineHeight: 1,
                  transition: "opacity 0.4s ease, transform 0.4s ease",
                  transform: isHover ? "translate(-4px, -4px)" : "translate(0, 0)",
                  pointerEvents: "none"
                }}>{p.n}</div>

                <div className="mono" style={{
                  fontSize: 12, color: "var(--accent)",
                  marginBottom: 20, position: "relative", zIndex: 2
                }}>{p.n}</div>

                <h3 className="display" style={{
                  fontSize: 30, margin: "0 0 16px",
                  fontWeight: 900,
                  position: "relative", zIndex: 2,
                  color: isHover ? "var(--accent)" : "#fff",
                  transition: "color 0.3s ease"
                }}>{p.title}</h3>

                {/* Base body — always visible */}
                <p style={{
                  fontSize: 16, lineHeight: 1.65,
                  opacity: 0.85,
                  margin: "0 0 24px", position: "relative", zIndex: 2,
                  whiteSpace: "pre-line"
                }}>{p.body}</p>

                {/* Example reveal — always visible */}
                <div style={{
                  position: "relative",
                  zIndex: 2,
                  pointerEvents: "none",
                  marginTop: "auto"
                }}>
                  <div className="mono" style={{
                    fontSize: 10, letterSpacing: "0.2em",
                    color: "var(--accent)", opacity: 0.8, marginBottom: 12
                  }}>תרחיש אמיתי</div>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                    {ex.lines.map((l, li) =>
                    <li key={li} style={{
                      fontSize: 14, lineHeight: 1.5, opacity: 0.85,
                      display: "flex", gap: 10, alignItems: "start"
                    }}>
                        <span style={{
                        width: 4, height: 4, borderRadius: "50%",
                        background: "var(--accent)", flexShrink: 0, marginTop: 8
                      }} />
                        {l}
                      </li>
                    )}
                  </ul>
                </div>

                {/* Corner hint */}
                <div style={{
                  position: "absolute", top: 20, left: 20,
                  width: 32, height: 32, borderRadius: "50%",
                  border: `1px solid ${isHover ? "var(--accent)" : "var(--line2)"}`,
                  background: isHover ? "var(--accent)" : "transparent",
                  color: isHover ? "#0A0A0A" : "rgba(255,255,255,0.4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 900,
                  transform: isHover ? "rotate(-45deg)" : "rotate(0)",
                  transition: "all 0.35s cubic-bezier(0.2,0.8,0.2,1)",
                  zIndex: 3
                }}>←</div>
              </div>);

          })}
        </div>

        {/* Closing pull quote — refined, restrained */}
        <ClosingPullQuote />
      </div>

      <style>{`
        @keyframes pushFade {
          0%, 20% { opacity: 0.9; }
          60%, 100% { opacity: 0.25; }
        }
        @keyframes pullGlow {
          0%, 30% { opacity: 0.45; text-shadow: 0 0 0 transparent; }
          70%, 100% { opacity: 1; text-shadow: 0 0 14px rgba(255,213,0,0.5); }
        }
        @keyframes arrowSlide {
          0%, 20%    { transform: translateX(10px); opacity: 0.3; }
          50%        { transform: translateX(0);    opacity: 1;   }
          80%, 100%  { transform: translateX(-10px); opacity: 0.3; }
        }
      `}</style>
    </section>);

}

function ClosingPullQuote() {
  const ref = React.useRef(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => {if (e.isIntersecting) {setInView(true);io.disconnect();}},
      { threshold: 0.35 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="pullquote" style={{
      marginTop: 80,
      position: "relative",
      padding: "40px 24px",
      textAlign: "center",
      maxWidth: 1100,
      marginLeft: "auto",
      marginRight: "auto"
    }}>
      {/* Glow halo behind quote */}
      <div aria-hidden="true" style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 600, height: 400,
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(255,213,0,0.10), transparent 65%)",
        filter: "blur(60px)",
        opacity: inView ? 1 : 0,
        transition: "opacity 1.2s ease 0.3s",
        pointerEvents: "none",
        zIndex: 0
      }} />

      {/* Massive quote glyph */}
      <div aria-hidden="true" className="pullquote-glyph" style={{
        position: "relative",
        fontSize: 140, lineHeight: 0.6,
        fontFamily: "Georgia, serif",
        fontWeight: 900,
        color: "var(--accent)",
        opacity: inView ? 0.85 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 1s ease 0.2s, transform 1s cubic-bezier(0.2,0.8,0.2,1) 0.2s",
        userSelect: "none",
        textShadow: "0 0 40px rgba(255,213,0,0.5)",
        marginBottom: 8,
        zIndex: 1
      }}></div>

      {/* Eyebrow */}
      <div style={{
        position: "relative",
        display: "inline-flex", alignItems: "center", gap: 10,
        marginBottom: 18,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
        zIndex: 1
      }}>
        <span style={{
          display: "inline-block",
          width: inView ? 32 : 0, height: 1.5,
          background: "var(--accent)",
          transition: "width 0.7s cubic-bezier(0.2,0.8,0.2,1) 0.35s"
        }} />
        <span className="mono pullquote-eyebrow" style={{
          fontSize: 14, fontWeight: 800,
          letterSpacing: "0.24em",
          color: "var(--accent)",
          textShadow: "0 0 14px rgba(255,213,0,0.45)"
        }}>השורה התחתונה</span>
        <span style={{
          display: "inline-block",
          width: inView ? 32 : 0, height: 1.5,
          background: "var(--accent)",
          transition: "width 0.7s cubic-bezier(0.2,0.8,0.2,1) 0.35s"
        }} />
      </div>

      {/* Quote */}
      <p className="display pullquote-text" style={{
        position: "relative",
        fontSize: "clamp(28px, 3.6cqw, 52px)",
        lineHeight: 1.05,
        margin: 0,
        fontWeight: 800,
        letterSpacing: "-0.015em",
        color: "rgba(255,255,255,0.95)",
        textWrap: "balance",
        zIndex: 1
      }}>
        <AnimatedLine inView={inView} delay={250}>
          זה בדיוק ההבדל בין{" "}
          <span style={{
            position: "relative",
            display: "inline-block",
            color: "rgba(255,255,255,0.95)",
            fontWeight: 800
          }}>
            לקוח שמתמקח על כל שקל
            <span aria-hidden="true" style={{
              position: "absolute",
              left: "-3%", right: "-3%",
              top: "52%",
              height: 5,
              background: "linear-gradient(90deg, transparent, #ff3b3b 12%, #ff3b3b 88%, transparent)",
              transform: inView ? "scaleX(1)" : "scaleX(0)",
              transformOrigin: "right",
              transition: "transform 0.9s cubic-bezier(0.2,0.8,0.2,1) 0.7s",
              borderRadius: 3,
              opacity: 0.9,
              boxShadow: "0 0 14px rgba(255,59,59,0.55)"
            }} />
          </span>,
        </AnimatedLine>
        <br />
        <AnimatedLine inView={inView} delay={450}>
          ללקוח ששואל{" "}
          <span style={{
            position: "relative",
            color: "var(--accent)",
            fontWeight: 900,
            whiteSpace: "nowrap",
            textShadow: "0 0 30px rgba(255,213,0,0.45)"
          }}>
            איפה להעביר את התשלום
            <span aria-hidden="true" style={{
              position: "absolute",
              left: 0, right: 0, bottom: "-0.08em",
              height: 4,
              background: "linear-gradient(90deg, transparent, var(--accent) 10%, var(--accent) 90%, transparent)",
              transformOrigin: "right",
              transform: inView ? "scaleX(1)" : "scaleX(0)",
              transition: "transform 0.9s cubic-bezier(0.2,0.8,0.2,1) 0.95s",
              borderRadius: 2,
              boxShadow: "0 0 12px rgba(255,213,0,0.6)"
            }} />
          </span>.
        </AnimatedLine>
      </p>
    </div>);

}

function AnimatedLine({ children, inView, delay = 0 }) {
  return (
    <span style={{
      display: "inline-block",
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(14px)",
      filter: inView ? "blur(0)" : "blur(4px)",
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.2,0.8,0.2,1) ${delay}ms, filter 0.7s ease ${delay}ms`
    }}>
      {children}
    </span>);

}

function CTAInline({ onCTAClick, label = "בוא נדבר על הפודקאסט שלך ←" }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
      <button className="btn btn-primary" onClick={onCTAClick} style={{ padding: "22px 36px", fontSize: 17 }}>
        {label}
      </button>
    </div>);

}

function ServicesAIStats() {
  const ref = React.useRef(null);
  const [inView, setInView] = React.useState(false);
  const [counts, setCounts] = React.useState([0, 0, 0, 0]);

  const STATS = [
  { value: 12, suffix: "", label: "רילסים מכל פרק", sub: "ממוצע — לפעמים יותר" },
  { value: 100, suffix: "%", label: "מהטקסט מנותח ע״י AI", sub: "Claude · GPT · Descript" },
  { value: 8, suffix: "h", label: "עבודה ידנית שנחסכה", sub: "מול עורך אנושי שרק מסתכל" },
  { value: 340, suffix: "%", label: "עלייה ב־reach ממוצע", sub: "מול פרק שלא מפורק" }];


  React.useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => {if (e.isIntersecting) setInView(true);},
      { threshold: 0.3 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  React.useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1600;
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setCounts(STATS.map((s) => Math.round(s.value * eased)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  return (
    <div ref={ref} style={{
      marginTop: 24,
      position: "relative", zIndex: 2,
      borderRadius: 14,
      overflow: "hidden",
      border: "1px solid rgba(255,213,0,0.18)",
      background: "linear-gradient(180deg, rgba(255,213,0,0.03), rgba(255,213,0,0.01))"
    }}>
      {/* AI scanning line — sweeps across continuously */}
      <div style={{
        position: "absolute", top: 0, bottom: 0, width: 2,
        background: "linear-gradient(180deg, transparent, var(--accent), transparent)",
        boxShadow: "0 0 24px rgba(255,213,0,0.6)",
        animation: inView ? "aiScan 3.4s linear infinite" : "none",
        pointerEvents: "none"
      }} />

      {/* Header strip */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 18px",
        borderBottom: "1px solid rgba(255,213,0,0.12)",
        background: "rgba(255,213,0,0.04)"
      }}>
        <div className="mono" style={{ fontSize: 11, letterSpacing: "0.2em", color: "var(--accent)", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            display: "inline-block", width: 8, height: 8, borderRadius: "50%",
            background: "var(--accent)",
            boxShadow: "0 0 10px var(--accent)",
            animation: "aiBlink 1.2s ease-in-out infinite"
          }} />
          LIVE · AI ANALYSIS
        </div>
        <div className="mono" style={{ fontSize: 11, opacity: 0.5, letterSpacing: "0.15em" }}>
          BENCHMARK · 2024–25
        </div>
      </div>

      <div className="cq-stack-2" style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 0
      }}>
        {STATS.map((s, i) =>
        <div key={i} style={{
          padding: "26px 22px",
          borderRight: i < STATS.length - 1 ? "1px solid rgba(255,213,0,0.12)" : "none",
          position: "relative",
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(12px)",
          transition: `opacity 0.5s ease ${0.1 + i * 0.1}s, transform 0.6s cubic-bezier(0.2,0.8,0.2,1) ${0.1 + i * 0.1}s`
        }}>
            <div style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "clamp(38px, 4.4cqw, 56px)",
            lineHeight: 1,
            color: "var(--accent)",
            letterSpacing: "-0.02em",
            fontVariantNumeric: "tabular-nums",
            marginBottom: 10,
            display: "flex", alignItems: "baseline", gap: 2
          }}>
              {counts[i]}{s.suffix}
            </div>
            <div style={{
            fontSize: 14, fontWeight: 700, lineHeight: 1.3,
            marginBottom: 4, color: "#fff"
          }}>
              {s.label}
            </div>
            <div className="mono" style={{
            fontSize: 11, opacity: 0.5, letterSpacing: "0.05em"
          }}>
              {s.sub}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes aiScan {
          0%   { right: -2px; }
          100% { right: 100%; }
        }
        @keyframes aiBlink {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.3; }
        }
      `}</style>
    </div>);

}

function ServicesOld({ onCTAClick }) {
  return (
    <section style={{ padding: "76px 0 52px", background: "var(--card)", borderTop: "1px solid var(--line2)", borderBottom: "1px solid var(--line2)" }}>
      <div className="wrap">
        <div style={{ textAlign: "center", marginBottom: 24, maxWidth: 1100, marginLeft: "auto", marginRight: "auto" }}>
          <h2 className="display" style={{
            fontSize: "clamp(40px, 6cqw, 84px)",
            margin: 0, fontWeight: 900, lineHeight: 1,
            textWrap: "balance"
          }}>
            <span style={{ display: "block", opacity: 0.92 }}>
              אתם מדברים.
            </span>
            <span style={{ display: "block", position: "relative" }}>
              <span style={{
                color: "var(--accent)",
                textShadow: "0 0 50px rgba(255,213,0,0.45), 0 0 90px rgba(255,213,0,0.2)",
                position: "relative",
                display: "inline-block"
              }}>
                אנחנו דואגים לכל השאר.
                <span aria-hidden="true" style={{
                  position: "absolute", left: "3%", right: "3%", bottom: "-0.06em",
                  height: 5,
                  background: "linear-gradient(90deg, transparent, var(--accent) 15%, var(--accent) 85%, transparent)",
                  opacity: 0.55,
                  borderRadius: 3,
                  filter: "blur(0.5px)"
                }} />
              </span>
            </span>
          </h2>
        </div>
        <p style={{ fontSize: 19, lineHeight: 1.7, opacity: 0.85, maxWidth: 760, margin: "0 auto 64px", textAlign: "center", textWrap: "balance" }}>
          אתה לא צריך סטודיו. לא צריך עורך. לא צריך לדעת איך מעלים פרק לספוטיפיי או איך מעצבים thumbnail ליוטיוב. {"\n"}
          אנחנו בונים את כל המכונה.
        </p>

        <div className="cq-stack" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 20 }}>
          {SERVICES.map((s, i) => {
            const span = s.highlight ? 6 : 3;
            return (
              <ServiceCard key={i} s={s} i={i} span={span}>
                {s.highlight && false &&
                <div className="mono" style={{
                  position: "absolute", top: 20, left: 20,
                  padding: "6px 12px", background: "var(--accent)", color: "#0A0A0A",
                  borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em"
                }}>

                </div>
                }
                <div style={{
                  position: "absolute", left: -10, bottom: -60,
                  fontFamily: "var(--font-display)", fontWeight: 900,
                  fontSize: s.highlight ? 260 : 180, color: "var(--accent)",
                  opacity: s.highlight ? 0.12 : 0.07, lineHeight: 1
                }}>{s.n}</div>

                <div className="mono" style={{ fontSize: 12, color: "var(--accent)", marginBottom: 18, position: "relative", zIndex: 2 }}>
                  {s.n}
                </div>
                <h3 className="display" style={{
                  fontSize: 28,
                  margin: "0 0 14px", fontWeight: 900,
                  position: "relative", zIndex: 2, textAlign: "center"

                }}>
                  {s.title}
                </h3>
                <p style={{
                  fontSize: 15,
                  lineHeight: 1.65, opacity: 0.85, margin: 0,
                  position: "relative", zIndex: 2,
                  textAlign: "center"
                }}>
                  {s.body}
                </p>
                {s.extra &&
                <>
                    <div style={{
                    marginTop: 24, padding: 24,
                    background: "rgba(255,213,0,0.08)",
                    border: "1px solid rgba(255,213,0,0.25)",
                    borderRadius: 14,
                    position: "relative", zIndex: 2
                  }}>
                      <p style={{ fontSize: 16, lineHeight: 1.65, margin: 0, opacity: 0.95 }}>
                        <strong style={{ color: "var(--accent)" }}>כאן מתחיל ההבדל שלנו:</strong>
                        {" "}
                        אנחנו לא מחפשים את הרגעים החזקים בעין. אנחנו משתמשים ב־Descript, GPT ו־Claude כדי לנתח את כל הטקסט —
                        ולזהות בדיוק את המשפטים, הסיפורים והרגעים שיעצרו גלילה. כל רגע ויראלי בפרק — נזהה אותו ונוציא ממנו מקסימום.
                      </p>
                    </div>
                  </>
                }
              </ServiceCard>);

          })}
        </div>

      </div>
    </section>);

}

function ServiceCard({ s, i, span, children }) {
  const ref = React.useRef(null);
  const [inView, setInView] = React.useState(false);
  const [isHover, setIsHover] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => {if (e.isIntersecting) {setInView(true);io.disconnect();}},
      { threshold: 0.2 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const delay = 0.08 * i;

  return (
    <div
      ref={ref}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      style={{
        gridColumn: `span ${span}`,
        background: "var(--bg)",
        borderRadius: 20,
        padding: 32,
        border: `1px solid ${isHover ? "var(--accent)" : "var(--line2)"}`,
        position: "relative",
        overflow: "hidden",
        opacity: inView ? 1 : 0,
        transform: inView ?
        isHover ? "translateY(-6px)" : "translateY(0)" :
        "translateY(24px)",
        boxShadow: isHover ?
        "0 24px 60px -20px rgba(255,213,0,0.35), 0 0 0 1px rgba(255,213,0,0.2) inset" :
        "0 0 0 0 rgba(0,0,0,0)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s cubic-bezier(0.2,0.8,0.2,1) ${delay}s, border-color 0.3s ease, box-shadow 0.35s ease`,
        cursor: "default"
      }}>
      {React.Children.map(children, (child) => {
        if (!child) return child;
        // Inject hover style into the giant number div (the one with fontFamily display)
        if (child.props && child.props.style && child.props.style.fontFamily === "var(--font-display)" && child.props.style.fontWeight === 900) {
          return React.cloneElement(child, {
            style: {
              ...child.props.style,
              opacity: isHover ? s.highlight ? 0.22 : 0.16 : s.highlight ? 0.12 : 0.07,
              transform: isHover ? "translate(-6px, -8px)" : "translate(0, 0)",
              transition: "opacity 0.4s ease, transform 0.5s cubic-bezier(0.2,0.8,0.2,1)"
            }
          });
        }
        return child;
      })}
    </div>);

}

function HowItWorksInteractive() {
  const [active, setActive] = React.useState(0);
  const [hover, setHover] = React.useState(-1);

  // Auto-advance active step every 4.5s, unless user is hovering
  React.useEffect(() => {
    if (hover >= 0) return;
    const id = setInterval(() => setActive((a) => (a + 1) % STEPS.length), 4500);
    return () => clearInterval(id);
  }, [hover]);

  const shown = hover >= 0 ? hover : active;
  // progress line fill: 0 → 0%, 1 → 50%, 2 → 100%
  const progress = shown / (STEPS.length - 1) * 100;

  return (
    <section id="how" style={{ padding: "56px 0 76px" }}>
      <div className="wrap">
        <div style={{ textAlign: "center", marginBottom: 64, maxWidth: 1000, marginLeft: "auto", marginRight: "auto" }}>
          <h2 className="display" style={{
            fontSize: "clamp(36px, 5.5cqw, 64px)",
            margin: 0, fontWeight: 900, lineHeight: 1,
            textWrap: "balance"
          }}>
            <span style={{ display: "block", opacity: 0.92 }}>
              שלושה שלבים.
            </span>
            <span style={{ display: "block", position: "relative" }}>
              <span style={{
                color: "var(--accent)",
                textShadow: "0 0 50px rgba(255,213,0,0.45), 0 0 90px rgba(255,213,0,0.2)",
                position: "relative",
                display: "inline-block"
              }}>
                ואתה כמעט לא מרגיש את זה.
                <span aria-hidden="true" style={{
                  position: "absolute", left: "3%", right: "3%", bottom: "-0.06em",
                  height: 5,
                  background: "linear-gradient(90deg, transparent, var(--accent) 15%, var(--accent) 85%, transparent)",
                  opacity: 0.55,
                  borderRadius: 3,
                  filter: "blur(0.5px)"
                }} />
              </span>
            </span>
          </h2>
          <div className="mono" style={{ fontSize: 12, opacity: 0.5, letterSpacing: "0.15em", marginTop: 20 }}>
            {String(shown + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
          </div>
        </div>

        {/* Horizontal timeline on desktop, stack on mobile */}
        <div style={{ position: "relative" }}>
          {/* Base line */}
          <div style={{
            position: "absolute", top: 68, right: "12%", left: "12%", height: 2,
            background: "rgba(255,213,0,0.12)",
            zIndex: 0
          }} />
          {/* Animated progress line — in RTL, grows from right to left */}
          <div style={{
            position: "absolute", top: 67, right: "12%", height: 4,
            width: `calc((100% - 24%) * ${progress / 100})`,
            background: "linear-gradient(to left, var(--accent), #FFE55C)",
            boxShadow: "0 0 20px rgba(255,213,0,0.6)",
            zIndex: 0,
            transition: "width 0.7s cubic-bezier(0.65, 0, 0.35, 1)",
            borderRadius: 2
          }} />

          <div className="cq-stack" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, position: "relative", zIndex: 1 }}>
            {STEPS.map((s, i) => {
              const isActive = shown === i;
              const reached = i <= shown;
              const isHovering = hover === i;
              return (
                <div
                  key={i}
                  className="step-card"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(-1)}
                  onClick={() => setActive(i)}
                  style={{
                    background: isActive ? "#111" : "var(--card)",
                    borderRadius: 20,
                    padding: 32,
                    paddingTop: 40,
                    border: isActive ? "1px solid rgba(255,213,0,0.5)" : "1px solid var(--line2)",
                    position: "relative",
                    overflow: "hidden",
                    cursor: "pointer",
                    transform: isActive ? "translateY(-8px)" : isHovering ? "translateY(-4px)" : "translateY(0)",
                    boxShadow: isActive ?
                    "0 24px 60px -20px rgba(255,213,0,0.35), 0 0 0 1px rgba(255,213,0,0.2) inset" :
                    "0 0 0 0 rgba(0,0,0,0)",
                    transition: "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s ease, border-color 0.3s ease, background 0.3s ease"
                  }}>

                  {/* Scanline sweep on hover */}
                  <div aria-hidden="true" style={{
                    position: "absolute",
                    top: 0, bottom: 0,
                    width: 80,
                    background: "linear-gradient(90deg, transparent, rgba(255,213,0,0.18), transparent)",
                    transform: "skewX(-20deg)",
                    pointerEvents: "none",
                    zIndex: 1,
                    opacity: isHovering ? 1 : 0,
                    animation: isHovering ? "stepScan 1.6s ease-out infinite" : "none"
                  }} />
                  
                  {/* Pulsing dot on timeline */}
                  <div style={{
                    position: "relative",
                    width: 18, height: 18, borderRadius: "50%",
                    background: reached ? "var(--accent)" : "#2a2a2a",
                    marginBottom: 24,
                    boxShadow: isActive ?
                    "0 0 0 5px #0A0A0A, 0 0 0 6px var(--accent), 0 0 22px rgba(255,213,0,0.7)" :
                    "0 0 0 5px #0A0A0A",
                    transition: "background 0.3s ease, box-shadow 0.3s ease"
                  }}>
                    {isActive &&
                    <span style={{
                      position: "absolute", inset: -4, borderRadius: "50%",
                      border: "2px solid var(--accent)",
                      animation: "cutsPulse 1.6s ease-out infinite",
                      pointerEvents: "none"
                    }} />
                    }
                  </div>

                  {/* Giant ghost number */}
                  <div style={{
                    position: "absolute", left: -20, bottom: -60,
                    fontFamily: "var(--font-display)", fontWeight: 900,
                    fontSize: 200,
                    color: "var(--accent)",
                    opacity: isActive ? 0.18 : 0.06,
                    lineHeight: 1,
                    transition: "opacity 0.4s ease, transform 0.6s ease",
                    transform: isActive ? "translate(-6px, -4px)" : "translate(0, 0)",
                    pointerEvents: "none"
                  }}>{s.n}</div>

                  <div className="mono" style={{
                    fontSize: 12,
                    color: "var(--accent)",
                    marginBottom: 16,
                    position: "relative", zIndex: 2,
                    letterSpacing: "0.15em",
                    opacity: reached ? 1 : 0.6
                  }}>STEP {s.n}</div>

                  <h3 className="display" style={{
                    fontSize: 32, margin: "0 0 16px",
                    fontWeight: 900,
                    position: "relative", zIndex: 2,
                    color: isActive ? "var(--accent)" : "#fff",
                    transition: "color 0.3s ease"
                  }}>{s.title}</h3>

                  <p style={{
                    fontSize: 16, lineHeight: 1.65,
                    opacity: isActive ? 0.95 : 0.7,
                    margin: 0,
                    position: "relative", zIndex: 2,
                    transition: "opacity 0.3s ease"
                  }}>{s.desc}</p>

                  {/* Arrow reveal */}
                  <div style={{
                    position: "absolute", bottom: 24, left: 28,
                    fontSize: 22, color: "var(--accent)",
                    fontWeight: 900,
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateX(0)" : "translateX(8px)",
                    transition: "opacity 0.3s ease, transform 0.3s ease",
                    zIndex: 2
                  }}>←</div>
                </div>);

            })}
          </div>

          {/* Step dots nav */}
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 48 }}>
            {STEPS.map((_, i) =>
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`שלב ${i + 1}`}
              style={{
                width: shown === i ? 32 : 10,
                height: 10, borderRadius: 5,
                background: shown === i ? "var(--accent)" : "rgba(255,255,255,0.15)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "width 0.4s cubic-bezier(0.65, 0, 0.35, 1), background 0.3s ease"
              }} />

            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cutsPulse {
          0%   { transform: scale(1);   opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes stepScan {
          0%   { transform: translateX(-120%) skewX(-20deg); }
          100% { transform: translateX(420%) skewX(-20deg); }
        }
      `}</style>
    </section>);

}

function WhoItsForOld() {
  const sectionRef = React.useRef(null);
  const [inView, setInView] = React.useState(false);
  const [revealed, setRevealed] = React.useState(false);

  React.useEffect(() => {
    if (!sectionRef.current) return;
    const io = new IntersectionObserver(
      ([e]) => {if (e.isIntersecting) setInView(true);},
      { threshold: 0.15 }
    );
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  React.useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setRevealed(true), 1100);
    return () => clearTimeout(t);
  }, [inView]);

  const whoHoverTransition = "transform 0.32s cubic-bezier(0.2,0.8,0.2,1), border-color 0.3s ease, box-shadow 0.35s ease, opacity 0.3s ease";

  return (
    <section ref={sectionRef} style={{ padding: "76px 0", background: "var(--card)", borderTop: "1px solid var(--line2)", borderBottom: "1px solid var(--line2)", overflow: "hidden" }}>
      <div className="wrap" style={{ maxWidth: 1100 }}>
        <div style={{ textAlign: "center", marginBottom: 56, maxWidth: 1000, marginLeft: "auto", marginRight: "auto" }}>
          <h2 className="display" style={{
            fontSize: "clamp(36px, 5.5cqw, 64px)",
            margin: 0, fontWeight: 900, lineHeight: 1,
            textWrap: "balance"
          }}>
            <span style={{ display: "block", opacity: 0.92 }}>
              פודקאסט לא מתאים לכולם.
            </span>
            <span style={{ display: "block", position: "relative" }}>
              <span style={{ opacity: 0.92 }}>אבל אם אתם כאן </span><span style={{
                color: "var(--accent)",
                textShadow: "0 0 50px rgba(255,213,0,0.45), 0 0 90px rgba(255,213,0,0.2)",
                position: "relative",
                display: "inline-block"
              }}>
                כנראה שזה בדיוק בשבילכם.
                <span aria-hidden="true" style={{
                  position: "absolute", left: "3%", right: "3%", bottom: "-0.06em",
                  height: 5,
                  background: "linear-gradient(90deg, transparent, var(--accent) 15%, var(--accent) 85%, transparent)",
                  opacity: 0.55,
                  borderRadius: 3,
                  filter: "blur(0.5px)"
                }} />
              </span>
            </span>
          </h2>
        </div>

        <div className="cq-stack" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginBottom: 80
        }}>
          {[
          {
            boldYellow: "יועצים ומומחים",
            boldRest: "שמוכרים שירות יקר",
            body: "לקוח שמגיע אחרי 10 פרקים שווה פי 3 מליד קר — הוא כבר מאמין לכם לפני שדיברתם."
          },
          {
            boldYellow: "בעלי עסקים",
            boldRest: "עם מחזור מכירות ארוך",
            body: "כל ליד קר עולה לכם זמן וכסף. פודקאסט מחמם אותו לפני שהוא מגיע אליכם."
          },
          {
            boldYellow: "מומחים",
            boldRest: "שרוצים לבנות מותג אישי",
            body: "שרוצים שהשוק יכיר אותם — לא רק את השירות שהם מוכרים."
          },
          {
            boldYellow: "אנשי מקצוע",
            boldRest: "שהמוניטין הוא הנכס שלהם",
            body: "רואי חשבון, עורכי דין, אדריכלים — שהמוניטין שלהם שווה יותר מכל פרסומת."
          }].
          map((c, i) => {
            const delay = 0.1 + i * 0.08;
            return (
              <div key={i} className="who-card" style={{
                borderRadius: 18,
                padding: "30px 32px 28px",
                position: "relative",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(16px)",
                transition: revealed ? whoHoverTransition : `opacity 0.6s ease ${delay}s, transform 0.6s cubic-bezier(0.2,0.8,0.2,1) ${delay}s`,
                ["--who-delay"]: `${i * 0.7}s`
              }}>
                <span aria-hidden="true" className="who-card__glow" />
                <span aria-hidden="true" className="who-card__edge" />
                <span aria-hidden="true" className="who-card__corner who-card__corner--tr" />
                <span aria-hidden="true" className="who-card__corner who-card__corner--bl" />
                <span aria-hidden="true" className="who-card__bar" />
                <span className="who-card__index mono" aria-hidden="true">{`0${i + 1} / 04`}</span>
                <h3 className="display" style={{
                  fontSize: "clamp(22px, 2cqw, 28px)",
                  fontWeight: 800, margin: "20px 0 10px",
                  lineHeight: 1.3, position: "relative", zIndex: 1,
                  display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap"
                }}>
                  <span aria-hidden="true" className="who-card__dot" />
                  <span>
                    <span style={{
                      color: "var(--accent)",
                      textShadow: "0 0 22px rgba(255,213,0,0.25)"
                    }}>{c.boldYellow}</span>{" "}
                    <span>{c.boldRest}</span>
                  </span>
                </h3>
                <p style={{
                  fontSize: 15, lineHeight: 1.65, color: "rgba(255,255,255,0.62)",
                  margin: 0, position: "relative", zIndex: 1
                }}>
                  {c.body}
                </p>
              </div>);
          })}
        </div>

        <InteractiveVerdictOld />
      </div>

      <style>{`
        @keyframes whoPulse {
          0%   { box-shadow: 0 0 0 0 rgba(255,213,0,0.5); }
          50%  { box-shadow: 0 0 0 14px rgba(255,213,0,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,213,0,0); }
        }

        @keyframes whoFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-3px); }
        }

        .who-card {
          background:
            radial-gradient(120% 80% at 100% 0%, rgba(255, 213, 0, 0.045), transparent 55%),
            linear-gradient(180deg, #131313 0%, #0E0E0E 60%, #0C0C0C 100%);
          border: 1px solid var(--line2);
          overflow: hidden;
          isolation: isolate;
          will-change: transform, border-color, box-shadow;
        }

        /* soft inner glow that intensifies on hover */
        .who-card__glow {
          position: absolute;
          top: -40%; right: -25%;
          width: 80%; height: 120%;
          background: radial-gradient(ellipse at center, rgba(255,213,0,0.08), transparent 60%);
          filter: blur(28px);
          opacity: 0.55;
          pointer-events: none;
          transition: opacity 0.45s ease, transform 0.6s ease;
          z-index: 0;
        }
        .who-card:hover .who-card__glow {
          opacity: 1;
          transform: translate(-4%, 4%);
        }

        /* vertical accent strip on the start (right in RTL) edge */
        .who-card__edge {
          position: absolute;
          top: 30px; bottom: 30px; right: 0;
          width: 2px;
          background: linear-gradient(180deg, transparent, rgba(255,213,0,0.55), transparent);
          opacity: 0.45;
          pointer-events: none;
          transition: opacity 0.35s ease, width 0.3s ease, box-shadow 0.35s ease;
          z-index: 1;
        }
        .who-card:hover .who-card__edge {
          opacity: 1;
          width: 3px;
          box-shadow: 0 0 18px rgba(255,213,0,0.45);
        }

        /* small index "01 / 04" in the trailing top corner (left in RTL) */
        .who-card__index {
          position: absolute;
          top: 22px; left: 28px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          color: rgba(255,213,0,0.55);
          pointer-events: none;
          z-index: 2;
          transition: color 0.3s ease, transform 0.35s cubic-bezier(0.2,0.8,0.2,1);
        }
        .who-card:hover .who-card__index {
          color: var(--accent);
          transform: translateY(-2px);
          text-shadow: 0 0 12px rgba(255,213,0,0.45);
        }

        /* small accent dot before the yellow title word */
        .who-card__dot {
          width: 6px; height: 6px; border-radius: 999px;
          background: var(--accent);
          box-shadow: 0 0 12px rgba(255,213,0,0.7), 0 0 24px rgba(255,213,0,0.25);
          display: inline-block;
          flex-shrink: 0;
          transform: translateY(-2px);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .who-card:hover .who-card__dot {
          transform: translateY(-2px) scale(1.25);
          box-shadow: 0 0 16px rgba(255,213,0,0.95), 0 0 32px rgba(255,213,0,0.4);
        }
        .who-card,
        .who-card .who-card__bar,
        .who-card .who-card__corner {
          transition:
            transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1),
            border-color 0.35s ease,
            box-shadow 0.4s ease,
            opacity 0.35s ease;
        }

        /* animated yellow bar at bottom edge — grows from center on hover */
        .who-card__bar {
          position: absolute;
          left: 50%; bottom: 0;
          width: 0%; height: 2px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          box-shadow: 0 0 18px rgba(255, 213, 0, 0.6);
          transform: translateX(-50%);
          opacity: 0;
          z-index: 2;
        }
        .who-card:hover .who-card__bar {
          width: 92%;
          opacity: 1;
        }

        /* corner brackets — appear on hover with a small slide */
        .who-card__corner {
          position: absolute;
          width: 18px; height: 18px;
          border: 2px solid var(--accent);
          opacity: 0;
          z-index: 2;
        }
        .who-card__corner--tr {
          top: 12px; right: 12px;
          border-left: none; border-bottom: none;
          transform: translate(6px, -6px);
        }
        .who-card__corner--bl {
          left: 12px; bottom: 12px;
          border-right: none; border-top: none;
          transform: translate(-6px, 6px);
        }
        .who-card:hover .who-card__corner {
          opacity: 1;
          transform: translate(0, 0);
        }

        .who-card:hover {
          transform: translateY(-6px);
          border-color: var(--accent);
          box-shadow:
            0 18px 50px -10px rgba(0, 0, 0, 0.55),
            0 0 0 1px rgba(255, 213, 0, 0.35) inset,
            0 0 60px -10px rgba(255, 213, 0, 0.35);
        }

        @media (prefers-reduced-motion: reduce) {
          .who-card,
          .who-card .who-card__bar,
          .who-card .who-card__corner {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>);

}

function InteractiveVerdictOld() {
  const wrapRef = React.useRef(null);
  const [inView, setInView] = React.useState(false);
  const [revealed, setRevealed] = React.useState(false);

  React.useEffect(() => {
    if (!wrapRef.current) return;
    const io = new IntersectionObserver(
      ([e]) => {if (e.isIntersecting) setInView(true);},
      { threshold: 0.2 }
    );
    io.observe(wrapRef.current);
    return () => io.disconnect();
  }, []);

  React.useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setRevealed(true), 1100);
    return () => clearTimeout(t);
  }, [inView]);

  const hoverTransition = "transform 0.32s cubic-bezier(0.2,0.8,0.2,1), border-color 0.3s ease, box-shadow 0.35s ease, opacity 0.3s ease";

  const NOT_FOR = [
  "מוצרים שמוכרים בנפח גדול ומחיר נמוך",
  "עסקים שצריכים תוצאות מיידיות בלבד",
  "קמפיינים שרצים פחות מ־48 שעות",
  "קהל שלא מתחבר לפורמט — רק מסרטון"];

  const FOR_YOU = [
  "מחזור מכירה ארוך שרוצים לקצר",
  "מותג אישי שרוצים לבנות לאורך זמן",
  "קהל יעד מוגדר שיודעים מה הוא צריך",
  "רוצים לקוחות שמגיעים מוכנים — לא כאלה שצריך לשכנע"];


  return (
    <div ref={wrapRef} style={{ marginTop: 12, position: "relative" }}>
      <div className="cq-stack" style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 20,
        alignItems: "stretch",
        direction: "ltr"
      }}>
        {/* LEFT — לא בשבילכם */}
        <div className="verdict-card verdict-card--no" style={{
          direction: "rtl",
          position: "relative",
          borderRadius: 20,
          overflow: "hidden",
          background: "#0E0E0E",
          border: "1px solid var(--line2)",
          padding: "32px 32px 28px",
          display: "flex", flexDirection: "column",
          opacity: inView ? 0.78 : 0,
          transform: inView ? "translateY(0)" : "translateY(18px)",
          transition: revealed ? hoverTransition : "opacity 0.6s ease 0.25s, transform 0.7s cubic-bezier(0.2,0.8,0.2,1) 0.25s, border-color 0.4s ease, box-shadow 0.4s ease"
        }}>
          <span aria-hidden="true" className="verdict-card__static" />
          <span aria-hidden="true" className="verdict-card__corner verdict-card__corner--tl" />
          <span aria-hidden="true" className="verdict-card__corner verdict-card__corner--br" />
          {/* huge watermark X — mirror of YES card's check */}
          <svg aria-hidden="true" viewBox="0 0 24 24" className="verdict-card__xmark"
          style={{
            position: "absolute", left: -10, bottom: -30,
            width: 260, height: 260,
            color: "rgba(255,255,255,0.85)", pointerEvents: "none"
          }} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 6 L18 18 M18 6 L6 18" />
          </svg>
          {/* tag */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "8px 16px", borderRadius: 999,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.6)",
            fontSize: 13, fontWeight: 700,
            alignSelf: "flex-start",
            marginBottom: 22
          }}>
            <span style={{ fontSize: 12 }}>✗</span>
            <span>לא בשבילכם</span>
          </div>

          <p className="display" style={{
            fontSize: "clamp(20px, 1.9cqw, 26px)",
            lineHeight: 1.4, margin: "0 0 24px", fontWeight: 800,
            color: "rgba(255,255,255,0.75)"
          }}>
            אם אתם מוכרים מוצר שצריך להסביר ב־30 שניות — <span style={{ color: "#fff" }}>פודקאסט הוא לא הכלי הנכון.</span>
          </p>

          <ul style={{
            listStyle: "none", padding: 0, margin: 0,
            display: "flex", flexDirection: "column", gap: 12,
            flex: 1
          }}>
            {NOT_FOR.map((pt, j) =>
            <li key={j} className="verdict-item verdict-item--no" style={{
              display: "flex", alignItems: "start", gap: 12,
              fontSize: 14, lineHeight: 1.5,
              color: "rgba(255,255,255,0.5)",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateX(0)" : "translateX(-10px)",
              transition: `opacity 0.5s ease ${0.4 + j * 0.07}s, transform 0.5s ease ${0.4 + j * 0.07}s`,
              position: "relative", zIndex: 1
            }}>
                <span aria-hidden="true" className="verdict-item__x" style={{
                flexShrink: 0, width: 16, height: 16, marginTop: 3,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                color: "rgba(255,255,255,0.4)", fontWeight: 900, fontSize: 13
              }}>✗</span>
                <span className="verdict-item__text">{pt}</span>
              </li>
            )}
          </ul>
        </div>

        {/* RIGHT — זה בשבילכם */}
        <div className="verdict-card verdict-card--yes" style={{
          direction: "rtl",
          position: "relative",
          borderRadius: 20,
          overflow: "hidden",
          background: "linear-gradient(180deg, rgba(255,213,0,0.07), rgba(255,213,0,0.02) 70%, transparent)",
          border: "1.5px solid var(--accent)",
          padding: "32px 32px 28px",
          display: "flex", flexDirection: "column",
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(18px)",
          transition: revealed ? hoverTransition : "opacity 0.6s ease 0.3s, transform 0.7s cubic-bezier(0.2,0.8,0.2,1) 0.3s"
        }}>
          <span aria-hidden="true" className="verdict-card__aurora" />
          <span aria-hidden="true" className="verdict-card__sheen verdict-card__sheen--yes" />
          <span aria-hidden="true" className="verdict-card__corner verdict-card__corner--tl verdict-card__corner--yes" />
          <span aria-hidden="true" className="verdict-card__corner verdict-card__corner--br verdict-card__corner--yes" />
          {/* huge watermark check */}
          <svg aria-hidden="true" viewBox="0 0 24 24" className="verdict-card__check"
          style={{
            position: "absolute", left: -10, bottom: -30,
            width: 260, height: 260,
            color: "var(--accent)", pointerEvents: "none"
          }} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12 L10 18 L20 6" />
          </svg>

          {/* tag */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "8px 16px", borderRadius: 999,
            background: "var(--accent)",
            color: "#0A0A0A",
            fontSize: 13, fontWeight: 800,
            alignSelf: "flex-start",
            marginBottom: 22,
            boxShadow: "0 0 24px rgba(255,213,0,0.4)"
          }}>
            <span style={{ fontSize: 12 }}>✓</span>
            <span>זה בשבילכם</span>
          </div>

          <p className="display" style={{
            fontSize: "clamp(20px, 1.9cqw, 26px)",
            lineHeight: 1.4, margin: "0 0 24px", fontWeight: 800,
            color: "#fff",
            position: "relative", zIndex: 1
          }}>
            אם אתם מוכרים אמון, ניסיון, או ידע — <span style={{ color: "var(--accent)", textShadow: "0 0 24px rgba(255,213,0,0.4)" }}>ואין לכם כלי שעובד בשבילכם 24/7 בלי לשלם על כל קליק.</span>
          </p>

          <ul style={{
            listStyle: "none", padding: 0, margin: 0,
            display: "flex", flexDirection: "column", gap: 12,
            flex: 1, position: "relative", zIndex: 1
          }}>
            {FOR_YOU.map((pt, j) =>
            <li key={j} className="verdict-item verdict-item--yes" style={{
              display: "flex", alignItems: "start", gap: 12,
              fontSize: 14, lineHeight: 1.5,
              color: "rgba(255,255,255,0.92)",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateX(0)" : "translateX(-10px)",
              transition: `opacity 0.5s ease ${0.55 + j * 0.07}s, transform 0.5s ease ${0.55 + j * 0.07}s`,
              position: "relative", zIndex: 1,
              ["--ping-delay"]: `${j * 0.08}s`
            }}>
                <span aria-hidden="true" className="verdict-item__check" style={{
                flexShrink: 0, width: 18, height: 18, marginTop: 2,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                color: "var(--accent)"
              }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12 L10 18 L20 6" />
                  </svg>
                </span>
                <span>{pt}</span>
              </li>
            )}
          </ul>

          {/* divider + footer */}
          <div style={{
            marginTop: 28, paddingTop: 22,
            borderTop: "1px solid rgba(255,213,0,0.22)",
            position: "relative", zIndex: 1
          }}>
            <p style={{
              fontSize: 14, lineHeight: 1.55, margin: "0 0 16px",
              color: "rgba(255,255,255,0.7)", textAlign: "center"
            }}>
              לא בטוחים לאיזה צד אתם שייכים?<br />
              <strong style={{ color: "#fff", fontWeight: 800 }}>נגיד לכם בשיחה — בלי לחץ.</strong>
            </p>
            <a href="#cta" onClick={(e) => { e.preventDefault(); scrollToId("#cta"); }} style={{
              display: "block", textAlign: "center",
              padding: "12px 20px", borderRadius: 12,
              background: "var(--accent)",
              color: "#0A0A0A", textDecoration: "none",
              fontWeight: 800, fontSize: 14,
              boxShadow: "0 0 24px rgba(255,213,0,0.35)",
              transition: "transform 0.2s ease, box-shadow 0.25s ease"
            }}
            onMouseEnter={(e) => {e.currentTarget.style.transform = "translateY(-1px)";e.currentTarget.style.boxShadow = "0 0 32px rgba(255,213,0,0.55)";}}
            onMouseLeave={(e) => {e.currentTarget.style.transform = "translateY(0)";e.currentTarget.style.boxShadow = "0 0 24px rgba(255,213,0,0.35)";}}>
              בואו נבדוק יחד →
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes verdictSheen {
          0%   { transform: translateX(-130%) skewX(-18deg); }
          60%  { transform: translateX(150%) skewX(-18deg); }
          100% { transform: translateX(150%) skewX(-18deg); }
        }
        @keyframes verdictAurora {
          0%   { transform: translate(0%, 0%) rotate(0deg); }
          50%  { transform: translate(6%, -4%) rotate(180deg); }
          100% { transform: translate(0%, 0%) rotate(360deg); }
        }
        @keyframes verdictGlowPulse {
          0%, 100% {
            box-shadow:
              0 0 48px rgba(255,213,0,0.18),
              inset 0 0 60px rgba(255,213,0,0.05),
              0 0 0 0 rgba(255,213,0,0.0);
          }
          50% {
            box-shadow:
              0 0 64px rgba(255,213,0,0.32),
              inset 0 0 80px rgba(255,213,0,0.08),
              0 0 0 0 rgba(255,213,0,0.0);
          }
        }
        @keyframes verdictDrift {
          0%, 100% { transform: translateY(0); opacity: 0.06; }
          50%      { transform: translateY(-6px); opacity: 0.12; }
        }
        @keyframes verdictCheckSpin {
          from { transform: rotate(-3deg) scale(1); }
          to   { transform: rotate(3deg) scale(1.04); }
        }
        @keyframes verdictPing {
          0%   { box-shadow: 0 0 0 0 rgba(255,213,0,0.55); }
          70%  { box-shadow: 0 0 0 10px rgba(255,213,0,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,213,0,0); }
        }
        @keyframes verdictXShake {
          0%, 100% { transform: translateX(0); }
          25%      { transform: translateX(-2px) rotate(-6deg); }
          75%      { transform: translateX(2px) rotate(6deg); }
        }

        /* Continuous yellow glow pulse on the YES card */
        .verdict-card--yes {
          animation: verdictGlowPulse 4.2s ease-in-out infinite;
          will-change: transform, box-shadow, border-color;
        }
        .verdict-card--yes:hover {
          animation-play-state: paused;
          transform: translateY(-6px) !important;
          border-color: var(--accent) !important;
          box-shadow:
            0 24px 60px -12px rgba(0,0,0,0.55),
            0 0 80px -8px rgba(255,213,0,0.45),
            inset 0 0 80px rgba(255,213,0,0.08) !important;
        }

        /* NO card subtle hover lift + cool grey accent */
        .verdict-card--no {
          will-change: transform, opacity, border-color, box-shadow;
        }
        .verdict-card--no:hover {
          transform: translateY(-4px) !important;
          opacity: 1 !important;
          border-color: rgba(255,255,255,0.22) !important;
          box-shadow:
            0 18px 46px -12px rgba(0,0,0,0.6),
            inset 0 0 60px rgba(255,255,255,0.02) !important;
        }

        /* Diagonal sheen — slow continuous loop, faster on hover */
        .verdict-card__sheen {
          position: absolute; inset: 0;
          pointer-events: none;
          background: linear-gradient(
            115deg,
            transparent 0%, transparent 40%,
            rgba(255,255,255,0.045) 50%,
            transparent 60%, transparent 100%
          );
          transform: translateX(-130%) skewX(-18deg);
          animation: verdictSheen 7.5s ease-in-out infinite;
          z-index: 0;
        }
        .verdict-card__sheen--yes {
          background: linear-gradient(
            115deg,
            transparent 0%, transparent 38%,
            rgba(255,213,0,0.14) 50%,
            transparent 62%, transparent 100%
          );
          animation-duration: 5.5s;
          animation-delay: 1.2s;
        }
        .verdict-card:hover .verdict-card__sheen {
          animation-duration: 2.4s;
        }

        /* Aurora blob inside YES card — slow rotating warm gradient */
        .verdict-card__aurora {
          position: absolute;
          top: -40%; right: -25%;
          width: 90%; height: 140%;
          background: radial-gradient(
            ellipse at center,
            rgba(255,213,0,0.16) 0%,
            rgba(255,213,0,0.06) 35%,
            transparent 65%
          );
          filter: blur(30px);
          pointer-events: none;
          animation: verdictAurora 14s linear infinite, verdictDrift 5s ease-in-out infinite;
          z-index: 0;
        }

        /* Static grain layer on NO card — drifts subtly */
        .verdict-card__static {
          position: absolute; inset: 0;
          pointer-events: none;
          background-image: repeating-linear-gradient(
            0deg,
            rgba(255,255,255,0.025) 0px,
            rgba(255,255,255,0.025) 1px,
            transparent 1px,
            transparent 3px
          );
          animation: verdictDrift 6s ease-in-out infinite;
          opacity: 0.06;
          z-index: 0;
        }

        /* Corner brackets */
        .verdict-card__corner {
          position: absolute;
          width: 22px; height: 22px;
          border: 2px solid rgba(255,255,255,0.4);
          opacity: 0;
          transition: opacity 0.35s ease, transform 0.4s cubic-bezier(0.2,0.8,0.2,1);
          z-index: 2;
        }
        .verdict-card__corner--yes { border-color: var(--accent); }
        .verdict-card__corner--tl {
          top: 14px; right: 14px;
          border-left: none; border-bottom: none;
          transform: translate(6px, -6px);
        }
        .verdict-card__corner--br {
          left: 14px; bottom: 14px;
          border-right: none; border-top: none;
          transform: translate(-6px, 6px);
        }
        .verdict-card:hover .verdict-card__corner {
          opacity: 1;
          transform: translate(0, 0);
        }

        /* YES card — big check watermark slowly tilts + glows */
        .verdict-card__check {
          opacity: 0.08;
          transform-origin: center;
          animation: verdictCheckSpin 6s ease-in-out infinite alternate;
          transition: opacity 0.4s ease, filter 0.4s ease;
        }
        .verdict-card--yes:hover .verdict-card__check {
          opacity: 0.18;
          filter: drop-shadow(0 0 24px rgba(255,213,0,0.5));
        }

        /* NO card — big X watermark slowly tilts */
        .verdict-card__xmark {
          opacity: 0.06;
          transform-origin: center;
          animation: verdictCheckSpin 7s ease-in-out infinite alternate-reverse;
          transition: opacity 0.4s ease, filter 0.4s ease;
        }
        .verdict-card--no:hover .verdict-card__xmark {
          opacity: 0.14;
          filter: drop-shadow(0 0 18px rgba(255,255,255,0.18));
        }

        /* YES list item check icons — ping pulse on card hover, staggered */
        .verdict-card--yes:hover .verdict-item__check {
          animation: verdictPing 1.2s ease-out infinite;
          animation-delay: var(--ping-delay, 0s);
          border-radius: 999px;
        }
        .verdict-item--yes { transition: transform 0.3s ease, color 0.3s ease; }
        .verdict-card--yes:hover .verdict-item--yes {
          transform: translateX(4px);
        }

        /* NO list item — X icons shake when card hovered, text fades a touch */
        .verdict-item__x { transition: color 0.3s ease, transform 0.3s ease; display: inline-flex; }
        .verdict-card--no:hover .verdict-item__x {
          color: rgba(255,255,255,0.7);
          animation: verdictXShake 0.45s ease-in-out;
        }
        .verdict-item__text { transition: color 0.3s ease, text-decoration-color 0.3s ease; }
        .verdict-card--no:hover .verdict-item__text {
          text-decoration: line-through;
          text-decoration-color: rgba(255,255,255,0.18);
          text-decoration-thickness: 1px;
        }

        @media (prefers-reduced-motion: reduce) {
          .verdict-card,
          .verdict-card *,
          .verdict-card__sheen,
          .verdict-card__aurora,
          .verdict-card__static,
          .verdict-card__check,
          .verdict-card__xmark,
          .verdict-item__check,
          .verdict-item__x {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>);

}

function WhyUsOld() {
  const [hovered, setHovered] = React.useState(-1);

  // Interactive chip data for the AI highlight
  const AI_CHIPS = [
  { label: "Claude", sub: "ניתוח פרקים + זיהוי רגעים" },
  { label: "GPT-4", sub: "תמלול + סיכומים חכמים" },
  { label: "Descript", sub: "עריכה אוטומטית" },
  { label: "Custom AI", sub: "אופטימיזציית יחידות תוכן" }];

  const [activeChip, setActiveChip] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => setActiveChip((c) => (c + 1) % AI_CHIPS.length), 2800);
    return () => clearInterval(id);
  }, []);

  // Extra reveal content for the two small cards
  const EXTRAS = {
    1: [
    "החלטות על מבנה הפרק",
    "אילו רגעים הופכים לרילס",
    "מתי להטמיע CTA",
    "איך המיצוב משפיע על הכותרת"],

    2: [
    "צ'אט עם מפיק אישי",
    "תגובה תוך שעתיים",
    "לו״ז פעמים וסיכומים קצרים",
    "שינויים מקבלים תוך 24 שעות"]

  };

  return (
    <section id="why" style={{ padding: "76px 0" }}>
      <div className="wrap">
        <h2 className="display" style={{ fontSize: "clamp(38px, 6cqw, 84px)", margin: "0 0 64px", maxWidth: 1100 }}>
          אנחנו לא חברת הפקה.<br />
          <span style={{ color: "var(--accent)" }}>אנחנו שותפים לתוצאה העסקית.</span>
        </h2>

        <div className="cq-stack" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {WHY_US.map((w, i) => {
            const isHover = hovered === i;
            if (w.highlight) {
              return (
                <div
                  key={i}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(-1)}
                  style={{
                    gridColumn: "span 3",
                    background: "rgba(255,213,0,0.06)",
                    borderRadius: 20, padding: 48,
                    border: "2px solid var(--accent)",
                    position: "relative", overflow: "hidden",
                    cursor: "default"
                  }}>
                  
                  {/* Animated scanning line */}
                  <div style={{
                    position: "absolute", top: 0, right: 0, height: 2,
                    width: "30%", background: "linear-gradient(to left, transparent, var(--accent), transparent)",
                    animation: "cutsScan 3.6s ease-in-out infinite",
                    zIndex: 2
                  }} />
                  <div style={{
                    position: "absolute", top: 24, left: 24,
                    padding: "8px 14px", background: "#0A0A0A", color: "var(--accent)",
                    border: "1px solid var(--accent)",
                    borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em",
                    fontFamily: "var(--font-mono)",
                    display: "flex", alignItems: "center", gap: 8
                  }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: "var(--accent)",
                      animation: "cutsBlink 1.2s ease-in-out infinite"
                    }} />
                    AI · Unfair Advantage
                  </div>
                  <div style={{
                    position: "absolute", left: -10, bottom: -60,
                    fontFamily: "var(--font-display)", fontWeight: 900,
                    fontSize: 260, color: "var(--accent)",
                    opacity: 0.08, lineHeight: 1,
                    pointerEvents: "none"
                  }}>{w.n}</div>
                  <div className="mono" style={{ fontSize: 12, color: "var(--accent)", marginBottom: 18, position: "relative", zIndex: 2 }}>
                    {w.n}
                  </div>
                  <h3 className="display" style={{
                    fontSize: 48, margin: "0 0 16px", fontWeight: 900,
                    position: "relative", zIndex: 2, maxWidth: 800
                  }}>
                    {w.title}
                  </h3>
                  <p style={{
                    fontSize: 19, lineHeight: 1.7, opacity: 0.88, margin: "0 0 28px",
                    position: "relative", zIndex: 2, maxWidth: 900
                  }}>
                    {w.body}
                  </p>

                  {/* Interactive AI chip rotator */}
                  <div style={{
                    display: "flex", flexWrap: "wrap", gap: 10,
                    position: "relative", zIndex: 2
                  }}>
                    {AI_CHIPS.map((c, ci) => {
                      const on = activeChip === ci;
                      return (
                        <button
                          key={ci}
                          onMouseEnter={() => setActiveChip(ci)}
                          style={{
                            background: on ? "var(--accent)" : "rgba(255,255,255,0.04)",
                            color: on ? "#0A0A0A" : "#fff",
                            border: `1px solid ${on ? "var(--accent)" : "var(--line2)"}`,
                            borderRadius: 12,
                            padding: "12px 16px",
                            cursor: "pointer",
                            textAlign: "right",
                            fontFamily: "inherit",
                            transition: "all 0.3s ease",
                            minWidth: 180
                          }}>
                          
                          <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 2, fontFamily: "var(--font-mono)" }}>{c.label}</div>
                          <div style={{ fontSize: 12, opacity: on ? 0.75 : 0.55 }}>{c.sub}</div>
                        </button>);

                    })}
                  </div>
                </div>);

            }

            const extra = EXTRAS[i] || [];
            return (
              <div
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(-1)}
                style={{
                  gridColumn: "span 1",
                  background: isHover ? "#111" : "var(--card)",
                  borderRadius: 20, padding: 32,
                  border: `1px solid ${isHover ? "rgba(255,213,0,0.5)" : "var(--line2)"}`,
                  position: "relative", overflow: "hidden",
                  cursor: "pointer",
                  transform: isHover ? "translateY(-6px)" : "translateY(0)",
                  boxShadow: isHover ?
                  "0 20px 50px -20px rgba(255,213,0,0.35)" :
                  "0 0 0 0 rgba(0,0,0,0)",
                  transition: "transform 0.35s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.35s ease, border-color 0.3s ease, background 0.3s ease",
                  minHeight: 340,
                  display: "flex", flexDirection: "column"
                }}>
                
                <div style={{
                  position: "absolute", left: -10, bottom: -60,
                  fontFamily: "var(--font-display)", fontWeight: 900,
                  fontSize: 180, color: "var(--accent)",
                  opacity: isHover ? 0.16 : 0.08, lineHeight: 1,
                  transition: "opacity 0.4s ease, transform 0.4s ease",
                  transform: isHover ? "translate(-4px, -4px)" : "translate(0,0)",
                  pointerEvents: "none"
                }}>{w.n}</div>
                <div className="mono" style={{ fontSize: 12, color: "var(--accent)", marginBottom: 18, position: "relative", zIndex: 2 }}>
                  {w.n}
                </div>
                <h3 className="display" style={{
                  fontSize: 28, margin: "0 0 16px", fontWeight: 900,
                  position: "relative", zIndex: 2,
                  color: isHover ? "var(--accent)" : "#fff",
                  transition: "color 0.3s ease"
                }}>
                  {w.title}
                </h3>
                <p style={{
                  fontSize: 15, lineHeight: 1.7,
                  opacity: isHover ? 0.7 : 0.88,
                  margin: 0, position: "relative", zIndex: 2,
                  transition: "opacity 0.3s ease, max-height 0.4s ease",
                  maxHeight: isHover ? 80 : 400,
                  overflow: "hidden"
                }}>
                  {w.body}
                </p>

                {/* Reveal list on hover */}
                <div style={{
                  marginTop: "auto", paddingTop: 20,
                  maxHeight: isHover ? 300 : 0,
                  opacity: isHover ? 1 : 0,
                  overflow: "hidden",
                  transition: "max-height 0.5s cubic-bezier(0.2,0.8,0.2,1), opacity 0.4s ease 0.1s",
                  position: "relative", zIndex: 2
                }}>
                  <div className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--accent)", marginBottom: 12, opacity: 0.8 }}>
                    // לדוגמה
                  </div>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                    {extra.map((e, ei) =>
                    <li key={ei} style={{
                      display: "flex", gap: 10, alignItems: "center",
                      fontSize: 13, opacity: 0.85,
                      transform: isHover ? "translateX(0)" : "translateX(8px)",
                      transition: `transform 0.4s ease ${0.05 * ei + 0.1}s`
                    }}>
                        <span style={{
                        width: 4, height: 4, borderRadius: "50%",
                        background: "var(--accent)", flexShrink: 0
                      }} />
                        {e}
                      </li>
                    )}
                  </ul>
                </div>

                {/* Corner arrow */}
                <div style={{
                  position: "absolute", top: 24, left: 24,
                  width: 36, height: 36, borderRadius: "50%",
                  border: `1px solid ${isHover ? "var(--accent)" : "var(--line2)"}`,
                  background: isHover ? "var(--accent)" : "transparent",
                  color: isHover ? "#0A0A0A" : "rgba(255,255,255,0.4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, fontWeight: 900,
                  transform: isHover ? "rotate(-45deg)" : "rotate(0)",
                  transition: "all 0.35s cubic-bezier(0.2,0.8,0.2,1)",
                  zIndex: 3
                }}>←</div>
              </div>);

          })}
        </div>
      </div>

      <style>{`
        @keyframes cutsScan {
          0%   { right: -30%; opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { right: 130%; opacity: 0; }
        }
        @keyframes cutsBlink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.3; transform: scale(0.7); }
        }
      `}</style>
    </section>);

}

function SectionDivider() {
  return (
    <div aria-hidden="true" style={{
      height: 1, width: "100%",
      background: "linear-gradient(90deg, transparent, rgba(255,213,0,0.18) 30%, rgba(255,213,0,0.18) 70%, transparent)"
    }} />);

}

// ---------- BOLD VARIATION (root) ----------

function BoldVariation({ onCTAClick, form, admin }) {
  // Comp identities MUST stay stable across renders — otherwise React
  // unmounts/remounts every section on each re-render, wiping in-section
  // state (e.g. the podcast carousel index). So deps are [] and live
  // values arrive via props (p) at the <s.Comp .../> call site.
  const DEFAULT_SECTIONS = React.useMemo(() => [
    { id: "hero",             Comp: (p) => <Hero onCTAClick={p.onCTAClick} /> },
    { id: "solution",         Comp: (p) => <SolutionOld /> },
    { id: "inline-lead-1",    Comp: (p) => <InlineLeadForm form={p.form} /> },
    { id: "problem",          Comp: (p) => <ProblemOld /> },
    { id: "social-proof",     Comp: (p) => <SocialProofSection onCTAClick={p.onCTAClick} admin={p.admin} /> },
    { id: "mini-lead-1",      Comp: (p) => <MiniLeadStripe form={p.form} /> },
    { id: "who-its-for",      Comp: (p) => <WhoItsForOld /> },
    { id: "how-it-works",     Comp: (p) => <HowItWorksInteractive /> },
    { id: "services",         Comp: (p) => <ServicesOld onCTAClick={p.onCTAClick} /> },
    { id: "studio-booking",   Comp: (p) => <StudioBookingLead form={p.form} /> },
    { id: "results",          Comp: (p) => <Results admin={p.admin} /> },
    { id: "guest-strip",      Comp: (p) => <GuestStrip admin={p.admin} /> },
    { id: "guarantee",        Comp: (p) => <Guarantee onCTAClick={p.onCTAClick} /> },
    { id: "mini-lead-2",      Comp: (p) => <MiniLeadStripe form={p.form} /> },
    { id: "faq",              Comp: (p) => <FAQSection /> },
    { id: "final-cta",        Comp: (p) => <FinalCTA form={p.form} onCTAClick={p.onCTAClick} /> },
  ], []);

  // Compose ordered list based on admin.sectionOrder (if any)
  const orderedSections = React.useMemo(() => {
    if (!admin || !Array.isArray(admin.sectionOrder) || admin.sectionOrder.length === 0) {
      return DEFAULT_SECTIONS;
    }
    const byId = new Map(DEFAULT_SECTIONS.map(s => [s.id, s]));
    const ordered = [];
    const seen = new Set();
    for (const id of admin.sectionOrder) {
      if (byId.has(id) && !seen.has(id)) {
        ordered.push(byId.get(id));
        seen.add(id);
      }
    }
    // append any new sections that weren't in saved order
    for (const s of DEFAULT_SECTIONS) {
      if (!seen.has(s.id)) ordered.push(s);
    }
    return ordered;
  }, [DEFAULT_SECTIONS, admin && admin.sectionOrder]);

  const draggable = !!(admin && admin.draggingSections);
  const dragSrc = React.useRef(null);

  function handleDragStart(e, id) {
    if (!draggable) return;
    dragSrc.current = id;
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.classList.add("section-dragging");
  }
  function handleDragEnd(e) {
    document.querySelectorAll(".section-dragging").forEach(el => el.classList.remove("section-dragging"));
    document.querySelectorAll(".section-drop-target").forEach(el => el.classList.remove("section-drop-target"));
    dragSrc.current = null;
  }
  function handleDragOver(e, id) {
    if (!draggable) return;
    if (!dragSrc.current || dragSrc.current === id) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    document.querySelectorAll(".section-drop-target").forEach(el => el.classList.remove("section-drop-target"));
    e.currentTarget.classList.add("section-drop-target");
  }
  function handleDragLeave(e) {
    e.currentTarget.classList.remove("section-drop-target");
  }
  function handleDrop(e, targetId) {
    if (!draggable) return;
    e.preventDefault();
    e.currentTarget.classList.remove("section-drop-target");
    const src = dragSrc.current;
    if (!src || src === targetId) return;
    const ids = orderedSections.map(s => s.id);
    const fromIdx = ids.indexOf(src);
    const toIdx = ids.indexOf(targetId);
    if (fromIdx < 0 || toIdx < 0) return;
    const next = ids.slice();
    next.splice(fromIdx, 1);
    next.splice(toIdx, 0, src);
    if (admin && admin.updateSectionOrder) admin.updateSectionOrder(next);
  }

  const isUnlocked = !!(admin && admin.unlocked);
  const hiddenSet = new Set((admin && admin.hiddenSections) || []);
  // Visitors see only non-hidden sections. Admins see all (with overlay) so
  // they can toggle visibility.
  const visibleSections = isUnlocked
    ? orderedSections
    : orderedSections.filter((s) => !hiddenSet.has(s.id));

  return (
    <div className="fade-in">
      <TopNav variant="bold" onCTAClick={onCTAClick} />
      {visibleSections.map((s, i) => {
        const isHidden = hiddenSet.has(s.id);
        return (
          <React.Fragment key={s.id}>
            <div
              data-section-id={s.id}
              className={isHidden ? "section-hidden-admin" : undefined}
              draggable={draggable}
              onDragStart={(e) => handleDragStart(e, s.id)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, s.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, s.id)}
            >
              {draggable && admin && admin.toggleSectionHidden && (
                <button
                  type="button"
                  className="section-hide-toggle"
                  onClick={(e) => { e.stopPropagation(); admin.toggleSectionHidden(s.id); }}
                  title={isHidden ? "החזר לתצוגה" : "הסתר מהאתר"}
                >
                  {isHidden ? "👁 הצג" : "🚫 הסתר"}
                </button>
              )}
              {isHidden && isUnlocked && (
                <div className="section-hidden-badge">מוסתר באתר הלייב</div>
              )}
              <s.Comp onCTAClick={onCTAClick} form={form} admin={admin} />
            </div>
            {i < visibleSections.length - 1 && <SectionDivider />}
          </React.Fragment>
        );
      })}
      <Footer variant="bold" />
    </div>);

}

Object.assign(window, { BoldVariation });