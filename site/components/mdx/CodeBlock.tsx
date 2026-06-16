'use client';

import { useEffect, useRef } from 'react';

/**
 * Code-block enhancer (no fumadocs, no `pre` override in the MDX map).
 *
 * rehype-pretty-code emits `figure[data-rehype-pretty-code-figure] > pre > code`
 * with the Shiki token colours as inline `--shiki-light/--shiki-dark` vars. The
 * box styling lives in mdx.css; the copy button can't be CSS-only, so this client
 * enhancer decorates every code figure on the page exactly once:
 *   - adds a `.ym-code` class hook to the figure
 *   - injects a top-right "Copy" button that copies the code text and flips to
 *     "Copied" for ~1.6s (transform/opacity feedback, reduced-motion safe in CSS)
 *
 * It runs globally and idempotently: a single mounted instance decorates the
 * whole document and re-scans on DOM mutations (MDX is static, but this keeps it
 * resilient to client transitions). Mounted from the MDX components that appear
 * on content pages so no chrome/route file has to change.
 */

const COPY_LABEL = 'Copy';
const DONE_LABEL = 'Copied';

function decorate(root: ParentNode) {
  const figures = root.querySelectorAll<HTMLElement>(
    'figure[data-rehype-pretty-code-figure]:not([data-ym-enhanced])',
  );
  figures.forEach((figure) => {
    figure.setAttribute('data-ym-enhanced', '');
    figure.classList.add('ym-code');

    const pre = figure.querySelector('pre');
    if (!pre) return;

    // rehype-pretty-code puts data-language on the <pre>; lift it to the
    // <figure> so the CSS language label (attr(data-language) on the figure,
    // see mdx.css) can render it in the block's top-right corner.
    const lang = pre.getAttribute('data-language');
    if (lang) figure.setAttribute('data-language', lang);

    // Mark titled figures so the copy button + language label drop below the
    // filename strip (mdx.css handles the offset).
    if (figure.querySelector('[data-rehype-pretty-code-title]')) {
      figure.classList.add('ym-code--titled');
    }

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ym-code-copy';
    btn.setAttribute('aria-label', 'Copy code');
    btn.innerHTML =
      '<span class="ym-code-copy-icon" aria-hidden="true">' +
      // copy glyph (two offset rounded rects) — lucide "copy", 14px
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" width="14" height="14">' +
      '<rect x="9" y="9" width="13" height="13" rx="2"/>' +
      '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>' +
      '</svg>' +
      // check glyph — lucide "check"
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" ' +
      'stroke-linecap="round" stroke-linejoin="round" width="14" height="14" class="ym-code-copy-check">' +
      '<path d="M20 6 9 17l-5-5"/>' +
      '</svg></span>' +
      `<span class="ym-code-copy-label">${COPY_LABEL}</span>`;

    let timer: number | undefined;
    btn.addEventListener('click', async () => {
      const code = pre.querySelector('code');
      const text = (code?.innerText ?? pre.innerText ?? '').replace(/\n$/, '');
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // Fallback for non-secure contexts.
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand('copy');
        } catch {
          /* give up silently */
        }
        document.body.removeChild(ta);
      }
      btn.setAttribute('data-copied', 'true');
      const label = btn.querySelector('.ym-code-copy-label');
      if (label) label.textContent = DONE_LABEL;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        btn.removeAttribute('data-copied');
        if (label) label.textContent = COPY_LABEL;
      }, 1600);
    });

    figure.appendChild(btn);
  });
}

export function CodeBlockEnhancer() {
  // A per-instance ref guard ensures this effect wires up at most one observer
  // even if the effect runs twice (React StrictMode double-invokes effects in
  // dev) or the component remounts. There's no module-global state, so a fresh
  // mount always sets up cleanly. Decoration itself is idempotent — it keys off
  // the `data-ym-enhanced` attribute on each figure, so double-runs are harmless.
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    decorate(document);

    if (!observerRef.current) {
      observerRef.current = new MutationObserver((records) => {
        for (const r of records) {
          if (r.addedNodes.length) {
            decorate(document);
            break;
          }
        }
      });
      observerRef.current.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, []);

  return null;
}
