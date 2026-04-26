// BOLD variation — rebuilt per landing page brief.
// 10 sections, RTL, dark-dominant with yellow accent.

function Hero({ onCTAClick }) {
  return (
    <section style={{ position: "relative", padding: "100px 0 60px", overflow: "hidden" }}>
      <div className="wrap" style={{ position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
          <span className="tag" style={{
            color: "var(--accent)",
            fontSize: 18,
            padding: "14px 26px",
            fontWeight: 700,
            letterSpacing: "0.04em",
            borderWidth: 2
          }}>
            <span className="dot pulse" style={{ width: 10, height: 10 }}></span>
            הפקת פודקאסטים לעסקים
          </span>
        </div>

        <h1 className="display" style={{
          fontSize: "clamp(52px, 9.5vw, 148px)",
          margin: 0, fontWeight: 900
        }}>
          למה יש בעלי עסקים שהקהל שלהם מת עליהם<br />
          <span style={{ color: "var(--accent)" }}>ויש כאלה שאף אחד לא זוכר?</span>
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 60, marginTop: 56, alignItems: "end" }}>
          <p style={{ fontSize: 22, lineHeight: 1.55, margin: 0, opacity: 0.85, maxWidth: 680 }}>
            הלקוחות שלך לא צריכים עוד מודעה, הם צריכים להכיר את הבן אדם שמאחורי העסק.<br />
            אנחנו מפיקים לך פודקאסט שהופך צופים ללקוחות — בלי לדחוף, בלי לרדוף, רק להיות אתה.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <button className="btn btn-primary" onClick={onCTAClick} style={{ justifyContent: "center", padding: "22px 28px", fontSize: 18 }}>
              בוא נדבר על הפודקאסט שלך ←
            </button>
            <div className="mono" style={{ fontSize: 12, opacity: 0.55, textAlign: "center", lineHeight: 1.7 }}>
              {"\n"}
            </div>
          </div>
        </div>

        {/* Subtle waveform baseline */}
        <div style={{ marginTop: 80, opacity: 0.35 }}>
          <Waveform count={64} color="var(--accent)" />
          <style>{`section:first-of-type .waveform { height: 56px !important; gap: 4px !important; }`}</style>
        </div>
      </div>
    </section>);

}

