// Helpers shared by the per-module capture scripts (capture/<module>.mjs).
import fs from 'fs';
import path from 'path';
import { BASE, HERE } from './yarmill.mjs';
import { GROUP, idOf } from './cast.mjs';

export const cy = (name) => `[data-cy="${name}"]`;

// The app shows product announcements over the UI. Always clear them before a
// capture, or they end up in the figure — and they swallow the first click, so
// a script that doesn't dismiss them can also end up on the wrong screen.
export async function dismissAnnouncements(page) {
  for (let i = 0; i < 4; i++) {
    const btn = page.getByRole('button', { name: /^(Got it|Rozumím|Close|Zavřít|Dismiss)$/i }).first();
    if (await btn.count().catch(() => 0)) {
      await btn.click({ force: true }).catch(() => {});
      await page.waitForTimeout(1200);
    } else break;
  }
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(400);
}

// Open a module for one athlete of the demo group (coach session).
export async function goTo(page, module, { athlete, wait = 5000 } = {}) {
  const q = athlete ? `?group=${GROUP}&athlete=${idOf(athlete)}` : `?group=${GROUP}`;
  await page.goto(`${BASE}/${module}${q}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(wait);
  await dismissAnnouncements(page);
}

// A raw capture: the whole window, saved under raw/<module>/<name>.png.
export function shooter(module) {
  const dir = path.join(HERE, 'raw', module);
  fs.mkdirSync(dir, { recursive: true });
  return async (page, name) => {
    const file = path.join(dir, `${name}.png`);
    await page.screenshot({ path: file });
    console.log('  raw/' + module + '/' + name + '.png');
  };
}

// Type into one of the app's inline editors (contenteditable cells and inputs
// alike) and commit with Tab.
export async function typeIn(page, locator, text, { pause = 800 } = {}) {
  await locator.click();
  await page.waitForTimeout(250);
  await page.keyboard.type(String(text), { delay: 12 });
  await page.keyboard.press('Tab');
  await page.waitForTimeout(pause);
}

// Pick an option in one of the app's dropdowns by its exact label.
export async function pick(page, label, { close = true, pause = 700 } = {}) {
  await page.locator('[role="option"]').filter({ hasText: new RegExp(`^${label}$`) }).first().click();
  await page.waitForTimeout(pause);
  if (close) { await page.keyboard.press('Escape'); await page.waitForTimeout(pause); }
}

// List every interactive element with its box — for finding hooks on a new screen.
export async function dumpInteractive(page, label = '') {
  const els = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('button, a, [role="button"], input, textarea, [contenteditable], th, [role="combobox"], [data-cy]')) {
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      const t = (el.innerText || el.value || el.getAttribute('placeholder') || el.getAttribute('aria-label') || '').trim().slice(0, 70).replace(/\s+/g, ' ');
      const hook = el.getAttribute('data-cy') ? ` [data-cy=${el.getAttribute('data-cy')}]` : '';
      out.push(`${el.tagName.toLowerCase()}${hook} @${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)} :: ${t}`);
    }
    return out;
  });
  console.log(`--- ${label} ---\n` + els.join('\n'));
}
