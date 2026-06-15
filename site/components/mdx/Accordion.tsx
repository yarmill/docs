'use client';

import { createContext, useContext, useId, type ReactNode } from 'react';
import * as RadixAccordion from '@radix-ui/react-accordion';
import { ChevronRight } from 'lucide-react';

/**
 * Disclosure rows, reimplemented on @radix-ui/react-accordion (no fumadocs-ui).
 * Keeps the same author-facing API:
 *   <Accordion title="…">…</Accordion>            single row (self-wraps)
 *   <AccordionGroup><Accordion …/>…</AccordionGroup>
 *
 * Radix gives keyboard toggle, roving focus and the data-state hooks the CSS
 * animation uses. Styling stays on `--ym-*` tokens (see mdx.css §7).
 */

const InGroup = createContext(false);

function AccordionItem({ title, children }: { title?: ReactNode; children?: ReactNode }) {
  const value = useId();
  return (
    <RadixAccordion.Item className="ym-accordion-item" value={value}>
      <RadixAccordion.Header className="ym-accordion-header">
        <RadixAccordion.Trigger className="ym-accordion-trigger">
          <ChevronRight className="ym-accordion-chevron" aria-hidden />
          <span className="ym-accordion-title">{title}</span>
        </RadixAccordion.Trigger>
      </RadixAccordion.Header>
      <RadixAccordion.Content className="ym-accordion-content">
        <div className="ym-accordion-body">{children}</div>
      </RadixAccordion.Content>
    </RadixAccordion.Item>
  );
}

export function Accordion({ title, children }: { title?: ReactNode; children?: ReactNode }) {
  const inGroup = useContext(InGroup);
  const item = <AccordionItem title={title}>{children}</AccordionItem>;
  // A bare <Accordion> outside a group still needs a Radix root.
  if (inGroup) return item;
  return (
    <RadixAccordion.Root type="single" collapsible className="ym-accordion-group">
      {item}
    </RadixAccordion.Root>
  );
}

export function AccordionGroup({ children }: { children?: ReactNode }) {
  return (
    <InGroup.Provider value={true}>
      <RadixAccordion.Root type="single" collapsible className="ym-accordion-group">
        {children}
      </RadixAccordion.Root>
    </InGroup.Provider>
  );
}
