// Shared primitives — rewritten per landing page brief (podcast production for B2B).

const LOGO_SRC = (typeof window !== "undefined" && window.__resources && window.__resources.cutsLogo) || "assets/cuts-logo.png";

const NAV = [
  { label: "איך זה עובד", href: "#how" },
  { label: "למה אנחנו", href: "#why" },
  { label: "תוצאות", href: "#results" },
  { label: "שאלות", href: "#faq" },
];

// SECTION 03 — three pillars
const PILLARS = [
  {
    n: "01",
    title: "קשר אישי עמוק",
    body: "30–60 דקות שבהן הלקוח הפוטנציאלי שומע אותך מדבר, חושב, מתלבט, צוחק. הוא מתחיל להרגיש שהוא מכיר אותך — לא כספק, כבן אדם.",
  },
  {
    n: "02",
    title: "ביסוס סמכות מקצועית",
    body: "כל פרק אתה מנתח, משתף ידע, מראיין. הוא כבר לא מחפש ״מי יעשה לי את זה״. הוא מחפש דווקא אותך.",
  },
  {
    n: "03",
    title: "אמון שנבנה לאורך זמן",
    body: "עד שהלקוח מגיע לשיחת מכירה — הוא כבר ״מכיר אותך מהפודקאסט״. 90% מעבודת השכנוע כבר קרתה. הוא לא בא להתמקח — הוא בא להצטרף.",
  },
];

// SECTION 04 — full stack services
const SERVICES = [
  {
    n: "01",
    title: "צילום מקצועי",
    body: "סט עם תאורה, סאונד ומספר מצלמות. אתה נכנס ליום צילום — יוצא עם תוכן שנראה כמו תוכנית טלוויזיה, לא כמו Zoom.",
    highlight: false,
  },
  {
    n: "02",
    title: "עריכת פרקים מלאים",
    body: "עריכה דינמית שמחזיקה צופים עד הסוף, כתוביות, גרפיקות מותאמות מותג, אינטרו ואאוטרו משלך. פרק שנראה כמו תוצר של ערוץ תוכן, לא כמו ״פודקאסט של בעל עסק״.",
    highlight: false,
  },
  {
    n: "03",
    title: "רילסים וסרטונים קצרים",
    body: "כל פרק הופך ל־10–15 רילסים לאינסטגרם, טיקטוק ולינקדאין.",
    extra: "כאן מתחיל ההבדל שלנו: אנחנו לא מחפשים את הרגעים החזקים בעין. אנחנו משתמשים ב־Descript, GPT ו־Claude כדי לנתח את כל הטקסט — ולזהות בדיוק את המשפטים, הסיפורים והרגעים שיעצרו גלילה. כל רגע ויראלי בפרק — נזהה אותו ונוציא ממנו מקסימום.",
    highlight: true,
  },
  {
    n: "04",
    title: "Thumbnails ליוטיוב",
    body: "Thumbnail טוב זה ההבדל בין פרק של 200 צפיות לפרק של 20,000. אנחנו מעצבים thumbnails שמזמינים הקלקה — בלי clickbait זול, עם סטייל ששומר על הרמה של המותג שלך.",
    highlight: false,
  },
  {
    n: "05",
    title: "קופי, פוסטים והפצה",
    body: "תיאורי פרקים לקידום אורגני, פוסטים לסושיאל, ציטוטים, כותרות, לוח הפצה. פרק אחד מתפרק אצלנו ל־30+ יחידות תוכן — אחת ההשקעות היחידות בשיווק שהערך שלה רק מצטבר עם הזמן.",
    highlight: false,
  },
];

// SECTION 05 — process
const STEPS = [
  {
    n: "01",
    title: "אסטרטגיה ופורמט",
    desc: "פגישה של שעתיים בה אנחנו יורדים לעומק של העסק שלך: מי הלקוח, מה הכאבים שלו, מה השאלות שהוא שואל בראש לפני שהוא מחליט לקנות, מה המיצוב שלך. מתוך זה בונים פורמט פודקאסט שעושה שני דברים יחד — מעניין לצפייה, ומייצר לידים.",
  },
  {
    n: "02",
    title: "יום צילום מרוכז",
    desc: "יום אחד של צילום = 4–6 פרקים. שעות ספורות בחודש, ואתה עם תוכן לחצי שנה קדימה. בלי להקדיש את החיים, בלי לשבש את היומן.",
  },
  {
    n: "03",
    title: "הפקה, עריכה, הפצה",
    desc: "אנחנו לוקחים את החומר הגולמי ומחזירים לך פרקים מלאים, רילסים, thumbnails, קופי, לוח הפצה. אתה מאשר — אנחנו מעלים לכל המקומות. אתה ממשיך לעשות את מה שאתה טוב בו.",
  },
];

