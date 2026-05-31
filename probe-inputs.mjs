import { webkit, devices } from 'playwright';

const URL = process.env.URL || 'https://www.cuts.co.il/';
const iPhone = devices['iPhone 13'];
const browser = await webkit.launch();
const context = await browser.newContext({ ...iPhone });
const page = await context.newPage();
const logs = [];
page.on('console', (m) => logs.push(`[${m.type()}] ${m.text()}`));
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));

await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);

// For each target: scroll into view, read center point, elementFromPoint, pointer-events,
// then tap and report whether it got focus / checkbox toggled, and whether DOM node survived.
async function probe(name, selector, kind) {
  const loc = page.locator(selector).first();
  if (await loc.count() === 0) { console.log(`\n## ${name}: NOT FOUND (${selector})`); return; }
  await loc.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (el) { const r = el.getBoundingClientRect();
      window.scrollTo(0, r.top + window.scrollY - window.innerHeight / 2); }
  }, selector);
  await page.waitForTimeout(500);

  const info = await loc.evaluate((node) => {
    const r = node.getBoundingClientRect();
    const cx = Math.round(r.left + r.width / 2), cy = Math.round(r.top + r.height / 2);
    const top = document.elementFromPoint(cx, cy);
    const cs = getComputedStyle(node);
    const desc = (el) => el ? el.tagName.toLowerCase() + '.' + ((el.className && el.className.baseVal != null ? el.className.baseVal : el.className) || '').toString().trim().split(/\s+/).slice(0,2).join('.') : 'null';
    return {
      cx, cy, w: Math.round(r.width), h: Math.round(r.height),
      inVp: cy >= 0 && cy <= window.innerHeight,
      topEl: desc(top),
      hitsSelf: top === node || node.contains(top) || (top && top.contains(node)),
      pe: cs.pointerEvents, opacity: cs.opacity, vis: cs.visibility,
      revealInit: node.classList.contains('reveal-init'),
      closestRevealInit: !!node.closest('.reveal-init'),
    };
  });
  console.log(`\n## ${name}  (${selector})`);
  console.log(`  rect ${info.w}x${info.h} center=(${info.cx},${info.cy}) inVp=${info.inVp}`);
  console.log(`  topElAtCenter=${info.topEl} hitsSelf=${info.hitsSelf}`);
  console.log(`  pointer-events=${info.pe} opacity=${info.opacity} vis=${info.vis} reveal-init(self/ancestor)=${info.revealInit}/${info.closestRevealInit}`);
  if (!info.inVp) { console.log('  (off-screen, skip tap)'); return; }

  // tap once
  await page.touchscreen.tap(info.cx, info.cy);
  await page.waitForTimeout(500);
  const after = await page.evaluate((k) => {
    const ae = document.activeElement;
    return {
      activeTag: ae ? ae.tagName + (ae.type ? '[' + ae.type + ']' : '') : 'none',
      activePlaceholder: ae ? ae.placeholder || '' : '',
    };
  }, kind);
  console.log(`  after 1 tap: activeElement=${after.activeTag} ph="${after.activePlaceholder}"`);
}

await probe('FinalCTA name input', '#cta-form-name', 'input');
await probe('FinalCTA phone input', '#cta input[dir="ltr"]', 'input');
await probe('Consent checkbox label', '#cta label', 'checkbox');
await probe('"בואו נבדוק יחד" link', 'a[href="#cta"]:has-text("בואו נבדוק")', 'a');

console.log('\n===== LOGS =====');
console.log(logs.slice(-12).join('\n') || '(none)');
await browser.close();
