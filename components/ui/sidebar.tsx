"use client";
import React from "react";

// ── Types ────────────────────────────────────────────────────────────────────

type SidebarContextType = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextType | null>(null);

/** Returns the sidebar context, or `null` when rendered outside a `<SidebarProvider>`. */
export function useSidebar() {
  return React.useContext(SidebarContext);
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => setIsMobile(mql.matches);
    mql.addEventListener("change", onChange);
    onChange();
    return () => mql.removeEventListener("change", onChange);
  }, [breakpoint]);

  return isMobile;
}

// ── Provider ─────────────────────────────────────────────────────────────────

export function SidebarProvider({
  defaultOpen = true,
  children,
}: {
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(defaultOpen);
  const [openMobile, setOpenMobile] = React.useState(false);

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) setOpenMobile((prev) => !prev);
    else setOpen((prev) => !prev);
  }, [isMobile]);

  const state = open ? "expanded" : "collapsed";

  const value = React.useMemo<SidebarContextType>(
    () => ({ state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar }),
    [state, open, isMobile, openMobile, toggleSidebar],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

// ── Trigger ──────────────────────────────────────────────────────────────────

function PanelLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
    </svg>
  );
}

/** PanelLeft icon toggle button. Renders nothing outside a `<SidebarProvider>`. */
export function SidebarTrigger({
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ctx = useSidebar();
  if (!ctx) return null;

  return (
    <button
      type="button"
      onClick={ctx.toggleSidebar}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 ${className}`}
      aria-label="Toggle Sidebar"
      {...props}
    >
      <PanelLeftIcon />
    </button>
  );
}
