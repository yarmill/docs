// Raw captures for the Goals page. Needs the seeded AFC Richmond data
// (node seed.mjs goals) and two sessions: session.json (Ted Lasso, coach) and
// session-jamie.json (Jamie Tartt, athlete). Writes raw/goals/*.png.
import { open } from '../yarmill.mjs';
import { cy, goTo, shooter, dismissAnnouncements } from '../capture-lib.mjs';

const shot = shooter('goals');
const openGoal = (page, title) =>
  page.locator(cy('objective-list-item')).filter({ hasText: title }).first().click({ force: true });

// ---------- coach session ----------
{
  const { browser, page } = await open();
  await goTo(page, 'okr', { athlete: 'Tartt Jamie', wait: 6000 });

  await openGoal(page, 'Turn into the team’s playmaker');
  await page.waitForTimeout(3500);
  await shot(page, 'goal-detail');

  // category menu, submenu open
  await page.locator(cy('objective-category')).first().click();
  await page.waitForTimeout(1200);
  await page.locator('[role="option"]').filter({ hasText: /^Fitness$/ }).first().click();
  await page.waitForTimeout(1600);
  await shot(page, 'category-picker');
  await page.keyboard.press('Escape'); await page.waitForTimeout(500);
  await page.keyboard.press('Escape'); await page.waitForTimeout(1500);

  // export menu
  await page.locator(cy('export-objectives')).first().click();
  await page.waitForTimeout(1800);
  await shot(page, 'export-options');
  await page.keyboard.press('Escape'); await page.waitForTimeout(1200);

  // the closed goal, with an evaluation from athlete and coach
  await openGoal(page, 'Finish the season fit');
  await page.waitForTimeout(3500);
  await shot(page, 'final-evaluation');

  // a brand-new empty goal, captured then removed again
  await page.locator(cy('add-objective')).first().click();
  await page.waitForTimeout(3000);
  await shot(page, 'new-goal');
  await page.locator(cy('remove-objective')).first().click();
  await page.waitForTimeout(1200);
  await page.getByRole('button', { name: 'Yes, delete' }).click();
  await page.waitForTimeout(2500);
  console.log('  (scratch goal deleted)');

  // Verification, on the deliberately incomplete goal
  await goTo(page, 'okr', { athlete: 'Rojas Dani' });
  await page.locator(cy('verification-button')).first().click();
  await page.waitForTimeout(2200);
  await shot(page, 'verification');
  await page.keyboard.press('Escape'); await page.waitForTimeout(1000);

  // the squad
  await goTo(page, 'okr', { wait: 6500 });
  await shot(page, 'group-overview');
  await browser.close();
}

// ---------- athlete session ----------
{
  const { browser, page } = await open({ session: 'session-jamie.json' });
  await page.goto('https://we.yarmill.com/okr', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(6000);
  await dismissAnnouncements(page);
  await openGoal(page, 'Turn into the team’s playmaker');
  await page.waitForTimeout(3500);
  await shot(page, 'athlete-view');
  await browser.close();
}
console.log('goals: all raws captured');
