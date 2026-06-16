import next from 'eslint-config-next';

/**
 * Flat ESLint config. `next lint` was removed in Next 16, so we wire
 * `eslint-config-next` directly. It bundles the core-web-vitals + TypeScript
 * rule sets (React, React Hooks, jsx-a11y, and the `@next/next` plugin).
 */
const config = [
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'],
  },
  ...next,
];

export default config;
