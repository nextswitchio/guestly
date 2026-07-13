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

function ReceiptIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 4h16v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4z" />
      <polyline points="22,6 12,13 2,6" />
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
function StoreIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" /><path d="M2 7h20" /><path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7" />
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
  { href: "/organizer/dashboard", label: "Dashboard", icon: LayoutIcon, exact: true },
  { href: "/organizer/dashboard/events", label: "Events", icon: CalendarIcon },
  { href: "/organizer/dashboard/marketing", label: "Marketing", icon: StarIcon },
  { href: "/organizer/dashboard/analytics", label: "Analytics", icon: BarChartIcon },
  { href: "/organizer/dashboard/featured", label: "Featured", icon: StarIcon },
  { href: "/organizer/dashboard/community", label: "Community", icon: UsersIcon },
  { href: "/organizer/dashboard/merch", label: "Merchandise", icon: ShoppingBagIcon },
  { href: "/organizer/dashboard/premium", label: "Premium Features", icon: StarIcon },
  { href: "/organizer/dashboard/reviews", label: "Reviews", icon: StarIcon },
  { href: "/organizer/dashboard/ai-assistant", label: "AI Assistant", icon: StarIcon, badge: "New" },
  { href: "/marketplace", label: "Marketplace", icon: StoreIcon },
];

const paymentsLinks: NavLink[] = [
  { href: "/organizer/dashboard/wallet", label: "Wallet", icon: WalletIcon },
  { href: "/organizer/dashboard/wallet/receipts", label: "Receipts", icon: ReceiptIcon },
];

const systemLinks: NavLink[] = [
  { href: "/organizer/dashboard/developer", label: "Developer", icon: SettingsIcon },
  { href: "/organizer/dashboard/subscription", label: "Subscription", icon: StarIcon },
  { href: "/organizer/dashboard/marketplace", label: "Marketplace Visibility", icon: StoreIcon },
  { href: "/organizer/dashboard/settings", label: "Settings", icon: SettingsIcon },
];

function NavItem({ link }: { link: NavLink }) {
  const sidebar = useSidebar();
  const collapsed = sidebar ? !sidebar.open : false;
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  const active = isActive(link.href, link.exact);

  return (
    <Link
      href={link.href}
      title={collapsed ? link.label : undefined}
      className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-150 min-h-[44px] ${
        collapsed ? "justify-center" : ""
      } ${
        active
          ? "bg-lime/15 text-white font-semibold"
          : "text-white/70 hover:bg-white/5 hover:text-white"
      }`}
    >
      {/* Active highlight bar */}
      {active && !collapsed && (
        <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-lime" />
      )}
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all ${
          active
            ? "bg-lime/20 text-lime"
            : "bg-white/5 text-white/50 group-hover:bg-white/10 group-hover:text-white"
        }`}
      >
        <link.icon className="h-4 w-4" />
      </span>

      {!collapsed && (
        <>
          <span className="flex-1 truncate">{link.label}</span>
          {link.badge && (
            <span className="rounded-full bg-lime/20 px-1.5 py-0.5 text-[10px] font-bold text-lime">
              {link.badge}
            </span>
          )}
        </>
      )}

      {/* Tooltip when collapsed */}
      {collapsed && (
        <span className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-xl bg-[#0D1821] border border-white/10 px-3 py-1.5 text-xs font-medium text-white shadow-xl group-hover:block z-50">
          {link.label}
        </span>
      )}
    </Link>
  );
}

