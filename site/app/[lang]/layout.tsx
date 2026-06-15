import { RootProvider } from 'fumadocs-ui/provider/next';
import { provider } from '@/lib/layout.shared';
import type { ReactNode } from 'react';
import '@/app/theme/chrome.css';

export default async function LangLayout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const { lang } = await params;

  return (
    <RootProvider
      i18n={provider(lang)}
      theme={{ defaultTheme: 'light' }}
    >
      {children}
    </RootProvider>
  );
}
