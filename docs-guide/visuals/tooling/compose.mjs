// Turns raw captures into docs figures.
//
//   node compose.mjs <module> [figure …] [--publish]
//
// Reads figures/<module>.mjs and raw/<module>/*.png, writes out/<module>/*.png;
// --publish also copies the results to site/public/images/<module>/.
//
// The rules this encodes (prose in docs-guide/visuals/demo-cast.md):
// - A figure IS the app: the whole window, or a zoom anchored to one of nine
//   positions on it, bleeding off the figure on every cut side.
// - The PNG carries the window on transparency — macOS corner, hairline and
//   shadow on the window's own edges only, a tight transparent margin there.
//   The backdrop comes from the docs frame's CSS, so one asset serves both themes.
// - Callouts are indigo cards in a transparent strip off the app, sized against
//   the RENDERED column (k = figure width / 700 CSS px), laid out by the browser,
//   and routed planar (each leader on its own rail, rails right-to-left down the list).
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { HERE, REPO, LAUNCH, VIEWPORT } from './yarmill.mjs';

const args = process.argv.slice(2);
const publish = args.includes('--publish');
const [mod, ...only] = args.filter((a) => !a.startsWith('--'));
if (!mod) { console.error('usage: node compose.mjs <module> [figure …] [--publish]'); process.exit(1); }
const { FIGURES } = await import(`./figures/${mod}.mjs`);

const RAW = path.join(HERE, 'raw', mod);
const OUT = path.join(HERE, 'out', mod);
const WORK = path.join(HERE, 'work', mod);
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(WORK, { recursive: true });
const fileUrl = (p) => 'file://' + p;

const INTER = fileUrl(path.join(REPO, 'site/public/fonts/InterVariable.woff2'));
const A = '#513ff8';          // --ym-accent — the callout colour
const FULL_W = VIEWPORT.width * VIEWPORT.scale;
const FULL_H = VIEWPORT.height * VIEWPORT.scale;

const ALIGN = {
  'top-left':     [0, 0],   'top':    [0.5, 0],   'top-right':    [1, 0],
  'left':         [0, 0.5], 'center': [0.5, 0.5], 'right':        [1, 0.5],
  'bottom-left':  [0, 1],   'bottom': [0.5, 1],   'bottom-right': [1, 1],
};

// Breathing room on the window's own sides, in source px (2x). Linear keeps this
// tight — the window is the subject, the backdrop is a frame, not a mat.
const PAD = 96;        // ~48 CSS px
const HERO_PAD = 176;  // the lead figure gets a little more air for its backdrop

for (const [name, f] of Object.entries(FIGURES)) {
  if (!ALIGN[f.align]) throw new Error(`${name}: unknown align "${f.align}"`);
  const [ax, ay] = ALIGN[f.align];
  const [w, h] = f.size;
  const x = Math.round((FULL_W - w) * ax), y = Math.round((FULL_H - h) * ay);
  f.crop = [x, y, w, h];
  // A side that sits on the capture's edge is the window's edge: give it a
  // transparent margin so you can see the figure is anchored there. A side
  // that cuts through content gets none — it bleeds instead.
  const pad = f.hero ? HERO_PAD : PAD;
  f.pad = {
    left: x === 0 ? pad : 0,
    top: y === 0 ? pad : 0,
    right: x + w >= FULL_W ? pad : 0,
    bottom: y + h >= FULL_H ? pad : 0,
  };
}

const COL = 700;          // the docs content column, in CSS px
const CARD_CSS = 170;     // how wide a callout card should LOOK, in CSS px
const RAIL_CSS = 60;      // room for the leader rails between shot and cards
const EDGE_CSS = 14;      // so a card never sits flush against the figure's edge
const RADIUS_CSS = 11;    // macOS window corner, as SEEN on the page

