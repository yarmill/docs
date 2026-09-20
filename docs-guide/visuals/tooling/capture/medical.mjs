// Raw captures for the Medical module (Injuries & Illnesses) page.
// Needs the seeded AFC Richmond data (`node seed.mjs medical`) and two
// sessions: session.json (Ted Lasso, coach) and session-jamie.json (Jamie
// Tartt, athlete). Writes raw/medical/*.png — full 3200×2000 windows; all
// cropping happens in compose.mjs.
//
// Clear both sessions before anything is written or shot:
//   node check-session.mjs session.json /medical
//   node check-session.mjs session-jamie.json /medical
//
// ─────────────────────────────────────────────────────────────────────────────
// UNVERIFIED — the route and every selector here is a GUESS
// The module notes (docs-guide/module-notes/medical-module.md §5–§7) were
// written against another instance (National Team / Simpson Lisa, GUI 2.0) and
// record no data-cy names. So: route `/medical`, the `?group=&athlete=` query,
// the record-card markup, the floating toolbar, the pickers — all unverified.
// Every shot below therefore runs inside `shot()`/`step()`, which log and carry
// on: one broken click path costs one raw, not the whole run.
//
//   RECON=1 node capture.mjs medical
//
// runs the reconnaissance pass below INSTEAD of the shoot: it dumps every
// interactive element (with its data-cy, if any) on the overview, the record
// list, the record detail and the quick-entry modal. That is the first thing to
// run against a live session — then put the real hooks into the CY table in
// seed/medical-lib.mjs and the SEL table here, and take the shots.
// ─────────────────────────────────────────────────────────────────────────────
import { open, BASE } from '../yarmill.mjs';
import { cy, goTo, shooter, dismissAnnouncements, dumpInteractive } from '../capture-lib.mjs';

const shot = shooter('medical');

// The athlete whose records the page is shot on, and the record that carries
// the richest data (must match seed/medical.mjs).
const ATHLETE = 'Tartt Jamie';
const HERO_RECORD = /ankle sprain/i;
const DIAGNOSIS_QUERY = 'ankle sprain';         // mid-search state for the OSIICS figure
const CIRCUMSTANCE_CATEGORY = 'Injury mechanism';

// Candidate selectors, best guess first. One line each so the real hook can
// replace the list once RECON has been run.
const SEL = {
  addRecord: [cy('add-record'), 'button:has-text("+")'],
  removeRecord: [cy('remove-record'), cy('delete-record')],
  quickEntry: [cy('new-quick-entry'), 'text=/New quick entry/i'],
  addDiagnosis: [cy('add-diagnosis')],
  addCircumstance: [cy('add-circumstance'), cy('add-circumstances')],
};

// ── plumbing: nothing here may abort the run ─────────────────────────────────
async function step(label, fn) {
  try { return await fn(); }
  catch (e) { console.log(`  !! ${label}: ${String(e.message).split('\n')[0].slice(0, 110)}`); return false; }
}

// A locator that is actually on screen, from a list of candidates (CSS string
// or fn(page) → Locator). Returns null on a miss.
async function find(page, candidates, { timeout = 3000 } = {}) {
  const deadline = Date.now() + timeout;
  do {
    for (const c of candidates.flat()) {
      if (!c) continue;
      let l;
      try { l = typeof c === 'function' ? c(page) : page.locator(c); } catch { continue; }
      if (!(await l.count().catch(() => 0))) continue;
      const first = l.first();
      if (await first.isVisible().catch(() => false)) return first;
    }
    await page.waitForTimeout(200);
  } while (Date.now() < deadline);
  return null;
}

async function click(page, candidates, { pause = 1200 } = {}) {
  const el = await find(page, candidates);
  if (!el) return false;
  await el.click({ force: true });
  await page.waitForTimeout(pause);
  return true;
}

const escapeTwice = async (page) => {
  for (const _ of [0, 1]) { await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(600); }
};

// Open a record from the Open/Closed list by (part of) its title.
const openRecord = (page, title) => click(page, [
  (p) => p.locator(cy('record-list-item')).filter({ hasText: title }),
  (p) => p.locator('[role="listitem"], li, [class*="card"]').filter({ hasText: title }),
  (p) => p.getByText(title),
], { pause: 3000 });

// ── RECON ────────────────────────────────────────────────────────────────────
// `RECON=1 node capture.mjs medical` — learn the real hooks, take no shots.
if (process.env.RECON) {
  const { browser, page } = await open();
  page.on('pageerror', (e) => console.log('  PAGEERROR', e.message.slice(0, 100)));

  await step('recon: overview', async () => {
    await goTo(page, 'medical', { wait: 6500 });
    console.log('URL:', page.url());
    await dumpInteractive(page, 'Entire Group overview (dark)');
  });

  await step('recon: record list', async () => {
    await goTo(page, 'medical', { athlete: ATHLETE, wait: 6000 });
    console.log('URL:', page.url());
    await dumpInteractive(page, 'record list (Open / Closed)');
  });

  await step('recon: record detail', async () => {
    await openRecord(page, HERO_RECORD);
    await page.waitForTimeout(2500);
    console.log('URL:', page.url());
    await dumpInteractive(page, 'record detail');
  });

  await step('recon: quick entry modal', async () => {
    if (!(await click(page, SEL.quickEntry, { pause: 2000 }))) {
      await page.keyboard.press('n');            // the `N` shortcut (§6.4)
      await page.waitForTimeout(2000);
    }
    await dumpInteractive(page, 'New quick entry modal');
    await escapeTwice(page);
  });

  await browser.close();
  console.log('\nmedical: recon complete — put the hooks into SEL here and CY in seed/medical-lib.mjs');
  process.exit(0);
}

