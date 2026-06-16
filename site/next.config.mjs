/** @type {import('next').NextConfig} */
const config = {
  // Fully static export (`next build` → ./out): the whole site is prerendered
  // HTML + assets, deployable to any static host (Netlify, S3, etc.). No server
  // runtime, so there is no Middleware — the `/` → `/en` redirect is handled by
  // a static root page (app/page.tsx) instead of proxy.ts.
  output: 'export',
  // Static export can't run next/image's optimizer at request time.
  images: { unoptimized: true },
  // StrictMode's dev-only double-invocation of effects races imperative
  // animations (e.g. the FLIP image zoom) in ways that never occur in
  // production. Disabling it makes dev match production behaviour so animations
  // are deterministic; it has no effect on the production build.
  reactStrictMode: false,
};

export default config;