function NavSection({ links, title, abbr }: { links: NavLink[]; title: string; abbr: string }) {
  const sidebar = useSidebar();
  const collapsed = sidebar ? !sidebar.open : false;

  return (
    <div suppressHydrationWarning>
      {collapsed ? (
        <div className="mb-2 flex justify-center">
          <div className="flex h-5 w-5 items-center justify-center rounded-md border border-white/10 text-[9px] font-bold text-white/40">
            {abbr}
          </div>
        </div>
      ) : (
        <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-widest text-white/40">
          {title}
        </p>
      )}
      <div className="flex flex-col gap-0.5">
        {links.map((link) => (
          <NavItem key={link.href} link={link} />
        ))}
      </div>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const sidebar = useSidebar();
  const collapsed = sidebar ? !sidebar.open : false;
  const mobileOpen = sidebar?.openMobile ?? false;

  React.useEffect(() => {
    sidebar?.setOpenMobile(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const navContent = (
    <nav id="main-navigation" className="flex flex-col gap-5" tabIndex={-1} suppressHydrationWarning>
      <NavSection links={mainLinks} title="Platform" abbr="P" />
      <NavSection links={paymentsLinks} title="Payments" abbr="$" />
      <NavSection links={systemLinks} title="System" abbr="S" />
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`fixed left-0 top-0 hidden h-screen shrink-0 flex-col bg-[#0D1821] border-r border-white/5 transition-all duration-200 ease-linear md:flex ${
          collapsed ? "w-16" : "w-64"
        }`}
        suppressHydrationWarning
      >
        {/* Header */}
        <div className={`flex items-center border-b border-white/5 px-4 py-4 ${collapsed ? "flex-col gap-2" : "gap-3"}`}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lime shadow-md">
            <svg viewBox="0 0 460 460" fill="currentColor" className="h-5 w-5 text-dark"><path d="M301.517,113.577c-23.541,4.649-43.755,20.214-60.514,46.74-3.625,5.757-11.983,6.098-16.078.682-24.138-32.368-51.431-48.574-81.965-48.574-27.08,0-50.237,10.661-69.555,31.942-19.276,21.109-28.956,45.375-28.956,72.882,0,26.44,8.657,49.043,25.971,67.935,17.314,18.636,39.831,27.933,67.551,27.933,16.888,0,31.857-3.539,44.949-10.661,12.41-7.079,21.962-15.608,28.615-25.63,5.971-9.297,13.988-26.398,23.967-51.218,16.419-40.855,32.07-66.357,46.91-76.549,7.762-5.373,15.822-9.339,24.18-11.941,4.478-1.407,7.548-5.459,7.548-10.15v-2.9c0-6.653-6.098-11.77-12.623-10.491ZM142.661,264.159c-29.17,0-52.796-23.626-52.796-52.796s23.626-52.753,52.796-52.753,52.753,23.626,52.753,52.753-23.626,52.796-52.753,52.796ZM391.585,177.333c-16.206-15.31-34.501-22.986-54.928-22.986-13.092,0-26.398,4.137-39.917,12.325-13.561,8.231-28.317,32.837-44.266,73.905-14.884,37.912-30.833,63.116-47.934,75.526-6.183,4.435-12.922,8.103-20.171,10.875-4.051,1.578-6.738,5.501-6.738,9.894,0,5.971,4.904,10.704,10.534,10.704.895,0,1.834-.128,2.729-.384,24.862-6.866,45.972-24.991,63.372-54.331,5.8-9.766,19.617-10.832,26.952-2.132,16.333,19.361,35.566,29.042,57.785,29.042,22.389,0,40.727-8.743,54.928-26.27,14.414-17.783,21.621-37.187,21.621-58.254,0-23.285-7.975-42.603-23.967-57.913Z" /></svg>
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white tracking-tight">Guestly</p>
              <p className="text-xs text-white/50">Organiser</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <div className={`flex-1 overflow-y-auto py-4 ${collapsed ? "px-2" : "px-3"}`}>
          {navContent}
        </div>

        {/* Footer: User info */}
        <div className="border-t border-white/5 px-3 py-3">
          {!collapsed ? (
            <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime/20 text-xs font-bold text-lime">
                O
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-white">My Organisation</p>
                <p className="text-xs text-white/50">Free plan</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lime/20 text-xs font-bold text-lime">
                O
              </span>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => sidebar?.setOpenMobile(false)} />
          <div className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col bg-[#0D1821] shadow-2xl md:hidden">
            <div className="flex h-16 items-center justify-between border-b border-white/5 px-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime">
                  <svg viewBox="0 0 460 460" fill="currentColor" className="h-5 w-5 text-[#0D1821]"><path d="M301.517,113.577c-23.541,4.649-43.755,20.214-60.514,46.74-3.625,5.757-11.983,6.098-16.078.682-24.138-32.368-51.431-48.574-81.965-48.574-27.08,0-50.237,10.661-69.555,31.942-19.276,21.109-28.956,45.375-28.956,72.882,0,26.44,8.657,49.043,25.971,67.935,17.314,18.636,39.831,27.933,67.551,27.933,16.888,0,31.857-3.539,44.949-10.661,12.41-7.079,21.962-15.608,28.615-25.63,5.971-9.297,13.988-26.398,23.967-51.218,16.419-40.855,32.07-66.357,46.91-76.549,7.762-5.373,15.822-9.339,24.18-11.941,4.478-1.407,7.548-5.459,7.548-10.15v-2.9c0-6.653-6.098-11.77-12.623-10.491ZM142.661,264.159c-29.17,0-52.796-23.626-52.796-52.796s23.626-52.753,52.796-52.753,52.753,23.626,52.753,52.753-23.626,52.796-52.753,52.796ZM391.585,177.333c-16.206-15.31-34.501-22.986-54.928-22.986-13.092,0-26.398,4.137-39.917,12.325-13.561,8.231-28.317,32.837-44.266,73.905-14.884,37.912-30.833,63.116-47.934,75.526-6.183,4.435-12.922,8.103-20.171,10.875-4.051,1.578-6.738,5.501-6.738,9.894,0,5.971,4.904,10.704,10.534,10.704.895,0,1.834-.128,2.729-.384,24.862-6.866,45.972-24.991,63.372-54.331,5.8-9.766,19.617-10.832,26.952-2.132,16.333,19.361,35.566,29.042,57.785,29.042,22.389,0,40.727-8.743,54.928-26.27,14.414-17.783,21.621-37.187,21.621-58.254,0-23.285-7.975-42.603-23.967-57.913Z" /></svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Guestly</p>
                  <p className="text-xs text-white/40">Organiser</p>
                </div>
              </div>
              <button
                onClick={() => sidebar?.setOpenMobile(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
              >
                <XIcon className="h-5 w-5 text-white/50" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-4">
              {navContent}
            </div>
            <div className="border-t border-white/5 px-2 py-2">
              <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime/20 text-xs font-bold text-lime">
                  O
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-white">My Organisation</p>
                  <p className="text-xs text-white/50">Free plan</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
