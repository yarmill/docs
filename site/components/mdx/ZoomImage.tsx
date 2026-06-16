'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Linear-style click-to-zoom for a single image (reverse-engineered from
 * linear.app/docs). Clicking the in-page image opens a body portal: a
 * page-COLOURED overlay fades in (not a dark scrim) and a fixed-position clone
 * GROWS — via a transform FLIP — from the image's exact on-page box to a
 * centred, viewport-fitted size (~0.4s ease-out). Clicking anywhere, Esc,
 * scrolling, or resizing reverses it back into the page. Body is scroll-locked
 * while open. Reduced motion → instant.
 *
 * Implementation notes (robustness):
 * - The start rect is measured at CLICK time (the original is still visible),
 *   not inside the effect — so React StrictMode's double-effect can't measure a
 *   hidden element and break the FLIP.
 * - Animations use the Web Animations API and are cancelled in the effect
 *   cleanup, so StrictMode's mount→unmount→mount sequence converges cleanly.
 */
const MARGIN = 0.05; // viewport margin around the zoomed image
// Emil Kowalski's rules: enter/exit both ease-out; exit faster than entrance;
// keep under 300ms; the paired clone + overlay share duration + easing.
const OPEN_MS = 300;
const CLOSE_MS = 240;
const EASE = 'cubic-bezier(0, 0, 0.2, 1)';
const IDENTITY = 'translate(0px, 0px) scale(1)';

function fitRect(natW: number, natH: number) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const maxW = vw * (1 - MARGIN * 2);
  const maxH = vh * (1 - MARGIN * 2);
  const ar = natW / natH || 1;
  let w = Math.min(maxW, natW);
  let h = w / ar;
  if (h > maxH) {
    h = maxH;
    w = h * ar;
  }
  return { left: (vw - w) / 2, top: (vh - h) / 2, width: w, height: h };
}

function prefersReduced() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function ZoomImage({ src, alt }: { src: string; alt: string }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const cloneRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const firstRect = useRef<DOMRect | null>(null);
  const anims = useRef<Animation[]>([]);
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    const o = imgRef.current;
    if (o) firstRect.current = o.getBoundingClientRect();
    setOpen(true);
  }, []);

  // FLIP open via WAAPI. The resting end-state is set inline (below), so the
  // entrance animation needs no fill; animations are tracked and cancelled on
  // cleanup.
  useEffect(() => {
    if (!open) return;
    const orig = imgRef.current;
    const clone = cloneRef.current;
    const overlay = overlayRef.current;
    if (!orig || !clone || !overlay) return;

    const first = firstRect.current ?? orig.getBoundingClientRect();
    const target = fitRect(orig.naturalWidth || first.width, orig.naturalHeight || first.height);
    clone.style.left = `${target.left}px`;
    clone.style.top = `${target.top}px`;
    clone.style.width = `${target.width}px`;
    clone.style.height = `${target.height}px`;
    clone.style.transformOrigin = 'top left';

    orig.style.visibility = 'hidden';
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    anims.current.forEach((a) => a.cancel());
    anims.current = [];

    // Set the correct RESTING end-state inline first (image large + overlay
    // visible). The FLIP is then layered on only as an entrance, and only when
    // the tab is visible — so the zoom is correct even if the animation engine
    // never ticks (e.g. background tab), with no `fill` needed.
    clone.style.transform = IDENTITY;
    overlay.style.opacity = '1';

    if (!prefersReduced() && !document.hidden) {
      const from = `translate(${first.left - target.left}px, ${first.top - target.top}px) scale(${first.width / target.width})`;
      anims.current = [
        clone.animate([{ transform: from }, { transform: IDENTITY }], {
          duration: OPEN_MS,
          easing: EASE,
        }),
        overlay.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: OPEN_MS,
          easing: EASE,
        }),
      ];
    }

    return () => {
      anims.current.forEach((a) => a.cancel());
      anims.current = [];
      document.body.style.overflow = prevOverflow;
      orig.style.visibility = '';
    };
  }, [open]);

  const close = useCallback(() => {
    const orig = imgRef.current;
    const clone = cloneRef.current;
    const overlay = overlayRef.current;
    if (!orig || !clone || !overlay || prefersReduced() || document.hidden) {
      setOpen(false);
      return;
    }

    // Reveal the original NOW — it stays fully covered by the shrinking clone
    // for the whole close, so when the clone unmounts there is no swap and thus
    // no flash. (The clone is held at its shrunk end-state via fill:'forwards'.)
    orig.style.visibility = '';

    const first = orig.getBoundingClientRect();
    const tLeft = parseFloat(clone.style.left) || 0;
    const tTop = parseFloat(clone.style.top) || 0;
    const tWidth = clone.offsetWidth || first.width;
    const to = `translate(${first.left - tLeft}px, ${first.top - tTop}px) scale(${first.width / tWidth})`;
    const fromTransform = getComputedStyle(clone).transform;
    const from = fromTransform === 'none' ? IDENTITY : fromTransform;

    // Stop the open animations so they don't fight the close.
    anims.current.forEach((a) => a.cancel());
    anims.current = [];

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setOpen(false);
    };
    // Paired (Emil): clone + overlay share duration + easing. fill 'forwards'
    // holds the shrunk end-state until unmount, so the clone never snaps back to
    // full size for a frame (the blink).
    const a = clone.animate([{ transform: from }, { transform: to }], {
      duration: CLOSE_MS,
      easing: EASE,
      fill: 'forwards',
    });
    overlay.animate([{ opacity: getComputedStyle(overlay).opacity }, { opacity: 0 }], {
      duration: CLOSE_MS,
      easing: EASE,
      fill: 'forwards',
    });
    a.onfinish = finish;
    a.oncancel = finish;
    window.setTimeout(finish, CLOSE_MS + 80); // safety net
  }, []);

  // Close on Esc / scroll-intent / resize while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    const onScrollIntent = () => close();
    window.addEventListener('keydown', onKey);
    window.addEventListener('wheel', onScrollIntent, { passive: true });
    window.addEventListener('touchmove', onScrollIntent, { passive: true });
    window.addEventListener('resize', onScrollIntent);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('wheel', onScrollIntent);
      window.removeEventListener('touchmove', onScrollIntent);
      window.removeEventListener('resize', onScrollIntent);
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
        onClick={handleOpen}
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={cloneRef} src={src} alt={alt} className="ym-zoom-clone" />
          </div>,
          document.body,
        )}
    </>
  );
}
