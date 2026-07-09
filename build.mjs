// Production build — pre-compiles JSX once (no in-browser Babel),
// uses React production, ships only used assets. Output: dist/
import { build } from "esbuild";
import { promises as fs } from "fs";
import path from "path";

const ROOT = path.resolve(".");
const DIST = path.join(ROOT, "dist");

// JSX modules loaded by the app, in order (mirrors index.html).
const JSX = [
  "primitives", "sections-bold", "sections-editorial", "sections-cinematic",
  "tweaks", "admin", "accessibility", "legal", "app",
];

const STANDALONE_HTML = [
  "terms.html", "privacy.html", "accessibility.html", "thank-you.html",
];

async function copy(src, dest) {
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.copyFile(src, dest);
}

// ---------------------------------------------------------------------------
// REGRESSION GUARD — do not remove. See HANDOFF-iOS-button-bug.md (RESOLVED).
//
// The iOS "tap 3× to focus a field" bug was caused by inline-editing attributes
// (contenteditable / data-edit-* / spellcheck) leaking into the published
// content and re-injecting ~300×/sec next to the lead form, which made WebKit
// cancel the tap. Two things keep it fixed, and BOTH must stay true or the
// storm comes back. This guard fails the build (→ blocks the Vercel deploy) if
// either is broken — so no future change can silently re-break the form taps.
// ---------------------------------------------------------------------------
const EDIT_ATTR_RE = /\b(?:contenteditable|spellcheck|data-edit-id|data-edit-original|data-edit-original-html|data-move-id)=/i;

