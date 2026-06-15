'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ReactNode } from 'react';

/**
 * next-themes provider (replaces Fumadocs' RootProvider theme handling).
 * Class strategy → toggles `.dark` on <html> so tokens.css dark rules apply.
 * Light is the default; the system preference is honoured until the user picks.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
