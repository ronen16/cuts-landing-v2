// One-off check for the guest-strip image optimization:
// 1. no Drive image request during the critical path (right after load)
// 2. the background burst starts ~2.5s after load, without any scrolling
// 3. no request goes out at w1600
// 4. every tile is decoded by the time a visitor scrolls to the strip
import { chromium } from 'playwright';

// NOTE: run against an HTTPS deployment. From a plain-http localhost origin,
// Chrome ORB-blocks the lh3.googleusercontent.com responses and every tile
// fails — that failure mode does not exist on the HTTPS production site.
const URL = process.argv[2] || 'https://cuts-landing-v2.vercel.app/';
const browser = await chromium.launch({
  executablePath: process.env.HOME +
    '/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell',
});
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

const driveRequests = [];
page.on('request', (r) => {
  const u = r.url();
  if (u.includes('drive.google.com/thumbnail') || u.includes('googleusercontent.com')) {
    driveRequests.push(u);
  }
});

await page.goto(URL, { waitUntil: 'load' });
const atLoad = driveRequests.length;

// The 2.5s post-load timer should kick off the burst with no scrolling at all.
await page.waitForTimeout(5000);
const afterIdle = driveRequests.length;

// A visitor reads the hero for a few seconds, then scrolls down.
await page.waitForTimeout(5000);
await page.evaluate(() => {
  document.querySelector('.guest-section').scrollIntoView({ block: 'center' });
});
await page.waitForTimeout(500);

const imgState = await page.evaluate(() => {
  const imgs = [...document.querySelectorAll('.guest-section img')];
  return {
    count: imgs.length,
    decoded: imgs.filter((i) => i.complete && i.naturalWidth > 0).length,
    srcSample: imgs.slice(0, 2).map((i) => i.src),
  };
});

const w1600 = driveRequests.filter((u) => /w1600/.test(u));
console.log('drive requests right at load (should be 0):', atLoad);
console.log('drive requests after 5s idle, no scroll (should be >0):', afterIdle);
console.log('requests still at w1600 (should be 0):', w1600.length);
console.log('tiles:', imgState.count, '| decoded on arrival:', imgState.decoded);
console.log('src sample:', imgState.srcSample);

await browser.close();
if (atLoad !== 0 || afterIdle === 0 || w1600.length > 0 || imgState.decoded < imgState.count) {
  console.error('FAIL');
  process.exit(1);
}
console.log('PASS');
