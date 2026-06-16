'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { TocItem } from '@/lib/toc';

// useLayoutEffect on the client, useEffect on the server (avoids SSR warning).
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * "On this page" right rail (id `#nd-toc`, consumed by chrome.css).
 *
 * Renders the collected h2/h3 headings as anchor links over a single continuous
 * 2px track (the list's `::before`). A single 2px accent indicator
 * (`.ym-toc-indicator`) is absolutely positioned inside the list and SLIDES —
 * animating `transform: translateY()` and `height` — to sit beside the active
 * item, matching its line box (Linear's mechanism; no per-item borders).
 *
 * Scroll-spy via IntersectionObserver: the active item is the topmost heading
 * currently in view; once every heading is scrolled past, the last one sticks.
 * Hidden ≤1024px by chrome.css.
 */
export function Toc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>('');
  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  // Scroll-spy: the active item is the last heading whose top has crossed a
  // line ~120px below the top bar. An IntersectionObserver is the *trigger*
  // (fires whenever any heading enters/leaves a thin band at that line); the
  // selection itself is computed from live positions so "scrolled past the
  // last section" keeps the last heading active (not the first).
  useEffect(() => {
    if (items.length === 0) return;
    const headings = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (headings.length === 0) return;

    const LINE = 120; // px below viewport top — the "active" reading line.
    const compute = () => {
      // At/near the bottom of the page the last section is active even if its
      // heading never reaches the reading line (short final sections can't
      // scroll far enough) — otherwise the last TOC item can never light up.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;
      if (atBottom) {
        setActiveId(headings[headings.length - 1].id);
        return;
      }
      let current = headings[0].id;
      for (const h of headings) {
        if (h.getBoundingClientRect().top - LINE <= 1) current = h.id;
        else break;
      }
      setActiveId(current);
    };
    compute();

    const observer = new IntersectionObserver(compute, {
      rootMargin: `-${LINE}px 0px 0px 0px`,
      threshold: [0, 1],
    });
    headings.forEach((h) => observer.observe(h));
    window.addEventListener('scroll', compute, { passive: true });
    window.addEventListener('resize', compute);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', compute);
      window.removeEventListener('resize', compute);
    };
  }, [items]);

  // Slide the indicator to the active link's box.
  useIsomorphicLayoutEffect(() => {
    const indicator = indicatorRef.current;
    const link = activeId ? linkRefs.current.get(activeId) : undefined;
    if (!indicator) return;
    if (!link) {
      indicator.dataset.visible = 'false';
      return;
    }
    indicator.style.transform = `translateY(${link.offsetTop}px)`;
    indicator.style.height = `${link.offsetHeight}px`;
    indicator.dataset.visible = 'true';
  }, [activeId, items]);

  if (items.length === 0) return <div id="nd-toc" aria-hidden />;

  return (
    <div id="nd-toc">
      <h3>On this page</h3>
      <nav aria-label="On this page">
        <div className="ym-toc-list" ref={listRef}>
          <span ref={indicatorRef} className="ym-toc-indicator" aria-hidden />
          {items.map((item) => (
            <a
              key={item.id}
              ref={(el) => {
                if (el) linkRefs.current.set(item.id, el);
                else linkRefs.current.delete(item.id);
              }}
              href={`#${item.id}`}
              data-active={item.id === activeId}
              data-depth={item.depth}
              onClick={(e) => {
                const target = document.getElementById(item.id);
                if (!target) return;
                e.preventDefault();
                const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
                history.replaceState(null, '', `#${item.id}`);
              }}
            >
              {item.text}
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}
