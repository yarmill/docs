'use client';

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';

/**
 * Minimal sidebar/drawer state (replaces fumadocs' `useSidebar`). Only the
 * mobile drawer needs shared open state between the top-bar hamburger and the
 * sidebar; desktop is a static column.
 */
interface SidebarState {
  open: boolean;
  setOpen: (v: boolean) => void;
}

const Ctx = createContext<SidebarState>({ open: false, setOpen: () => {} });

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <Ctx.Provider value={{ open, setOpen }}>{children}</Ctx.Provider>;
}

export function useSidebar(): SidebarState {
  return useContext(Ctx);
}
