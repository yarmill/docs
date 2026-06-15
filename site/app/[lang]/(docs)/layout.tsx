import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from 'fumadocs-ui/layouts/docs/slots/sidebar';
import { baseOptions } from '@/lib/layout.shared';
import { Container } from '@/components/chrome/Container';
import { Sidebar } from '@/components/chrome/Sidebar';
import { TopBar } from '@/components/chrome/TopBar';
import type { ReactNode } from 'react';

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const { lang } = await params;

  // We keep Fumadocs' DocsLayout — and therefore its SidebarProvider (drawer
  // state), TreeContextProvider and the RootProvider-mounted search dialog — but
  // replace the three chrome slots with Yarmill's Linear-matched shell:
  //   • container → the 3-column grid (sidebar / main / toc + header)
  //   • header    → the translucent top bar (breadcrumbs, theme, copy, CTA)
  //   • sidebar.root → the collapsible-group rail with search + footer
  // The built-in DocsPage primitives (article in [grid-area:main], TOC in
  // [grid-area:toc]) drop straight into the grid we define.
  return (
    <DocsLayout
      tree={source.pageTree[lang]}
      {...baseOptions(lang)}
      slots={{
        container: Container,
        header: TopBar,
        // The merge in DocsLayout replaces the whole `sidebar` slot object with
        // `??`, so we re-supply the defaults and only swap `root`.
        sidebar: {
          provider: SidebarProvider,
          root: Sidebar,
          trigger: SidebarTrigger,
          useSidebar,
        },
      }}
    >
      {children}
    </DocsLayout>
  );
}
