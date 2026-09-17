// Browser harness for we.yarmill.com.
//
//   import { open, BASE } from './yarmill.mjs';
//   const { browser, page } = await open({ session: 'session.json' });
//
// A session is a Playwright storageState file built by session.py from cookies
// the product owner pastes (see README). Nothing here ever types a password.
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const HERE = path.dirname(fileURLToPath(import.meta.url));
export const REPO = path.resolve(HERE, '../../..');
export const BASE = 'https://we.yarmill.com';

// The bundled Chromium, if there is one (Claude Code's remote environment
// pre-installs it under /opt/pw-browsers); otherwise Playwright's own.
function chromiumPath() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  if (!fs.existsSync(root)) return undefined;
  const dir = fs.readdirSync(root).filter((d) => /^chromium-\d+$/.test(d)).sort().pop();
  const bin = dir && path.join(root, dir, 'chrome-linux', 'chrome');
  return bin && fs.existsSync(bin) ? bin : undefined;
}

const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
export const LAUNCH = {
  executablePath: chromiumPath(),
  // The proxy port rotates when the session's egress proxy restarts — always
  // read it from the environment rather than pinning a port.
  ...(proxy ? { proxy: { server: proxy } } : {}),
  // The egress proxy can't complete a TLS 1.3 handshake from Chromium (the
  // tunnel resets mid-ClientHello). Capping at 1.2 fixes it; verification
  // stays on. Harmless without a proxy.
  args: ['--ssl-version-max=tls1.2', '--allow-file-access-from-files'],
};

// Every capture is a 1600×1000 window at 2×: a 3200×2000 PNG. The compositor
// derives its anchor grid from these numbers, so change them in one place.
export const VIEWPORT = { width: 1600, height: 1000, scale: 2 };

export async function open({ session = 'session.json', width = VIEWPORT.width,
                             height = VIEWPORT.height, scale = VIEWPORT.scale } = {}) {
  const state = path.resolve(HERE, session);
  if (!fs.existsSync(state)) {
    throw new Error(`No session file at ${state} — build one with session.py (see README).`);
  }
  const browser = await chromium.launch(LAUNCH);
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: scale,
    storageState: state,
    locale: 'en-GB',
    timezoneId: 'Europe/London',
  });
  return { browser, ctx, page: await ctx.newPage() };
}

// Plain browser, no session — for checking the docs site itself.
export async function openLocal({ width = 1440, height = 1000, scale = 2 } = {}) {
  const browser = await chromium.launch(LAUNCH);
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: scale });
  return { browser, page };
}