// SECTION 06 — audience
const AUDIENCE = [
  {
    bold: "יועצים, מאמנים ומומחי תוכן",
    rest: "שמוכרים שירותים יקרים ורוצים לבסס סמכות בלי להישמע כמו כל השאר.",
  },
  {
    bold: "עסקי B2B",
    rest: "עם מחזור מכירות ארוך, שבו הלקוח חייב לסמוך עליך לפני שהוא חותם.",
  },
  {
    bold: "מנכ״לים ובעלי עסקים",
    rest: "שרוצים לבנות מותג אישי שמושך אליהם לקוחות, עובדים ושותפים איכותיים.",
  },
  {
    bold: "מקצועות טכניים וחופשיים",
    rest: "(רואי חשבון, עורכי דין, אדריכלים, אנשי טכנולוגיה) שמתקשים להסביר את הערך במודעה של 30 שניות.",
  },
];

// SECTION 07 — why us
const WHY_US = [
  {
    n: "01",
    title: "AI בכל שלב",
    body: "אנחנו אחת הסוכנויות הבודדות בארץ שמשלבת AI ברצינות בתהליך. Descript לתמלול, GPT ו־Claude לניתוח הפרקים, זיהוי רגעים ויראליים, ואופטימיזציה של כל יחידת תוכן. התוצאה: אנחנו מוציאים מכל פרק פי 3 ערך מסוכנות רגילה — באותו תקציב.",
    highlight: true,
  },
  {
    n: "02",
    title: "חושבים כמו בעלי עסקים",
    body: "אנחנו לא מפיקים פרקים כדי שיהיו מגניבים. אנחנו מפיקים פרקים כדי שיביאו לך פגישות. ההבדל קריטי — הוא משפיע על איך בוחרים אורחים, איך בונים פורמט, איזה משפטים מנ״תחים לרילסים, ואיזה CTA חבוי בכל פרק.",
    highlight: false,
  },
  {
    n: "03",
    title: "עובדים עם מעט לקוחות",
    body: "אנחנו לא ״מפעל תוכן״. אנחנו עובדים עם מספר מצומצם של עסקים בכל רגע נתון — כי פודקאסט טוב דורש שהמפיק באמת יכיר את העסק. זה אומר שיש מקום לפעמים, ולפעמים יש רשימת המתנה.",
    highlight: false,
  },
];

// SECTION 09 — FAQ
const FAQ = [
  {
    q: "לא הנחיתי פודקאסט מעולם. זה לא יתאים לי.",
    a: "זו נקודת ההתחלה של 90% מהלקוחות שלנו. אנחנו בונים איתך פורמט שיושב בדיוק על הקול הטבעי שלך, עם מבנה ברור לכל פרק — אתה לא צריך להמציא כלום. תוך 2–3 פרקים זה יהיה לך נוח כמו לדבר בפגישת לקוח.",
  },
  {
    q: "כמה זמן עד שאני רואה תוצאות?",
    a: "פרק ראשון יוצא תוך 3–4 שבועות מיום הצילום. הקפיצה המשמעותית בלידים מגיעה בדרך כלל בין פרק 8 ל־12 — כשהאלגוריתם מתחיל להכיר אותך, והקהל מתחיל לצפות לפרקים הבאים.",
  },
  {
    q: "כמה זמן אני צריך להקדיש לזה בכל חודש?",
    a: "יום צילום אחד בחודש (4–6 פרקים בבת אחת), פלוס שעה־שעתיים לאישורים ופידבקים. בפועל: 10–12 שעות בחודש בלבד. השאר — עלינו.",
  },
  {
    q: "מה אם אין לי אורחים?",
    a: "פודקאסט לא חייב להיות עם אורחים. אנחנו בונים איתך את הפורמט הנכון — סולו, עם אורחים, פאנלים, או שילוב. אם בחרנו פורמט עם אורחים — אנחנו עוזרים גם במציאה ובהזמנה שלהם.",
  },
  {
    q: "הפודקאסט הוא שלי או שלכם?",
    a: "שלך. לגמרי. הערוץ, הקבצים הגולמיים, השם, הזכויות — הכל שלך. אנחנו השותפים שמייצרים אותו, לא הבעלים שלו.",
  },
  {
    q: "האם זה מתאים גם לעסק קטן / עצמאי?",
    a: "כן — בתנאי שאתה מוכר משהו עם מרווח רציני (שירותים, ייעוץ, מוצרים פרימיום). עסק שמוכר מוצר של 50 ש״ח לא יחזיר את ההשקעה. עסק שמוכר ליווי של 30,000 ש״ח — יחזיר אותה עם פרק אחד שהביא עסקה.",
  },
  {
    q: "יש סרטון לדוגמא של עבודה שלכם?",
    a: "בוודאי. בשיחת ההיכרות נשלח לך דוגמאות מהפקות קודמות, וגם דוגמאות של רילסים וסוגי thumbnails כדי שתבין בדיוק איך זה נראה.",
  },
];

const CLIENT_LOGOS = [
  "יועץ עסקי", "מאמן עסקים", "משרד עו״ד", "חברת ייעוץ",
  "Startup Nation", "פיננסים", "אדריכלות", "מנכ״ל Tech", "רואי חשבון",
];

