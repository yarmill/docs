export const PageMeta = ({ audience, where }) => {
  return (
    <div className="ym-pagemeta not-prose">
      <style>{`
        .ym-pagemeta{display:flex;flex-wrap:wrap;gap:8px;margin:0.25rem 0 1.75rem;--pm-ink:#0E1525;--pm-accent:#513FF8;}
        html.dark .ym-pagemeta,.dark .ym-pagemeta{--pm-ink:#E6E8F0;--pm-accent:#9E93FB;}
        .ym-pagemeta .pm-pill{display:inline-flex;align-items:center;gap:8px;padding:5px 12px;border-radius:999px;font-size:0.8125rem;line-height:1.25;white-space:nowrap;border:1px solid color-mix(in srgb,var(--pm-ink) 16%,transparent);background:color-mix(in srgb,var(--pm-ink) 5%,transparent);}
        .ym-pagemeta .pm-icon{display:inline-flex;color:var(--pm-accent);}
        .ym-pagemeta .pm-label{color:var(--pm-ink);opacity:0.5;}
        .ym-pagemeta .pm-value{color:var(--pm-ink);opacity:0.95;}
      `}</style>
      <span className="pm-pill">
        <span className="pm-icon" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </span>
        <span className="pm-label">For</span>
        <span className="pm-value">{audience}</span>
      </span>
      <span className="pm-pill">
        <span className="pm-icon" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        </span>
        <span className="pm-label">Where</span>
        <span className="pm-value">{where}</span>
      </span>
    </div>
  );
};