function Problem() {
  const sectionRef = React.useRef(null);
  const [inView, setInView] = React.useState(false);
  const [mode, setMode] = React.useState("old"); // "old" | "new"

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

  // Line chart for CPC rising 2022 → 2026
  const chartPoints = React.useMemo(() => {
    // normalized y=0 (bottom) to y=1 (top)
    const vals = [0.15, 0.22, 0.34, 0.52, 0.78, 0.96];
    const years = ["'22", "'23", "'24", "'25", "'26", "'27"];
    return vals.map((v, i) => ({ v, year: years[i] }));
  }, []);

  const CHART_W = 560;
  const CHART_H = 180;
  const pathD = React.useMemo(() => {
    const n = chartPoints.length;
    return chartPoints.
    map((p, i) => {
      const x = i / (n - 1) * CHART_W;
      const y = CHART_H - p.v * CHART_H;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).
    join(" ");
  }, [chartPoints]);

  const areaD = pathD + ` L ${CHART_W} ${CHART_H} L 0 ${CHART_H} Z`;

  return (
    <section ref={sectionRef} style={{ padding: "120px 0", background: "var(--card)", borderTop: "1px solid var(--line2)", borderBottom: "1px solid var(--line2)" }}>
      <div className="wrap">
        <h2 className="display" style={{ fontSize: "clamp(38px, 6vw, 84px)", margin: "0 0 48px", maxWidth: 1100 }}>
          התקציבים עולים. הלידים מתקררים.<br />
          <span style={{ color: "var(--accent)" }}>וזה רק ימשיך להחמיר.</span>
        </h2>

        {/* Three live stats */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16, marginBottom: 56
        }}>
          {[
          { n: `+${cpcUp}%`, label: "עליית מחיר הליד בגוגל", sub: "YoY · WordStream 2024", arrow: "↑", tone: "bad" },
          { n: `${(convRate / 100).toFixed(2)}%`, label: "אחוז המרה ממוצע ב־B2B", sub: "WebFX Benchmarks", arrow: "↓", tone: "bad" },
          { n: `+${cpcUp}%`, label: "עליית מחיר הליד בגוגל", sub: "YoY · WordStream 2024", arrow: "↑", tone: "bad" }].
          map((s, i) =>
          <div key={i} style={{
            padding: "32px 28px",
            background: "var(--bg)",
            border: "1px solid var(--line2)",
            borderRadius: 18,
            position: "relative", overflow: "hidden"
          }}>
              <div style={{
              position: "absolute", top: 18, left: 18,
              color: "var(--accent)", fontSize: 22, opacity: 0.35, fontWeight: 900
            }}>{s.arrow}</div>
              <div className="display" style={{
              fontSize: "clamp(44px, 5.5vw, 72px)",
              fontWeight: 900, lineHeight: 1, color: "var(--accent)",
              marginBottom: 14,
              fontVariantNumeric: "tabular-nums"
            }}>{s.n}</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{s.label}</div>
              <div className="mono" style={{ fontSize: 11, opacity: 0.5, letterSpacing: "0.08em" }}>{s.sub}</div>
            </div>
          )}
        </div>

        {/* Chart + paragraph */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 60, alignItems: "stretch", marginBottom: 56 }}>
          <div style={{
            background: "var(--bg)",
            border: "1px solid var(--line2)",
            borderRadius: 18,
            padding: 32,
            position: "relative"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
              <div>
                <div className="mono" style={{ fontSize: 11, opacity: 0.5, letterSpacing: "0.15em", marginBottom: 6 }}>{"\n"}</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>מחיר ליד ממוצע</div>
              </div>
              <div className="mono" style={{ fontSize: 11, opacity: 0.4 }}>
                <span style={{ display: "inline-block", width: 10, height: 2, background: "var(--accent)", marginLeft: 6, verticalAlign: "middle" }} />
                מגמה ←
              </div>
            </div>

            <svg viewBox={`0 0 ${CHART_W} ${CHART_H + 28}`} style={{ width: "100%", height: "auto", overflow: "visible" }}>
              <defs>
                <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* gridlines */}
              {[0.25, 0.5, 0.75].map((g, i) =>
              <line key={i}
              x1={0} x2={CHART_W}
              y1={CHART_H * g} y2={CHART_H * g}
              stroke="rgba(255,255,255,0.05)"
              strokeDasharray="2 4" />

              )}
              {/* area */}
              <path d={areaD} fill="url(#areaFill)" style={{
                transition: "opacity 0.8s ease",
                opacity: inView ? 1 : 0
              }} />
              {/* line */}
              <path d={pathD} fill="none" stroke="var(--accent)" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              style={{
                strokeDasharray: 1200,
                strokeDashoffset: inView ? 0 : 1200,
                transition: "stroke-dashoffset 1.6s cubic-bezier(0.2,0.8,0.2,1)"
              }} />
              
              {/* year dots */}
              {chartPoints.map((p, i) => {
                const x = i / (chartPoints.length - 1) * CHART_W;
                const y = CHART_H - p.v * CHART_H;
                const isLast = i === chartPoints.length - 1;
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r={isLast ? 6 : 3}
                    fill={isLast ? "var(--accent)" : "#0A0A0A"}
                    stroke="var(--accent)" strokeWidth={isLast ? 0 : 2}
                    style={{ transition: `opacity 0.4s ease ${0.8 + i * 0.1}s`, opacity: inView ? 1 : 0 }} />
                    
                    {isLast &&
                    <circle cx={x} cy={y} r={10} fill="none" stroke="var(--accent)" strokeWidth="2"
                    opacity={0.5 + 0.5 * Math.sin(tick / 6)} />

                    }
                    <text x={x} y={CHART_H + 20}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.45)"
                    style={{ fontSize: 11, fontFamily: "ui-monospace, monospace", letterSpacing: "0.06em" }}>
                      {p.year}</text>
                  </g>);

              })}
              {/* forecast shade after '25 */}
              <rect
                x={CHART_W * 0.6} y={0}
                width={CHART_W * 0.4} height={CHART_H}
                fill="rgba(255,213,0,0.04)" />
              
              <text x={CHART_W * 0.8} y={16}
              textAnchor="middle"
              fill="rgba(255,213,0,0.45)"
              style={{ fontSize: 10, fontFamily: "ui-monospace, monospace", letterSpacing: "0.2em" }}>
                FORECAST →</text>
            </svg>
          </div>

          <p style={{ fontSize: 19, lineHeight: 1.75, opacity: 0.9, margin: 0, alignSelf: "center" }}>
            כל בעל עסק מרגיש את זה עכשיו: מחירי הלידים מזנקים. אחוזי ההמרה צונחים.
            אנשים גוללים הלאה לפני שהם בכלל הבינו מה אתה מציע.
            <br /><br />
            וכשמישהו כבר נכנס לשיחה — הוא מתנגד, מתמקח, או פשוט נעלם.
          </p>
        </div>

        {/* Interactive toggle: the old way vs your way */}
        <div style={{
          background: "var(--bg)",
          border: "1px solid var(--line2)",
          borderRadius: 22,
          padding: "44px 48px",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Toggle */}
          <div style={{
            display: "inline-flex",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid var(--line2)",
            borderRadius: 999,
            padding: 4,
            marginBottom: 28,
            position: "relative"
          }}>
            <button
              onClick={() => setMode("old")}
              style={{
                padding: "10px 22px", fontSize: 13, fontWeight: 700,
                background: mode === "old" ? "var(--accent)" : "transparent",
                color: mode === "old" ? "#0A0A0A" : "rgba(255,255,255,0.55)",
                border: "none", borderRadius: 999, cursor: "pointer",
                fontFamily: "ui-monospace, monospace", letterSpacing: "0.1em",
                transition: "all 0.25s ease"
              }}>
              הדרך הישנה</button>
            <button
              onClick={() => setMode("new")}
              style={{
                padding: "10px 22px", fontSize: 13, fontWeight: 700,
                background: mode === "new" ? "var(--accent)" : "transparent",
                color: mode === "new" ? "#0A0A0A" : "rgba(255,255,255,0.55)",
                border: "none", borderRadius: 999, cursor: "pointer",
                fontFamily: "ui-monospace, monospace", letterSpacing: "0.1em",
                transition: "all 0.25s ease"
              }}>הדרך שלנו
            </button>
          </div>

          {/* Content swap */}
          <div style={{ position: "relative", minHeight: 200 }}>
            <div key={mode} style={{
              animation: "fadeSlide 0.4s cubic-bezier(0.2,0.8,0.2,1)"
            }}>
              {mode === "old" ?
              <>
                  <p className="display" style={{
                  fontSize: "clamp(28px, 3.8vw, 52px)",
                  lineHeight: 1.15, margin: 0, fontWeight: 800,
                  maxWidth: 980
                }}>
                    הבעיה היא לא המוצר.{" "}
                    <span style={{ color: "var(--accent)" }}>הבעיה היא שאתה עוד דוחף.</span>
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 28 }}>
                    {["מודעה של 15 שניות", "קמפיין ממומן", "דף נחיתה קר", "cold email", "רימרקטינג"].map((t, i) =>
                  <span key={i} style={{
                    padding: "10px 16px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--line2)",
                    borderRadius: 999,
                    fontSize: 13,
                    opacity: 0.6,
                    textDecoration: "line-through",
                    textDecorationColor: "rgba(255,255,255,0.3)"
                  }}>{t}</span>
                  )}
                  </div>
                </> :

              <>
                  <p className="display" style={{
                  fontSize: "clamp(28px, 3.8vw, 52px)",
                  lineHeight: 1.15, margin: 0, fontWeight: 800,
                  maxWidth: 980
                }}>
                    תפסיק לשדר.{" "}
                    <span style={{ color: "var(--accent)" }}>תתחיל לדבר.</span>
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 28 }}>
                    {["פודקאסט ארוך", "סיפורים אמיתיים", "סמכות מקצועית", "קשר אנושי", "אמון שמצטבר"].map((t, i) =>
                  <span key={i} style={{
                    padding: "10px 16px",
                    background: "rgba(255,213,0,0.08)",
                    border: "1px solid rgba(255,213,0,0.35)",
                    borderRadius: 999,
                    fontSize: 13,
                    color: "var(--accent)",
                    fontWeight: 600
                  }}>{t}</span>
                  )}
                  </div>
                </>
              }
            </div>
          </div>
        </div>

        <p style={{ fontSize: 19, lineHeight: 1.7, opacity: 0.85, maxWidth: 900, marginTop: 56 }}>
          ב־2026 אנשים כבר לא קונים ממי שצועק הכי חזק במודעות. הם קונים ממי שהם מכירים, סומכים עליו, ומרגישים שהוא מבין אותם.{"\n"}
          אלא שאי אפשר לבנות אמון במודעה של 15 שניות.
        </p>
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>);

}

