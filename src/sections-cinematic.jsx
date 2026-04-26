// Variation 3: CINEMATIC
// Dark warm background, red "ON AIR" accent, yellow highlights.
// Cinematic photography-forward, filmic.

function CinHero({ onCTAClick }) {
  return (
    <section style={{ position: "relative", padding: "60px 0 80px", overflow: "hidden" }}>
      {/* Film grain */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle at 20% 30%, rgba(230,57,70,0.15), transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,213,0,0.08), transparent 50%)",
      }} />
      <div className="wrap" style={{ position: "relative" }}>
        {/* ON AIR chip */}
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 40 }}>
          <span className="tag" style={{ color: "var(--accent)", borderColor: "var(--accent)" }}>
            <span className="dot pulse" style={{ background: "var(--accent)" }}></span>
            REC · ON AIR
          </span>
          <span className="mono" style={{ fontSize: 12, opacity: 0.5 }}>TAKE 001 · 48FPS · 4K</span>
          <span className="mono" style={{ fontSize: 12, opacity: 0.5, marginRight: "auto" }}>PETAH TIKVA · 32.087°N 34.887°E</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 48, alignItems: "center" }}>
          <div>
            <h1 className="display" style={{
              fontSize: "clamp(56px, 9vw, 156px)", margin: 0,
              fontWeight: 900, lineHeight: 0.9,
            }}>
              <span style={{ color: "var(--accent)" }}>אקשן.</span>
              <br/>
              <span style={{ fontFamily: "'Rubik', serif", fontStyle: "italic", fontWeight: 500 }}>לא קאט.</span>
            </h1>
            <p style={{ fontSize: 20, lineHeight: 1.6, margin: "36px 0 0", opacity: 0.85, maxWidth: 560 }}>
              אולפן פודקאסטים בפתח תקווה עם תשומת לב של צוות הפקה קולנועי.
              מצלמות סינמה, תאורה מדורגת, מיקרופוני שידור — וצוות שמבין שהפרק הוא סרט קצר של 45 דקות.
            </p>
            <div style={{ marginTop: 40, display: "flex", gap: 14 }}>
              <button className="btn" onClick={onCTAClick} style={{ background: "var(--yellow)", color: "#0A0A0A" }}>
                קבעו שיחת ייעוץ ←
              </button>
              <a className="btn btn-ghost" href="#work" onClick={(e) => { e.preventDefault(); scrollToId("#work"); }}>
                ▶ צפו בטריילר
              </a>
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <MediaPlaceholder label="LIVE TAKE" big accent="var(--accent)" />
            {/* Frame timecode */}
            <div className="mono" style={{
              position: "absolute", top: -16, left: -16, background: "var(--accent)", color: "#fff",
              padding: "6px 12px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
            }}>00:12:47:22</div>
            <div className="mono" style={{
              position: "absolute", bottom: -16, right: -16, background: "var(--yellow)", color: "#0A0A0A",
              padding: "6px 12px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
            }}>SCENE 02 / TAKE 1</div>
          </div>
        </div>

        {/* Stats as film crew roster */}
        <div style={{
          marginTop: 72, padding: "24px 0",
          borderTop: "1px solid var(--line2)", borderBottom: "1px solid var(--line2)",
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24,
        }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
              <div className="display" style={{ fontSize: 48, fontWeight: 900, color: i === 0 ? "var(--accent)" : i === 3 ? "var(--yellow)" : "inherit" }}>{s.v}</div>
              <div className="mono" style={{ fontSize: 11, opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CinLogos() {
  return (
    <section style={{ padding: "40px 0" }}>
      <div className="wrap" style={{ marginBottom: 16 }}>
        <span className="mono" style={{ fontSize: 11, opacity: 0.5 }}>★ STARRING — הקלטנו איתם</span>
      </div>
      <LogoMarquee />
    </section>
  );
}

function CinHowItWorks() {
  return (
    <section id="how" style={{ padding: "120px 0", position: "relative" }}>
      <div className="wrap">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 60, alignItems: "end", marginBottom: 72 }}>
          <div>
            <span className="mono" style={{ fontSize: 12, opacity: 0.5, color: "var(--accent)" }}>REEL 01 / PROCESS</span>
            <h2 className="display" style={{ fontSize: "clamp(40px, 6vw, 80px)", margin: "12px 0 0", fontWeight: 900 }}>
              לוח הצילומים.
            </h2>
          </div>
          <p style={{ fontSize: 18, lineHeight: 1.6, opacity: 0.7, margin: 0 }}>
            כל הפקה מתחילה בפרה־פרודקשן מדוייק: קהל יעד, פורמט, מבנה פרק, שאלות.
            מגיעים לאולפן עם שוטליסט, יוצאים עם סרט קצר.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{
              background: "var(--card)", padding: 32, position: "relative",
              borderTop: `3px solid ${i === 0 ? "var(--accent)" : i === 1 ? "var(--yellow)" : "var(--fg)"}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 28 }}>
                <span className="mono" style={{ fontSize: 11, opacity: 0.5 }}>SCENE {s.n}</span>
                <span className="mono" style={{ fontSize: 11, opacity: 0.5 }}>{s.meta}</span>
              </div>
              <div className="display" style={{ fontSize: 96, lineHeight: 0.9, fontWeight: 900, marginBottom: 20, color: i === 0 ? "var(--accent)" : i === 1 ? "var(--yellow)" : "var(--fg)" }}>{s.n}</div>
              <h3 style={{ fontSize: 30, margin: "0 0 14px", fontFamily: "var(--font-display)", fontWeight: 800 }}>{s.title}</h3>
              <p style={{ fontSize: 15, lineHeight: 1.65, opacity: 0.75, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CinVideoDemo() {
  return (
    <section id="work" style={{ padding: "60px 0 120px" }}>
      <div className="wrap">
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span className="mono" style={{ fontSize: 12, opacity: 0.5, color: "var(--accent)" }}>REEL 02 / SELECTED WORK</span>
          <h2 className="display" style={{ fontSize: "clamp(40px, 6vw, 84px)", margin: "12px 0 0", fontWeight: 900 }}>
            הרול <span style={{ color: "var(--yellow)" }}>של 2026.</span>
          </h2>
        </div>

        <MediaPlaceholder label="MAIN REEL · 02:34" big />

        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {["FRAME 001", "FRAME 047", "FRAME 188", "FRAME 312"].map((f, i) => (
            <div key={i} style={{ position: "relative" }}>
              <div style={{
                aspectRatio: "4/5", background: "#1A1210",
                backgroundImage: `repeating-linear-gradient(${45 + i * 30}deg, rgba(255,255,255,0.03) 0 8px, transparent 8px 16px)`,
                display: "flex", alignItems: "end", padding: 12,
              }}>
                <span className="mono" style={{ fontSize: 10, opacity: 0.7 }}>{f}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CinTestimonials() {
  const [idx, setIdx] = React.useState(0);
  const t = TESTIMONIALS[idx];
  return (
    <section id="testimonials" style={{ padding: "120px 0", background: "var(--card)" }}>
      <div className="wrap">
        <div style={{ marginBottom: 48 }}>
          <span className="mono" style={{ fontSize: 12, opacity: 0.5, color: "var(--accent)" }}>REEL 03 / VOICES</span>
          <h2 className="display" style={{ fontSize: "clamp(36px, 5vw, 72px)", margin: "12px 0 0", fontWeight: 900 }}>
            הם דיברו על <span style={{ color: "var(--accent)" }}>העבודה.</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 48, alignItems: "center" }}>
          <div>
            <div style={{
              aspectRatio: "1/1", background: "#0A0A0A",
              backgroundImage: "repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0 12px, transparent 12px 24px)",
              borderRadius: 8, position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-display)", fontSize: 120, fontWeight: 900,
                color: "var(--accent)", opacity: 0.3,
              }}>
                {t.name.split(" ").map(w => w[0]).join("")}
              </div>
              <span className="mono" style={{ position: "absolute", top: 12, right: 12, fontSize: 10, color: "var(--accent)" }}>● REC</span>
              <span className="mono" style={{ position: "absolute", bottom: 12, right: 12, fontSize: 10, opacity: 0.6 }}>INTERVIEW · {String(idx + 1).padStart(3, "0")}</span>
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 140, color: "var(--accent)", lineHeight: 0.5, marginBottom: 8 }}>״</div>
            <p style={{ fontSize: 32, lineHeight: 1.4, margin: 0, fontWeight: 500, fontFamily: "var(--font-display)" }}>
              {t.quote}
            </p>
            <div style={{ marginTop: 36, display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 24, borderTop: "1px solid var(--line2)" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>{t.name}</div>
                <div className="mono" style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>{t.role}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {TESTIMONIALS.map((_, i) => (
                  <button key={i} onClick={() => setIdx(i)} style={{
                    width: 10, height: 10, borderRadius: "50%",
                    background: i === idx ? "var(--accent)" : "var(--line2)",
                    transition: "all .2s",
                  }}/>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CinCTABanner({ form }) {
  const { values, setField, errors, touched, blur, submit, submitted } = form;
  return (
    <section id="cta" style={{ padding: "120px 0" }}>
      <div className="wrap">
        <div style={{
          border: "1px solid var(--accent)", borderRadius: 8,
          padding: 48, position: "relative",
        }}>
          <div className="mono" style={{
            position: "absolute", top: -14, right: 32,
            background: "var(--bg)", color: "var(--accent)",
            padding: "4px 12px", fontSize: 11, letterSpacing: "0.15em",
          }}>● BOOK YOUR SESSION</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 56 }}>
            <div>
              <h2 className="display" style={{ fontSize: "clamp(36px, 5vw, 72px)", margin: "0 0 20px", fontWeight: 900 }}>
                בואו נכתוב<br/>
                <span style={{ color: "var(--accent)" }}>את הסנריו.</span>
              </h2>
              <p style={{ fontSize: 18, lineHeight: 1.6, opacity: 0.75, margin: 0, maxWidth: 400 }}>
                שיחת ייעוץ של 30 דקות עם מפיק בכיר מהצוות. חינם, בלי התחייבות.
              </p>

              <div style={{ marginTop: 48, display: "grid", gap: 14 }}>
                {[
                  ["24h", "חזרנו אליכם"],
                  ["30 דק׳", "שיחת ייעוץ"],
                  ["0 ₪", "הכל חינם"],
                ].map(([v, l], i) => (
                  <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 14, paddingBottom: 12, borderBottom: "1px solid var(--line2)" }}>
                    <span className="display" style={{ fontSize: 36, color: "var(--yellow)", fontWeight: 900 }}>{v}</span>
                    <span className="mono" style={{ fontSize: 12, opacity: 0.6 }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>

            {submitted ? (
              <div style={{ background: "var(--card)", padding: 40, borderRadius: 4, display: "flex", flexDirection: "column", justifyContent: "center", border: "1px solid var(--accent)" }}>
                <div style={{ fontSize: 60, color: "var(--accent)", marginBottom: 16 }}>●</div>
                <h3 className="display" style={{ fontSize: 36, margin: "0 0 12px", fontWeight: 900 }}>THAT'S A WRAP.</h3>
                <p style={{ fontSize: 17, lineHeight: 1.6, opacity: 0.75 }}>קיבלנו את הבקשה. מפיק בכיר יצור איתך קשר תוך 24 שעות.</p>
              </div>
            ) : (
              <form onSubmit={submit} style={{ background: "var(--card)", padding: 32, borderRadius: 4, display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className={`field ${errors.name && touched.name ? "error" : ""}`}>
                    <label>שם מלא</label>
                    <input value={values.name} onChange={e => setField("name", e.target.value)} onBlur={() => blur("name")} />
                    {errors.name && touched.name && <span className="err">{errors.name}</span>}
                  </div>
                  <div className={`field ${errors.phone && touched.phone ? "error" : ""}`}>
                    <label>טלפון</label>
                    <input dir="ltr" value={values.phone} onChange={e => setField("phone", e.target.value)} onBlur={() => blur("phone")} />
                    {errors.phone && touched.phone && <span className="err">{errors.phone}</span>}
                  </div>
                </div>
                <div className={`field ${errors.email && touched.email ? "error" : ""}`}>
                  <label>אימייל</label>
                  <input dir="ltr" value={values.email} onChange={e => setField("email", e.target.value)} onBlur={() => blur("email")} />
                  {errors.email && touched.email && <span className="err">{errors.email}</span>}
                </div>
                <div className={`field ${errors.goal && touched.goal ? "error" : ""}`}>
                  <label>פורמט</label>
                  <select value={values.goal} onChange={e => setField("goal", e.target.value)} onBlur={() => blur("goal")}>
                    <option value="">בחרו פורמט…</option>
                    <option value="new">פודקאסט חדש</option>
                    <option value="existing">פודקאסט קיים</option>
                    <option value="reels">ריילסים בלבד</option>
                    <option value="brand">תוכן מותג</option>
                  </select>
                  {errors.goal && touched.goal && <span className="err">{errors.goal}</span>}
                </div>
                <button type="submit" className="btn" style={{ background: "var(--accent)", color: "#fff", justifyContent: "center", padding: "18px", marginTop: 6 }}>
                  ACTION ←
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function CinFAQ() {
  return (
    <section id="faq" style={{ padding: "60px 0 120px" }}>
      <div className="wrap">
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span className="mono" style={{ fontSize: 12, opacity: 0.5, color: "var(--accent)" }}>REEL 05 / Q&A</span>
          <h2 className="display" style={{ fontSize: "clamp(36px, 5vw, 72px)", margin: "12px 0 0", fontWeight: 900 }}>
            השאלות שקיבלנו <span style={{ color: "var(--yellow)" }}>הכי הרבה.</span>
          </h2>
        </div>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          {FAQ.map((f, i) => (
            <details key={i} className="faq">
              <summary>
                <span style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <span className="mono" style={{ fontSize: 13, color: "var(--accent)" }}>Q.{String(i + 1).padStart(2, "0")}</span>
                  <span>{f.q}</span>
                </span>
                <span className="icon" style={{ color: "var(--accent)" }}>+</span>
              </summary>
              <div className="answer">{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CinematicVariation({ onCTAClick, form }) {
  return (
    <div className="fade-in">
      <TopNav variant="cinematic" onCTAClick={onCTAClick} />
      <CinHero onCTAClick={onCTAClick} />
      <CinLogos />
      <CinHowItWorks />
      <CinVideoDemo />
      <CinTestimonials />
      <CinCTABanner form={form} />
      <CinFAQ />
      <Footer variant="cinematic" />
    </div>
  );
}

Object.assign(window, { CinematicVariation });
