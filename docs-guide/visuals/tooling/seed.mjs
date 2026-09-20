// node seed.mjs <module> [member …]
// Wipes and re-creates the demo data for the module (all cast members with an
// entry in seed/<module>.mjs, or just the ones named). Coach session.
import { open } from './yarmill.mjs';

const [mod, ...only] = process.argv.slice(2);
if (!mod) { console.error('usage: node seed.mjs <module> [member …]'); process.exit(1); }
const { SEED } = await import(`./seed/${mod}.mjs`);
const lib = await import(`./seed/${mod}-lib.mjs`);
// Each module's lib names its driver after what it creates (seedGoal, seedRecord …).
const { wipeAthlete } = lib;
const seedOne = lib.seedRecord ?? lib.seedGoal;

const names = only.length ? only : Object.keys(SEED);
const { browser, page } = await open();
page.on('pageerror', (e) => console.log('  PAGEERROR', e.message.slice(0, 100)));
for (const name of names) {
  console.log(`\n== ${name} ==`);
  await wipeAthlete(page, name);
  for (const g of SEED[name]) {
    try { await seedOne(page, g); }
    catch (e) { console.log(`    !! ${g.title}: ${e.message.split('\n')[0].slice(0, 120)}`); }
  }
}
await browser.close();
console.log('\nseeding pass complete');
