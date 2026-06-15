import './global.css';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';

// Self-hosted Inter Variable (Yarmill's UI typeface) — no external fetch,
// exact match to the product. Italic axis included for emphasis in prose.
const inter = localFont({
  src: [
    { path: '../public/fonts/InterVariable.woff2', weight: '100 900', style: 'normal' },
    { path: '../public/fonts/InterVariable-Italic.woff2', weight: '100 900', style: 'italic' },
  ],
  variable: '--fd-font-inter',
  display: 'swap',
});

// Root layout only sets up the font + html shell; locale-aware providers live
// in app/[lang]/layout.tsx. Default theme is light-first (see RootProvider).
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">{children}</body>
    </html>
  );
}
