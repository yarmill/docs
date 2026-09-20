// Drives the Medical UI (Injuries & Illnesses) to create the SEED records.
// Data lives in seed/medical.mjs; run it with `node seed.mjs medical`.
//
// ─────────────────────────────────────────────────────────────────────────────
// UNVERIFIED — READ BEFORE RUNNING
// The Medical module was explored on a DIFFERENT instance (National Team /
// Simpson Lisa, see docs-guide/module-notes/medical-module.md §5–§7) and no
// data-cy hooks were recorded for it. Route (`/medical`), the query params
// (`?group=&athlete=`), and every selector below are therefore GUESSES.
// So: each control is looked up through a LIST of candidates — the data-cy the
// notes imply first, then a role/text locator that works with no hooks at all —
// and every step logs and continues instead of aborting the run.
//
// First thing to do against a live session is the RECON block at the top of
// capture/medical.mjs (`RECON=1 node capture.mjs medical`). It dumps the real
// hooks; put them in the CY table below, then re-run the seed.
// ─────────────────────────────────────────────────────────────────────────────
//
// Record shape (seed/medical.mjs owns the data):
//   { title, type: 'Injury'|'Illness', classification: 'New'|'Recurring',
//     treatment: 'Open'|'Closed', limitation: '<exact UI label>',
//     startDate: 'YYYY-MM-DD', expectedReturn: 'YYYY-MM-DD'|null,
//     diagnosis: { query, code, side } | null,
//     circumstances: [[category, value], …], staff, note, comments: […] }
// (plus an optional `closureDate` on closed records — best-effort, see step 10:
// the app stamps its own closure date when the record is set to Closed.)
//
// Field order is deliberate: it is what the Activity log will read like
// afterwards. create → title → type properties → dates → diagnosis →
// circumstances → note → staff → comments → and Treatment Status = Closed
// LAST, so the closure date lands after every other change.
import { cy, goTo } from '../capture-lib.mjs';

const P = 700;      // the app's usual settle after a click
const LONG = 2200;  // after something that re-renders a panel

// ── hook guesses ─────────────────────────────────────────────────────────────
// Replace each list with the single real name once RECON has been run.
const CY = {
  addRecord:       ['add-record', 'add-health-record', 'medical-add-record'],
  recordItem:      ['record-list-item', 'health-record-item', 'medical-record-item'],
  recordTitle:     ['record-title', 'health-record-title', 'medical-record-title'],
  removeRecord:    ['remove-record', 'delete-record', 'remove-health-record'],
  classification:  ['record-classification', 'medical-classification'],
  treatment:       ['record-treatment-status', 'record-treatment', 'medical-treatment-status'],
  limitation:      ['record-injury-status', 'record-limitation', 'medical-injury-status'],
  staff:           ['record-staff', 'record-responsible-staff', 'medical-staff'],
  startDate:       ['record-start-date', 'record-startDate', 'medical-start-date'],
  expectedReturn:  ['record-expected-return', 'record-expectedReturn', 'medical-expected-return'],
  closureDate:     ['record-closure-date', 'record-closureDate', 'medical-closure-date'],
  addDiagnosis:    ['add-diagnosis', 'record-add-diagnosis'],
  diagnosisSearch: ['diagnosis-search', 'osiics-search'],
  diagnosisSide:   ['diagnosis-side', 'osiics-side'],
  addCircumstance: ['add-circumstance', 'add-circumstances', 'record-add-circumstance'],
  note:            ['record-note', 'medical-note'],
  commentForm:     ['medical-comment-form', 'record-comment-form', 'activity-comment-form'],
  quickEntry:      ['new-quick-entry', 'quick-entry', 'add-quick-entry'],
};
const cys = (k) => (CY[k] || []).map((n) => cy(n));

// Section titles on the record detail (§6.3), used to scope a lookup when there
// is no hook to scope it with.
export const SECTION = {
  keyDates: 'Key Dates',
  circumstances: 'Circumstances',
  note: 'Note',
  diagnosis: 'Diagnosis',
  files: 'Files',
  activity: 'Activity',
};

