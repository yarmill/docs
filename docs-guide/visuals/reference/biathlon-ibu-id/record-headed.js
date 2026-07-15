const { chromium } = require('playwright');
const { spawn, execSync } = require('child_process');

const W = 1512, H = 950, DISPLAY = ':99';

async function smoothMove(toX, toY, steps = 14) {
  let [fx, fy] = execSync(`DISPLAY=${DISPLAY} xdotool getmouselocation --shell | head -2 | cut -d= -f2 | paste -sd,`, { shell: '/bin/bash' })
    .toString().trim().split(',').map(Number);
  for (let i = 1; i <= steps; i++) {
    const x = Math.round(fx + (toX - fx) * (i / steps));
    const y = Math.round(fy + (toY - fy) * (i / steps));
    execSync(`DISPLAY=${DISPLAY} xdotool mousemove ${x} ${y}`);
    await new Promise(r => setTimeout(r, 26));
  }
}

(async () => {
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium',
    headless: false,
    proxy: { server: process.env.HTTPS_PROXY },
    args: ['--ssl-version-max=tls1.2', '--no-sandbox', `--window-position=0,0`, `--window-size=${W},${H}`, '--hide-crash-restore-bubble'],
    env: { ...process.env, DISPLAY },
  });
  const ctx = await browser.newContext({ viewport: null });
  // auto-dismiss the site's "enable notifications" banner on every page
  await ctx.addInitScript(() => {
    setInterval(() => {
      document.querySelectorAll('button').forEach((b) => {
        if (/^skip$/i.test((b.textContent || '').trim())) b.click();
      });
    }, 250);
  });
  const page = await ctx.newPage();

  // chrome UI offset (tab strip + omnibox) for pointer coordinates
  const chromeOffset = await page.evaluate(() => window.outerHeight - window.innerHeight)
    .catch(() => 88);

  const target = async (sel) => {
    const box = await page.locator(sel).first().boundingBox();
    return [Math.round(box.x + box.width / 2), Math.round(box.y + box.height / 2 + chromeOffset)];
  };

  // ---- preload: home, cookies, notification prompt — all BEFORE recording ----
  await page.goto('https://www.biathlonworld.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4500);
  const ot = page.locator('#onetrust-accept-btn-handler');
  if (await ot.count()) await ot.click().catch(() => {});
  await page.waitForTimeout(2500);
  const skip = page.getByRole('button', { name: /skip/i });
  if (await skip.count()) await skip.first().click().catch(() => {});
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollTo(0, 0));
  execSync(`DISPLAY=${DISPLAY} xdotool mousemove ${W / 2} ${H / 2}`);

  // ---- start recording ----
  const ff = spawn('ffmpeg', ['-y', '-f', 'x11grab', '-framerate', '30', '-video_size', `${W}x${H}`,
    '-draw_mouse', '1', '-i', DISPLAY, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'veryfast',
    'video/ibu-lookup-with-urlbar.mp4'], { stdio: 'ignore' });
  // wait until ffmpeg is actually writing frames before acting
  const fs = require('fs');
  for (let i = 0; i < 100; i++) {
    try { if (fs.statSync('video/ibu-lookup-with-urlbar.mp4').size > 20000) break; } catch {}
    await new Promise(r => setTimeout(r, 200));
  }
  await page.waitForTimeout(1200);

  // 1 — BIATHLETES in the menu
  const nav = 'a:has-text("BIATHLETES")';
  await smoothMove(...await target(nav));
  await page.waitForTimeout(500);
  await page.click(nav);
  await page.waitForTimeout(4200);

  // 2 — search Davidova
  const search = 'input[placeholder="Search athlete"]';
  await page.waitForSelector(search, { timeout: 15000 });
  await page.locator(search).scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await smoothMove(...await target(search));
  await page.click(search);
  await page.waitForTimeout(600);
  await page.locator(search).pressSequentially('Davidova', { delay: 170 });
  await page.waitForTimeout(2200);

  // 3 — open the profile
  const result = 'a[href*="/athlete/"]:has-text("DAVIDOVA MARKETA"), a[href*="/athlete/"]:has-text("Davidova")';
  await smoothMove(...await target(result));
  await page.waitForTimeout(500);
  await page.locator(result).first().click();
  await page.waitForTimeout(5200);

  // 4 — let the URL with the ID sink in
  await page.waitForTimeout(2200);

  // 5 — click the address bar (selects the whole URL) …
  await smoothMove(750, 62);
  await new Promise(r => setTimeout(r, 400));
  execSync(`DISPLAY=${DISPLAY} xdotool click 1`);
  await new Promise(r => setTimeout(r, 1100));

  // … then double-click the ID segment to select just the IBU ID
  await smoothMove(555, 62);
  await new Promise(r => setTimeout(r, 400));
  execSync(`DISPLAY=${DISPLAY} xdotool click --repeat 2 --delay 130 1`);
  await page.waitForTimeout(4800);

  const finalUrl = page.url();
  ff.kill('SIGINT');
  await new Promise(r => setTimeout(r, 1500));
  await browser.close();
  console.log('recorded video/ibu-lookup-with-urlbar.mp4 — final URL:', finalUrl);
})();
