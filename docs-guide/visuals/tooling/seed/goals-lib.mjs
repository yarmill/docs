// Drives the Goals UI to create the SEED goals, through the app's data-cy hooks.
import { cy, goTo, pick, typeIn } from '../capture-lib.mjs';
const P = 700;

async function setAttr(page, which, value) {
  await page.locator(cy(`objective-${which}`)).first().click();
  await page.waitForTimeout(P);
  await pick(page, value);
}

// Delete every goal the athlete has. Only reachable through goTo → idOf, so it
// cannot run against anyone outside AFC Richmond.
export async function wipeAthlete(page, name) {
  await goTo(page, 'okr', { athlete: name, wait: 6000 });
  for (let guard = 0; guard < 20; guard++) {
    const cards = page.locator(cy('objective-list-item'));
    if (await cards.count() === 0) break;
    await cards.first().click();
    await page.waitForTimeout(2000);
    await page.locator(cy('remove-objective')).first().click();
    await page.waitForTimeout(1200);
    await page.getByRole('button', { name: 'Yes, delete' }).click();
    await page.waitForTimeout(2500);
  }
  console.log(`  wiped ${name}`);
}

export async function seedGoal(page, g) {
  await page.locator(cy('add-objective')).first().click();
  await page.waitForTimeout(2500);
  await page.locator(cy('objective-title')).first().fill(g.title);
  await page.waitForTimeout(P);
  if (g.description) await typeIn(page, page.locator(cy('objective-description')).first(), g.description);
  if (g.season) await setAttr(page, 'season', g.season);
  if (g.priority) await setAttr(page, 'priority', g.priority);
  if (g.supervisor) await setAttr(page, 'supervisors', g.supervisor);
  if (g.category) {
    await page.locator(cy('objective-category')).first().click();
    await page.waitForTimeout(P);
    await pick(page, g.category[0], { close: false });
    await pick(page, g.category[1]);
  }
  for (const kr of g.keyResults || []) {
    const i = (await page.locator(cy('key-result-title')).count()) - 1;
    await typeIn(page, page.locator(cy('key-result-title')).nth(i), kr.name);
    await page.waitForTimeout(1200);
    for (const [field, v] of [['startValue', kr.start], ['currentValue', kr.current], ['targetValue', kr.target]]) {
      if (v != null) await typeIn(page, page.locator(cy(`key-result-${field}`)).nth(i), v);
    }
    if (kr.date) { await page.locator(cy('key-result-targetDate')).nth(i).fill(kr.date); await page.waitForTimeout(P); }
    if (kr.state) {
      await page.locator(cy('key-result-status')).nth(i).click();
      await page.waitForTimeout(P);
      await pick(page, kr.state);
    }
  }
  if (g.state) await setAttr(page, 'status', g.state);   // last, so Activity reads as progress
  for (const c of g.comments || []) {
    const form = page.locator(cy('okr-comment-form'));
    await typeIn(page, form.locator('[contenteditable], textarea').first(), c);
    await form.locator('button').last().click();
    await page.waitForTimeout(1500);
  }
  if (g.evaluation) {
    const form = page.locator(cy('okr-evaluation-form'));
    await typeIn(page, form.locator('[contenteditable], textarea').first(), g.evaluation);
    await form.locator('button').last().click();
    await page.waitForTimeout(1800);
  }
  console.log(`    + ${g.title}`);
}
