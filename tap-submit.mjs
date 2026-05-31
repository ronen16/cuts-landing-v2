import { webkit, devices } from 'playwright';

const URL = 'https://www.cuts.co.il/';
const iPhone = devices['iPhone 13'];

const browser = await webkit.launch();
const context = await browser.newContext({ ...iPhone });
const page = await context.newPage();
const logs = [];
page.on('console', (m) => logs.push(`[${m.type()}] ${m.text()}`));
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));

await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);

// Tap a button N times with a real touchscreen tap, in-viewport, and report
// after each tap: did scroll change / did validation errors appear / did url change.
async function tapTest(name, selector, taps = 3) {
  const loc = page.locator(selector).first();
  if (await loc.count() === 0) { console.log(`\n## ${name}: NOT FOUND`); return; }

  // bring into viewport center via window.scroll so coords are valid
  await loc.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (el) {
      const r = el.getBoundingClientRect();
      const target = r.top + window.scrollY - (window.innerHeight / 2);
      window.scrollTo(0, target);
    }
  }, selector);
  await page.waitForTimeout(600);

  console.log(`\n## ${name}  (${selector})`);
  for (let n = 1; n <= taps; n++) {
    const pre = await page.evaluate(() => ({
      scrollY: window.scrollY,
      errCount: document.querySelectorAll('[class*="err"], [style*="rgb(220"], .field-error').length,
      bodyLen: document.body.innerHTML.length,
    }));
    const point = await loc.evaluate((node) => {
      const r = node.getBoundingClientRect();
      const cx = Math.round(r.left + r.width / 2);
      const cy = Math.round(r.top + r.height / 2);
      const top = document.elementFromPoint(cx, cy);
      return {
        cx, cy,
        inViewport: cy >= 0 && cy <= window.innerHeight,
        hitsSelf: top === node || node.contains(top),
        topTag: top ? top.tagName + '.' + ((top.className||'')+'').trim().split(/\s+/)[0] : 'null',
      };
    });
    if (!point.inViewport) { console.log(`  tap${n}: SKIP (cy=${point.cy} off-screen)`); continue; }
    await page.touchscreen.tap(point.cx, point.cy);
    await page.waitForTimeout(700);
    const post = await page.evaluate(() => ({
      scrollY: window.scrollY,
      errCount: document.querySelectorAll('[class*="err"], [style*="rgb(220"], .field-error').length,
      bodyLen: document.body.innerHTML.length,
    }));
    console.log(`  tap${n}: hitsSelf=${point.hitsSelf} top=${point.topTag} | scrollΔ=${post.scrollY-pre.scrollY} errΔ=${post.errCount-pre.errCount} bodyΔ=${post.bodyLen-pre.bodyLen} url=${page.url().slice(-20)}`);
  }
}

await tapTest('HERO CTA', 'section .btn-primary', 3);
await tapTest('FINAL submit (#cta)', '#cta button[type="submit"]', 3);

console.log('\n===== LOGS =====');
console.log(logs.slice(-15).join('\n'));
await browser.close();