// ── defensive plumbing ───────────────────────────────────────────────────────
const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const exact = (s) => new RegExp(`^\\s*${esc(s)}\\s*$`, 'i');

// Try candidates in order (a CSS string, or a fn(scope) → Locator) and return
// the first one that is actually on screen. A miss returns null — callers log
// and carry on rather than killing the whole seeding pass.
export async function firstOf(scope, candidates, { timeout = 3000 } = {}) {
  const deadline = Date.now() + timeout;
  do {
    for (const c of candidates.flat()) {
      if (!c) continue;
      let l;
      try { l = typeof c === 'function' ? c(scope) : scope.locator(c); } catch { continue; }
      const n = await l.count().catch(() => 0);
      if (!n) continue;
      const first = l.first();
      if (await first.isVisible().catch(() => false)) return first;
    }
    await (scope.page ? scope.page() : scope).waitForTimeout(200).catch(() => {});
  } while (Date.now() < deadline);
  return null;
}

// One labelled attempt. Never throws: a failure is a line in the log.
export async function step(label, fn) {
  try {
    const r = await fn();
    if (r === false) console.log(`      – no hook for ${label} (skipped)`);
    return r;
  } catch (e) {
    console.log(`      !! ${label}: ${String(e.message).split('\n')[0].slice(0, 110)}`);
    return false;
  }
}

async function clickOne(scope, candidates, { pause = P } = {}) {
  const el = await firstOf(scope, candidates);
  if (!el) return false;
  await el.click({ force: true });
  const page = scope.page ? scope.page() : scope;
  await page.waitForTimeout(pause);
  return true;
}

// Pick an option out of whatever kind of menu the app opened (listbox, menu, or
// a plain list of clickable rows).
export async function choose(page, label, { close = true, pause = P } = {}) {
  const re = exact(label);
  const opt = await firstOf(page, [
    (p) => p.locator('[role="option"]').filter({ hasText: re }),
    (p) => p.locator('[role="menuitem"], [role="menuitemradio"], [role="treeitem"]').filter({ hasText: re }),
    (p) => p.locator('[role="dialog"] li, [role="menu"] li, [role="listbox"] li').filter({ hasText: re }),
    (p) => p.getByRole('button', { name: re }),
    (p) => p.getByText(re),
  ]);
  if (!opt) return false;
  await opt.click({ force: true });
  await page.waitForTimeout(pause);
  if (close) { await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(pause); }
  return true;
}

// The panel around a titled section of the record detail. No known hook, so:
// find the heading, walk up a couple of levels, use that as the scope. Falls
// back to the whole page, which is still usable because the section's controls
// are looked up by their own text.
export async function sectionScope(page, title, hookKey) {
  if (hookKey) {
    const byHook = await firstOf(page, cys(hookKey), { timeout: 600 });
    if (byHook) return byHook;
  }
  const head = page.getByText(exact(title)).first();
  if (await head.count().catch(() => 0)) {
    const box = head.locator('xpath=ancestor::*[self::section or self::div][2]');
    if (await box.count().catch(() => 0)) return box.first();
  }
  return page;
}

// The "+" that adds something inside a section (Circumstances, Diagnosis, Files).
async function plusIn(page, scope, hookKey) {
  const inSection = await clickOne(scope, [
    cys(hookKey),
    (s) => s.getByRole('button', { name: /^\s*\+\s*$/ }),
    (s) => s.getByRole('button', { name: /^(add|přidat)/i }),
    (s) => s.locator('button:has-text("+")'),
  ], { pause: 1200 });
  if (inSection) return true;
  return clickOne(page, cys(hookKey), { pause: 1200 });
}

// Type into an input / textarea / contenteditable and commit.
async function fillText(page, el, text, { commit = 'Tab', pause = P } = {}) {
  await el.click();
  await page.waitForTimeout(250);
  const tag = await el.evaluate((n) => n.tagName.toLowerCase()).catch(() => '');
  if (tag === 'input' || tag === 'textarea') {
    await el.fill(String(text)).catch(async () => { await page.keyboard.type(String(text), { delay: 12 }); });
  } else {
    await page.keyboard.type(String(text), { delay: 12 });
  }
  if (commit) await page.keyboard.press(commit).catch(() => {});
  await page.waitForTimeout(pause);
  return true;
}