function Solution() {
  const [hoveredPillar, setHoveredPillar] = React.useState(-1);

  // Concrete examples revealed on hover
  const PILLAR_EXAMPLES = [
  {
    icon: "🎙",
    lines: [
    "לקוח מאזין בדרך לעבודה",
    "שומע אותך נאבק בסוגיה שגם הוא נאבק בה",
    "מרגיש שהוא מכיר אותך חודשים לפני פגישה"]

  },
  {
    icon: "📚",
    lines: [
    "פרק על טעות נפוצה בתחום שלך",
    "לקוח גוגל את הבעיה, מוצא את הפרק",
    "הוא פונה אליך — לא למתחרה"]

  },
  {
    icon: "🤝",
    lines: [
    "״שמעתי את הפרק על…״",
    "במקום ״תשכנע אותי למה אתה״",
    "שיחת מכירה הופכת לשיחת הצטרפות"]

  }];


  return (
    <section style={{ padding: "120px 0" }}>
      <div className="wrap">
        <h2 className="display" style={{ fontSize: "clamp(40px, 7vw, 104px)", margin: "0 0 40px", fontWeight: 900 }}>
          מלמכור בכוח —<br />
          <span style={{ color: "var(--accent)" }}>להיות נקנה.</span>
        </h2>

        {/* Animated Push → Pull visual */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 20,
          marginBottom: 64,
          padding: "14px 26px",
          border: "1.5px solid var(--line2)",
          borderRadius: 999,
          position: "relative",
          overflow: "hidden"
        }}>
          <span className="mono" style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.3)",
            textDecoration: "line-through",
            letterSpacing: "0.12em",
            fontWeight: 500,
            animation: "pushFade 3.2s ease-in-out infinite"
          }}>לדחוף</span>
          <span style={{
            fontSize: 22, color: "var(--accent)",
            animation: "arrowSlide 3.2s ease-in-out infinite",
            display: "inline-block"
          }}>←</span>
          <span className="mono" style={{
            fontSize: 14, color: "var(--accent)",
            fontWeight: 700, letterSpacing: "0.12em",
            animation: "pullGlow 3.2s ease-in-out infinite"
          }}>למשוך</span>
        </div>

        <p style={{ fontSize: 20, lineHeight: 1.6, opacity: 0.85, maxWidth: 820, margin: "0 0 64px" }}>
          פודקאסט הוא הכלי השיווקי היחיד שמייצר שלושה דברים בו־זמנית,
          שאף פורמט אחר לא נותן:
        </p>

        {/* Interactive Pillar cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
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

                {/* Base body — fades out on hover */}
                <p style={{
                  fontSize: 16, lineHeight: 1.65,
                  opacity: isHover ? 0 : 0.85,
                  margin: 0, position: "relative", zIndex: 2,
                  transition: "opacity 0.3s ease",
                  maxHeight: isHover ? 0 : 300,
                  overflow: "hidden"
                }}>{p.body}</p>

                {/* Hover example reveal */}
                <div style={{
                  position: "absolute",
                  insetInlineStart: 36, insetInlineEnd: 36,
                  top: 120,
                  opacity: isHover ? 1 : 0,
                  transform: isHover ? "translateY(0)" : "translateY(12px)",
                  transition: "opacity 0.4s ease 0.05s, transform 0.4s cubic-bezier(0.2,0.8,0.2,1) 0.05s",
                  pointerEvents: "none",
                  zIndex: 2
                }}>
                  <div style={{ fontSize: 32, marginBottom: 14 }}>{ex.icon}</div>
                  <div className="mono" style={{
                    fontSize: 10, letterSpacing: "0.2em",
                    color: "var(--accent)", opacity: 0.8, marginBottom: 14
                  }}>// תרחיש אמיתי</div>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                    {ex.lines.map((l, li) =>
                    <li key={li} style={{
                      fontSize: 14, lineHeight: 1.5, opacity: 0.85,
                      display: "flex", gap: 10, alignItems: "start",
                      transform: isHover ? "translateX(0)" : "translateX(6px)",
                      transition: `transform 0.4s ease ${0.08 * li + 0.1}s`
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

        {/* Closing pull quote */}
        <div style={{
          marginTop: 56,
          background: "var(--accent)", color: "#0A0A0A",
          padding: "48px 56px", borderRadius: 22,
          textAlign: "center"
        }}>
          <p className="display" style={{
            fontSize: "clamp(26px, 3.4vw, 44px)",
            lineHeight: 1.25, margin: 0, fontWeight: 800
          }}>
            זה בדיוק ההבדל בין לקוח שמתמקח על כל שקל,<br />
            ללקוח ששואל איפה להעביר את התשלום.
          </p>
        </div>
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

function CTAInline({ onCTAClick, label = "בוא נדבר על הפודקאסט שלך ←" }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
      <button className="btn btn-primary" onClick={onCTAClick} style={{ padding: "22px 36px", fontSize: 17 }}>
        {label}
      </button>
    </div>);

}

function Services({ onCTAClick }) {
  return (
    <section style={{ padding: "120px 0", background: "var(--card)", borderTop: "1px solid var(--line2)", borderBottom: "1px solid var(--line2)" }}>
      <div className="wrap">
        <h2 className="display" style={{ fontSize: "clamp(40px, 6vw, 88px)", margin: "0 0 24px", maxWidth: 1000 }}>
          אתה מדבר.<br />
          <span style={{ color: "var(--accent)" }}>אנחנו נדאג לכל השאר.</span>
        </h2>
        <p style={{ fontSize: 19, lineHeight: 1.7, opacity: 0.85, maxWidth: 860, margin: "0 0 64px" }}>
          אתה לא צריך סטודיו. לא צריך עורך. לא צריך לדעת איך מעלים פרק לספוטיפיי או איך מעצבים thumbnail ליוטיוב. {"\n"}
          אנחנו בונים את כל המכונה.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 20 }}>
          {SERVICES.map((s, i) => {
            const colSpan = s.highlight ? 6 : i === 0 || i === 1 ? 3 : 3;
            return (
              <div key={i} style={{
                gridColumn: s.highlight ? "span 6" : "span 3",
                background: s.highlight ? "var(--bg)" : "var(--bg)",
                borderRadius: 20, padding: s.highlight ? 48 : 32,
                border: `${s.highlight ? 2 : 1}px solid ${s.highlight ? "var(--accent)" : "var(--line2)"}`,
                position: "relative", overflow: "hidden"
              }}>
                {s.highlight &&
                <div className="mono" style={{
                  position: "absolute", top: 20, left: 20,
                  padding: "6px 12px", background: "var(--accent)", color: "#0A0A0A",
                  borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em"
                }}>
                    AI-POWERED · הבידול שלנו
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
                  fontSize: s.highlight ? 44 : 28,
                  margin: "0 0 14px", fontWeight: 900,
                  position: "relative", zIndex: 2,
                  maxWidth: s.highlight ? 700 : "none"
                }}>
                  {s.title}
                </h3>
                <p style={{
                  fontSize: s.highlight ? 18 : 15,
                  lineHeight: 1.65, opacity: 0.85, margin: 0,
                  position: "relative", zIndex: 2,
                  maxWidth: s.highlight ? 820 : "none"
                }}>
                  {s.body}
                </p>
                {s.extra &&
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
                }
              </div>);

          })}
        </div>

        <div style={{ marginTop: 48, textAlign: "center" }}>
          <button className="btn btn-primary" onClick={onCTAClick} style={{ padding: "20px 32px", fontSize: 17 }}>
            אני רוצה לראות איך זה נראה בעסק שלי ←
          </button>
        </div>
      </div>
    </section>);

}

