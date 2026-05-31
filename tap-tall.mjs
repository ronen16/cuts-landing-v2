import { webkit, devices } from 'playwright';
const iPhone = devices['iPhone 13'];
const browser = await webkit.launch();
const context = await browser.newContext({ ...iPhone, viewport: { width: 390, height: 2200 }, screen: { width: 390, height: 2200 } });
const page = await context.newPage();
const logs = [];
page.on('console', (m) => logs.push(`[${m.type()}] ${m.text()}`));
await page.goto('https://www.cuts.co.il/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);

async function tapTest(name, selector) {
  const loc = page.locator(selector).first();
  if (await loc.count() === 0) { console.log(`\n## ${name}: NOT FOUND`); return; }
  await loc.scrollIntoViewIfNeeded().catch(()=>{});
  await page.waitForTimeout(400);
  console.log(`\n## ${name}`);
  for (let n = 1; n <= 2; n++) {
    const p = await loc.evaluate((node) => {
      const r = node.getBoundingClientRect();
      const cx = Math.round(r.left+r.width/2), cy = Math.round(r.top+r.height/2);
      const top = document.elementFromPoint(cx, cy);
      return { cx, cy, inV: cy>=0&&cy<=window.innerHeight, hitsSelf: top===node||node.contains(top),
        topTag: top?top.tagName:'null', errs: document.querySelectorAll('[class*="err"]').length };
    });
    if (!p.inV) { console.log(`  tap${n}: off-screen cy=${p.cy}`); continue; }
    await page.touchscreen.tap(p.cx, p.cy);
    await page.waitForTimeout(700);
    const after = await loc.evaluate(() => ({ errs: document.querySelectorAll('[class*="err"]').length, sy: window.scrollY }));
    console.log(`  tap${n}: hitsSelf=${p.hitsSelf} top=${p.topTag} errsBefore=${p.errs} errsAfter=${after.errs} url=${page.url().slice(-18)}`);
  }
}
await tapTest('FINAL submit', '#cta button[type="submit"]');
await tapTest('MINI submit', 'button:has-text("שליחה")');
console.log('\nLOGS:', logs.slice(-8).join(' | '));
await browser.close();
