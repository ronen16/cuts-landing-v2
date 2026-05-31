# iOS "tap 3× fast" button bug — full handoff for another AI

You are an expert in iOS Safari/WebKit + React 18. Below is a complete, self-contained
description of a stubborn bug. **All relevant source code is inline** — you do not need
repo access. Read everything, then give a concrete root-cause + fix. 9 fixes already
failed (listed at the end) — do not repeat them.

---

## 1. The symptom

- Site: a one-page landing page at **https://www.cuts.co.il** (Hebrew, RTL).
- On **iPhone (real device, Safari)**: tapping a yellow CTA button that scrolls to the
  lead-capture form — and the buttons **inside** the form, including the submit button —
  does **nothing on a single tap**. You must tap **~3 times fast** for it to register.
- On **desktop** everything works perfectly on the first click.
- It is **not** a visual/hit-area problem — the button is fully visible and centered.

## 2. The stack

- **React 18** (UMD production build, classic JSX — no ES modules; all JSX files share
  one global script scope). Built with esbuild from `src/*.jsx` → `dist/src/*.js`.
- Plain CSS (`styles.css`), one extra vanilla file `interactions.js`.
- Hosted on **Vercel**, auto-deploy on push to `main`.
- React's synthetic event system attaches a **single delegated listener on the root
  container `#root`**. (This matters — see hypothesis B.)

## 3. The architecture that is almost certainly the cause

There is a custom **"content override" system**. Editors can change any text on the page;
the chosen text is stored in a big `live-overrides.json` keyed by a computed DOM-path id,
and on the **live site, for every visitor including mobile**, the overrides are applied
**imperatively to the live DOM** and **re-applied via a `MutationObserver` on `#root`**.

The CTA buttons and the form submit button **have text overrides** — so the override
system rewrites their content on the live site. Confirmed override values:
- Hero CTA button → `'אני רוצה להפוך למותג ←'`
- Form submit button → `'בואו נקבע שיחה ←'` (both desktop and mobile layers)

### Original (pre-fix) behaviour — the suspected root cause
The override applier originally did **`el.innerHTML = desired`** on every element with an
override, and the `MutationObserver` re-ran it on every DOM mutation (debounced 50ms).
Because **React re-renders revert the button text back to the JSX value**, the observer
fires and the applier **rewrites the button's innerHTML again** — repeatedly.

**iOS WebKit cancels the synthesized `click`** if, between `touchstart`/`touchend` and the
click, the tapped element's **DOM subtree is destroyed/replaced**. `innerHTML =` destroys
and recreates all child nodes. So every observer tick that rewrites the button's innerHTML
**races the user's tap and swallows the click** — which matches the "tap 3× fast" symptom
exactly (you have to tap during a quiet window between rewrites).

---

## 4. The fix I already shipped (and it DID NOT fix it on the real iPhone)

I replaced the `innerHTML =` write with an **in-place text-node edit** (`nodeValue`) so the
button's nodes are never destroyed for plain-text overrides, plus a short-circuit when the
text is already correct so a settled page never mutates again. Code:

```js
// admin.jsx — the override applier
function applyOverrideContent(el, desired) {
  const isPlainText = !/[<&]/.test(String(desired));
  if (isPlainText) {
    const elementChildren = el.children.length; // element nodes only (not text)
    if (elementChildren === 0) {
      if (el.textContent === desired) return; // already correct → no DOM mutation
      const textNodes = Array.from(el.childNodes).filter((n) => n.nodeType === 3);
      if (textNodes.length === 0) {
        el.appendChild(document.createTextNode(desired));
      } else {
        textNodes[0].nodeValue = desired; // edit in place — node survives the tap
        for (let i = 1; i < textNodes.length; i++) textNodes[i].nodeValue = "";
      }
      el.__ovDesired = desired;
      return;
    }
  }
  // Fallback: real HTML or mixed text+element content.
  if (el.__ovDesired !== desired || el.__ovApplied !== el.innerHTML) {
    el.innerHTML = desired;
    el.__ovDesired = desired;
    el.__ovApplied = el.innerHTML;
  }
}

function applyOverridesToDOM(overrides) {
  if (!overrides) overrides = {};
  const elements = getAllEditableElements(); // root.querySelectorAll("*") filtered
  for (const el of elements) {
    if (document.activeElement === el) continue;
    if (!el.hasAttribute("data-edit-original")) {
      el.setAttribute("data-edit-original", el.textContent || "");
    }
    if (el.dataset.editOriginalHtml == null) {
      el.dataset.editOriginalHtml = el.innerHTML;
    }
    const id = computeEditId(el);
    if (!id) continue;
    el.setAttribute("data-edit-id", id);
    if (Object.prototype.hasOwnProperty.call(overrides, id)) {
      const desired = overrides[id];
      const visible = String(desired == null ? "" : desired)
        .replace(/<[^>]*>/g, "").replace(/&nbsp;/g, "").trim();
      if (visible !== "") {
        applyOverrideContent(el, desired);
      }
    }
  }
}
window.__cutsApplyOverrides = applyOverridesToDOM;
```

