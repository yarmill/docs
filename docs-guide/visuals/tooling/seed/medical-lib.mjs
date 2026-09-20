// Drives the Medical module's UI to create the SEED records.
//
// Every hook below was read off the live app with `RECON=1 node capture.mjs
// medical` and the probes that followed (2026-09-20, AFC Richmond, coach Ted
// Lasso), not guessed. Notes on the flows that aren't obvious:
//
// - Creating: the "Add record" button opens a two-item menu (Injury / Illness);
//   picking one creates the record immediately and routes to /medical/<uuid>.
//   A new record starts as New · Open · Modified training, dated today.
// - Dates: a calendar popover, no text input. Days outside the allowed range
//   render disabled (the expected-return picker disables everything before the
//   start date), and adjacent months' days share the grid — so navigate to the
//   month first, then index into the run of days that starts at the first "1".
//   Set the start date BEFORE the expected return, or the target day is still
//   disabled.
// - Diagnosis: search, pick the code, then pick a Side — picking the side
//   commits it and closes the popover. There is no separate Add button.
// - Everything auto-saves; there is no Save on the record.
import { cy, goTo } from '../capture-lib.mjs';
import { idOf } from '../cast.mjs';

const P = 700;

const CY = {
  add: 'add-health-issue',
  addInjury: 'add-health-issue-injury',
  addIllness: 'add-health-issue-illness',
  listItem: 'health-issue-list-item',
  title: 'health-issue-title',
  classification: 'classification-button',
  treatment: 'treatment-status-button',
  limitation: 'health-issue-status-button',
  staff: 'responsible-staff-button',
  startDate: 'health-issue-date-button',
  expectedReturn: 'expected-return-date-button',
  closureDate: 'closure-date-button',
  circumstance: 'add-circumstance-button',
  note: 'notes-editor',
  diagnosis: 'add-diagnosis-button',
  comment: 'comment-form',
  remove: 'remove-health-issue',
  dpNav: 'datepicker-navigation',
  dpDay: 'datepicker-day',
  dpPrev: 'previous-month',
  dpNext: 'next-month',
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];

// Run one step, and let the record survive a step that doesn't work: a missing
// circumstance value or an absent diagnosis code costs that field, not the run.
async function step(label, fn) {
  try { await fn(); return true; }
  catch (e) { console.log(`      – ${label} skipped (${e.message.split('\n')[0].slice(0, 80)})`); return false; }
}

// Pick an option by exact label out of whatever popover is open.
async function pickOption(page, label, { pause = P } = {}) {
  await page.locator('[role="option"], [role="menuitem"]')
    .filter({ hasText: new RegExp(`^${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`) })
    .first().click({ timeout: 8000 });
  await page.waitForTimeout(pause);
}

async function setFromDropdown(page, hook, label) {
  await page.locator(cy(hook)).first().click();
  await page.waitForTimeout(P);
  await pickOption(page, label);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
}

// Type into one of the app's contenteditable editors.
async function typeInto(page, locator, text) {
  await locator.click();
  await page.waitForTimeout(300);
  await page.keyboard.type(String(text), { delay: 8 });
  await page.waitForTimeout(400);
}

// Drive the calendar popover to an ISO date. The grid carries the tail of the
// previous month and the head of the next, so the target month's days are the
// `daysInMonth` buttons starting at the first button labelled "1".
async function pickDate(page, hook, iso) {
  const [y, m, d] = iso.split('-').map(Number);
  await page.locator(cy(hook)).first().click();
  await page.waitForTimeout(900);

  for (let guard = 0; guard < 48; guard++) {
    const shown = (await page.locator(cy(CY.dpNav)).first().innerText()).trim();
    const [sm, sy] = [MONTHS.indexOf(shown.split(' ')[0]) + 1, Number(shown.split(' ')[1])];
    if (sm === m && sy === y) break;
    const back = sy > y || (sy === y && sm > m);
    await page.locator(cy(back ? CY.dpPrev : CY.dpNext)).first().click();
    await page.waitForTimeout(450);
    if (guard === 47) throw new Error(`calendar would not reach ${iso} (stuck on ${shown})`);
  }

  const days = page.locator(cy(CY.dpDay));
  const labels = await days.allInnerTexts();
  const first = labels.findIndex((t) => t.trim() === '1');
  if (first < 0) throw new Error(`no day 1 in the ${iso} grid`);
  const cell = days.nth(first + d - 1);
  if (await cell.isDisabled().catch(() => false)) throw new Error(`${iso} is disabled in the picker`);
  await cell.click();
  await page.waitForTimeout(P);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
}

