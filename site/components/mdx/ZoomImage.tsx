'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Linear-style click-to-zoom for a single image (medium-zoom mechanism).
 *
 * There is exactly ONE image element — the real in-page `<img>`. Clicking
 * transforms that same element (scale + translate) from its inline box to a
 * centred, viewport-fitted size while a body-portal overlay fades in. Closing
 * reverses the transform on the SAME element. Because nothing is ever swapped
 * (no clone), the motion is one continuous transform and there is structurally
 * no flash — this is what Linear's docs do.
 *
 * For the in-flow image to paint above the overlay and not be clipped:
 * - `.ym-page-enter` no longer leaves a permanent `will-change`/`transform`, so
 *   no ancestor creates a stacking context or containing block (see chrome.css).
 *   The image gets `position: relative; z-index` above the overlay and resolves
 *   in the root stacking context.
 * - The image's frame (`.ym-frame-media`) is `overflow: hidden`; we flip it to
 *   `visible` for the duration of the zoom so the enlarged image isn't clipped.
 *
 * Reduced motion / hidden tab → instant (no transition).
 */
const MARGIN = 40; // px of viewport breathing room around the zoomed image
const DUR = 300;
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'; // ease-out (Emil: enter + exit)

function prefersReduced() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function ZoomImage({ src, alt }: { src: string; alt: string }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const targetTransform = useRef<string>('none');
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => setOpen(true), []);

  // Open: lock scroll, free the frame's clip, transform the real image to a
  // centred fit, fade the overlay in. The cleanup return restores everything,
  // so it doubles as the teardown after close() unmounts the overlay.
  useEffect(() => {
    if (!open) return;
    const img = imgRef.current;
    const overlay = overlayRef.current;
    if (!img || !overlay) return;

    // Scroll-lock, compensating for the scrollbar so the page can't shift.
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    document.body.style.overflow = 'hidden';
    if (sbw > 0) document.body.style.paddingRight = `${sbw}px`;

    // Let the enlarged image escape its frame's overflow clip.
    const frame = img.closest('.ym-frame-media') as HTMLElement | null;
    const prevFrameOverflow = frame?.style.overflow ?? '';
    if (frame) frame.style.overflow = 'visible';

    // Neutralise the page-entrance wrapper's stacking context for the duration
    // of the zoom. While `.ym-page-enter`'s animation is in its active phase it
    // applies a transform/opacity that creates a stacking context + containing
    // block, which would trap the in-flow image BELOW the body-portal overlay.
    // Forcing it static (it equals the resting state once the entrance is done)
    // guarantees the image's z-index resolves at the root, above the overlay —
    // regardless of entrance timing or tab-throttled animation clocks.
    const enter = img.closest('.ym-page-enter') as HTMLElement | null;
    const prevEnter = enter
      ? {
          animation: enter.style.animation,
          transform: enter.style.transform,
          opacity: enter.style.opacity,
          willChange: enter.style.willChange,
        }
      : null;
    if (enter) {
      enter.style.animation = 'none';
      enter.style.transform = 'none';
      enter.style.opacity = '1';
      enter.style.willChange = 'auto';
    }

    // Target transform: scale to fit (capped at natural size), translate centre
    // to viewport centre. Form `translate() scale()` ⇒ translate is in real CSS
    // pixels (applied outside the scale), so no division by scale is needed.
    const r = img.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scale = Math.min(
      (vw - MARGIN * 2) / r.width,
      (vh - MARGIN * 2) / r.height,
      (img.naturalWidth || r.width) / r.width,
    );
    const tx = vw / 2 - (r.left + r.width / 2);
    const ty = vh / 2 - (r.top + r.height / 2);
    const target = `translate(${tx}px, ${ty}px) scale(${scale})`;
    targetTransform.current = target;

    // Resting (open) state inline, so it holds even if the animation never ticks
    // (hidden tab); the transition is layered on as an entrance.
    img.style.position = 'relative';
    img.style.zIndex = '210'; // above the overlay (z-index 200)
    img.style.cursor = 'zoom-out';
    img.style.transformOrigin = 'center center';
    img.style.willChange = 'transform';
    img.style.transform = target;
    overlay.style.opacity = '1';

    if (!prefersReduced() && !document.hidden) {
      img.animate([{ transform: 'none' }, { transform: target }], {
        duration: DUR,
        easing: EASE,
      });
      overlay.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: DUR,
        easing: EASE,
      });
    }

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPad;
      if (frame) frame.style.overflow = prevFrameOverflow;
      if (enter && prevEnter) {
        enter.style.animation = prevEnter.animation;
        enter.style.transform = prevEnter.transform;
        enter.style.opacity = prevEnter.opacity;
        enter.style.willChange = prevEnter.willChange;
      }
      img.style.position = '';
      img.style.zIndex = '';
      img.style.cursor = '';
      img.style.transformOrigin = '';
      img.style.willChange = '';
      img.style.transform = '';
    };
  }, [open]);

  // Close: reverse the transform on the SAME element + fade the overlay, then
  // unmount (which runs the effect cleanup). Resting-end values are set inline
  // up front so the no-fill animations land on them — no end-of-close flash.
  const close = useCallback(() => {
    const img = imgRef.current;
    const overlay = overlayRef.current;
    if (!img || !overlay || prefersReduced() || document.hidden) {
      setOpen(false);
      return;
    }

    const target = targetTransform.current;
    img.style.transform = 'none';
    overlay.style.opacity = '0';

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setOpen(false);
    };

    const a = img.animate([{ transform: target }, { transform: 'none' }], {
      duration: DUR,
      easing: EASE,
    });
    overlay.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: DUR,
      easing: EASE,
    });
    a.onfinish = finish;
    a.oncancel = finish;
    window.setTimeout(finish, DUR + 80);
  }, []);

  // Esc / scroll-intent / resize all close (Linear closes on scroll).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    const onIntent = () => close();
    window.addEventListener('keydown', onKey);
    window.addEventListener('wheel', onIntent, { passive: true });
    window.addEventListener('touchmove', onIntent, { passive: true });
    window.addEventListener('resize', onIntent);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('wheel', onIntent);
      window.removeEventListener('touchmove', onIntent);
      window.removeEventListener('resize', onIntent);
    };
  }, [open, close]);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="ym-zoom-trigger"
        onClick={() => (open ? close() : handleOpen())}
      />
      {open &&
        createPortal(
          <div
            ref={overlayRef}
            className="ym-zoom-overlay"
            role="dialog"
            aria-modal="true"
            aria-label={alt || 'Image preview'}
            onClick={close}
          >
            <span className="ym-zoom-esc" aria-hidden>
              esc
            </span>
          </div>,
          document.body,
        )}
    </>
  );
}