function HowItWorks() {
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
    <section id="how" style={{ padding: "120px 0" }}>
      <div className="wrap">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 64, gap: 40, flexWrap: "wrap" }}>
          <div>
            <h2 className="display" style={{ fontSize: "clamp(40px, 6vw, 88px)", margin: "0", maxWidth: 900, color: "rgb(255, 213, 0)" }}>
              שלושה שלבים.<br />
              <span style={{ color: "rgb(255, 255, 255)" }}>ואתה כמעט לא מרגיש את זה.</span>
            </h2>
          </div>
          <div className="mono" style={{ fontSize: 12, opacity: 0.5, letterSpacing: "0.15em" }}>
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

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, position: "relative", zIndex: 1 }}>
            {STEPS.map((s, i) => {
              const isActive = shown === i;
              const reached = i <= shown;
              return (
                <div
                  key={i}
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
                    transform: isActive ? "translateY(-8px)" : "translateY(0)",
                    boxShadow: isActive ?
                    "0 24px 60px -20px rgba(255,213,0,0.35), 0 0 0 1px rgba(255,213,0,0.2) inset" :
                    "0 0 0 0 rgba(0,0,0,0)",
                    transition: "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s ease, border-color 0.3s ease, background 0.3s ease"
                  }}>
                  
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
      `}</style>
    </section>);

}

function WhoItsFor() {
  return (
    <section style={{ padding: "120px 0", background: "var(--card)", borderTop: "1px solid var(--line2)", borderBottom: "1px solid var(--line2)" }}>
      <div className="wrap" style={{ maxWidth: 1100 }}>
        <h2 className="display" style={{ fontSize: "clamp(38px, 5.5vw, 78px)", margin: "0 0 56px", maxWidth: 1000 }}>
          פודקאסט זה <span style={{ opacity: 0.55 }}>לא</span> לכל אחד.<br />
          זה עובד חזק במיוחד ל:
        </h2>

        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 0 }}>
          {AUDIENCE.map((a, i) =>
          <li key={i} style={{
            display: "flex", gap: 24, alignItems: "start",
            padding: "28px 0",
            borderBottom: i < AUDIENCE.length - 1 ? "1px solid var(--line2)" : "none"
          }}>
              <span style={{
              flexShrink: 0, width: 36, height: 36, borderRadius: "50%",
              background: "var(--accent)", color: "#0A0A0A",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: 16, marginTop: 2
            }}>✓</span>
              <p style={{ fontSize: 20, lineHeight: 1.55, margin: 0 }}>
                <strong style={{ fontWeight: 800, fontFamily: "var(--font-display)" }}>{a.bold}</strong>{" — "}
                <span style={{ opacity: 0.8 }}>{a.rest}</span>
              </p>
            </li>
          )}
        </ul>

        <InteractiveVerdict />
      </div>
    </section>);

}

function InteractiveVerdict() {
  const [side, setSide] = React.useState(1); // 0 = not your tool, 1 = your tool
  const [auto, setAuto] = React.useState(true);

  React.useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setSide((s) => 1 - s), 4200);
    return () => clearInterval(id);
  }, [auto]);

  const VERDICTS = [
  {
    tag: "לא בשבילך",
    headline: "אם אתה מוכר משהו שנקנה ב־30 שניות ללא מחשבה",
    verdict: "פודקאסט הוא לא הכלי שלך.",
    icon: "✗",
    tone: "mute"
  },
  {
    tag: "זה בשבילך",
    headline: "אם אתה מוכר אמון, ניסיון, או ידע",
    verdict: "כמעט ואין כלי שיעבוד בשבילך טוב יותר.",
    icon: "✓",
    tone: "accent"
  }];


  return (
    <div
      onMouseLeave={() => setAuto(true)}
      style={{ marginTop: 56, position: "relative" }}>
      
      {/* Tabs */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        {VERDICTS.map((v, i) => {
          const on = side === i;
          return (
            <button
              key={i}
              onMouseEnter={() => {setAuto(false);setSide(i);}}
              onClick={() => {setAuto(false);setSide(i);}}
              style={{
                flex: 1,
                textAlign: "right",
                background: on ? i === 1 ? "var(--accent)" : "#1a1a1a" : "transparent",
                color: on ? i === 1 ? "#0A0A0A" : "#fff" : "rgba(255,255,255,0.5)",
                border: `1px solid ${on ? i === 1 ? "var(--accent)" : "#333" : "var(--line2)"}`,
                borderRadius: 12,
                padding: "14px 20px",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.12em",
                fontFamily: "var(--font-mono)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex", alignItems: "center", gap: 10
              }}>
              
              <span style={{
                display: "inline-flex", width: 22, height: 22, borderRadius: "50%",
                alignItems: "center", justifyContent: "center",
                background: on ? i === 1 ? "#0A0A0A" : "var(--accent)" : "rgba(255,255,255,0.1)",
                color: on ? i === 1 ? "var(--accent)" : "#0A0A0A" : "rgba(255,255,255,0.4)",
                fontSize: 13, fontWeight: 900
              }}>{v.icon}</span>
              {v.tag}
            </button>);

        })}
      </div>

      {/* Stage */}
      <div style={{
        position: "relative",
        borderRadius: 18,
        overflow: "hidden",
        minHeight: 260,
        background: side === 1 ? "rgba(255,213,0,0.08)" : "#0F0F0F",
        border: `1.5px solid ${side === 1 ? "var(--accent)" : "#222"}`,
        transition: "background 0.5s ease, border-color 0.5s ease"
      }}>
        {/* Diagonal yellow wash that animates in on 'your tool' side */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(255,213,0,0.18) 0%, transparent 55%)",
          opacity: side === 1 ? 1 : 0,
          transition: "opacity 0.6s ease",
          pointerEvents: "none"
        }} />
        {/* Giant ghost icon */}
        <div style={{
          position: "absolute", left: -30, bottom: -80,
          fontFamily: "var(--font-display)", fontWeight: 900,
          fontSize: 340, lineHeight: 0.85,
          color: side === 1 ? "var(--accent)" : "#fff",
          opacity: side === 1 ? 0.14 : 0.04,
          transition: "all 0.6s ease",
          pointerEvents: "none"
        }}>{VERDICTS[side].icon}</div>

        {/* Crossfade content */}
        {VERDICTS.map((v, i) => {
          const on = side === i;
          return (
            <div key={i} style={{
              position: i === 0 ? "absolute" : "relative",
              inset: i === 0 ? 0 : undefined,
              padding: "44px 48px",
              opacity: on ? 1 : 0,
              transform: on ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.45s ease, transform 0.45s ease",
              pointerEvents: on ? "auto" : "none",
              zIndex: on ? 2 : 1
            }}>
              <div className="mono" style={{
                fontSize: 12, letterSpacing: "0.2em",
                color: i === 1 ? "var(--accent)" : "rgba(255,255,255,0.45)",
                marginBottom: 16
              }}>VERDICT · 0{i + 1}</div>
              <p className="display" style={{
                fontSize: "clamp(22px, 2.6vw, 32px)",
                lineHeight: 1.35, margin: 0, fontWeight: 700,
                color: i === 1 ? "#fff" : "rgba(255,255,255,0.55)"
              }}>
                {v.headline} —<br />
                <span style={{
                  color: i === 1 ? "var(--accent)" : "#fff",
                  fontWeight: 900
                }}>{v.verdict}</span>
              </p>
            </div>);

        })}
      </div>
    </div>);

}

function WhyUs() {
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
    <section id="why" style={{ padding: "120px 0" }}>
      <div className="wrap">
        <h2 className="display" style={{ fontSize: "clamp(38px, 6vw, 84px)", margin: "0 0 64px", maxWidth: 1100 }}>
          אנחנו לא חברת הפקה.<br />
          <span style={{ color: "var(--accent)" }}>אנחנו שותפים לתוצאה העסקית.</span>
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
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

function Results() {
  return (
    <section id="results" style={{ padding: "120px 0", background: "var(--card)", borderTop: "1px solid var(--line2)", borderBottom: "1px solid var(--line2)" }}>
      <div className="wrap">
        <h2 className="display" style={{ fontSize: "clamp(38px, 6vw, 84px)", margin: "0 0 56px", maxWidth: 1100 }}>
          המספרים מאחורי<br />
          <span style={{ color: "var(--accent)" }}>הפודקאסטים שאנחנו מייצרים.</span>
        </h2>

        {/* Placeholder notice */}
        <div style={{
          padding: 24,
          background: "rgba(255,213,0,0.06)",
          border: "1px dashed rgba(255,213,0,0.35)",
          borderRadius: 14,
          marginBottom: 48,
          display: "flex", gap: 14, alignItems: "center"
        }}>
          <span className="mono" style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.15em",
            padding: "4px 10px", background: "var(--accent)", color: "#0A0A0A", borderRadius: 999
          }}>PLACEHOLDER</span>
          <span style={{ fontSize: 14, opacity: 0.75 }}>
            נדרש תוכן אמיתי — שמות לקוחות, מספרים, ציטוטים. עד אז, מוצגות מסגרות ריקות ברורות.
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[1, 2, 3].map((i) =>
          <div key={i} style={{
            background: "var(--bg)", borderRadius: 20, padding: 32,
            border: "1px dashed var(--line2)",
            minHeight: 340, display: "flex", flexDirection: "column", justifyContent: "space-between"
          }}>
              <div>
                <div className="mono" style={{ fontSize: 11, opacity: 0.4, marginBottom: 12 }}>
                  CASE #{String(i).padStart(2, "0")}
                </div>
                <div style={{
                width: 60, height: 60, borderRadius: 12,
                border: "1px dashed var(--line2)", marginBottom: 18,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, color: "var(--muted)", opacity: 0.5
              }}>לוגו</div>
                <div style={{ fontSize: 15, fontWeight: 700, opacity: 0.5 }}>שם הלקוח / תחום</div>
              </div>
              <div>
                <div className="display" style={{ fontSize: 56, color: "var(--accent)", opacity: 0.35, fontWeight: 900 }}>
                  —
                </div>
                <div className="mono" style={{ fontSize: 11, opacity: 0.4, marginTop: 4 }}>
                  KPI · לידים · צפיות
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Featured platforms */}
        <div style={{ marginTop: 64 }}>
          <div className="mono" style={{ fontSize: 12, opacity: 0.45, marginBottom: 16 }}>— הפרקים שלנו מופיעים ב:</div>
          <LogoMarquee />
        </div>
      </div>
    </section>);

}

function FAQSection() {
  const [openIdx, setOpenIdx] = React.useState(0);
  return (
    <section id="faq" style={{ padding: "120px 0" }}>
      <div className="wrap" style={{ maxWidth: 1000 }}>
        <span className="mono" style={{ fontSize: 13, opacity: 0.5 }}>09 / שאלות</span>
        <h2 className="display" style={{ fontSize: "clamp(40px, 6vw, 88px)", margin: "12px 0 56px" }}>
          שאלות <span style={{ color: "var(--accent)" }}>ותשובות.</span>
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
                padding: "28px 4px",
                cursor: "pointer",
                background: isOpen ? "rgba(255,213,0,0.04)" : "transparent",
                transition: "background .25s ease"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 20, flex: 1 }}>
                    <span className="mono" style={{
                      fontSize: 12, opacity: isOpen ? 1 : 0.4,
                      color: isOpen ? "var(--accent)" : "inherit", minWidth: 28
                    }}>{String(i + 1).padStart(2, "0")}</span>
                    <span style={{
                      fontSize: 20, fontWeight: 700,
                      color: isOpen ? "var(--accent)" : "inherit"
                    }}>{f.q}</span>
                  </div>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    border: `1.5px solid ${isOpen ? "var(--accent)" : "var(--line2)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative", flexShrink: 0,
                    transition: "border-color .25s, transform .3s",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0)",
                    background: isOpen ? "var(--accent)" : "transparent"
                  }}>
                    <span style={{ width: 12, height: 1.5, background: isOpen ? "#0A0A0A" : "currentColor" }} />
                    <span style={{
                      width: 1.5, height: 12, background: isOpen ? "#0A0A0A" : "currentColor",
                      position: "absolute",
                      transform: isOpen ? "scaleY(0)" : "scaleY(1)",
                      transition: "transform .25s"
                    }} />
                  </div>
                </div>
                <div style={{
                  display: "grid",
                  gridTemplateRows: isOpen ? "1fr" : "0fr",
                  transition: "grid-template-rows .35s ease",
                  marginTop: isOpen ? 18 : 0
                }}>
                  <div style={{ overflow: "hidden", paddingRight: 48 }}>
                    <p style={{ margin: 0, fontSize: 17, lineHeight: 1.75, opacity: 0.85 }}>{f.a}</p>
                  </div>
                </div>
              </div>);

          })}
        </div>
      </div>
    </section>);

}

