import { defineI18n } from 'fumadocs-core/i18n';

// Default locale `en`; more languages can be added here later as a config change.
// `hideLocale: 'never'` keeps the locale prefix in every URL, so pages live at
// `/en/...` (e.g. `/en/plan/goals`).
export const i18n = defineI18n({
  defaultLanguage: 'en',
  languages: ['en'],
  hideLocale: 'never',
});
