'use client';

import {
  Children,
  isValidElement,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';

interface TabProps {
  title?: ReactNode;
  children?: ReactNode;
}

export function Tab({ children }: TabProps) {
  // Rendered by <Tabs>; standalone use just shows its body.
  return <>{children}</>;
}

export function Tabs({
  items,
  children,
}: {
  items?: string[];
  children?: ReactNode;
}) {
  const tabs = Children.toArray(children).filter((c) =>
    isValidElement(c),
  ) as ReactElement<TabProps>[];

  const titles =
    items ??
    tabs.map((t, i) => {
      const title = t.props.title;
      return typeof title === 'string' ? title : `Tab ${i + 1}`;
    });

  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const dir = e.key === 'ArrowRight' ? 1 : -1;
    const next = (active + dir + titles.length) % titles.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="ym-tabs">
      <div role="tablist" aria-orientation="horizontal" onKeyDown={onKeyDown}>
        {titles.map((title, i) => {
          const selected = i === active;
          return (
            <button
              key={i}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${i}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${i}`}
              tabIndex={selected ? 0 : -1}
              data-state={selected ? 'active' : 'inactive'}
              className="ym-tab-trigger"
              onClick={() => setActive(i)}
            >
              {title}
            </button>
          );
        })}
      </div>
      {tabs.map((tab, i) => (
        <div
          key={i}
          role="tabpanel"
          id={`${baseId}-panel-${i}`}
          aria-labelledby={`${baseId}-tab-${i}`}
          hidden={i !== active}
        >
          {tab.props.children}
        </div>
      ))}
    </div>
  );
}
