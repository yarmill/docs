'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Light/dark toggle wired to next-themes (our ThemeProvider). Respects the
 * system default until the user picks; flipping between the two resolved themes
 * on click. We gate rendering of the icon on mount to avoid a hydration
 * mismatch (server can't know the resolved theme), but reserve the box so there
 * is no layout shift.
 */
// Augment the lib DOM types: View Transitions ship in Chromium but aren't in
// the ambient `Document` lib yet. Narrow, local declaration — no `any`.
interface ViewTransition {
  ready: Promise<void>;
  finished: Promise<void>;
}
type StartViewTransition = (callback: () => void) => ViewTransition;

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  // Canonical next-themes hydration gate: the resolved theme is only known on
  // the client, so we flip `mounted` once after hydration. This is a deliberate
  // one-shot state set in an effect (no render-time equivalent exists).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === 'dark';

  const toggle = useCallback(() => {
    const next = isDark ? 'light' : 'dark';
    const start = (document as Document & { startViewTransition?: StartViewTransition })
      .startViewTransition;
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Signature delight (Block C2): a circular clip-path reveal expanding from
    // the toggle's centre. Falls back to an instant theme swap when View
    // Transitions are unsupported OR the user prefers reduced motion.
    if (!start || reduce) {
      setTheme(next);
      return;
    }

    // Capture the button centre BEFORE the DOM snapshot.
    const rect = btnRef.current?.getBoundingClientRect();
    const cx = rect ? rect.left + rect.width / 2 : window.innerWidth - 24;
    const cy = rect ? rect.top + rect.height / 2 : 24;
    // Radius to the farthest viewport corner from the button centre.
    const endRadius = Math.hypot(
      Math.max(cx, window.innerWidth - cx),
      Math.max(cy, window.innerHeight - cy),
    );

    const transition = start.call(document, () => setTheme(next));
    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${cx}px ${cy}px)`,
              `circle(${endRadius}px at ${cx}px ${cy}px)`,
            ],
          },
          {
            duration: 450,
            easing: 'cubic-bezier(0, 0, 0.2, 1)',
            pseudoElement: '::view-transition-new(root)',
          },
        );
      })
      .catch(() => {
        // Snapshot/animation failed for any reason — theme already swapped in
        // the callback, so nothing else to do.
      });
  }, [isDark, setTheme]);

  return (
    <button
      ref={btnRef}
      type="button"
      className="ym-icon-btn"
      // Keep the label theme-agnostic until mounted so the server-rendered
      // attribute matches the client (next-themes only knows the theme client-side).
      aria-label={!mounted ? 'Toggle theme' : isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={toggle}
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
