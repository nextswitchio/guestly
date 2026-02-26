"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar, SidebarTrigger } from "@/components/ui/sidebar";

// ── Icons ────────────────────────────────────────────────────────────────────
function LayoutIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  );
}
function CalendarIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function PlusCircleIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}
function BarChartIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
}
function WalletIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 10h20" />
    </svg>
  );
}
function ShoppingBagIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
function UsersIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function SettingsIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
function XIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ── Links ────────────────────────────────────────────────────────────────────

type NavLink = { href: string; label: string; icon: React.ComponentType<{ className?: string }>; exact?: boolean };

const marketingLinks: NavLink[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutIcon, exact: true },
  { href: "/dashboard/events", label: "Events", icon: CalendarIcon },
  { href: "/dashboard/events/new", label: "Create Event", icon: PlusCircleIcon },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChartIcon },
  { href: "/dashboard/merch", label: "Merchandise", icon: ShoppingBagIcon },
  { href: "/dashboard/community", label: "Community", icon: UsersIcon },
];
const paymentsLinks: NavLink[] = [{ href: "/dashboard/wallet", label: "Wallet", icon: WalletIcon }];
const systemLinks: NavLink[] = [{ href: "/dashboard/settings", label: "Settings", icon: SettingsIcon }];

// ── Component ────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const pathname = usePathname();
  const sidebar = useSidebar();

  const collapsed = sidebar ? !sidebar.open : false;
  const mobileOpen = sidebar?.openMobile ?? false;

  // Close mobile drawer on navigation
  React.useEffect(() => {
    sidebar?.setOpenMobile(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  function renderSectionAbbr(letter: string) {
    return (
      <div className="mb-2 flex justify-center">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-xs font-semibold text-neutral-500">
          {letter}
        </div>
      </div>
    );
  }

  function renderNavSection(
    sectionLinks: { href: string; label: string; icon: React.ComponentType<{ className?: string }>; exact?: boolean }[],
    title: string,
    abbr: string
  ) {
    return (
      <div>
        {collapsed ? renderSectionAbbr(abbr) : <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">{title}</p>}
        <div className="flex flex-col gap-0.5">
          {sectionLinks.map((link) => {
            const active = isActive(link.href, link.exact);
            return (
              <Link
                key={link.href}
                href={link.href}
                title={collapsed ? link.label : undefined}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${collapsed ? "justify-center" : ""
                  } ${active
                    ? "bg-primary-50 font-semibold text-primary-700 shadow-sm"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                  }`}
              >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${active
                  ? "bg-primary-100 text-primary-600"
                  : "bg-neutral-100 text-neutral-400 group-hover:bg-neutral-200 group-hover:text-neutral-600"
                  }`}>
                  <link.icon className="h-4 w-4" />
                </span>
                {!collapsed && <span className="truncate">{link.label}</span>}

                {/* Tooltip on hover when collapsed */}
                {collapsed && (
                  <span className="pointer-events-none absolute left-full ml-2 hidden whitespace-nowrap rounded-lg bg-neutral-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg group-hover:block z-50">
                    {link.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  const nav = (
    <nav className="flex flex-col gap-6">
      {renderNavSection(marketingLinks, "Marketing", "M")}
      {renderNavSection(paymentsLinks, "Payments", "P")}
      {renderNavSection(systemLinks, "System", "S")}
    </nav>
  );

  /* ── Full mobile nav (always expanded) ── */
  function renderMobileNav() {
    return (
      <nav className="flex flex-col gap-6">
        {[
          { items: marketingLinks, title: "Marketing" },
          { items: paymentsLinks, title: "Payments" },
          { items: systemLinks, title: "System" },
        ].map(({ items, title }: { items: NavLink[]; title: string }) => (
          <div key={title}>
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">{title}</p>
            <div className="flex flex-col gap-0.5">
              {items.map((link: NavLink) => {
                const active = isActive(link.href, link.exact);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${active
                      ? "bg-primary-50 font-semibold text-primary-700 shadow-sm"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                      }`}
                  >
                    <span className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${active ? "bg-primary-100 text-primary-600" : "bg-neutral-100 text-neutral-400 group-hover:bg-neutral-200 group-hover:text-neutral-600"}`}>
                      <link.icon className="h-4 w-4" />
                    </span>
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    );
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`fixed left-0 top-0 hidden h-screen shrink-0 flex-col border-r border-neutral-200 bg-white transition-all duration-200 ease-linear md:flex ${collapsed ? "w-16" : "w-64"}`}
      >
        {/* Org header */}
        <div className={`flex items-center border-b border-neutral-100 px-4 py-4 ${collapsed ? "flex-col gap-2" : "gap-3"}`}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary-500 to-primary-700 text-sm font-bold text-white shadow-sm">
            G
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-neutral-900">Organiser</p>
              <p className="text-xs text-neutral-400">Dashboard</p>
            </div>
          )}
          <SidebarTrigger className="shrink-0" />
        </div>

        {/* Nav */}
        <div className={`flex-1 overflow-y-auto py-4 ${collapsed ? "px-2" : "px-3"}`}>
          {nav}
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-100 px-3 py-3">
          {!collapsed && (
            <div className="flex items-center gap-3 rounded-xl bg-neutral-50 px-3 py-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">O</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-neutral-900">My Organisation</p>
                <p className="text-xs text-neutral-400">Free plan</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden" onClick={() => sidebar?.setOpenMobile(false)} />
          <div className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col bg-white shadow-2xl md:hidden">
            <div className="flex h-14 items-center justify-between border-b border-neutral-100 px-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-primary-500 to-primary-700 text-sm font-bold text-white shadow-sm">
                  G
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">Organiser</p>
                  <p className="text-xs text-neutral-400">Dashboard</p>
                </div>
              </div>
              <button onClick={() => sidebar?.setOpenMobile(false)} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-neutral-100">
                <XIcon className="h-5 w-5 text-neutral-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-4">
              {renderMobileNav()}
            </div>
            <div className="border-t border-neutral-100 px-4 py-3">
              <div className="flex items-center gap-3 rounded-xl bg-neutral-50 px-3 py-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">O</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-neutral-900">My Organisation</p>
                  <p className="text-xs text-neutral-400">Free plan</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
