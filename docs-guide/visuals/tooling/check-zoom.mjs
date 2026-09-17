// Is the click-to-zoom crisp on a Retina display? Opens the first figure on a
// page at 2× and reports device pixels drawn per source pixel (≤ 1.00 = crisp).
//
//   node check-zoom.mjs /en/plan/goals        (site running: cd site && npm run dev)
import { openLocal } from './yarmill.mjs';

const route = process.argv[2];
if (!route) { console.error('usage: node check-zoom.mjs /en/<area>/<slug>'); process.exit(1); }
const { browser, page } = await openLocal({ width: 1440, height: 900 });
await page.goto('http://localhost:3000' + route, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(2000);
const img = page.locator('.ym-zoom-trigger').first();
await img.scrollIntoViewIfNeeded();
await img.click();
await page.waitForTimeout(1200);           // past the entrance + hand-off
const s = await page.evaluate(() => {
  const el = document.querySelector('.ym-zoom-trigger');
  const r = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  return { natural: el.naturalWidth, cssWidth: Math.round(r.width), dpr: devicePixelRatio,
           position: cs.position, transform: cs.transform,
           devicePxAcross: Math.round(r.width * devicePixelRatio) };
});
console.log(JSON.stringify(s));
console.log('upscale factor:', (s.devicePxAcross / s.natural).toFixed(2), '(1.00 or less = crisp)');
await browser.close();
