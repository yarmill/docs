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
  const handedOff = useRef(false);
  const closing = useRef(false);
  const entrance = useRef<Animation | null>(null);
  const originRect = useRef<DOMRect | null>(null);
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
    const prevFrameHeight = frame?.style.height ?? '';
    if (frame) frame.style.overflow = 'visible';

    // Neutralise the page-entrance wrapper's stacking context for the duration
    // of the zoom. While `.ym-page-enter`'s animation is in its active phase it
    // applies a transform/opacity that creates a stacking context + containing
    // block, which would trap the in-flow image BELOW the body-portal overlay.
    // Forcing it static (it equals the resting state once the entrance is done)
    // guarantees the image's z-index resolves at the root, above the overlay —
    // regardless of entrance timing or tab-throttled animation clocks.
    const enter = img.closest('.ym-page-enter') as HTMLElement | null;
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
    originRect.current = r; // where it sits in the flow — the closing target
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    // Never enlarge past the file's own resolution. The cap has to count DEVICE
    // pixels, not CSS pixels: on a 2x screen, showing a 3200px-wide image at
    // 3200 CSS px means each image pixel is stretched over four device pixels,
    // which is the blur. naturalWidth / (cssWidth * dpr) is the honest ceiling.
    const dpr = window.devicePixelRatio || 1;
    const scale = Math.min(
      (vw - MARGIN * 2) / r.width,
      (vh - MARGIN * 2) / r.height,
      (img.naturalWidth || r.width * dpr) / (r.width * dpr),
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
    img.style.transform = target;
    overlay.style.opacity = '1';

    // Once the motion is over, stop being a scaled layer and become a normally
    // laid-out element of the same size. A transform: scale() is rasterised by
    // the compositor from the element's UNTRANSFORMED box — WebKit generates
    // that texture at 1x and stretches it, which is the blur in Safari — so the
    // resting state is switched to explicit width/height with no transform, and
    // the image rasterises natively at the size it is actually drawn. The frame
    // keeps its measured height for the duration so nothing reflows behind the
    // overlay when the image leaves the flow.
    const settleAtFullSize = () => {
      // Never hand off once a close has begun: the entrance's `finished` would
      // otherwise fire mid-close and pin the image at stale fixed coordinates.
      if (closing.current || handedOff.current) return;
      const box = img.getBoundingClientRect(); // the transformed (visual) box
      // The corner radius was being scaled along with everything else while
      // transformed; keep that apparent size, or the corner snaps at hand-off.
      const cs = getComputedStyle(img);
      const r = (v: string) => `${parseFloat(v) * scale}px`;
      if (frame) frame.style.height = `${frame.getBoundingClientRect().height}px`;
      img.style.borderRadius =
        `${r(cs.borderTopLeftRadius)} ${r(cs.borderTopRightRadius)} ` +
        `${r(cs.borderBottomRightRadius)} ${r(cs.borderBottomLeftRadius)}`;
      img.style.willChange = 'auto';
      img.style.transform = 'none';
      img.style.position = 'fixed';
      img.style.left = `${box.left}px`;
      img.style.top = `${box.top}px`;
      img.style.width = `${box.width}px`;
      img.style.height = `${box.height}px`;
      handedOff.current = true;
    };

    if (!prefersReduced() && !document.hidden) {
      img.style.willChange = 'transform';
      const anim = img.animate([{ transform: 'none' }, { transform: target }], {
        duration: DUR,
        easing: EASE,
      });
      entrance.current = anim;
      anim.finished.then(settleAtFullSize, () => {});
      overlay.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: DUR,
        easing: EASE,
      });
    } else {
      settleAtFullSize();
    }

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPad;
      if (frame) frame.style.overflow = prevFrameOverflow;
      // Leave .ym-page-enter neutralised (static at its resting state) — do NOT
      // restore the CSS `animation`. Re-applying the keyframe name would RESTART
      // the entrance animation, flashing the whole content (text + image) on
      // close. The entrance already played for this page instance, and the
      // wrapper remounts fresh on the next navigation, so leaving it static here
      // is correct.
      if (frame) frame.style.height = prevFrameHeight;
      img.style.position = '';
      img.style.left = '';
      img.style.top = '';
      img.style.width = '';
      img.style.height = '';
      img.style.borderRadius = '';
      img.style.zIndex = '';
      img.style.cursor = '';
      img.style.transformOrigin = '';
      img.style.willChange = '';
      img.style.transform = '';
      handedOff.current = false;
      closing.current = false;
      entrance.current = null;
      originRect.current = null;
    };
  }, [open]);

  // Close: reverse the transform on the SAME element + fade the overlay, then
  // unmount (which runs the effect cleanup). Resting-end values are set inline
  // up front so the no-fill animations land on them — no end-of-close flash.
  const close = useCallback(() => {
    // A scroll gesture fires a burst of wheel events, and every one of them used
    // to run this whole function — stacking a new animation on each, which is
    // what made closing-by-scroll stutter. One close per open.
    if (closing.current) return;
    closing.current = true;
    // If we're still mid-entrance, stop it — its finished handler must not run.
    entrance.current?.cancel();
    entrance.current = null;

    const img = imgRef.current;
    const overlay = overlayRef.current;
    if (!img || !overlay || prefersReduced() || document.hidden) {
      setOpen(false);
      return;
    }

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setOpen(false); // the effect cleanup resets every style
    };

    overlay.style.opacity = '0';
    overlay.animate([{ opacity: 1 }, { opacity: 0 }], { duration: DUR, easing: EASE });

    let a: Animation;
    if (handedOff.current && originRect.current) {
      // It is laid out at full size, position: fixed. Animate it back with a
      // transform alone — going back into the flow first would force a reflow
      // on the same frame the animation starts, which is the other half of the
      // stutter. Geometry at the end matches the in-flow box exactly, so the
      // cleanup's style reset is invisible.
      const now = img.getBoundingClientRect();
      const o = originRect.current;
      const scale = o.width / now.width;
      const back = `translate(${o.left - now.left}px, ${o.top - now.top}px) scale(${scale})`;
      img.style.transformOrigin = 'top left';
      img.style.willChange = 'transform';
      img.style.transform = back;
      a = img.animate([{ transform: 'none' }, { transform: back }], {
        duration: DUR,
        easing: EASE,
      });
    } else {
      // Closed mid-open, before the hand-off: just reverse the entrance.
      const target = targetTransform.current;
      img.style.transform = 'none';
      img.style.willChange = 'transform';
      a = img.animate([{ transform: target }, { transform: 'none' }], {
        duration: DUR,
        easing: EASE,
      });
    }

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
    window.addEventListener('wheel', onIntent, { passive: true, once: true });
    window.addEventListener('touchmove', onIntent, { passive: true, once: true });
    window.addEventListener('resize', onIntent, { once: true });
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
