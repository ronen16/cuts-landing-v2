// In-site legal modal — Terms / Privacy / Accessibility shown as an
// overlay instead of navigating to a separate page.

const LEGAL_DOCS = {
  terms: {
    title: "תקנון האתר ותנאי שימוש",
    updated: "עודכן לאחרונה: מאי 2026",
    note: "נוסח ביניים לצורכי השקה. מומלץ להעביר את הנוסח לעורך/ת דין להתאמה סופית לפעילות העסק.",
    sections: [
      { h: "1. כללי", p: [
        "ברוכים הבאים לאתר של Cuts. תקנון זה מסדיר את השימוש באתר ובשירותים המוצעים בו. עצם הגלישה והשימוש באתר מהווים הסכמה מלאה לתנאים המפורטים להלן. אם אינך מסכים/ה לתנאים, אנא הימנע/י משימוש באתר.",
        "החברה רשאית לעדכן תקנון זה מעת לעת, ונוסחו המעודכן יחול ממועד פרסומו באתר. האמור בלשון זכר מתייחס לכל המגדרים כאחד.",
      ]},
      { h: "2. השירותים", p: [
        "האתר מציג מידע על שירותי האולפן וההפקה של החברה ומאפשר השארת פרטים ליצירת קשר ולתיאום שיחת אבחון. השארת פרטים אינה מהווה התחייבות של מי מהצדדים, ואינה יוצרת יחסים חוזיים. כל התקשרות עסקית תיעשה בהסכם נפרד בכתב.",
        "החברה עושה מאמץ לשמור על מידע מעודכן ומדויק, אך אינה מתחייבת כי כל התכנים יהיו נקיים משגיאות או יהיו זמינים בכל עת.",
      ]},
      { h: "3. השארת פרטים ויצירת קשר", p: [
        "בעת השארת פרטים בטופס שבאתר (שם, טלפון, דוא\"ל) הנך מאשר/ת כי הפרטים נמסרו מרצונך החופשי, וכי החברה רשאית ליצור עמך קשר טלפוני, בהודעה או בדוא\"ל לצורך מתן מענה ותיאום שיחה. פירוט מלא על אופן איסוף המידע ושמירתו מופיע במדיניות הפרטיות.",
      ]},
      { h: "4. קניין רוחני", p: [
        "כל זכויות הקניין הרוחני באתר, לרבות העיצוב, הטקסטים, הלוגו, הסרטונים והתכנים, שייכות לחברה או לבעלי הזכויות מטעמה. אין להעתיק, לשכפל, להפיץ או לעשות שימוש מסחרי בתכני האתר ללא אישור מראש ובכתב מהחברה.",
        "סרטונים, ציטוטים ולוגואים של לקוחות מוצגים באישור ולמטרות הצגת עבודות בלבד.",
      ]},
      { h: "5. הגבלת אחריות", p: [
        "השימוש באתר ובמידע המוצג בו הוא באחריות המשתמש בלבד. החברה לא תישא באחריות לכל נזק ישיר או עקיף שייגרם כתוצאה משימוש באתר, מהסתמכות על תכניו או מתקלות טכניות. תכני האתר אינם מהווים ייעוץ מקצועי מחייב.",
      ]},
      { h: "6. תכנים של צד שלישי", p: [
        "האתר עשוי לכלול הטמעות וקישורים לשירותי צד שלישי (כגון YouTube ו-Vimeo להצגת סרטונים). השימוש בשירותים אלה כפוף לתנאי השימוש ומדיניות הפרטיות של אותם ספקים, ולחברה אין שליטה עליהם.",
      ]},
      { h: "7. דין וסמכות שיפוט", p: [
        "על תקנון זה יחולו דיני מדינת ישראל. סמכות השיפוט הבלעדית בכל מחלוקת תהיה נתונה לבתי המשפט המוסמכים במחוז המרכז.",
      ]},
      { h: "8. יצירת קשר", p: [
        "לשאלות בנוגע לתקנון ניתן לפנות אלינו בדוא\"ל: office@cuts.co.il.",
      ]},
    ],
  },
  privacy: {
    title: "מדיניות פרטיות",
    updated: "עודכן לאחרונה: ספטמבר 2026",
    note: "נוסח ביניים לצורכי השקה. מומלץ להעביר את הנוסח לעורך/ת דין להתאמה סופית, ובפרט אם נוספים כלי דיוור או פיקסלים של פרסום.",
    sections: [
      { h: "1. כללי", p: [
        "Cuts מכבדת את פרטיות המשתמשים באתר. מדיניות זו מסבירה איזה מידע נאסף, כיצד נעשה בו שימוש וכיצד הוא נשמר. השימוש באתר מהווה הסכמה למדיניות זו.",
      ]},
      { h: "2. איזה מידע נאסף", p: [
        "אנו אוספים מידע שאתה מוסר לנו מרצונך בעת מילוי טופס יצירת קשר באתר:",
      ], ul: ["שם מלא", "מספר טלפון", "כתובת דוא\"ל"], pAfter: [
        "בנוסף, ייתכן ויאסף מידע טכני בסיסי באופן אוטומטי (סוג דפדפן, עמודים שנצפו) לצורך תפעול ושיפור האתר.",
      ]},
      { h: "3. למה המידע משמש", ul: [
        "יצירת קשר חוזר לתיאום שיחת אבחון ומתן מענה לפנייתך.",
        "תפעול האתר ושיפור השירות.",
        "עמידה בדרישות חוקיות, ככל שיידרש.",
      ], pAfter: ["איננו מוכרים ואיננו משכירים את המידע האישי שלך לצדדים שלישיים."] },
      { h: "4. שמירת מידע ואבטחה", p: [
        "המידע נשמר אצל החברה ו/או אצל ספקי שירות מטעמה (כגון שירותי אחסון וניהול לידים) ומוגן באמצעים סבירים מקובלים. אנו שומרים את המידע למשך הזמן הדרוש למטרות שלשמן נאסף או כנדרש על פי דין.",
      ]},
      { h: "5. שירותי צד שלישי", p: [
        "האתר עושה שימוש בשירותי הטמעת וידאו של YouTube ו-Vimeo להצגת תכנים. שירותים אלו עשויים לאסוף מידע בהתאם למדיניות הפרטיות שלהם, ולחברה אין שליטה על כך.",
        "כמו כן אנו משתמשים בפיקסל של Meta למדידת ביצועי הפרסום שלנו: כמה אנשים הגיעו מהמודעות וכמה השאירו פרטים. המידע מעובד גם על ידי Meta בהתאם למדיניות הפרטיות שלה.",
      ]},
      { h: "5א. חיבור ערוץ YouTube של לקוחות (YouTube API Services)", p: [
        "לקוחות האולפן יכולים, מרצונם, לחבר את ערוץ ה-YouTube שלהם למערכת הלקוחות של Cuts (cuts-client-portal-production.up.railway.app) באמצעות הרשאת Google. החיבור נעשה במסך ההסכמה של Google, בחשבון של הלקוח, והאולפן אינו מקבל בשום שלב את סיסמת Google של הלקוח.",
        "איזה מידע אנחנו מקבלים: פרטי הערוץ שהלקוח בחר (מזהה, שם, כינוי ותמונת הערוץ), הרשאה להעלות סרטונים לערוץ, לקבוע להם תמונה ממוזערת ולשייך אותם לפלייליסטים, והרשאת קריאה בלבד לדוחות YouTube Analytics של הערוץ.",
        "למה המידע משמש: אך ורק כדי להעלות לערוץ של הלקוח פרקים שהלקוח הזמין ואישר, ולהציג ללקוח דוחות ביצועים על התכנים שלו. איננו משתמשים בנתונים לפרסום ואיננו משנים הגדרות ערוץ.",
        "שמירה ושיתוף: אסימון ההרשאה נשמר בשרתינו בהצפנה. נתוני Analytics נשמרים עד 30 יום, אלא אם רועננו מחדש. המידע אינו נמכר ואינו מועבר לצד שלישי, למעט Google עצמה במסגרת השימוש ב-API.",
        "ניתוק ומחיקה: הלקוח יכול לבטל את החיבור בכל עת בפנייה לאולפן או בעמוד ההרשאות של חשבון Google (myaccount.google.com/permissions). עם הביטול, אסימון ההרשאה נמחק ונתוני ה-Analytics נמחקים בתוך 30 יום.",
        "השירות עושה שימוש ב-YouTube API Services וכפוף לתנאי השימוש של YouTube (youtube.com/t/terms), למדיניות הפרטיות של Google (policies.google.com/privacy) ול-Google API Services User Data Policy, לרבות דרישות השימוש המוגבל (Limited Use).",
      ]},
      { h: "5ב. איך אנחנו מגינים על המידע של חשבונות מחוברים", p: [
        "הצפנה בהעברה: כל התקשורת בין הדפדפן, מערכת הלקוחות ושירותי Google, YouTube, Meta ו-TikTok עוברת בחיבור מוצפן (HTTPS/TLS).",
        "הצפנה באחסון: אסימוני ההרשאה של חשבונות מחוברים נשמרים במסד הנתונים מוצפנים (Fernet: הצפנת AES-128 עם חתימת HMAC-SHA256). מפתח ההצפנה שמור בנפרד, במשתני הסביבה של שרת האחסון, ולא במסד הנתונים או בקוד המקור. מסד הנתונים עצמו מוצפן באחסון אצל ספק התשתית (Supabase, AES-256).",
        "הגבלת גישה: הגישה למידע מוגבלת לצוות האולפן המטפל בלקוח, דרך מערכת שדורשת התחברות. פרטי הגישה לשירותים חיצוניים שמורים במשתני סביבה ולא בקוד המקור.",
        "מינימום מידע: אנחנו מבקשים רק את ההרשאות שנדרשות לפעולות שהלקוח ביקש, ושומרים נתוני ביצועים עד 30 יום.",
        "מחיקה: ניתוק חשבון מוחק את אסימון ההרשאה מהשרתים שלנו, והנתונים שנאספו ממנו נמחקים בתוך 30 יום.",
        "בינה מלאכותית: איננו משתמשים במידע שמתקבל מ-Google APIs, ובכלל זה נתוני YouTube, כדי לפתח, לשפר או לאמן מודלים כלליים של בינה מלאכותית או למידת מכונה.",
        "אירוע אבטחה: אם נגלה גישה לא מורשית למידע הזה, נודיע ללקוחות שנפגעו ול-Google, כנדרש.",
        "Data protection. All traffic between the browser, the client portal and Google, YouTube, Meta and TikTok is encrypted in transit (HTTPS/TLS). OAuth tokens of connected accounts are stored encrypted at rest (Fernet: AES-128 with HMAC-SHA256); the encryption key is kept separately in the hosting environment, never in the database or the source code, and the database itself is encrypted at rest by our infrastructure provider (Supabase, AES-256). Access is limited to the studio staff handling the client, through an authenticated system; service credentials live in environment variables, not in code. We request only the scopes needed for the actions the client asked for and keep analytics data for up to 30 days. Disconnecting an account deletes its token from our servers and its collected data within 30 days. We do not use data obtained from Google APIs, including YouTube data, to develop, improve or train generalized AI or machine-learning models. If we learn of unauthorized access to this data, we will notify the affected clients and Google as required.",
      ]},
      { h: "6. עוגיות והסכמה", p: [
        "עוגיות פרסום: האתר עושה שימוש בעוגיות של פיקסל Meta לצורכי מדידת פרסום. ניתן לחסום עוגיות אלה דרך הגדרות הדפדפן.",
        "סטטיסטיקה אנונימית (פועלת תמיד): אנו מפעילים כלי מדידה עצמאי המתארח בשרתי האתר ואינו מועבר לצד שלישי, הסופר קליקים ועומק גלילה בלבד. הוא אינו משתמש בעוגיות ואינו אוסף שם, טלפון, דוא\"ל, כתובת IP או כל מזהה אישי אחר. המדידה נשענת על מזהה מפגש אקראי שנשמר בזיכרון הלשונית ונמחק עם סגירתה, ולכן היא מתבצעת כחלק מהתפעול והשיפור השוטף של האתר.",
      ]},
      { h: "7. הזכויות שלך", p: [
        "בכפוף לדין החל, באפשרותך לפנות אלינו בבקשה לעיין במידע שנאגר עליך, לתקנו או למחקו. נטפל בפנייתך בתוך זמן סביר.",
      ]},
      { h: "8. יצירת קשר", p: [
        "בכל שאלה או בקשה בנוגע לפרטיות ניתן לפנות אלינו בדוא\"ל: office@cuts.co.il.",
      ]},
    ],
  },
  accessibility: {
    title: "הצהרת נגישות",
    updated: "עודכן לאחרונה: מאי 2026",
    note: "נוסח ביניים. מומלץ להתאים את הפרטים (שם בעל התפקיד, פרטי קשר ותאריך בדיקה) ולבדוק התאמה מלאה לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), תשע\"ג-2013, ולתקן ישראלי 5568.",
    sections: [
      { h: "מחויבות לנגישות", p: [
        "אנו ב-Cuts רואים חשיבות רבה במתן שירות שוויוני ונגיש לכלל הגולשים, לרבות אנשים עם מוגבלות. אנו פועלים להנגיש את האתר ברמה סבירה ובהתאם להוראות הדין.",
      ]},
      { h: "רמת הנגישות באתר", p: [
        "האתר הונגש בהתאם להמלצות התקן הישראלי (ת\"י 5568) המבוסס על הנחיות WCAG 2.0 ברמה AA, ככל הניתן. בין היתר:",
      ], ul: [
        "תפריט נגישות בלחיצה על כפתור ייעודי בפינה השמאלית-תחתונה.",
        "אפשרות להגדלה והקטנה של הטקסט.",
        "ניגודיות גבוהה, ניגודיות הפוכה וגווני אפור.",
        "רקע בהיר, הדגשת קישורים וכותרות, פונט קריא.",
        "סמן עכבר מוגדל ועצירת אנימציות.",
        "ניווט באמצעות מקלדת ותמיכה בקוראי מסך במבנה סמנטי.",
      ]},
      { h: "הסדרי נגישות והגבלות", p: [
        "ייתכן כי חלקים מסוימים באתר, בעיקר תכנים של צד שלישי (כגון נגני YouTube ו-Vimeo), אינם בשליטתנו המלאה, ורמת הנגישות בהם תלויה בספקים אלה. אנו פועלים לתקן ליקויים שמתגלים.",
      ]},
      { h: "פנייה בנושא נגישות", p: [
        "נתקלתם בבעיית נגישות? נשמח לקבל פנייה ונטפל בה בהקדם. רכז/ת הנגישות: צוות Cuts. דוא\"ל: office@cuts.co.il.",
      ]},
    ],
  },
};