// Simple form
function validateForm(values) {
  const errors = {};
  if (!values.name || values.name.trim().length < 2) errors.name = "צריך שם מלא";
  if (!values.phone || values.phone.replace(/\D/g, "").length < 9) errors.phone = "מספר טלפון לא תקין";
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "אימייל לא תקין";
  return errors;
}

function useForm() {
  const [values, setValues] = React.useState({ name: "", phone: "", email: "" });
  const [errors, setErrors] = React.useState({});
  const [submitted, setSubmitted] = React.useState(false);
  const [touched, setTouched] = React.useState({});

  const setField = (k, v) => {
    setValues(prev => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors(prev => { const n = { ...prev }; delete n[k]; return n; });
  };
  const blur = (k) => setTouched(prev => ({ ...prev, [k]: true }));

  const submit = (e) => {
    e.preventDefault();
    const errs = validateForm(values);
    setErrors(errs);
    setTouched({ name: true, phone: true, email: true });
    if (Object.keys(errs).length === 0) setSubmitted(true);
  };
  return { values, setField, errors, touched, blur, submit, submitted };
}

function scrollToId(id) {
  const el = document.querySelector(id);
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
}

function Waveform({ count = 28, color }) {
  const bars = Array.from({ length: count });
  return (
    <div className="waveform" style={{ color }}>
      {bars.map((_, i) => (
        <span key={i} style={{
          height: `${20 + Math.abs(Math.sin(i * 0.9)) * 80}%`,
          animationDelay: `${(i % 8) * 0.09}s`,
        }} />
      ))}
    </div>
  );
}

function LogoMarquee({ color = "currentColor", logos = CLIENT_LOGOS }) {
  const set = [...logos, ...logos];
  return (
    <div className="marquee">
      <div className="marquee-track" style={{ color }}>
        {set.map((l, i) => (
          <div key={i} style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800, fontSize: 28, opacity: 0.55,
            whiteSpace: "nowrap", letterSpacing: "-0.01em",
          }}>{l}</div>
        ))}
      </div>
    </div>
  );
}

// Sticky header
function TopNav({ variant, onCTAClick }) {
  const bg = "rgba(10,10,10,0.78)";
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 30,
      backdropFilter: "blur(14px)",
      background: bg,
      borderBottom: "1px solid var(--line2)",
    }}>
      <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <a href="#" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src={LOGO_SRC} alt="Cuts" style={{ height: 34 }} />
        </a>
        <ul style={{ display: "flex", gap: 28, listStyle: "none", margin: 0, padding: 0, fontSize: 15, fontWeight: 500 }}>
          {NAV.map(n => (
            <li key={n.href}>
              <a href={n.href} onClick={(e) => { e.preventDefault(); scrollToId(n.href); }} style={{ opacity: 0.8 }}>
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <button className="btn btn-primary" onClick={onCTAClick} style={{ padding: "10px 18px", fontSize: 14 }}>
          בוא נדבר ←
        </button>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--line2)", padding: "48px 0 32px", marginTop: 40 }}>
      <div className="wrap" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 40 }}>
        <div>
          <img src={LOGO_SRC} alt="Cuts" style={{ height: 44, marginBottom: 16 }} />
          <p style={{ opacity: 0.6, maxWidth: 280, lineHeight: 1.6, margin: 0 }}>
            סוכנות הפקת פודקאסטים לעסקים. אסטרטגיה, צילום, עריכה ורילסים — מעטפת מלאה.
          </p>
        </div>
        <div>
          <h4 className="mono" style={{ fontSize: 11, opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>ניווט</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 2, fontSize: 15 }}>
            <li><a href="#how">איך זה עובד</a></li>
            <li><a href="#why">למה אנחנו</a></li>
            <li><a href="#faq">שאלות נפוצות</a></li>
          </ul>
        </div>
        <div>
          <h4 className="mono" style={{ fontSize: 11, opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>צרו קשר</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 2, fontSize: 15 }}>
            <li>hello@cuts.co.il</li>
            <li dir="ltr" style={{ textAlign: "right" }}>+972 (3) 555-0199</li>
            <li>פתח תקווה</li>
          </ul>
        </div>
        <div>
          <h4 className="mono" style={{ fontSize: 11, opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>עוקבים</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 2, fontSize: 15 }}>
            <li>Instagram</li>
            <li>LinkedIn</li>
            <li>YouTube</li>
          </ul>
        </div>
      </div>
      <div className="wrap" style={{
        display: "flex", justifyContent: "space-between",
        paddingTop: 32, marginTop: 32, borderTop: "1px solid var(--line2)",
        fontFamily: "var(--font-mono)", fontSize: 12, opacity: 0.5,
      }}>
        <span>© 2026 CUTS. כל הזכויות שמורות.</span>
        <span>מדיניות פרטיות · תקנון · צור קשר</span>
      </div>
    </footer>
  );
}

Object.assign(window, {
  LOGO_SRC, NAV, CLIENT_LOGOS, PILLARS, SERVICES, STEPS, AUDIENCE, WHY_US, FAQ,
  validateForm, useForm, scrollToId,
  Waveform, LogoMarquee, TopNav, Footer,
});