// ── coach session (Ted Lasso) ────────────────────────────────────────────────
{
  const { browser, page } = await open();
  page.on('pageerror', (e) => console.log('  PAGEERROR', e.message.slice(0, 100)));

  // 1. the team on one dark screen — the module's landing view
  await step('overview', async () => {
    await goTo(page, 'medical', { wait: 6500 });
    await shot(page, 'overview');
  });

  // 2. one athlete's Open / Closed lists, nothing opened yet
  await step('record-list', async () => {
    await goTo(page, 'medical', { athlete: ATHLETE, wait: 6000 });
    await shot(page, 'record-list');
  });

  // 3. the hero: a record with everything on it
  await step('record', async () => {
    await openRecord(page, HERO_RECORD);
    await page.waitForTimeout(3500);
    await dismissAnnouncements(page);
    await shot(page, 'record');
  });

  // 4. the OSIICS picker, mid-search — the figure that makes the OSIICS point.
  //    Nothing is added: Escape backs out, so the seeded record is unchanged.
  await step('diagnosis-picker', async () => {
    const opened = await click(page, [
      SEL.addDiagnosis,
      (p) => p.getByText(/^\s*Diagnosis\s*$/i).locator('xpath=ancestor::*[self::section or self::div][2]')
        .getByRole('button', { name: /^\s*(\+|add)\s*$/i }),
    ], { pause: 1500 });
    if (!opened) return console.log('  – diagnosis "+" not found');
    const search = await find(page, [
      cy('diagnosis-search'),
      (p) => p.getByPlaceholder(/search|diagnos/i),
      '[role="dialog"] input',
    ]);
    if (!search) return console.log('  – diagnosis search box not found');
    await search.click();
    await page.keyboard.type(DIAGNOSIS_QUERY, { delay: 45 });   // leave the results showing
    await page.waitForTimeout(2200);
    await shot(page, 'diagnosis-picker');
    await escapeTwice(page);
  });

  // 5. the circumstances picker with one submenu open (per-instance codelists)
  await step('circumstances-picker', async () => {
    const opened = await click(page, [
      SEL.addCircumstance,
      (p) => p.getByText(/^\s*Circumstances\s*$/i).locator('xpath=ancestor::*[self::section or self::div][2]')
        .getByRole('button', { name: /^\s*(\+|add)\s*$/i }),
    ], { pause: 1500 });
    if (!opened) return console.log('  – circumstances "+" not found');
    await click(page, [
      (p) => p.locator('[role="menuitem"], [role="option"], li').filter({ hasText: new RegExp(`^\\s*${CIRCUMSTANCE_CATEGORY}\\s*$`, 'i') }),
      (p) => p.getByText(new RegExp(`^\\s*${CIRCUMSTANCE_CATEGORY}\\s*$`, 'i')),
    ], { pause: 1500 });
    await shot(page, 'circumstances-picker');
    await escapeTwice(page);
  });

  // 6. the quick-entry modal (floating toolbar, or the `N` shortcut).
  //    Nothing is created until Save — Escape leaves no record behind.
  await step('quick-entry', async () => {
    const opened = await click(page, SEL.quickEntry, { pause: 2200 });
    if (!opened) { await page.keyboard.press('n'); await page.waitForTimeout(2200); }
    await shot(page, 'quick-entry');
    await escapeTwice(page);
  });

  // 7. the create picker (+ → Injury / Illness) and, behind it, the empty
  //    record it makes. The scratch record is deleted again below, in this run.
  await step('create-picker + new-record', async () => {
    await goTo(page, 'medical', { athlete: ATHLETE, wait: 5000 });
    if (!(await click(page, SEL.addRecord, { pause: 1500 }))) return console.log('  – create "+" not found');
    await shot(page, 'create-picker');

    const chose = await click(page, [
      (p) => p.locator('[role="menuitem"], [role="option"], li').filter({ hasText: /^\s*Injury\s*$/i }),
      (p) => p.getByText(/^\s*Injury\s*$/i),
    ], { pause: 3000 });
    if (!chose) { await escapeTwice(page); return console.log('  – "Injury" not found in the create picker'); }
    await dismissAnnouncements(page);
    await shot(page, 'new-record');

    // clean up the scratch record in the same run
    const binned = await click(page, [
      SEL.removeRecord,
      (p) => p.getByRole('button', { name: /^(delete|remove)/i }),
      (p) => p.locator('[class*="toolbar"] button, [class*="floating"] button').last(),
    ], { pause: 1200 });
    if (!binned) return console.log('  !! SCRATCH RECORD NOT DELETED — remove "New Injury" by hand');
    const confirm = await find(page, [(p) => p.getByRole('button', { name: /^(Yes, delete|Delete|Yes)$/i })], { timeout: 2500 });
    if (confirm) await confirm.click({ force: true });
    await page.waitForTimeout(2500);
    console.log('  (scratch record deleted)');
  });

  await browser.close();
}

// ── athlete session (Jamie Tartt) ────────────────────────────────────────────
// The point of this one is what ISN'T there: no group dropdown, no athlete
// list, no Entire Group — only his own records.
{
  const { browser, page } = await open({ session: 'session-jamie.json' });
  page.on('pageerror', (e) => console.log('  PAGEERROR', e.message.slice(0, 100)));

  await step('athlete-view', async () => {
    await page.goto(`${BASE}/medical`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(6000);
    await dismissAnnouncements(page);
    await openRecord(page, HERO_RECORD);
    await page.waitForTimeout(3000);
    await shot(page, 'athlete-view');
  });

  await browser.close();
}
console.log('medical: capture pass complete — check raw/medical/ before composing');