function FinalCTA({ form }) {
  const { values, setField, errors, touched, blur, submit, submitted } = form;
  return (
    <section id="cta" style={{ padding: "120px 0 60px", position: "relative", overflow: "hidden" }}>
      {/* Decorative giant type watermark */}
      <div aria-hidden style={{
        position: "absolute", right: "-2%", bottom: "-10%",
        fontFamily: "var(--font-display)", fontWeight: 900,
        fontSize: "clamp(200px, 28vw, 520px)",
        letterSpacing: "-0.05em", lineHeight: 0.8,
        color: "var(--accent)", opacity: 0.06,
        pointerEvents: "none", userSelect: "none"
      }}>PULL</div>

      <div className="wrap" style={{ position: "relative", zIndex: 2 }}>
        <div style={{
          background: "var(--accent)", color: "#0A0A0A",
          borderRadius: 28, padding: "80px 56px",
          position: "relative", overflow: "hidden"
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 60, alignItems: "center" }}>
            <div>
              <span className="mono" style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.15em" }}>
                10 / שיחת היכרות
              </span>
              <h2 className="display" style={{
                fontSize: "clamp(42px, 6.5vw, 96px)",
                margin: "20px 0 28px", color: "#0A0A0A", fontWeight: 900
              }}>
                מוכן להפסיק<br />
                לרדוף אחרי לקוחות?
              </h2>
              <p style={{ fontSize: 20, lineHeight: 1.55, margin: "0 0 16px", maxWidth: 520 }}>
                במקום זה — בוא ניצור משהו שהם ירדפו אחריו.
                שיחת היכרות של 30 דקות, ללא עלות וללא מחויבות.
                נבין ביחד אם פודקאסט הוא הכלי הנכון לעסק שלך — ואם כן, איך נראה הפורמט שיעבוד בשבילך.
              </p>
            </div>

            {submitted ?
            <div style={{
              background: "#0A0A0A", color: "#F5F2E8",
              borderRadius: 20, padding: 40
            }}>
                <div style={{ fontSize: 56, marginBottom: 12, color: "var(--accent)" }}>✓</div>
                <h3 className="display" style={{ fontSize: 36, margin: "0 0 12px", color: "var(--accent)" }}>קיבלנו!</h3>
                <p style={{ fontSize: 17, lineHeight: 1.6, opacity: 0.85 }}>
                  נחזור אליך תוך 24 שעות לקביעת שיחה.
                  אין שיחת מכירה לוחצת — רק שיחת אבחון אמיתית.
                </p>
              </div> :

            <form onSubmit={submit} style={{
              background: "#0A0A0A", color: "#F5F2E8",
              borderRadius: 20, padding: 32,
              display: "flex", flexDirection: "column", gap: 14
            }}>
                <div className={`field ${errors.name && touched.name ? "error" : ""}`}>
                  <label>שם מלא</label>
                  <input value={values.name} onChange={(e) => setField("name", e.target.value)} onBlur={() => blur("name")} placeholder="משה לוי" />
                  {errors.name && touched.name && <span className="err">{errors.name}</span>}
                </div>
                <div className={`field ${errors.phone && touched.phone ? "error" : ""}`}>
                  <label>טלפון</label>
                  <input dir="ltr" value={values.phone} onChange={(e) => setField("phone", e.target.value)} onBlur={() => blur("phone")} placeholder="054-000-0000" />
                  {errors.phone && touched.phone && <span className="err">{errors.phone}</span>}
                </div>
                <div className={`field ${errors.email && touched.email ? "error" : ""}`}>
                  <label>אימייל (לא חובה)</label>
                  <input dir="ltr" value={values.email} onChange={(e) => setField("email", e.target.value)} onBlur={() => blur("email")} placeholder="you@company.com" />
                  {errors.email && touched.email && <span className="err">{errors.email}</span>}
                </div>
                <button type="submit" className="btn btn-primary" style={{
                marginTop: 8, justifyContent: "center", padding: "20px",
                background: "var(--accent)", color: "#0A0A0A", fontSize: 17
              }}>
                  בוא נקבע שיחה ←
                </button>
                <p className="mono" style={{
                fontSize: 11, opacity: 0.55, margin: "6px 0 0",
                textAlign: "center", lineHeight: 1.6
              }}>
                  אין שיחת מכירה לוחצת. רק שיחת אבחון אמיתית —<br />
                  גם אם בסוף נחליט שזה לא מתאים.
                </p>
              </form>
            }
          </div>
        </div>
      </div>
    </section>);

}