**Result: still broken on the real iPhone.** I verified the *mechanism* on desktop (node
identity preserved, innerHTML never used, idempotent noop, click fires) — but I could NOT
reproduce or verify on a real iOS device. So either the hypothesis is incomplete, or there
is a **second cause**.

> ⚠️ Note a subtlety: the CTA button renders **two** text nodes (`{label} ←` →
> `["אני רוצה...", " ←"]`). My fix writes the whole desired string into `textNodes[0]` and
> blanks the rest. That's fine for identity, but worth scrutinising.

---

## 5. The driver: app.jsx effect + MutationObserver (UNCHANGED — prime suspect)

```js
// app.jsx — runs for ALL visitors, including mobile
React.useEffect(() => {
  if (!window.__cutsApplyOverrides) return;
  const apply = () => window.__cutsApplyOverrides(effOverrides);
  apply();
  const rootEl = document.getElementById("root");
  if (!rootEl) return;
  let timer = null;
  const obs = new MutationObserver(() => {
    if (timer) return;
    timer = setTimeout(() => {
      timer = null;
      apply();
    }, 50);
  });
  obs.observe(rootEl, { childList: true, subtree: true, characterData: true });
  return () => {
    obs.disconnect();
    if (timer) clearTimeout(timer);
  };
}, [effOverrides]);
```

`effOverrides` is the merged override map (live JSON + admin edits, device-specific).
The observer watches `childList + subtree + characterData` on `#root`. **Any** DOM change
(including my own `nodeValue` write? no — guarded by the early-return, but any React
re-render, scroll-triggered reveal, counter animation, etc.) schedules an `apply()`.

## 6. CTA button + form + scroll handler (the actual elements that fail)

```jsx
// sections-bold.jsx
function CTAButton({ onCTAClick, label = "הפעולה המרכזית שצריך לבצע", style }) {
  return (
    <button className="btn btn-primary" onClick={onCTAClick} style={{
      padding: "22px 44px", fontSize: 18, fontWeight: 700, borderRadius: 10, ...style
    }}>
      {label} ←
    </button>
  );
}

// the form (one of three variants), submit button is a plain submit
<form onSubmit={submit}>
  ...inputs...
  <button type="submit" className="btn btn-primary">בואו נקבע שיחה ←</button>
</form>
```

```js
// primitives.jsx — what the CTA onClick does
function scrollToId(id) {
  const el = document.querySelector(id);
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
}
// onCTAClick = () => scrollToId("#cta")
```

```js
// primitives.jsx — form submit handler (React synthetic onSubmit)
const submit = (e) => {
  e.preventDefault();
  const errs = validateForm(values);
  if (!consent) errs.consent = "יש לאשר את תקנון האתר כדי להמשיך";
  setErrors(errs);
  setTouched({ name: true, phone: true, email: true, consent: true });
  if (Object.keys(errs).length === 0) {
    setSubmitted(true);
    // fire-and-forget POST to /api/lead, then redirect to thank-you.html
    fetch("/api/lead", { method: "POST", headers: {...}, body: JSON.stringify(payload), keepalive: true }).catch(() => {});
    window.location.assign("thank-you.html?name=" + encodeURIComponent(values.name));
  }
};
```

## 7. interactions.js — vanilla layer (already hardened, may still interfere)

```js
// reveal-on-scroll: sets opacity:0 + translateY(30px) then animates in.
// Buttons/forms are EXEMPTED (this was a prior fix):
if (el.matches("button, a, input, select, textarea, form, [type='submit'], .btn")) return;
if (el.querySelector("button, a[href], input, form, [type='submit'], .btn")) return;

// Native delegated CTA backup handler (added in a prior fix) — catches clicks on
// .btn-primary OUTSIDE forms and scrolls to #cta directly, bypassing React:
document.addEventListener("click", function (e) {
  var btn = e.target.closest && e.target.closest(".btn-primary");
  if (!btn) return;
  if (btn.closest("form")) return;       // form submit handled by native <form>
  var target = document.querySelector("#cta");
  if (!target) return;
  var top = target.getBoundingClientRect().top + window.scrollY - 80;
  try { window.scrollTo({ top: top, behavior: "smooth" }); }
  catch (_) { window.scrollTo(0, top); }
}, false);
```