async function guard() {
  const fail = (msg) => {
    throw new Error(
      "\n🛑 BUILD BLOCKED — input/checkbox tap-storm safeguard tripped.\n" +
      msg +
      "\n   See HANDOFF-iOS-button-bug.md (✅ RESOLVED block) before changing anything.\n"
    );
  };

  // 1. The sanitizer must exist and be wired into BOTH the apply path and the
  //    save paths. stripEditingAttrs strips editing junk from override HTML.
  const admin = await fs.readFile("src/admin.jsx", "utf8");
  if (!/function\s+stripEditingAttrs\s*\(/.test(admin)) {
    fail("   • stripEditingAttrs() is gone from src/admin.jsx.");
  }
  if (!/desired\s*=\s*stripEditingAttrs\(desired\)/.test(admin)) {
    fail("   • applyOverrideContent no longer sanitizes on apply (the line\n" +
         "     `desired = stripEditingAttrs(desired)` was removed).");
  }
  const wiredCalls = (admin.match(/stripEditingAttrs\(/g) || []).length;
  if (wiredCalls < 3) {
    fail("   • stripEditingAttrs is called only " + wiredCalls + "× — expected ≥3\n" +
         "     (apply + persistEditToStorage + onBlur). A save path lost its sanitize.");
  }

  // 2. The published overrides must contain NO inline-editing attributes.
  //    If they do, an edit was saved/published without sanitizing.
  try {
    const live = await fs.readFile("live-overrides.json", "utf8");
    if (EDIT_ATTR_RE.test(live)) {
      const hit = (live.match(EDIT_ATTR_RE) || [""])[0];
      fail("   • live-overrides.json contains editing junk (" + hit + "). Re-clean it:\n" +
           "     strip the six edit attributes from every string value, then republish.");
    }
  } catch (e) {
    if (e.code !== "ENOENT") throw e; // missing file is fine; poisoned file is not
  }

  console.log("✓ tap-storm safeguard OK (sanitizer wired, published data clean)");
}

async function run() {
  await guard();
  await fs.rm(DIST, { recursive: true, force: true });
  await fs.mkdir(path.join(DIST, "src"), { recursive: true });
  await fs.mkdir(path.join(DIST, "assets", "fonts"), { recursive: true });

  // 1. Transpile + minify each JSX file (classic runtime → global React).
  await build({
    entryPoints: JSX.map((n) => `src/${n}.jsx`),
    outdir: path.join(DIST, "src"),
    outExtension: { ".js": ".js" },
    bundle: false,           // keep global-script semantics intact
    // NOTE: these files share one global script scope (classic, no
    // modules) and reference each other's top-level names directly.
    // minifyIdentifiers would rename them per-file and break cross-file
    // references — only minify whitespace + syntax.
    minifyWhitespace: true,
    minifySyntax: true,
    minifyIdentifiers: false,
    target: "es2018",
    jsx: "transform",
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
    loader: { ".jsx": "jsx" },
    legalComments: "none",
  });

  // 2. Static files.
  await copy("styles.css", path.join(DIST, "styles.css"));
  await copy("src/interactions.js", path.join(DIST, "src", "interactions.js"));
  for (const f of STANDALONE_HTML) {
    try { await copy(f, path.join(DIST, f)); } catch (_) {}
  }
  try { await copy("live-overrides.json", path.join(DIST, "live-overrides.json")); } catch (_) {}

  // 3. Only the assets actually used (skip ~4.8MB of unused PNGs).
  await copy("assets/cuts-logo.png", path.join(DIST, "assets", "cuts-logo.png"));
  try { await copy("assets/hero-video-poster.jpg", path.join(DIST, "assets", "hero-video-poster.jpg")); } catch (_) {}
  try { await copy("assets/hero-video-loop.mp4", path.join(DIST, "assets", "hero-video-loop.mp4")); } catch (_) {}
  for (const w of ["Light", "Regular", "Bold", "Black"]) {
    await copy(
      `assets/fonts/FbTypograph2-${w}.otf`,
      path.join(DIST, "assets", "fonts", `FbTypograph2-${w}.otf`)
    );
  }
  // logos folder (svg client logos for the marquee)
  try {
    const logos = await fs.readdir("assets/logos");
    await fs.mkdir(path.join(DIST, "assets", "logos"), { recursive: true });
    for (const l of logos) {
      await copy(path.join("assets/logos", l), path.join(DIST, "assets", "logos", l));
    }
  } catch (_) {}
  // guests folder (podcast guest stills for the marquee)
  try {
    const guests = await fs.readdir("assets/guests");
    await fs.mkdir(path.join(DIST, "assets", "guests"), { recursive: true });
    for (const g of guests) {
      await copy(path.join("assets/guests", g), path.join(DIST, "assets", "guests", g));
    }
  } catch (_) {}

  // 4. Production index.html — React prod CDN, no Babel, compiled .js.
  // Cache-bust every local asset with a per-build version so browsers can
  // never serve a stale compiled bundle (the static host caches src/*.js).
  const V = Date.now();
  let html = await fs.readFile("index.html", "utf8");
  html = html
    .replace(
      /<script src="https:\/\/unpkg\.com\/react@[^"]+"[^>]*><\/script>\s*/,
      '<script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js" crossorigin="anonymous"></script>\n  '
    )
    .replace(
      /<script src="https:\/\/unpkg\.com\/react-dom@[^"]+"[^>]*><\/script>\s*/,
      '<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js" crossorigin="anonymous"></script>\n  '
    )
    .replace(/<script src="https:\/\/unpkg\.com\/@babel\/standalone[^"]+"[^>]*><\/script>\s*/, "")
    .replace(/<script type="text\/babel" src="src\/([a-z-]+)\.jsx"><\/script>/g,
      `<script src="src/$1.js?v=${V}"></script>`)
    .replace(/(<link[^>]+href=")styles\.css(?:\?v=[0-9]+)?(")/g, `$1styles.css?v=${V}$2`)
    .replace(/(<script[^>]+src=")src\/interactions\.js("[^>]*><\/script>)/g,
      `$1src/interactions.js?v=${V}$2`);
  await fs.writeFile(path.join(DIST, "index.html"), html);

  console.log("✓ build complete → dist/");
}

run().catch((e) => { console.error(e); process.exit(1); });
