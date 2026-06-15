import { i18n } from '@/lib/i18n';
import { defineI18nUI } from 'fumadocs-ui/i18n';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export const { provider } = defineI18nUI(i18n, {
  en: { displayName: 'English' },
});

export function baseOptions(_locale: string): BaseLayoutProps {
  return {
    nav: {
      title: 'Yarmill',
    },
    links: [
      { text: 'Support', url: 'mailto:support@yarmill.com' },
      { text: 'Legal Terms', url: 'https://yarmill.com/en/legal-terms' },
    ],
  };
}
