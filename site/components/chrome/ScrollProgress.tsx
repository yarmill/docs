'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Reading-progress line (Block C3). A 2px `--ym-accent` bar pinned to the bottom
 * edge of the top bar that fills left→right with document scroll progress.
 *
 * - Invisible at the top (scaleX 0) and hidden entirely when the page is too
 *   short to scroll.
 * - Driven by a rAF-throttled scroll listener writing `transform: scaleX(p)`
 *   (transform-only, GPU-friendly, no layout). We resolve progress on each frame
 *   from `scrollY / (scrollHeight - innerHeight)`.
 * - Resets per page: re-measures on pathname change (new content height).
 * - Reduced motion: the bar still reflects position (it IS the scroll), but the
 *   smoothing transition is dropped in chrome.css so it tracks instantly.
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const bar = barRef.current;
    const root = rootRef.current;
    if (!bar || !root) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      // Nothing to scroll → hide the bar entirely (avoids a stray dot at 0).
      if (scrollable <= 1) {
        root.dataset.visible = 'false';
        bar.style.transform = 'scaleX(0)';
        return;
      }
      root.dataset.visible = 'true';
      const progress = Math.min(1, Math.max(0, window.scrollY / scrollable));
      bar.style.transform = `scaleX(${progress})`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
    // Re-measure when the route (and therefore content height) changes.
  }, [pathname]);

  return (
    <div ref={rootRef} className="ym-scroll-progress" data-visible="false" aria-hidden>
      <div ref={barRef} className="ym-scroll-progress-bar" />
    </div>
  );
}
