// Raw captures for the Medical module page. Needs the seeded AFC Richmond data
// (node seed.mjs medical) and the coach session (session.json, Ted Lasso); the
// athlete shot additionally needs session-jamie.json. Writes raw/medical/*.png.
//
// Hooks are the real ones, read off the live app on 2026-09-20 — see the header
// of ../seed/medical-lib.mjs for the flows that aren't obvious. Every shot runs
// inside step(), so a broken click path costs one raw rather than the run.
//
//   RECON=1 node capture.mjs medical    dump the interactive elements instead
import { open } from '../yarmill.mjs';
import { cy, goTo, shooter, dismissAnnouncements, dumpInteractive } from '../capture-lib.mjs';
import { HERE } from '../yarmill.mjs';
import fs from 'fs';
import path from 'path';

const shot = shooter('medical');
const HERO = 'Right ankle sprain (lateral)';

async function step(label, fn) {
  try { await fn(); }
  catch (e) { console.log(`  !! ${label}: ${e.message.split('\n')[0].slice(0, 110)}`); }
}

const openRecord = async (page, title) => {
  await page.locator(cy('health-issue-list-item')).filter({ hasText: title }).first().click();
  await page.waitForTimeout(3000);
};

// Make sure we are where we think we are before shooting eight screens of it.
async function assertMedical(page) {
  if (/\/login/i.test(page.url())) throw new Error('session expired — see check-session.mjs');
  if (!(await page.getByText('Injuries & Illnesses').first().count())) {
    throw new Error(`not on the Medical module: ${page.url()}`);
  }
}

// ---------- coach session ----------
{
  const { browser, page } = await open();

  if (process.env.RECON) {
    await goTo(page, 'medical', { wait: 7000 });
    await dumpInteractive(page, 'Entire Group overview (dark)');
    await goTo(page, 'medical', { athlete: 'Tartt Jamie', wait: 7000 });
    await dumpInteractive(page, 'record list (Open / Closed)');
    await openRecord(page, HERO).catch(() => {});
    await dumpInteractive(page, 'record detail');
    await page.locator(cy('add-health-issue')).first().click().catch(() => {});
    await page.waitForTimeout(1200);
    await dumpInteractive(page, 'create picker');
    await browser.close();
    console.log('medical: recon complete');
    process.exit(0);
  }

  // the squad — the page's hero
  await goTo(page, 'medical', { wait: 7500 });
  await assertMedical(page);
  await shot(page, 'overview');

  // one athlete's Open / Closed lists, nothing opened
  await goTo(page, 'medical', { athlete: 'Tartt Jamie', wait: 7000 });
  await shot(page, 'record-list');

  // the filled record
  await step('record', async () => {
    await openRecord(page, HERO);
    await shot(page, 'record');
  });

  // the OSIICS picker mid-search — the figure that carries the diagnosis section
  await step('diagnosis-picker', async () => {
    await page.locator(cy('add-diagnosis-button')).first().click();
    await page.waitForTimeout(1200);
    const row = page.locator('[data-floating-ui-portal], [role="dialog"]').last();
    await row.locator('input').first().click({ force: true });
    await page.keyboard.type('ankle sprain', { delay: 25 });
    await page.waitForTimeout(2500);
    await shot(page, 'diagnosis-picker');
    const cancel = page.getByRole('button', { name: /^Cancel$/ }).first();
    if (await cancel.count()) await cancel.click();
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);
  });

  // the circumstances submenu (captured, not published — see figures/medical.mjs)
  await step('circumstances-picker', async () => {
    await page.locator(cy('add-circumstance-button')).first().click();
    await page.waitForTimeout(1100);
    await page.locator('[role="option"], [role="menuitem"]').filter({ hasText: /^Activity$/ }).first().hover();
    await page.waitForTimeout(1500);
    await shot(page, 'circumstances-picker');
    await page.keyboard.press('Escape'); await page.waitForTimeout(400);
    await page.keyboard.press('Escape'); await page.waitForTimeout(800);
  });

  // the create menu (captured, not published)
  await step('create-picker', async () => {
    await page.locator(cy('add-health-issue')).first().click();
    await page.waitForTimeout(1300);
    await shot(page, 'create-picker');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(800);
  });

  // quick entry: the button offers Injury / Illness, then the entry form opens
  await step('quick-entry', async () => {
    await page.getByRole('button', { name: /New quick entry/ }).first().click();
    await page.waitForTimeout(1200);
    await page.locator(cy('add-health-issue-injury')).first().click();
    await page.waitForTimeout(2500);
    await shot(page, 'quick-entry');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1200);
  });

  // an empty record, captured and then removed again. The delete is in a
  // finally and it refuses to fire on anything but the placeholder title, so a
  // misfire costs a raw rather than one of the seeded records.
  await step('new-record', async () => {
    await goTo(page, 'medical', { athlete: 'Tartt Jamie', wait: 6000 });
    await page.locator(cy('add-health-issue')).first().click();
    await page.waitForTimeout(1200);
    await page.locator(cy('add-health-issue-injury')).first().click();
    await page.waitForTimeout(3500);
    try {
      await shot(page, 'new-record');
    } finally {
      const title = await page.locator(cy('health-issue-title')).first().inputValue().catch(() => '');
      if (/^New (Injury|Illness)$/i.test(title.trim())) {
        await page.locator(cy('remove-health-issue')).first().click();
        await page.waitForTimeout(1000);
        await page.getByRole('button', { name: 'Yes, delete' }).click();
        await page.waitForTimeout(2500);
        console.log('  (scratch record deleted)');
      } else {
        console.log(`  !! SCRATCH RECORD NOT DELETED — open record is "${title}", not the placeholder. Remove it by hand.`);
      }
    }
  });

  await browser.close();
}

// ---------- athlete session ----------
// Jamie's own account: the point is what ISN'T there — no group dropdown, no
// athlete list. Skipped when the session file is missing.
if (fs.existsSync(path.join(HERE, 'session-jamie.json'))) {
  const { browser, page } = await open({ session: 'session-jamie.json' });
  await step('athlete-view', async () => {
    await page.goto('https://we.yarmill.com/medical', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(7000);
    await dismissAnnouncements(page);
    await openRecord(page, HERO).catch(() => {});
    await shot(page, 'athlete-view');
  });
  await browser.close();
} else {
  console.log('  (no session-jamie.json — athlete-view skipped)');
}

console.log('medical: raws captured');