Note: the reveal-on-scroll `.reveal-init { opacity:0; transform:translateY(30px) }` sets a
transform on a **sibling/ancestor** that briefly overlaps the button while the
IntersectionObserver transition runs — see hypothesis A.

## 8. Relevant CSS

```css
.btn { transition: transform .25s cubic-bezier(.2,.8,.2,1), box-shadow .25s; }
@media (hover: hover) { .btn:hover { transform: scale(1.04); } }   /* hover only — not touch */
button, [type="submit"] { touch-action: manipulation; cursor: pointer; }
.reveal-init { opacity: 0; transform: translateY(30px); transition: opacity .7s, transform .7s; }
.reveal-in   { opacity: 1; transform: none; }
/* z-index landscape: .admin-button/.admin-toolbar 9998; a11y widget buttons 99999;
   legal/admin backdrops 100000/10001 (only when open). Theme glow ::before is
   pointer-events:none and display:none on mobile. */
```

## 9. computeEditId — how an element maps to an override key

```js
function computeEditId(el) {
  if (!el || el.nodeType !== 1) return null;
  const root = document.getElementById("root");
  if (!root) return null;
  const sectionAncestor = el.closest("[data-section-id]");
  const anchor = sectionAncestor || root;
  const anchorTag = sectionAncestor ? `sec:${sectionAncestor.getAttribute("data-section-id")}` : "root";
  const parts = [];
  let cur = el;
  while (cur && cur !== anchor && cur.parentElement) {
    const parent = cur.parentElement;
    const siblings = Array.from(parent.children).filter((c) => c.tagName === cur.tagName);
    const idx = siblings.indexOf(cur);
    parts.unshift(`${cur.tagName.toLowerCase()}[${idx}]`);
    cur = parent;
  }
  const text = (el.getAttribute("data-edit-original") || el.textContent || "").trim().slice(0, 60);
  let h = 0; for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  return `${anchorTag}>${parts.join(">")}#h:${(h >>> 0).toString(16).padStart(8,"0")}`;
}
```
`<button>` is **NOT** in `NON_EDITABLE_TAGS`, so buttons with a direct text node are
"editable" and get overridden. The id includes a **hash of the element's text** — so when
the override changes the text, a later `computeEditId` of the same element yields a
**different hash**, potentially making the override "miss" and the applier thrash.
**This is a strong lead worth checking.**

---

## 10. Three untested hypotheses (please evaluate each)

**A. reveal-init overlay intercepts the tap.** A `.reveal-init` element with
`transform:translateY(30px)` sits visually over the button during its 0.7s transition; the
first tap hits the overlay, not the button. Test: `document.elementFromPoint(x,y)` at the
button's center on a fresh load.

**B. React synthetic event delegation is broken for these buttons.** React 18 attaches one
listener on `#root`. If the override system replaces nodes inside `#root`, the React fiber
for the button is disconnected and `onClick`/`onSubmit` never fire — the native delegated
handler in interactions.js is a partial backup for CTA, but **the form submit has no such
backup**, which is why submit is also broken. Test: does a native
`button.addEventListener('click', ...)` fire reliably while React's onClick does not?

**C. The id-hash mismatch (section 9)** causes the applier to keep toggling the button
between original and override text on every observer tick, destroying nodes each time.

## 11. The 9 fixes that already FAILED (do not repeat)

1. Removed JS hover-scale (mouseenter/mouseleave inline transform).
2. Exempted buttons/forms from reveal-on-scroll.
3. Removed `will-change` / `transition:transform` on touch.
4. Added FastClick + skipped cursor-glow on mobile.
5. Temporary tap-diagnostic badge.
6. Removed FastClick interceptor.
7. Force-disabled transforms on touch + added delegated CTA handler.
8. Made `applyOverridesToDOM` idempotent (guard so it skips when text already correct).
9. Replaced `innerHTML =` with in-place `nodeValue` edit for plain-text overrides (section 4).

## 12. What I need from you

1. The **single most likely root cause** given all the above (rank A/B/C or propose D).
2. A **concrete, minimal code fix** — ideally one that I can verify on a real iPhone.
3. A **way to prove it on a real device** (not desktop emulation) — e.g. what to log.

### Live diagnostic already deployed
Open **https://www.cuts.co.il/?diag=1** on the iPhone. A black panel at the top logs, per
tap: the `touchstart` target, `elementFromPoint` (⚠OVERLAY-INTERCEPT if something covers
the button), whether the `click` fired within 450ms, whether the button is still in the DOM
(`btnStillInDOM`), and the scroll delta. **The output of one real tap session is the single
most valuable piece of evidence** — ask me to paste it.