// A date field: try filling the input, fall back to opening the calendar and
// typing into whatever it focuses. Locale is en-GB in the harness, so a picker
// that wants a typed date wants dd/mm/yyyy.
async function setDate(page, hookKey, label, iso) {
  if (!iso) return false;
  const [y, m, d] = iso.split('-');
  const uk = `${d}/${m}/${y}`;
  const scope = await sectionScope(page, SECTION.keyDates);
  const el = await firstOf(page, [
    cys(hookKey).map((s) => `${s} input`),
    cys(hookKey),
    (p) => scope.getByRole('button', { name: new RegExp(esc(label), 'i') }),
    (p) => scope.getByText(new RegExp(esc(label), 'i')),
  ]);
  if (!el) return false;
  const tag = await el.evaluate((n) => n.tagName.toLowerCase()).catch(() => '');
  if (tag === 'input') {
    await el.fill(iso).catch(() => {});
    const got = await el.inputValue().catch(() => '');
    if (!got) await el.fill(uk).catch(() => {});
    await page.keyboard.press('Enter').catch(() => {});
    await page.waitForTimeout(P);
    return true;
  }
  await el.click({ force: true });
  await page.waitForTimeout(1000);
  const inCal = await firstOf(page, [
    '[role="dialog"] input',
    '.calendar input, [class*="calendar"] input, [class*="date"] input',
  ], { timeout: 1500 });
  if (inCal) { await inCal.fill(uk).catch(() => {}); await page.keyboard.press('Enter').catch(() => {}); }
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(P);
  return true;
}

// A property pill on the record detail (§6.3): click it, pick the value.
async function setProperty(page, hookKey, uiLabel, value) {
  if (value == null) return false;
  const opened = await clickOne(page, [
    cys(hookKey),
    (p) => p.getByRole('button', { name: new RegExp(esc(uiLabel), 'i') }),
    (p) => p.getByText(new RegExp(esc(uiLabel), 'i')),
  ]);
  if (!opened) return false;
  // Injury Status is a *searchable* select — typing narrows it, harmless elsewhere.
  const search = await firstOf(page, ['[role="dialog"] input', '[role="listbox"] input', 'input[type="search"]'], { timeout: 800 });
  if (search) { await search.type(String(value).slice(0, 12), { delay: 15 }).catch(() => {}); await page.waitForTimeout(500); }
  return choose(page, value);
}

// ── the two exports seed.mjs uses ────────────────────────────────────────────

// Delete every Medical record the athlete has, open and closed. Only reachable
// through goTo → idOf, so it cannot touch anyone outside AFC Richmond.
export async function wipeAthlete(page, name) {
  await goTo(page, 'medical', { athlete: name, wait: 6000 });
  for (let guard = 0; guard < 25; guard++) {
    const card = await firstOf(page, [
      cys('recordItem'),
      // No hook: a record card in the Open/Closed list, addressed by its role.
      (p) => p.locator('[role="listitem"], li').filter({ hasText: /\d{1,2}[./]\d{1,2}[./]\d{2,4}|\d{4}-\d{2}-\d{2}/ }),
    ], { timeout: 2500 });
    if (!card) break;
    await card.click({ force: true });
    await page.waitForTimeout(LONG);
    const gone = await step('delete record', async () => {
      const hit = await clickOne(page, [
        cys('removeRecord'),
        (p) => p.getByRole('button', { name: /^(delete|remove|smazat)/i }),
        // the floating toolbar's bin, when it has no accessible name
        (p) => p.locator('[class*="toolbar"] button, [class*="floating"] button').last(),
      ], { pause: 1200 });
      if (!hit) return false;
      const confirm = await firstOf(page, [
        (p) => p.getByRole('button', { name: /^(Yes, delete|Delete|Yes|Ano, smazat)$/i }),
      ], { timeout: 2500 });
      if (confirm) await confirm.click({ force: true });
      await page.waitForTimeout(2500);
      return true;
    });
    if (!gone) break;   // don't spin 25 times on a hook that isn't there
  }
  console.log(`  wiped ${name}`);
}

