import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import type { AnchorHTMLAttributes } from 'react';

import './components/mdx/mdx.css';
import './components/changelog/changelog.css';

import { Card } from '@/components/mdx/Card';
import { CardGroup } from '@/components/mdx/CardGroup';
import { Columns } from '@/components/mdx/Columns';
import { Steps, Step } from '@/components/mdx/Steps';
import { Info, Tip, Warning, Note, Check } from '@/components/mdx/Callouts';
import { Update } from '@/components/mdx/Update';
import { Frame } from '@/components/mdx/Frame';
import { ParamField } from '@/components/mdx/ParamField';
import { Tabs, Tab } from '@/components/mdx/Tabs';
import { Accordion, AccordionGroup } from '@/components/mdx/Accordion';
import { PageMeta } from '@/components/mdx/PageMeta';
import { TutorialMeta } from '@/components/mdx/TutorialMeta';
import { Heading } from '@/components/mdx/Heading';

/**
 * Base `<a>` override: root-relative and hash links route through next/link
 * (client navigation); external links open in a new tab. Styling is handled by
 * the `#ym-page` prose rules in chrome.css.
 */
function MdxLink({ href = '', ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const internal = href.startsWith('/') || href.startsWith('#');
  if (internal) return <Link href={href} {...props} />;
  return <a href={href} target="_blank" rel="noreferrer noopener" {...props} />;
}

const baseComponents: MDXComponents = {
  a: MdxLink,
  // In-article headings get a hover-reveal permalink (copies the deep link with
  // a "Copied" confirmation). rehype-slug has already set the id, which the
  // override preserves along with scroll-margin-top from chrome.css.
  h2: (props) => <Heading as="h2" {...props} />,
  h3: (props) => <Heading as="h3" {...props} />,
};

const customComponents = {
  Card,
  CardGroup,
  Columns,
  Steps,
  Step,
  Info,
  Tip,
  Warning,
  Note,
  Check,
  Update,
  Frame,
  ParamField,
  Tabs,
  Tab,
  Accordion,
  AccordionGroup,
  PageMeta,
  TutorialMeta,
} as const;

/**
 * The global MDX component map (no Fumadocs). Provided to `compileMDX` so MDX
 * content compiles without per-file imports. `overrides` lets the page route
 * inject anything page-specific.
 */
export function getMDXComponents(overrides?: MDXComponents): MDXComponents {
  return {
    ...baseComponents,
    ...customComponents,
    ...overrides,
  };
}

export const useMDXComponents = getMDXComponents;