const css = (k) => `
  @font-face { font-family: InterV; src: url('${INTER}') format('woff2');
               font-weight: 100 900; font-display: block; }
  * { box-sizing: border-box; margin: 0; }
  body { font-family: InterV, -apple-system, "Segoe UI", Roboto, sans-serif; }
  .stage { position: relative; }
  /* The app window: a macOS-sized corner, a hairline, and a layered shadow.
     Only the corners where two window edges actually meet are rounded — a cut
     edge stays square and runs off the figure. */
  .shot { position: absolute; overflow: hidden;
          box-shadow: 0 1px 2px rgba(16,14,40,.10), 0 10px 24px rgba(16,14,40,.13),
                      0 36px 72px rgba(16,14,40,.16); }
  .shot > img { position: absolute; display: block; }
  /* The hairline belongs only to edges that are really the window's; drawing it
     on a cut edge implies a border the screen doesn't have. */
  .edge { position: absolute; inset: 0; z-index: 2; pointer-events: none; }
  .rail { position: absolute; top: 0; }
  .pill { position: absolute; left: 0; top: 0; width: max-content; max-width: ${CARD_CSS * k}px;
          background: ${A}; border-radius: ${9 * k}px; padding: ${11 * k}px ${12 * k}px;
          box-shadow: 0 ${1 * k}px ${3 * k}px rgba(16,14,40,.14),
                      0 ${8 * k}px ${18 * k}px rgba(81,63,248,.26); }
  .pill .chip { display: inline-block; background: rgba(255,255,255,.18); color: #fff;
                font-weight: 600; font-size: ${11.5 * k}px; line-height: 1;
                letter-spacing: -.004em; padding: ${4 * k}px ${6 * k}px;
                border-radius: ${4.5 * k}px; }
  .pill p { font-weight: 450; font-size: ${12 * k}px; line-height: 1.45;
            color: rgba(255,255,255,.9); letter-spacing: -.002em; margin-top: ${7 * k}px; }
  .dot { position: absolute; width: ${3.6 * k}px; height: ${3.6 * k}px; border-radius: 50%;
         background: ${A}; }
  svg { position: absolute; inset: 0; overflow: visible; }
`;

function build(f) {
  const [cx, cy, cw, ch] = f.crop;
  const pad = f.pad;
  const matteW = pad.left + cw + pad.right;
  const matteH = pad.top + ch + pad.bottom;
  // A figure of total width W is displayed at COL css px, so everything drawn
  // at scale k = W / COL renders at its intended css size. The strip depends on
  // k and k depends on the strip, so solve once: W = matteW + (CARD+RAIL+EDGE)*k.
  const k = f.callouts?.length
    ? matteW / (COL - CARD_CSS - RAIL_CSS - EDGE_CSS)
    : matteW / COL;
  const strip = f.callouts?.length ? Math.round((CARD_CSS + RAIL_CSS + EDGE_CSS) * k) : 0;
  // The corner has to be sized against the RENDERED figure for the same reason
  // the type does: a 20px corner in a 3200px-wide image displayed in a 700px
  // column arrives as ~4px and the window reads square.
  const R = Math.round(RADIUS_CSS * k);
  const hw = (1 * k).toFixed(2);
  const hairline = [
    pad.top ? `inset 0 ${hw}px 0 0 rgba(31,30,49,.12)` : '',
    pad.bottom ? `inset 0 -${hw}px 0 0 rgba(31,30,49,.12)` : '',
    pad.left ? `inset ${hw}px 0 0 0 rgba(31,30,49,.12)` : '',
    pad.right ? `inset -${hw}px 0 0 0 rgba(31,30,49,.12)` : '',
  ].filter(Boolean).join(',') || 'none';
  // round a corner only where both of its sides are the window's own edge
  const radii = [
    pad.top && pad.left ? R : 0, pad.top && pad.right ? R : 0,
    pad.bottom && pad.right ? R : 0, pad.bottom && pad.left ? R : 0,
  ].map((v) => `${v}px`).join(' ');
  // Cards are laid out by the browser in a real column — guessing their height
  // is what made them collide — and the leaders are drawn afterwards from the
  // positions they actually took (see the second pass below).
  const ordered = [...(f.callouts || [])].sort((a, b) => a.at[1] - b.at[1]);
  const dots = ordered.map((c) => {
    const ax = c.at[0] - cx + pad.left, ay = c.at[1] - cy + pad.top;
    return `<div class="dot" data-ax="${ax}" data-ay="${ay}"
              style="left:${ax - 1.8 * k}px;top:${ay - 1.8 * k}px"></div>`;
  });
  const pills = ordered.map((c) => `<div class="pill">
      <span class="chip">${c.label}</span>${c.sub ? `<p>${c.sub}</p>` : ''}</div>`);

  const W = matteW + strip;
  const H = matteH;
  // Callout copy is UTF-8 ("·", "—"); without the charset Chromium reads it as Latin-1.
  return `<meta charset="utf-8"><style>${css(k)}</style>
  <div class="stage" style="width:${W}px;height:${H}px">
    <div class="shot" style="left:${pad.left}px;top:${pad.top}px;width:${cw}px;height:${ch}px;
         border-radius:${radii}">
      <div class="edge" style="border-radius:${radii};box-shadow:${hairline}"></div>
      <img src="${fileUrl(path.join(RAW, f.src))}" style="left:${-cx}px;top:${-cy}px">
    </div>
    <svg width="${W}" height="${H}"></svg>
    ${dots.join('')}
    <div class="rail" style="left:${matteW + RAIL_CSS * k}px;width:${CARD_CSS * k}px;
         height:${matteH}px">${pills.join('')}</div>
  </div>`;
}

