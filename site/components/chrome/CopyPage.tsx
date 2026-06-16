'use client';

import { Check, ChevronDown, Copy, ExternalLink, FileCode } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

/**
 * Linear-style "Copy page" split button.
 *
 * Main button copies the current page's rendered text to the clipboard (and
 * shows a brief "Copied" state). The chevron opens a small menu:
 *   • Copy page          — copies the real source Markdown to the clipboard
 *   • View as Markdown    — opens the raw source in a new tab (`/raw/<lang>/<slug>.md`)
 *   • Open in ChatGPT     — prefilled prompt referencing the page URL
 *   • Open in Claude      — prefilled prompt referencing the page URL
 *
 * Source Markdown comes from the static `/raw/<lang>/<slug>.md` files
 * (scripts/build-raw-md.mjs, mirrored from the .mdx at build). If that fetch
 * ever fails we fall back to the rendered article text scraped from the DOM.
 */
function rawUrl(): string {
  // Static .md mirror of the page (scripts/build-raw-md.mjs): /en/plan/goals ->
  // /raw/en/plan/goals.md, /en -> /raw/en.md.
  const p = window.location.pathname.replace(/\/$/, '') || '/en';
  return `/raw${p}.md`;
}

function getDomText(): string {
  const article =
    document.querySelector('#ym-page') ??
    document.querySelector('article') ??
    document.querySelector('main');
  return (article?.textContent ?? '').replace(/\n{3,}/g, '\n\n').trim();
}

async function getPageMarkdown(): Promise<string> {
  try {
    const res = await fetch(rawUrl());
    if (res.ok) return (await res.text()).trim();
  } catch {
    // fall through to DOM text
  }
  return getDomText();
}

const MENU_ITEMS = ['copy', 'markdown', 'chatgpt', 'claude'] as const;
type MenuAction = (typeof MENU_ITEMS)[number];

export function CopyPage() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  // Close the menu on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    // Focus first menu item for keyboard users.
    menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  async function copyPage() {
    try {
      await navigator.clipboard.writeText(await getPageMarkdown());
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can reject without a user gesture / permissions; fail quietly.
    }
  }

  function run(action: MenuAction) {
    const url = window.location.href;
    switch (action) {
      case 'copy':
        void copyPage();
        break;
      case 'markdown':
        window.open(rawUrl(), '_blank', 'noopener');
        break;
      case 'chatgpt':
        window.open(
          `https://chatgpt.com/?q=${encodeURIComponent(`Read this Yarmill docs page and help me: ${url}`)}`,
          '_blank',
          'noopener',
        );
        break;
      case 'claude':
        window.open(
          `https://claude.ai/new?q=${encodeURIComponent(`Read this Yarmill docs page and help me: ${url}`)}`,
          '_blank',
          'noopener',
        );
        break;
    }
    setOpen(false);
  }

  // Arrow-key navigation within the open menu.
  function onMenuKeyDown(e: React.KeyboardEvent) {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [],
    );
    const idx = items.indexOf(document.activeElement as HTMLElement);
    const next =
      e.key === 'ArrowDown'
        ? items[(idx + 1) % items.length]
        : items[(idx - 1 + items.length) % items.length];
    next?.focus();
  }

  return (
    <div className="ym-split" ref={rootRef}>
      <button type="button" className="ym-split-main" onClick={() => run('copy')}>
        {copied ? (
          <Check className="ym-split-icon" aria-hidden />
        ) : (
          <Copy className="ym-split-icon" aria-hidden />
        )}
        <span>{copied ? 'Copied' : 'Copy page'}</span>
      </button>
      {/* Dedicated polite live region: announces the copy result to screen
          readers without re-announcing the visible label on every render. */}
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? 'Page copied to clipboard' : ''}
      </span>
      <button
        type="button"
        className="ym-split-chevron"
        aria-label="Page actions"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <ChevronDown aria-hidden />
      </button>

      {open ? (
        <div
          ref={menuRef}
          className="ym-menu"
          role="menu"
          aria-label="Page actions"
          onKeyDown={onMenuKeyDown}
        >
          <button type="button" role="menuitem" className="ym-menu-item" onClick={() => run('copy')}>
            <Copy className="ym-menu-icon" aria-hidden />
            Copy page
          </button>
          <button
            type="button"
            role="menuitem"
            className="ym-menu-item"
            onClick={() => run('markdown')}
          >
            <FileCode className="ym-menu-icon" aria-hidden />
            View as Markdown
          </button>
          <div className="ym-menu-sep" role="separator" />
          <button
            type="button"
            role="menuitem"
            className="ym-menu-item"
            onClick={() => run('chatgpt')}
          >
            <ExternalLink className="ym-menu-icon" aria-hidden />
            Open in ChatGPT
          </button>
          <button
            type="button"
            role="menuitem"
            className="ym-menu-item"
            onClick={() => run('claude')}
          >
            <ExternalLink className="ym-menu-icon" aria-hidden />
            Open in Claude
          </button>
        </div>
      ) : null}
    </div>
  );
}
