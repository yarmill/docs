// Screenshot every <Frame> on a docs page, light and dark, at 2× — to eyeball
// bleed, corners, backdrop and callout legibility as the reader will see them.
//
//   node check-frames.mjs /en/plan/goals        (site running: cd site && npm run dev)
import fs from 'fs';
import path from 'path';
import { HERE, openLocal } from './yarmill.mjs';

const route = process.argv[2];
if (!route) { console.error('usage: node check-frames.mjs /en/<area>/<slug>'); process.exit(1); }
const dir = path.join(HERE, 'shots', route.replace(/^\/+/, '').replace(/\//g, '-'));
fs.mkdirSync(dir, { recursive: true });

const { browser, page } = await openLocal();
await page.goto('http://localhost:3000' + route, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(2000);
for (const theme of ['light', 'dark']) {
  await page.evaluate((t) => document.documentElement.classList.toggle('dark', t === 'dark'), theme);
  await page.waitForTimeout(600);
  const figs = await page.$$('.ym-frame');
  for (let i = 0; i < figs.length; i++) {
    await figs[i].scrollIntoViewIfNeeded(); await page.waitForTimeout(400);
    await figs[i].screenshot({ path: path.join(dir, `frame-${i + 1}-${theme}.png`) });
  }
  console.log(`${theme}: ${figs.length} frames → ${path.relative(HERE, dir)}/`);
}
await browser.close();
