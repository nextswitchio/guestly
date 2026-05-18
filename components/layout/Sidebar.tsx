"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";

// ── Icons ─────────────────────────────────────────────────────────────────
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
function StarIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
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

// ── Types ─────────────────────────────────────────────────────────────────
type NavLink = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  badge?: string;
};

const mainLinks: NavLink[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutIcon, exact: true },
  { href: "/dashboard/events", label: "Events", icon: CalendarIcon },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChartIcon },
  { href: "/dashboard/marketing", label: "Marketing", icon: ShoppingBagIcon },
  { href: "/dashboard/community", label: "Community", icon: UsersIcon },
  { href: "/dashboard/ai-assistant", label: "AI Assistant", icon: StarIcon, badge: "New" },
];
const paymentsLinks: NavLink[] = [
  { href: "/dashboard/wallet", label: "Wallet", icon: WalletIcon },
];
const systemLinks: NavLink[] = [
  { href: "/dashboard/subscription", label: "Subscription", icon: StarIcon },
  { href: "/dashboard/settings", label: "Settings", icon: SettingsIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const sidebar = useSidebar();
  const collapsed = sidebar ? !sidebar.open : false;
  const mobileOpen = sidebar?.openMobile ?? false;

  React.useEffect(() => {
    sidebar?.setOpenMobile(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  function NavItem({ link }: { link: NavLink }) {
    const active = isActive(link.href, link.exact);
    return (
      <Link
        href={link.href}
        title={collapsed ? link.label : undefined}
        className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-150 min-h-[44px] ${collapsed ? "justify-center" : ""
          } ${active
            ? "bg-primary-500/15 text-primary-300 font-semibold"
            : "text-navy-200 hover:bg-white/5 hover:text-white"
          }`}
      >
        {/* Active highlight bar */}
        {active && !collapsed && (
          <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-primary-400" />
        )}
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all ${active
            ? "bg-primary-500/20 text-primary-400"
            : "bg-white/5 text-navy-300 group-hover:bg-white/10 group-hover:text-white"
          }`}>
          <link.icon className="h-4 w-4" />
        </span>

        {!collapsed && (
          <>
            <span className="flex-1 truncate">{link.label}</span>
            {link.badge && (
              <span className="rounded-full bg-primary-500/20 px-1.5 py-0.5 text-[10px] font-bold text-primary-300">
                {link.badge}
              </span>
            )}
          </>
        )}

        {/* Tooltip when collapsed */}
        {collapsed && (
          <span className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-xl bg-navy-700 border border-navy-600 px-3 py-1.5 text-xs font-medium text-white shadow-xl group-hover:block z-50">
            {link.label}
          </span>
        )}
      </Link>
    );
  }

  function NavSection({ links, title, abbr }: { links: NavLink[]; title: string; abbr: string }) {
    return (
      <div>
        {collapsed ? (
          <div className="mb-2 flex justify-center">
            <div className="flex h-5 w-5 items-center justify-center rounded-md border border-navy-600 text-[9px] font-bold text-navy-400">
              {abbr}
            </div>
          </div>
        ) : (
          <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-widest text-navy-500">
            {title}
          </p>
        )}
        <div className="flex flex-col gap-0.5">
          {links.map((link) => <NavItem key={link.href} link={link} />)}
        </div>
      </div>
    );
  }

  const navContent = (
    <nav id="main-navigation" className="flex flex-col gap-5" tabIndex={-1}>
      <NavSection links={mainLinks} title="Platform" abbr="P" />
      <NavSection links={paymentsLinks} title="Payments" abbr="$" />
      <NavSection links={systemLinks} title="System" abbr="S" />
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`fixed left-0 top-0 hidden h-screen shrink-0 flex-col bg-navy-800 border-r border-navy-700 transition-all duration-200 ease-linear md:flex ${collapsed ? "w-16" : "w-64"
          }`}
      >
        {/* Header */}
        <div className={`flex items-center border-b border-navy-700 px-4 py-4 ${collapsed ? "flex-col gap-2" : "gap-3"}`}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-500 text-sm font-black text-white shadow-md btn-glow-blue">
            G
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white tracking-tight">Guestly</p>
              <p className="text-xs text-navy-400">Organiser</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <div className={`flex-1 overflow-y-auto py-4 ${collapsed ? "px-2" : "px-3"}`}>
          {navContent}
        </div>

        {/* Footer: User info */}
        <div className="border-t border-navy-700 px-3 py-3">
          {!collapsed ? (
            <div className="flex items-center gap-3 rounded-xl bg-navy-700/50 px-3 py-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-500/20 text-xs font-bold text-primary-300">O</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-white">My Organisation</p>
                <p className="text-xs text-navy-400">Free plan</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500/20 text-xs font-bold text-primary-300">O</span>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => sidebar?.setOpenMobile(false)} />
          <div className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col bg-navy-800 shadow-2xl md:hidden">
            <div className="flex h-16 items-center justify-between border-b border-navy-700 px-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500 text-sm font-black text-white">G</div>
                <div>
                  <p className="text-sm font-bold text-white">Guestly</p>
                  <p className="text-xs text-navy-400">Organiser</p>
                </div>
              </div>
              <button onClick={() => sidebar?.setOpenMobile(false)} className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-navy-700 transition-colors">
                <XIcon className="h-5 w-5 text-navy-300" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-4">
              {navContent}
            </div>
            <div className="border-t border-navy-700 px-4 py-3">
              <div className="flex items-center gap-3 rounded-xl bg-navy-700/50 px-3 py-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500/20 text-xs font-bold text-primary-300">O</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-white">My Organisation</p>
                  <p className="text-xs text-navy-400">Free plan</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