function GuestStrip() {
  return (
    <section style={{
      padding: "120px 0 100px",
      position: "relative", overflow: "hidden",
      background: "var(--bg)",
      borderTop: "1px solid var(--line2)"
    }}>
      {/* Ambient glow */}
      <div aria-hidden="true" style={{
        position: "absolute", top: "30%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 900, height: 400,
        background: "radial-gradient(ellipse, rgba(255,213,0,0.06), transparent 70%)",
        pointerEvents: "none", filter: "blur(40px)"
      }} />

      <div className="wrap" style={{ position: "relative", zIndex: 2, marginBottom: 56 }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
          <div>
            <div className="mono" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "8px 14px", borderRadius: 999,
              background: "rgba(255,213,0,0.08)",
              border: "1px solid rgba(255,213,0,0.3)",
              fontSize: 11, letterSpacing: "0.18em",
              color: "var(--accent)", marginBottom: 24
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: "50%",
                background: "var(--accent)", boxShadow: "0 0 8px var(--accent)",
                animation: "pulse 1.6s ease-in-out infinite"
              }} />
              FROM THE STUDIO
            </div>
            <h2 className="display" style={{
              fontSize: "clamp(40px, 6vw, 88px)",
              margin: 0, fontWeight: 900, lineHeight: 0.95,
              maxWidth: 900
            }}>
              עשרות אורחים.<br />
              <span style={{ color: "var(--accent)" }}>מאות פרקים.</span>
            </h2>
          </div>
          <p style={{
            fontSize: 18, lineHeight: 1.6, opacity: 0.7,
            margin: 0, maxWidth: 380
          }}>
            מבעלי עסקים ומנכ״לים ועד יוצרי תוכן ומותגי צריכה — דוגמית מהאולפן שלנו, בפעולה.
          </p>
        </div>
      </div>

      {/* Marquee rows */}
      <div style={{ position: "relative" }}>
        {/* Edge vignettes */}
        <div aria-hidden="true" style={{
          position: "absolute", top: 0, bottom: 0, right: 0,
          width: 140, zIndex: 3, pointerEvents: "none",
          background: "linear-gradient(to left, var(--bg), transparent)"
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", top: 0, bottom: 0, left: 0,
          width: 140, zIndex: 3, pointerEvents: "none",
          background: "linear-gradient(to right, var(--bg), transparent)"
        }} />

        <div className="guest-marquee-row" style={{
          display: "flex", gap: 0, marginBottom: 18,
          animation: "marquee-rtl 60s linear infinite",
          width: "max-content"
        }}>
          <img src="assets/guests-row-1.png" alt="" style={{ height: 260, width: "auto", display: "block", flexShrink: 0 }} />
          <img src="assets/guests-row-1.png" alt="" style={{ height: 260, width: "auto", display: "block", flexShrink: 0 }} aria-hidden="true" />
        </div>

        <div className="guest-marquee-row" style={{
          display: "flex", gap: 0,
          animation: "marquee-ltr 75s linear infinite",
          width: "max-content"
        }}>
          <img src="assets/guests-row-2.png" alt="" style={{ height: 260, width: "auto", display: "block", flexShrink: 0 }} />
          <img src="assets/guests-row-2.png" alt="" style={{ height: 260, width: "auto", display: "block", flexShrink: 0 }} aria-hidden="true" />
        </div>
      </div>

      <div className="wrap" style={{
        marginTop: 56, display: "flex",
        alignItems: "center", gap: 24, flexWrap: "wrap",
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1, color: "var(--accent)" }}>+50</div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: "0.15em", opacity: 0.6, marginTop: 6 }}>אורחים</div>
          </div>
          <div style={{ width: 1, height: 40, background: "var(--line2)" }} />
          <div>
            <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1, color: "var(--accent)" }}>+300</div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: "0.15em", opacity: 0.6, marginTop: 6 }}>פרקים</div>
          </div>
          <div style={{ width: 1, height: 40, background: "var(--line2)" }} />
          <div>
            <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1, color: "var(--accent)" }}>4</div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: "0.15em", opacity: 0.6, marginTop: 6 }}>סטים באולפן</div>
          </div>
        </div>
        <div className="mono" style={{ fontSize: 12, letterSpacing: "0.2em", opacity: 0.5 }}>
          CUTS STUDIO · TEL AVIV
        </div>
      </div>

      <style>{`
        @keyframes marquee-rtl {
          from { transform: translateX(0); }
          to { transform: translateX(50%); }
        }
        @keyframes marquee-ltr {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .guest-marquee-row:hover { animation-play-state: paused; }
        @media (max-width: 768px) {
          .guest-marquee-row img { height: 180px !important; }
        }
      `}</style>
    </section>);

}

function BoldVariation({ onCTAClick, form }) {
  return (
    <div className="fade-in">
      <TopNav variant="bold" onCTAClick={onCTAClick} />
      <Hero onCTAClick={onCTAClick} />
      <Problem />
      <Solution />
      <CTAInline onCTAClick={onCTAClick} />
      <Services onCTAClick={onCTAClick} />
      <HowItWorks />
      <WhoItsFor />
      <GuestStrip />
      <Results />
      <FAQSection />
      <FinalCTA form={form} />
      <Footer variant="bold" />
    </div>);

}

Object.assign(window, { BoldVariation });