function LegalModal() {
  const [doc, setDoc] = React.useState(null);

  React.useEffect(() => {
    const onOpen = (e) => {
      const which = e && e.detail;
      if (LEGAL_DOCS[which]) setDoc(which);
    };
    const onKey = (e) => { if (e.key === "Escape") setDoc(null); };
    window.addEventListener("cuts-legal", onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("cuts-legal", onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  React.useEffect(() => {
    if (!doc) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // stop the page behind from scrolling/jumping
    return () => { document.body.style.overflow = prev; };
  }, [doc]);

  if (!doc) return null;
  const d = LEGAL_DOCS[doc];

  return (
    <div className="legal-backdrop" onClick={() => setDoc(null)} dir="rtl">
      <div
        className="legal-modal"
        role="dialog"
        aria-modal="true"
        aria-label={d.title}
        onClick={(e) => e.stopPropagation()}>
        <div className="legal-modal__head">
          <h2 className="legal-modal__title">{d.title}</h2>
          <button
            type="button"
            className="legal-modal__close"
            aria-label="סגירה"
            onClick={() => setDoc(null)}>✕</button>
        </div>
        <div className="legal-modal__body">
          <p className="legal-modal__updated">{d.updated}</p>
          {d.sections.map((s, i) => (
            <div key={i}>
              <h3 className="legal-modal__h">{s.h}</h3>
              {(s.p || []).map((para, j) => (
                <p key={"p" + j} className="legal-modal__p">{para}</p>
              ))}
              {s.ul && (
                <ul className="legal-modal__ul">
                  {s.ul.map((li, k) => <li key={"l" + k}>{li}</li>)}
                </ul>
              )}
              {(s.pAfter || []).map((para, j) => (
                <p key={"pa" + j} className="legal-modal__p">{para}</p>
              ))}
            </div>
          ))}
          <p className="legal-modal__foot">© 2026 Cuts כל הזכויות שמורות.</p>
        </div>
      </div>
    </div>
  );
}

window.openLegal = function (which) {
  window.dispatchEvent(new CustomEvent("cuts-legal", { detail: which }));
};
window.LegalModal = LegalModal;

// Delegated, attribute-keyed opener. The inline React onClick on legal links is
// fragile here: the override-apply scan re-serializes parent spans via innerHTML,
// which strips React's synthetic handlers from nested buttons. A single
// document-level listener keyed on [data-legal-open] survives that, since the
// DOM attribute persists through innerHTML round-trips.
if (!window.__cutsLegalDelegated) {
  window.__cutsLegalDelegated = true;
  document.addEventListener("click", function (e) {
    const trigger = e.target.closest && e.target.closest("[data-legal-open]");
    if (!trigger) return;
    e.preventDefault();
    window.openLegal(trigger.getAttribute("data-legal-open"));
  }, true);
}
