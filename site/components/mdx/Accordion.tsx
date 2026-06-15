'use client';

import { createContext, useContext, type ReactNode } from 'react';
import {
  Accordion as FdAccordion,
  Accordions as FdAccordions,
} from 'fumadocs-ui/components/accordion';

/** True when rendered inside an <AccordionGroup>. */
const InGroup = createContext(false);

/**
 * Single disclosure row. Wraps Fumadocs' Accordion (Radix-backed: smooth
 * height+opacity animation, keyboard toggle, hairline separators). A bare
 * `<Accordion>` used outside a group self-wraps in a group so it never
 * crashes the Radix root requirement.
 */
export function Accordion({
  title,
  children,
}: {
  title?: ReactNode;
  children?: ReactNode;
}) {
  const inGroup = useContext(InGroup);
  const item = <FdAccordion title={title ?? ''}>{children}</FdAccordion>;
  if (inGroup) return item;
  return (
    <FdAccordions type="single" className="ym-accordion-group">
      {item}
    </FdAccordions>
  );
}

export function AccordionGroup({ children }: { children?: ReactNode }) {
  return (
    <InGroup.Provider value={true}>
      <FdAccordions type="single" className="ym-accordion-group">
        {children}
      </FdAccordions>
    </InGroup.Provider>
  );
}
