// Where does the content end inside a band of a raw capture? Use it to place
// callout anchors just past the element they name, instead of guessing.
//
//   node measure.mjs <module> <raw.png> <yFrom> <yTo> <xFrom> <xTo>
//   → "content ends at x=…" (the rightmost non-background pixel in the band)
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { HERE, LAUNCH } from './yarmill.mjs';

const [mod, src, ...nums] = process.argv.slice(2);
if (!mod || !src || nums.length !== 4) {
  console.error('usage: node measure.mjs <module> <raw.png> <yFrom> <yTo> <xFrom> <xTo>');
  process.exit(1);
}
const [y0, y1, x0, x1] = nums.map(Number);
const img = 'file://' + path.join(HERE, 'raw', mod, src);
const stage = path.join(HERE, 'work', 'measure.html');
fs.mkdirSync(path.dirname(stage), { recursive: true });
fs.writeFileSync(stage, `<canvas id="c"></canvas><script>
window.edge = (src, yFrom, yTo, xFrom, xTo) => new Promise((res) => {
  const img = new Image();
  img.onload = () => {
    const c = document.getElementById('c');
    c.width = img.width; c.height = img.height;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    const d = ctx.getImageData(xFrom, yFrom, xTo - xFrom, yTo - yFrom).data;
    const w = xTo - xFrom, h = yTo - yFrom;
    // background = the dominant colour in the band's right-hand quarter
    const counts = new Map();
    for (let y = 0; y < h; y++) for (let x = Math.floor(w * 0.75); x < w; x++) {
      const i = (y * w + x) * 4;
      const k = d[i] + ',' + d[i+1] + ',' + d[i+2];
      counts.set(k, (counts.get(k) || 0) + 1);
    }
    const bg = [...counts.entries()].sort((a,b) => b[1]-a[1])[0][0].split(',').map(Number);
    let maxX = -1;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const diff = Math.abs(d[i]-bg[0]) + Math.abs(d[i+1]-bg[1]) + Math.abs(d[i+2]-bg[2]);
      if (diff > 26 && x > maxX) maxX = x;
    }
    res({ edge: maxX < 0 ? null : xFrom + maxX, bg });
  };
  img.src = src;
});
</script>`);

const b = await chromium.launch(LAUNCH);
const p = await b.newPage();
await p.goto('file://' + stage);
const r = await p.evaluate(([s, a, bb, c, d]) => window.edge(s, a, bb, c, d), [img, y0, y1, x0, x1]);
console.log(`${src} rows ${y0}–${y1}: content ends at x=${r.edge}  (background rgb(${r.bg.join(',')}))`);
await b.close();
