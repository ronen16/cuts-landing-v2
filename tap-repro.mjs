import { webkit, devices } from 'playwright';

const URL = 'https://www.cuts.co.il/';
const iPhone = devices['iPhone 13'];

const browser = await webkit.launch();
const context = await browser.newContext({ ...iPhone });
const page = await context.newPage();

const logs = [];
page.on('console', (m) => logs.push(`[console.${m.type()}] ${m.text()}`));
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));

await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500); // let overrides apply + React settle

async function probe(name, selector) {
  const count = await page.locator(selector).count();
  if (count === 0) { console.log(`\n## ${name}: NOT FOUND (${selector})`); return; }
  const el = page.locator(selector).first();

  const visible = await el.isVisible().catch(() => false);
  if (!visible) { console.log(`\n## ${name}: present but NOT VISIBLE (${selector})`); return; }

  await el.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(400);

  const before = await page.evaluate(() => window.scrollY);
  const info = await el.evaluate((node) => {
    const r = node.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const top = document.elementFromPoint(cx, cy);
    const fiberKey = Object.keys(node).find((k) => k.startsWith('__reactFiber'));
    const propsKey = Object.keys(node).find((k) => k.startsWith('__reactProps'));
    const props = propsKey ? node[propsKey] : null;
    return {
      text: (node.textContent || '').trim().slice(0, 30),
      rect: { x: Math.round(cx), y: Math.round(cy), w: Math.round(r.width), h: Math.round(r.height) },
      childCount: node.children.length,
      topEl: top ? top.tagName + '.' + (top.className && top.className.baseVal != null ? top.className.baseVal : top.className || '').toString().trim().split(/\s+/).slice(0,2).join('.') : 'null',
      overlayIntercept: top !== node && !node.contains(top),
      hasReactFiber: !!fiberKey,
      reactHandlers: props ? Object.keys(props).filter((k) => /^on[A-Z]/.test(k)).join(',') : 'none',
    };
  });

  await page.touchscreen.tap(info.rect.x, info.rect.y);
  await page.waitForTimeout(900);
  const after = await page.evaluate(() => window.scrollY);
  const url = page.url();

  console.log(`\n## ${name}`);
  console.log(`  text: "${info.text}"  childCount: ${info.childCount}`);
  console.log(`  topElAtCenter: ${info.topEl}  overlayIntercept: ${info.overlayIntercept}`);
  console.log(`  hasReactFiber: ${info.hasReactFiber}  reactHandlers: ${info.reactHandlers}`);
  console.log(`  scrollY: ${before} -> ${after}  (moved ${after - before})`);
  console.log(`  url after: ${url}`);
}

// Enumerate every primary button on the page first
const inventory = await page.evaluate(() => {
  const btns = Array.from(document.querySelectorAll('button, .btn-primary, [type="submit"]'));
  return btns.map((b, i) => {
    const r = b.getBoundingClientRect();
    const propsKey = Object.keys(b).find((k) => k.startsWith('__reactProps'));
    const props = propsKey ? b[propsKey] : null;
    return {
      i,
      tag: b.tagName,
      cls: (b.className || '').toString().slice(0, 40),
      text: (b.textContent || '').trim().slice(0, 24),
      childCount: b.children.length,
      visible: r.width > 0 && r.height > 0,
      handlers: props ? Object.keys(props).filter((k) => /^on[A-Z]/.test(k)).join(',') : 'none',
    };
  });
});
console.log('===== BUTTON INVENTORY =====');
for (const b of inventory) {
  console.log(`[${b.i}] <${b.tag}> "${b.text}" cls=${b.cls} kids=${b.childCount} vis=${b.visible} handlers=${b.handlers}`);
}

await probe('NAV CTA (topnav)', '.topnav-cta');
await probe('HERO CTA', 'section .btn-primary');
await probe('FINAL-CTA submit', '#cta button[type="submit"]');

console.log('\n===== PAGE CONSOLE/ERRORS =====');
console.log(logs.slice(-25).join('\n') || '(none)');

await browser.close();