async function setDiagnosis(page, { query, code, side }) {
  let done = false;
  try {
    await page.locator(cy(CY.diagnosis)).first().click();
    await page.waitForTimeout(1200);
    const portal = page.locator('[data-floating-ui-portal], [role="dialog"]').last();
    await portal.locator('input').first().click({ force: true });
    await page.keyboard.type(query, { delay: 20 });
    await page.waitForTimeout(2200);

    // Match on the code, which the result rows carry after the label
    // ("Sprain lateral collateral ligament ankle AL1"). A code this instance's
    // OSIICS version doesn't have must not fall through to the nearest hit —
    // a wrong code in a published figure is worse than no diagnosis.
    const hit = page.locator('[role="option"]').filter({ hasText: new RegExp(`\\b${code}\\b`) }).first();
    if (!(await hit.count())) throw new Error(`no result carrying code ${code} for "${query}"`);
    await hit.click();
    await page.waitForTimeout(1200);

    // Side is a second select on the same inline row, and it does NOT commit:
    // the row carries Cancel / Add (Ctrl+Enter) and the diagnosis is only
    // attached once Add is pressed. Don't go looking for a button called "Add"
    // — the page has several (Add record, Add note, Add files, Add diagnosis)
    // and the first one in the DOM is the wrong one. Use the shortcut the row
    // advertises, and fall back to the button sitting next to its Cancel.
    // Side is offered for injuries; an illness has no side, and the select
    // simply isn't there. Not finding it is normal, not a failure.
    try { await pickOption(page, side, { pause: 900 }); }
    catch { console.log('      – no side on this record (illness), committing without one'); }
    const cancel = page.getByRole('button', { name: /^Cancel$/ }).first();
    await page.keyboard.press('Control+Enter');
    await page.waitForTimeout(1500);
    if (await cancel.count().catch(() => 0)) {
      await cancel.locator('xpath=..').getByRole('button').last().click();
      await page.waitForTimeout(1500);
    }
    if (await cancel.count().catch(() => 0)) throw new Error('the diagnosis row would not commit');
    done = true;
  } finally {
    // A half-filled diagnosis row left open sits over everything set after it.
    if (!done) {
      const cancel = page.getByRole('button', { name: /^Cancel$/ }).first();
      if (await cancel.count().catch(() => 0)) await cancel.click().catch(() => {});
      await page.keyboard.press('Escape').catch(() => {});
      await page.waitForTimeout(400);
    }
  }
}

// The circumstance categories are a hover submenu: hovering one opens its
// values over the category list, so each pair is set from a freshly opened
// menu. Whatever happens, close it — a menu left open swallows every click
// that follows, which once cost a whole record's note, staff and comments.
async function setCircumstance(page, category, value) {
  try {
    await page.locator(cy(CY.circumstance)).first().click();
    await page.waitForTimeout(1000);
    await page.locator('[role="option"], [role="menuitem"]')
      .filter({ hasText: new RegExp(`^${category}$`) }).first().hover({ timeout: 8000 });
    await page.waitForTimeout(1400);
    await pickOption(page, value, { pause: 900 });
  } finally {
    for (let i = 0; i < 2; i++) { await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(400); }
  }
}

/**
 * Delete every health record the athlete has. Only reachable through goTo →
 * idOf, so it cannot run against anyone outside AFC Richmond.
 */
