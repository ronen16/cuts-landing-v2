// Captures the hero's rendered markup so the page can paint it before React
// exists. Run locally after any change to the hero's STRUCTURE:
//
//     npm run build && node tools/snapshot-hero.mjs
//
// The snapshot keeps its data-edit-id attributes on purpose: the build uses
// them to pour Ronen's currently published text into it, so a published
// headline is baked in without this ever being re-run. Only a code change to
// the hero's shape needs a new snapshot.
// Playwright is a local-only tool: it never runs on Vercel, so it stays out of
// package.json. Resolve it from wherever it happens to live on this machine.
const { chromium } = await (async () => {
  for (const spec of ["playwright", ...(process.env.PW_PATH ? [process.env.PW_PATH] : []),
    ...await findNpxPlaywright()]) {
    try { return await import(spec); } catch { /* try the next one */ }
  }
  console.error("✗ playwright not found. Run:  npx playwright install chromium");
  process.exit(1);
})();

async function findNpxPlaywright() {
  const { globSync } = await import("node:fs");
  try {
    return globSync(`${process.env.HOME}/.npm/_npx/*/node_modules/playwright/index.mjs`);
  } catch { return []; }
}
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { createReadStream, statSync } from "node:fs";

const DIST = "dist";
const OUT = "prerendered-hero.html";
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png",
  ".mp4": "video/mp4", ".woff2": "font/woff2", ".otf": "font/otf", ".svg": "image/svg+xml" };

const server = http.createServer((req, res) => {
  let p = path.join(DIST, decodeURIComponent(req.url.split("?")[0]));
  try { if (statSync(p).isDirectory()) p = path.join(p, "index.html"); } catch { }
  try {
    statSync(p);
    res.writeHead(200, { "Content-Type": TYPES[path.extname(p)] || "application/octet-stream" });
    createReadStream(p).pipe(res);
  } catch { res.writeHead(404).end("nope"); }
});
await new Promise((r) => server.listen(0, r));
const port = server.address().port;

// Prefer whatever browser this machine already has rather than downloading one.
const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}
);
const page = await (await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true })).newPage();
await page.goto(`http://localhost:${port}/`, { waitUntil: "load" });
// Wait for the hero to actually be rendered rather than trusting a timer.
await page.waitForSelector('[data-section-id="hero"] h1', { timeout: 30000 });
await page.waitForTimeout(3000);

const html = await page.evaluate(() => {
  const hero = document.querySelector('[data-section-id="hero"]');
  if (!hero) return null;
  const c = hero.cloneNode(true);
  // data-edit-id stays — the build needs it to place the published text.
  c.querySelectorAll("*").forEach((e) => {
    for (const a of ["contenteditable", "spellcheck", "data-edit-original", "data-edit-original-html", "data-move-id"]) e.removeAttribute(a);
  });
  c.querySelectorAll("script,iframe").forEach((e) => e.remove());
  // A placeholder must not pull the looping clip; the poster is already there.
  c.querySelectorAll("video").forEach((v) => {
    const img = document.createElement("img");
    img.src = v.getAttribute("poster") || "";
    img.alt = "";
    img.className = v.className;
    img.setAttribute("style", v.getAttribute("style") || "");
    img.setAttribute("fetchpriority", "high");
    v.replaceWith(img);
  });
  // This copy is scenery until React arrives — never a second hero for the
  // heatmap, the override engine or a screen reader.
  c.removeAttribute("data-section-id");
  return c.outerHTML;
});

await browser.close();
server.close();
if (!html) { console.error("✗ hero not found — snapshot NOT written"); process.exit(1); }
await fs.writeFile(OUT, html);
console.log(`✓ ${OUT} (${(html.length / 1024).toFixed(1)}KB, ${(html.match(/data-edit-id/g) || []).length} editable slots)`);