// Leaders: horizontal out of the shot, down a rail of its own, then straight
// into the card's left edge. Runs in the page after the cards have been laid out.
function routeLeaders(scale) {
  const stage = document.querySelector('.stage');
  const svg = stage.querySelector('svg');
  const dots = [...stage.querySelectorAll('.dot')];
  const cards = [...stage.querySelectorAll('.pill')];
  if (!dots.length) return;
  const base = stage.getBoundingClientRect();
  const shot = stage.querySelector('.shot').getBoundingClientRect();
  const rail = stage.querySelector('.rail').getBoundingClientRect();
  const shotRight = shot.right - base.left;
  const cardLeft = rail.left - base.left;
  const H = base.height;
  const GAP = 14 * scale;
  const EDGE = 10 * scale;   // never let a card sit flush against the figure edge

  // 1. Put every card as close to its own anchor as it can get: start centred
  //    on the anchor, then sweep down to remove overlaps and sweep back up if
  //    the stack runs past the bottom. Shortest possible leaders, order kept.
  const anchors = dots.map((d) => +d.dataset.ay);
  const hs = cards.map((c) => c.getBoundingClientRect().height);
  const tops = anchors.map((a, i) => a - hs[i] / 2);
  for (let i = 0; i < tops.length; i++) {
    if (i > 0) tops[i] = Math.max(tops[i], tops[i - 1] + hs[i - 1] + GAP);
    tops[i] = Math.max(tops[i], EDGE);
  }
  for (let i = tops.length - 1; i >= 0; i--) {
    const limit = i === tops.length - 1 ? H - hs[i] - EDGE : tops[i + 1] - hs[i] - GAP;
    tops[i] = Math.max(EDGE, Math.min(tops[i], limit));
  }
  cards.forEach((c, i) => { c.style.top = `${tops[i]}px`; });

  // 2. Rails run right-to-left as you go DOWN the list: the topmost callout
  //    takes the rail nearest the cards. With both anchors and cards in the
  //    same order, that ordering is what makes the routing planar — a lower
  //    leader can never reach far enough right to meet a higher one's rail.
  const gapW = cardLeft - shotRight;
  svg.innerHTML = dots.map((d, i) => {
    const ax = +d.dataset.ax, ay = anchors[i];
    const mid = tops[i] + hs[i] / 2;
    const railX = shotRight + (gapW * (dots.length - i)) / (dots.length + 1);
    const p = Math.abs(mid - ay) < 1
      ? `M ${ax} ${ay} H ${cardLeft}`
      : `M ${ax} ${ay} H ${railX} V ${mid} H ${cardLeft}`;
    return `<path d="${p}" stroke="#513ff8" stroke-width="${1.4 * scale}" fill="none"
             stroke-dasharray="${3.5 * scale} ${3.5 * scale}" opacity=".5"
             stroke-linejoin="round" stroke-linecap="round"/>`;
  }).join('');
}

const browser = await chromium.launch(LAUNCH);
const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
const names = Object.keys(FIGURES).filter((n) => !only.length || only.includes(n));
for (const name of names) {
  const f = FIGURES[name];
  const raw = path.join(RAW, f.src);
  if (!fs.existsSync(raw)) { console.error(`${name}: missing ${raw} — run capture first`); continue; }
  const stage = path.join(WORK, `${name}.html`);
  fs.writeFileSync(stage, build(f));
  await page.goto(fileUrl(stage));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(900);
  await page.evaluate(routeLeaders, 1);
  await page.waitForTimeout(150);
  const el = await page.$('.stage');
  const out = path.join(OUT, `${name}.png`);
  await el.screenshot({ path: out, omitBackground: true });
  console.log(`out/${mod}/${name}.png`);
  if (publish) {
    const dest = path.join(REPO, 'site/public/images', mod, `${name}.png`);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(out, dest);
    console.log(`  → site/public/images/${mod}/${name}.png`);
  }
}
await browser.close();
