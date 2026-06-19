import './global.css';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import { ThemeProvider } from '@/components/chrome/ThemeProvider';

// Self-hosted Inter Variable (Yarmill's UI typeface) — no external fetch, exact
// match to the product. Italic axis included for emphasis in prose.
const inter = localFont({
  src: [
    { path: '../public/fonts/InterVariable.woff2', weight: '100 900', style: 'normal' },
    { path: '../public/fonts/InterVariable-Italic.woff2', weight: '100 900', style: 'italic' },
  ],
  variable: '--ym-font-inter',
  display: 'swap',
});

// Self-hosted JetBrains Mono (variable) — the monospace for code blocks and the
// changelog's tabular dates. Exposed as a CSS variable consumed by --ym-font-mono.
const jetbrainsMono = localFont({
  src: [{ path: '../public/fonts/JetBrainsMono.woff2', weight: '100 800', style: 'normal' }],
  variable: '--ym-font-jetbrains',
  display: 'swap',
});

// Root layout: font shell + theme provider (next-themes, class strategy, light
// default). `suppressHydrationWarning` is required by next-themes (it writes the
// theme class onto <html> before React hydrates).
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.className} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen">
        {/* First focusable element: jumps keyboard users past the chrome to the
            article. Visually hidden until focused (styled in chrome.css). */}
        <a href="#ym-page" className="ym-skip-link">
          Skip to content
        </a>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
