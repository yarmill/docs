'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * Light/dark toggle wired to next-themes (our ThemeProvider). Respects the
 * system default until the user picks; flips between the two resolved themes on
 * click. The icon is gated on mount to avoid a hydration mismatch (the server
 * can't know the resolved theme); the box is reserved so there's no layout
 * shift. The swap is instant — no transition animation.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // Canonical next-themes hydration gate: the resolved theme is only known on
  // the client, so we flip `mounted` once after hydration.
  // eslint-disable-next-line react-hooks/set-state-in-effect
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
