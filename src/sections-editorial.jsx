// Variation 2: EDITORIAL
// Cream background, black type, magazine / newspaper energy.
// Minimal, typography-first, yellow used as accent chip only.

function EdHero({ onCTAClick }) {
  return (
    <section style={{ padding: "40px 0 80px", borderTop: "1px solid var(--line2)" }}>
      <div className="wrap">
        {/* Top bar — newspaper style */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          borderBottom: "1px solid var(--line2)", paddingBottom: 12, marginBottom: 48,
          fontFamily: "var(--font-mono)", fontSize: 12, opacity: 0.6,
        }}>
          <span>גיליון 024 · עונה 2026</span>
          <span>אולפן פודקאסטים · פתח תקווה</span>
          <span>יום שני · 20 באפריל</span>
        </div>

        {/* Masthead headline */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span style={{
            display: "inline-block", padding: "4px 12px",
            background: "#FFD500", color: "#0A0A0A",
            fontFamily: "var(--font-mono)", fontSize: 12,
            fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.12em", marginBottom: 24,
          }}>פודקאסט סטודיו — קבעו שיחה</span>

          <h1 className="display" style={{
            fontSize: "clamp(64px, 11vw, 180px)",
            margin: 0, letterSpacing: "-0.04em",
            fontFamily: "'Rubik', serif",
            fontWeight: 900,
          }}>
            הפודקאסט
            <br />
            <em style={{ fontStyle: "italic", fontWeight: 400, fontFamily: "'Rubik', serif" }}>שלך</em>,
            <br />
            ברמה אחרת.
          </h1>

          <p style={{
            fontSize: 22, lineHeight: 1.6, maxWidth: 680, margin: "40px auto 0",
            opacity: 0.75,
          }}>
            אולפן פודקאסטים בפתח תקווה. מצלמים בארבע מצלמות, עורכים, ומספקים
            ריילסים מוכנים לרשת — תוך שלושה ימי עבודה.
          </p>

          <div style={{ marginTop: 40, display: "flex", gap: 14, justifyContent: "center" }}>
            <button className="btn btn-primary" onClick={onCTAClick} style={{ background: "#0A0A0A", color: "#FAF7F0" }}>
              לקביעת שיחה ←
            </button>
            <a className="btn btn-ghost" href="#work" onClick={(e) => { e.preventDefault(); scrollToId("#work"); }}>
              ראו עבודות
            </a>
          </div>
        </div>

        {/* Dense meta bar */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0,
          borderTop: "1px solid var(--line2)", borderBottom: "1px solid var(--line2)",
          padding: "28px 0",
        }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              padding: "0 24px",
              borderLeft: i < STATS.length - 1 ? "1px solid var(--line2)" : "none",
              textAlign: "center",
            }}>
              <div className="display" style={{ fontSize: 48, fontWeight: 900 }}>{s.v}</div>
              <div className="mono" style={{ fontSize: 11, opacity: 0.6, marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EdLogos() {
  return (
    <section style={{ padding: "60px 0 0" }}>
      <div className="wrap" style={{ marginBottom: 20 }}>
        <span className="mono" style={{ fontSize: 12, opacity: 0.5 }}>— אמון על ידי</span>
      </div>
      <LogoMarquee />
    </section>
  );
}

function EdHowItWorks() {
  return (
    <section id="how" style={{ padding: "120px 0" }}>
      <div className="wrap">
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <span className="mono" style={{ fontSize: 13, opacity: 0.5 }}>§ 01 — התהליך</span>
          <h2 className="display" style={{ fontSize: "clamp(40px, 6.5vw, 96px)", margin: "12px 0 0", letterSpacing: "-0.03em" }}>
            שלושה שלבים.<br/>
            <em style={{ fontStyle: "italic", fontWeight: 400 }}>בלי הפתעות.</em>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{
              padding: "32px 32px 24px",
              borderLeft: i < 2 ? "1px solid var(--line2)" : "none",
              position: "relative",
            }}>
              <div style={{
                display: "flex", alignItems: "baseline", justifyContent: "space-between",
                marginBottom: 24, paddingBottom: 12,
                borderBottom: "1px solid var(--line2)",
              }}>
                <span className="display" style={{ fontSize: 72, lineHeight: 0.9, fontWeight: 900 }}>{s.n}</span>
                <span className="mono" style={{ fontSize: 11, opacity: 0.5 }}>{s.meta}</span>
              </div>
              <h3 style={{ fontSize: 28, margin: "0 0 12px", fontWeight: 700, fontFamily: "var(--font-display)" }}>{s.title}</h3>
              <p style={{ fontSize: 16, lineHeight: 1.65, opacity: 0.75, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EdVideoDemo() {
  return (
    <section id="work" style={{ padding: "40px 0 120px" }}>
      <div className="wrap">
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "baseline",
          paddingBottom: 20, borderBottom: "2px solid var(--fg)", marginBottom: 40,
        }}>
          <h2 className="display" style={{ fontSize: "clamp(32px, 4vw, 56px)", margin: 0, fontWeight: 900 }}>§ 02 — עבודות נבחרות</h2>
          <span className="mono" style={{ fontSize: 12, opacity: 0.5 }}>CASE STUDIES · 2025–2026</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
          <MediaPlaceholder label="FEATURED" big dark />
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
              <span className="mono" style={{ fontSize: 11, opacity: 0.5 }}>עבודה נבחרת · אפריל</span>
              <h3 style={{ fontSize: 28, margin: "8px 0 12px", fontFamily: "var(--font-display)", fontWeight: 800 }}>
                ״על קצה המזלג״ — עונה 3
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.6, opacity: 0.75, margin: 0 }}>
                הפקנו עונה שלמה של 12 פרקים, כולל ריילסים שצברו 8.2 מיליון צפיות.
                ממוצע צפייה: 4.7 דקות לפרק.
              </p>
            </div>
            <div style={{ borderTop: "1px solid var(--line2)", paddingTop: 20, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
              {[["8.2M", "צפיות"], ["12", "פרקים"], ["96", "ריילסים"]].map(([v, l], i) => (
                <div key={i}>
                  <div className="display" style={{ fontSize: 28, fontWeight: 900 }}>{v}</div>
                  <div className="mono" style={{ fontSize: 10, opacity: 0.6 }}>{l}</div>
                </div>
              ))}
            </div>
            <a href="#" style={{
              padding: "12px 16px", border: "1px solid currentColor", borderRadius: 999,
              fontSize: 14, textAlign: "center", fontWeight: 600,
            }}>לכל הפרויקטים →</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function EdTestimonials() {
  return (
    <section id="testimonials" style={{ padding: "120px 0", background: "#F0ECDF", borderTop: "1px solid var(--line2)", borderBottom: "1px solid var(--line2)" }}>
      <div className="wrap">
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <span className="mono" style={{ fontSize: 13, opacity: 0.5 }}>§ 03 — המלצות</span>
          <h2 className="display" style={{ fontSize: "clamp(36px, 5vw, 72px)", margin: "12px 0 0", letterSpacing: "-0.03em" }}>
            ״העבודה מדברת<br/>
            <em style={{ fontStyle: "italic", fontWeight: 400 }}>בשבילנו.״</em>
          </h2>
        </div>

        <div style={{ columns: 2, columnGap: 24 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{
              breakInside: "avoid", marginBottom: 24,
              background: "var(--paper)", padding: 28,
              border: "1px solid var(--line2)", borderRadius: 4,
            }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 48, lineHeight: 0.6, display: "block", marginBottom: 12 }}>״</span>
              <p style={{ fontSize: 18, lineHeight: 1.55, margin: "0 0 20px", fontWeight: 500 }}>{t.quote}</p>
              <div style={{ paddingTop: 16, borderTop: "1px solid var(--line2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                  <div className="mono" style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>{t.role}</div>
                </div>
                <span className="mono" style={{ fontSize: 11, opacity: 0.4 }}>#{String(i + 1).padStart(3, "0")}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EdCTABanner({ form }) {
  const { values, setField, errors, touched, blur, submit, submitted } = form;
  return (
    <section id="cta" style={{ padding: "120px 0" }}>
      <div className="wrap" style={{ maxWidth: 960 }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span className="mono" style={{ fontSize: 13, opacity: 0.5 }}>§ 04 — צרו קשר</span>
          <h2 className="display" style={{ fontSize: "clamp(40px, 6vw, 84px)", margin: "12px 0 16px", letterSpacing: "-0.03em" }}>
            השאירו פרטים.<br/>נחזור אליכם היום.
          </h2>
          <p style={{ fontSize: 18, opacity: 0.7, margin: 0 }}>שיחת ייעוץ של 30 דקות · חינם · בלי התחייבות</p>
        </div>

        {submitted ? (
          <div style={{ textAlign: "center", padding: 60, background: "#FFD500", borderRadius: 4, border: "2px solid #0A0A0A" }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>✓</div>
            <h3 className="display" style={{ fontSize: 40, margin: "0 0 12px" }}>תודה — קיבלנו!</h3>
            <p style={{ fontSize: 16, margin: 0, opacity: 0.85 }}>ניצור קשר תוך 24 שעות.</p>
          </div>
        ) : (
          <form onSubmit={submit} style={{
            border: "2px solid var(--fg)", padding: 40, borderRadius: 4,
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20,
          }}>
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
            <div className={`field ${errors.email && touched.email ? "error" : ""}`} style={{ gridColumn: "1 / -1" }}>
              <label>אימייל</label>
              <input dir="ltr" value={values.email} onChange={e => setField("email", e.target.value)} onBlur={() => blur("email")} />
              {errors.email && touched.email && <span className="err">{errors.email}</span>}
            </div>
            <div className={`field ${errors.goal && touched.goal ? "error" : ""}`} style={{ gridColumn: "1 / -1" }}>
              <label>מה אתם מחפשים?</label>
              <select value={values.goal} onChange={e => setField("goal", e.target.value)} onBlur={() => blur("goal")}>
                <option value="">בחרו אפשרות…</option>
                <option value="new">להתחיל פודקאסט מאפס</option>
                <option value="existing">פודקאסט קיים שצריך שדרוג</option>
                <option value="reels">ריילסים מפודקאסט קיים</option>
                <option value="brand">תוכן וידאו למותג</option>
              </select>
              {errors.goal && touched.goal && <span className="err">{errors.goal}</span>}
            </div>
            <button type="submit" className="btn btn-primary" style={{ gridColumn: "1 / -1", justifyContent: "center", background: "#0A0A0A", color: "#FAF7F0", padding: "18px", fontSize: 16 }}>
              שלחו את הבקשה ←
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function EdFAQ() {
  return (
    <section id="faq" style={{ padding: "120px 0" }}>
      <div className="wrap">
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "baseline",
          paddingBottom: 20, borderBottom: "2px solid var(--fg)", marginBottom: 8,
        }}>
          <h2 className="display" style={{ fontSize: "clamp(32px, 4vw, 56px)", margin: 0, fontWeight: 900 }}>§ 05 — שאלות נפוצות</h2>
          <span className="mono" style={{ fontSize: 12, opacity: 0.5 }}>FAQ</span>
        </div>
        {FAQ.map((f, i) => (
          <details key={i} className="faq">
            <summary>
              <span style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <span className="mono" style={{ fontSize: 13, opacity: 0.5 }}>{String(i + 1).padStart(2, "0")}</span>
                <span>{f.q}</span>
              </span>
              <span className="icon">+</span>
            </summary>
            <div className="answer" style={{ paddingRight: 40 }}>{f.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}

function EditorialVariation({ onCTAClick, form }) {
  return (
    <div className="fade-in">
      <TopNav variant="editorial" onCTAClick={onCTAClick} />
      <EdHero onCTAClick={onCTAClick} />
      <EdLogos />
      <EdHowItWorks />
      <EdVideoDemo />
      <EdTestimonials />
      <EdCTABanner form={form} />
      <EdFAQ />
      <Footer variant="editorial" />
    </div>
  );
}

Object.assign(window, { EditorialVariation });