export async function wipeAthlete(page, name) {
  await goTo(page, 'medical', { athlete: name, wait: 6500 });

  // Deleting is the one irreversible thing these scripts do, so prove where we
  // are first. idOf bounds it to AFC Richmond, but only if the app honoured the
  // URL: an expired session or an ignored parameter would leave us on the login
  // page or the whole-group overview, and the loop below would then delete
  // whatever it found there.
  const id = idOf(name);
  if (/\/login/i.test(page.url())) throw new Error('session expired — rebuild it (see check-session.mjs)');
  if (!page.url().includes(`athlete=${id}`)) {
    throw new Error(`refusing to delete: expected athlete=${id} in the URL, got ${page.url()}`);
  }

  let removed = 0;
  for (let guard = 0; guard < 30; guard++) {
    const before = await page.locator(cy(CY.listItem)).count();
    if (before === 0) break;
    await page.locator(cy(CY.listItem)).first().click();
    await page.waitForTimeout(2200);
    await page.locator(cy(CY.remove)).first().click();
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Yes, delete' }).click();
    await page.waitForTimeout(2500);
    if (await page.locator(cy(CY.listItem)).count() >= before) {
      // Not deleting, so stop rather than spin — and say so, because seeding on
      // top of records that are still there produces duplicates, not a re-seed.
      console.log(`  !! ${name}: a delete did not land, ${before} record(s) left — not seeding on top`);
      return { removed, remaining: before };
    }
    removed++;
  }
  console.log(`  wiped ${name}${removed ? ` (${removed} record${removed > 1 ? 's' : ''})` : ' (nothing to remove)'}`);
  return { removed, remaining: 0 };
}

/**
 * Create one health record from the SEED shape. Fields are set in the order a
 * human would, so the Activity log reads as the problem developing: create,
 * name, how bad it is, when it started and when they're due back, what it is,
 * how it happened, the note, who's looking after it, then the comments — and
 * the close last of all, so the closure date lands after everything else.
 */
export async function seedRecord(page, r) {
  await page.locator(cy(CY.add)).first().click();
  await page.waitForTimeout(1000);
  await page.locator(cy(r.type === 'Illness' ? CY.addIllness : CY.addInjury)).first().click();
  await page.waitForTimeout(3500);

  await page.locator(cy(CY.title)).first().fill(r.title);
  await page.keyboard.press('Tab');
  await page.waitForTimeout(P);

  if (r.limitation) await step('limitation', () => setFromDropdown(page, CY.limitation, r.limitation));
  if (r.classification && r.classification !== 'New') {
    await step('classification', () => setFromDropdown(page, CY.classification, r.classification));
  }
  if (r.startDate) await step('start date', () => pickDate(page, CY.startDate, r.startDate));
  if (r.expectedReturn) await step('expected return', () => pickDate(page, CY.expectedReturn, r.expectedReturn));
  if (r.diagnosis?.code) await step(`diagnosis ${r.diagnosis.code}`, () => setDiagnosis(page, r.diagnosis));

  for (const [category, value] of r.circumstances || []) {
    await step(`circumstance ${category}/${value}`, () => setCircumstance(page, category, value));
  }

  if (r.note) {
    await step('note', () => typeInto(page, page.locator(cy(CY.note)).first(), r.note));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  }

  if (r.staff) {
    await step('responsible staff', async () => {
      await page.locator(cy(CY.staff)).first().click();
      await page.waitForTimeout(P);
      await page.keyboard.type(r.staff, { delay: 10 });
      await page.keyboard.press('Enter');
      await page.waitForTimeout(P);
    });
  }

  for (const c of r.comments || []) {
    await step('comment', async () => {
      const form = page.locator(cy(CY.comment)).first();
      await typeInto(page, form.locator('[contenteditable], textarea').first(), c);
      await form.locator('button').last().click();
      await page.waitForTimeout(1500);
    });
  }

  if (r.treatment === 'Closed') {
    await step('close', () => setFromDropdown(page, CY.treatment, 'Closed'));
    // The app stamps its own closure date on close. If it turns out to be
    // editable, put the real one back; if not, this logs and moves on.
    if (r.closureDate) {
      await step('closure date', () => pickDate(page, CY.closureDate, r.closureDate));
    }
  }

  console.log(`    + ${r.title}`);
}
