'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * Light/dark toggle wired to next-themes (our ThemeProvider). Respects the
 * system default until the user picks; flipping between the two resolved themes
 * on click. We gate rendering of the icon on mount to avoid a hydration
 * mismatch (server can't know the resolved theme), but reserve the box so there
 * is no layout shift.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      className="ym-icon-btn"
      // Keep the label theme-agnostic until mounted so the server-rendered
      // attribute matches the client (next-themes only knows the theme client-side).
      aria-label={!mounted ? 'Toggle theme' : isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {mounted ? (
        isDark ? (
          <Moon aria-hidden />
        ) : (
          <Sun aria-hidden />
        )
      ) : (
        <span style={{ width: '1em', height: '1em', display: 'inline-block' }} aria-hidden />
      )}
    </button>
  );
}