// Create one record. `seed.mjs` calls this once per entry in seed/medical.mjs.
export async function seedRecord(page, r) {
  // 1. create — "+" in the record list, then Injury / Illness in the picker
  const created = await step('create', async () => {
    const hit = await clickOne(page, [
      cys('addRecord'),
      (p) => p.getByRole('button', { name: /^\s*\+\s*$/ }),
      (p) => p.getByRole('button', { name: /^(new|add)\b/i }),
    ], { pause: 1200 });
    if (!hit) return false;
    await choose(page, r.type || 'Injury', { close: false, pause: 1500 });
    await page.waitForTimeout(LONG);
    return true;
  });
  if (!created) { console.log(`    !! ${r.title}: no create affordance — nothing seeded`); return; }

  // 2. title (placeholder is "New Injury" / "New Illness")
  await step('title', async () => {
    const el = await firstOf(page, [
      cys('recordTitle'),
      (p) => p.getByRole('textbox', { name: /title|name/i }),
      (p) => p.locator('h1, h2').filter({ hasText: /^New (Injury|Illness)/i }),
      (p) => p.locator('h1 [contenteditable], h2 [contenteditable], [contenteditable]').first(),
    ]);
    if (!el) return false;
    const tag = await el.evaluate((n) => n.tagName.toLowerCase()).catch(() => '');
    if (tag === 'input' || tag === 'textarea') { await el.fill(r.title); await page.keyboard.press('Tab'); }
    else { await el.click(); await page.keyboard.press('Control+A').catch(() => {}); await page.keyboard.type(r.title, { delay: 12 }); await page.keyboard.press('Tab'); }
    await page.waitForTimeout(P);
    return true;
  });

  // 3. properties — classification and the training limitation.
  //    Treatment Status is handled at the very end (see step 10).
  await step('classification', () => setProperty(page, 'classification', 'Classification', r.classification));
  await step('injury status', () => setProperty(page, 'limitation', 'Injury Status', r.limitation));

  // 4. key dates
  await step('start date', () => setDate(page, 'startDate', 'start', r.startDate));
  await step('expected return', () => setDate(page, 'expectedReturn', 'Expected', r.expectedReturn));

  // 5. diagnosis — OSIICS search → result carrying the code → Side → Add
  if (r.diagnosis) {
    await step('diagnosis', async () => {
      const scope = await sectionScope(page, SECTION.diagnosis);
      if (!(await plusIn(page, scope, 'addDiagnosis'))) return false;
      const search = await firstOf(page, [
        cys('diagnosisSearch'),
        '[role="dialog"] input',
        (p) => p.getByPlaceholder(/search|diagnos|hledat/i),
        'input[type="search"]',
      ]);
      if (!search) return false;
      await search.click();
      await page.keyboard.type(String(r.diagnosis.query), { delay: 25 });
      await page.waitForTimeout(1800);
      const hit = await firstOf(page, [
        (p) => p.locator('[role="option"], [role="listitem"], li').filter({ hasText: new RegExp(`\\b${esc(r.diagnosis.code)}\\b`) }),
        (p) => p.getByText(new RegExp(`\\b${esc(r.diagnosis.code)}\\b`)),
      ], { timeout: 4000 });
      if (!hit) return false;
      await hit.click({ force: true });
      await page.waitForTimeout(P);
      if (r.diagnosis.side) {
        const sideCtl = await firstOf(page, [
          cys('diagnosisSide'),
          (p) => p.getByRole('combobox', { name: /side/i }),
          (p) => p.getByRole('button', { name: /side|left|right|bilateral|unknown/i }),
        ], { timeout: 1500 });
        if (sideCtl) { await sideCtl.click({ force: true }); await page.waitForTimeout(P); await choose(page, r.diagnosis.side, { close: false }); }
      }
      const add = await firstOf(page, [(p) => p.getByRole('button', { name: /^add$/i })], { timeout: 1500 });
      if (add) await add.click({ force: true });
      else await page.keyboard.press('Meta+Enter').catch(() => {});   // ⌘↵
      await page.waitForTimeout(LONG);
      await page.keyboard.press('Escape').catch(() => {});
      await page.waitForTimeout(P);
      return true;
    });
  }

  // 6. circumstances — "+" → category submenu → value (per-instance codelists)
  for (const [category, value] of r.circumstances || []) {
    await step(`circumstance ${category} › ${value}`, async () => {
      const scope = await sectionScope(page, SECTION.circumstances);
      if (!(await plusIn(page, scope, 'addCircumstance'))) return false;
      await choose(page, category, { close: false, pause: 900 });
      const ok = await choose(page, value, { close: true, pause: 1000 });
      if (!ok) await page.keyboard.press('Escape').catch(() => {});
      return ok;
    });
  }

  // 7. note (auto-saves on blur)
  if (r.note) {
    await step('note', async () => {
      const scope = await sectionScope(page, SECTION.note, 'note');
      const el = await firstOf(page, [
        cys('note'),
        (s) => scope.locator('textarea, [contenteditable]'),
        (p) => p.getByPlaceholder(/note|poznámk/i),
      ]);
      if (!el) return false;
      await fillText(page, el, r.note, { commit: null, pause: 400 });
      await page.mouse.click(40, 40);            // blur → auto-save
      await page.waitForTimeout(1200);
      return true;
    });
  }

  // 8. responsible staff (free text with Save/Cancel)
  if (r.staff) {
    await step('responsible staff', async () => {
      const opened = await clickOne(page, [
        cys('staff'),
        (p) => p.getByText(/Enter medical staff or institution/i),
        (p) => p.getByRole('button', { name: /responsible staff|staff/i }),
      ]);
      if (!opened) return false;
      const el = await firstOf(page, [
        cys('staff').map((s) => `${s} input`),
        (p) => p.getByPlaceholder(/medical staff or institution/i),
        '[role="dialog"] input',
      ]);
      if (!el) return false;
      await fillText(page, el, r.staff, { commit: null, pause: 300 });
      const save = await firstOf(page, [(p) => p.getByRole('button', { name: /^save$/i })], { timeout: 1200 });
      if (save) await save.click({ force: true });
      else await page.keyboard.press('Enter').catch(() => {});
      await page.waitForTimeout(1200);
      return true;
    });
  }

  // 9. comments in the Activity log
  for (const c of r.comments || []) {
    await step('comment', async () => {
      const scope = await sectionScope(page, SECTION.activity, 'commentForm');
      const box = await firstOf(page, [
        cys('commentForm').map((s) => `${s} [contenteditable], ${s} textarea`),
        (s) => scope.locator('[contenteditable], textarea'),
        (p) => p.getByPlaceholder(/leave a? ?comment|komentář/i),
      ]);
      if (!box) return false;
      await fillText(page, box, c, { commit: null, pause: 300 });
      const send = await firstOf(page, [
        (s) => scope.getByRole('button', { name: /^(comment|send|post|save)$/i }),
        (s) => scope.locator('button'),
      ], { timeout: 1200 });
      if (send) await send.click({ force: true });
      else await page.keyboard.press('Meta+Enter').catch(() => {});
      await page.waitForTimeout(1500);
      return true;
    });
  }

  // 10. LAST: close the record, so the closure date and the "changed treatment
  //     status to Closed" line land after everything else in Activity.
  if (r.treatment === 'Closed') {
    await step('treatment status → Closed', () => setProperty(page, 'treatment', 'Treatment Status', 'Closed'));
    // The app stamps the Closure date itself (§6.3). seed/medical.mjs carries a
    // `closureDate` for the ones where the demo story wants a specific day —
    // best-effort only: if the stamped date isn't editable this is a no-op.
    if (r.closureDate) {
      await step('closure date', () => setDate(page, 'closureDate', 'Closure', r.closureDate));
    }
  }

  console.log(`    + ${r.title}`);
}
