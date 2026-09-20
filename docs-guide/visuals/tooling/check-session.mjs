// node check-session.mjs [session.json] [/medical]
//
// Is this session still logged in, and as whom? A session built from pasted
// cookies expires silently; without this the first sign is a login page in the
// middle of a raw capture. Optionally also opens a module route for the demo
// group and reports what rendered, so a shoot can be cleared before it starts.
import { open, BASE } from './yarmill.mjs';
import { dismissAnnouncements } from './capture-lib.mjs';
import { GROUP } from './cast.mjs';

const session = process.argv[2] || 'session.json';
const route = process.argv[3];

const { browser, page } = await open({ session });
try {
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(5000);
  if (/\/login/.test(page.url())) {
    console.log(`${session}: NOT logged in — the app redirected to ${page.url()}.`);
    console.log('  Rebuild it from a fresh paste (README → "Getting a session").');
    process.exitCode = 1;
  } else {
    console.log(`${session}: logged in — landed on ${page.url()}`);
    await dismissAnnouncements(page);
    const who = await page.evaluate(() => {
      const el = document.querySelector('[data-cy="user-name"], [data-cy="avatar"], header img[alt]');
      return el ? (el.innerText || el.getAttribute('alt') || '').trim() : null;
    });
    if (who) console.log(`  as: ${who}`);
  }

  if (route) {
    const url = `${BASE}${route}${route.includes('?') ? '&' : '?'}group=${GROUP}`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(6000);
    await dismissAnnouncements(page);
    const text = (await page.locator('body').innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400);
    console.log(`  ${route} → ${page.url()}`);
    console.log(`  renders: ${text || '(nothing)'}`);
  }
} finally {
  await browser.close();
}
