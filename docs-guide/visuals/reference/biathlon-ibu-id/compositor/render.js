const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const sizes = { field: 640, url: 830, search: 830 };
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 2 });
  for (const name of process.argv.slice(2)) {
    await page.setViewportSize({ width: 1400, height: sizes[name] || 900 });
    await page.goto('file://' + path.resolve(__dirname, name + '.html'));
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.resolve(__dirname, 'out-' + name + '.png') });
    console.log('rendered', name);
  }
  await browser.close();
})();
