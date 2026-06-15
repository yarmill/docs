import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

import './components/mdx/mdx.css';

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

// Provide every custom MDX component GLOBALLY so content compiles without
// per-file imports.
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
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
    ...components,
  };
}

export const useMDXComponents = getMDXComponents;
