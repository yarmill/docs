'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ReactNode } from 'react';

/**
 * next-themes provider (replaces Fumadocs' RootProvider theme handling).
 * Class strategy → toggles `.dark` on <html> so tokens.css dark rules apply.
 * Defaults to the OS preference on first visit (defaultTheme "system" +
 * enableSystem); the toggle then sets an explicit light/dark that persists.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
