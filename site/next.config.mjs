/** @type {import('next').NextConfig} */
const config = {
  // StrictMode's dev-only double-invocation of effects races imperative
  // animations (e.g. the FLIP image zoom) in ways that never occur in
  // production. Disabling it makes dev match production behaviour so animations
  // are deterministic; it has no effect on the production build.
  reactStrictMode: false,
};

export default config;
