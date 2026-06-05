"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import { clearAllCookies } from "@/lib/clearCookies";

// ── Icons ─────────────────────────────────────────────────────────────────
const icons = {
  layout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
    </svg>
  ),
   barChart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>
    </svg>
  ),
  activity: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  wallet: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/>
    </svg>
  ),
  creditCard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  alertTriangle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><circle cx="12" cy="17" r="1"/>
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  megaphone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11v3a1 1 0 0 0 1 1h1l4 4V7L5 11H4a1 1 0 0 0-1 1z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M18.37 5.63a10 10 0 0 1 0 12.74"/>
    </svg>
  ),
  fileText: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  lifeBuoy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/>
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  blog: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  key: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
    </svg>
  ),
  webhook: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2"/><path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06"/><path d="m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8"/>
    </svg>
  ),
  flag: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>
    </svg>
  ),
  database: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
    </svg>
  ),
  building: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M8 10h.01M16 10h.01M12 14h.01M8 14h.01M16 14h.01"/>
    </svg>
  ),
  package: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/>
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
};

function Icon({ name, className = "h-4 w-4" }: { name: keyof typeof icons; className?: string }) {
  return <span className={className}>{icons[name]}</span>;
}

// ── Nav config ─────────────────────────────────────────────────────────────
type NavItem = {
  href: string;
  label: string;
  icon: keyof typeof icons;
  exact?: boolean;
  badge?: string;
};

type NavSection = {
  title: string;
  abbr: string;
  items: NavItem[];
};

const NAV: NavSection[] = [
  {
    title: "Overview",
    abbr: "O",
    items: [
      { href: "/admin", label: "Dashboard", icon: "layout", exact: true },
      { href: "/admin/analytics", label: "Analytics", icon: "barChart" },
    ],
  },
    {
      title: "Users",
      abbr: "U",
      items: [
        { href: "/admin/users", label: "Users", icon: "users" },
        { href: "/admin/affiliates", label: "Affiliates", icon: "megaphone" },
        { href: "/admin/organizers", label: "Organizers", icon: "building" },
        { href: "/admin/vendors", label: "Vendors", icon: "package" },
        { href: "/admin/vendor-categories", label: "Vendor Categories", icon: "package" },
        { href: "/admin/vendor-subscriptions", label: "Vendor Subscriptions", icon: "creditCard" },
      ],
    },
  {
    title: "Events",
    abbr: "E",
    items: [
      { href: "/admin/events", label: "Events", icon: "calendar" },
      { href: "/admin/event-categories", label: "Event Categories", icon: "star" },
      { href: "/admin/geography", label: "Geography", icon: "flag" },
      { href: "/admin/featured", label: "Featured", icon: "star" },
      { href: "/admin/moderation", label: "Moderation", icon: "shield" },
    ],
  },
  {
    title: "Finance",
    abbr: "$",
    items: [
      { href: "/admin/settlements", label: "Settlements", icon: "wallet" },
      { href: "/admin/commissions", label: "Commissions", icon: "creditCard" },
      { href: "/admin/revenue", label: "Revenue", icon: "barChart" },
      { href: "/admin/disputes", label: "Disputes", icon: "alertTriangle" },
    ],
  },
  {
    title: "Content",
    abbr: "C",
    items: [
      { href: "/admin/blog", label: "Blog", icon: "blog" },
      { href: "/admin/blog/categories", label: "Blog Categories", icon: "package" },
      { href: "/admin/announcements", label: "Announcements", icon: "megaphone" },
      { href: "/admin/notifications", label: "Notifications", icon: "bell" },
      { href: "/admin/seo", label: "SEO", icon: "search" },
    ],
  },
  {
    title: "Security",
    abbr: "S",
    items: [
      { href: "/admin/fraud", label: "Fraud Detection", icon: "shield" },
      { href: "/admin/identity", label: "Identity Review", icon: "shield" },
      { href: "/admin/audit-logs", label: "Audit Logs", icon: "fileText" },
      { href: "/admin/support", label: "Support", icon: "lifeBuoy" },
    ],
  },
  {
    title: "Developer",
    abbr: "D",
    items: [
      { href: "/admin/api-keys", label: "API Keys", icon: "key" },
      { href: "/admin/webhooks", label: "Webhooks", icon: "webhook" },
      { href: "/admin/feature-flags", label: "Feature Flags", icon: "flag" },
      { href: "/admin/cache", label: "Cache", icon: "database" },
    ],
  },
  {
    title: "System",
    abbr: "SY",
    items: [
      { href: "/admin/monitoring", label: "Monitoring", icon: "activity" },
      { href: "/admin/settings", label: "Settings", icon: "settings" },
    ],
  },
];

// ── Component ──────────────────────────────────────────────────────────────
export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const sidebar = useSidebar();
  const [isHydrated, setIsHydrated] = React.useState(false);
  const collapsed = sidebar ? !sidebar.open : false;
  const mobileOpen = sidebar?.openMobile ?? false;
  const setOpenMobile = sidebar?.setOpenMobile;

  React.useEffect(() => {
    const timer = setTimeout(() => setIsHydrated(true), 0);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    setOpenMobile?.(false);
  }, [pathname, setOpenMobile]);

  function isActive(href: string, exact?: boolean) {
    const currentPath = pathname !== "/" ? pathname.replace(/\/+$/, "") : pathname;
    const targetPath = href !== "/" ? href.replace(/\/+$/, "") : href;
    if (exact) return currentPath === targetPath;
    return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
  }

  function NavLink({ item }: { item: NavItem }) {
    const active = isActive(item.href, item.exact);
    return (
      <Link
        href={item.href}
        title={collapsed ? item.label : undefined}
        className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-150 min-h-[44px] ${
          collapsed ? "justify-center" : ""
        } ${
          active
            ? "bg-lime/15 text-white font-semibold"
            : "text-white/60 hover:bg-white/5 hover:text-white"
        }`}
      >
        {/* Active left bar */}
        {active && !collapsed && (
          <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-lime" />
        )}

        {/* Icon */}
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all [&>span]:flex [&>span]:items-center [&>span]:justify-center ${
          active
            ? "bg-lime/20 text-lime"
            : "bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white"
        }`}>
          <Icon name={item.icon} className="h-4 w-4" />
        </span>

        {!collapsed && (
          <>
            <span className="flex-1 truncate">{item.label}</span>
            {item.badge && (
              <span className="rounded-full bg-lime/20 px-1.5 py-0.5 text-[10px] font-bold text-lime">
                {item.badge}
              </span>
            )}
          </>
        )}

        {/* Tooltip when collapsed */}
        {collapsed && (
          <span className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-xl bg-[#001c24] border border-white/10 px-3 py-1.5 text-xs font-medium text-white shadow-xl group-hover:block z-50">
            {item.label}
          </span>
        )}
      </Link>
    );
  }

  const navContent = (
    <nav className="flex flex-col gap-4">
      {NAV.map((section) => (
        <div key={section.title}>
          {collapsed ? (
            <div className="mb-1.5 flex justify-center">
              <div className="flex h-5 w-5 items-center justify-center rounded-md border border-white/10 text-[9px] font-bold text-white/30">
                {section.abbr}
              </div>
            </div>
          ) : (
            <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-white/30">
              {section.title}
            </p>
          )}
          <div className="flex flex-col gap-0.5">
            {section.items.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );

  const navPlaceholder = (
    <nav className="flex flex-col gap-4" aria-hidden="true">
      {Array.from({ length: 7 }).map((_, sectionIndex) => (
        <div key={`nav-placeholder-${sectionIndex}`}>
          {collapsed ? (
            <div className="mb-1.5 flex justify-center">
              <div className="h-5 w-5 rounded-md bg-white/5" />
            </div>
          ) : (
            <div className="mb-2 ml-3 h-2 w-16 rounded bg-white/5" />
          )}
          <div className="flex flex-col gap-1">
            {Array.from({ length: sectionIndex === 0 ? 2 : sectionIndex === 6 ? 1 : 3 }).map((_, itemIndex) => (
              <div
                key={`nav-placeholder-${sectionIndex}-${itemIndex}`}
                className={`min-h-[44px] rounded-xl bg-white/[0.03] ${collapsed ? "mx-auto w-11" : "w-full"}`}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );

  const sidebarContent = (
    <>
      {/* Header */}
      <div className={`flex items-center border-b border-white/5 px-4 py-4 ${collapsed ? "flex-col gap-2" : "gap-3"}`}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lime text-sm font-black text-[#001c24] shadow-md">
          G
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-white tracking-tight">Guestly Admin</p>
            <p className="text-xs text-white/40">Control Panel</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className={`flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 ${collapsed ? "px-2" : "px-3"}`}>
        {isHydrated ? navContent : navPlaceholder}
      </div>

      {/* Footer */}
      <div className="border-t border-white/5 px-2 py-2 space-y-0.5">
        {/* Sign out */}
        <button
          onClick={async () => {
            try {
              await fetch("/api/auth/logout", { method: "POST" });
            } catch {}
            clearAllCookies();
            window.location.href = "/admin/login";
          }}
          title={collapsed ? "Sign Out" : undefined}
          className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-150 min-h-[44px] text-white/60 hover:bg-white/5 hover:text-white ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white transition-all">
            <Icon name="logout" className="h-4 w-4" />
          </span>
          {!collapsed && <span className="flex-1 truncate text-left">Sign Out</span>}
          {collapsed && (
            <span className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-xl bg-[#001c24] border border-white/10 px-3 py-1.5 text-xs font-medium text-white shadow-xl group-hover:block z-50">
              Sign Out
            </span>
          )}
        </button>

        {/* Admin badge */}
        {!collapsed && (
          <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5 mt-1">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime/20 text-xs font-bold text-lime">A</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">Administrator</p>
              <p className="text-xs text-white/40">Active Session</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center pt-1">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lime/20 text-xs font-bold text-lime">A</span>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`fixed left-0 top-0 hidden h-screen shrink-0 flex-col bg-[#001c24] border-r border-white/5 transition-all duration-200 ease-linear md:flex ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => sidebar?.setOpenMobile(false)}
          />
          <div className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col bg-[#001c24] border-r border-white/5 shadow-2xl md:hidden">
            <div className="flex h-16 items-center justify-between border-b border-white/5 px-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime text-sm font-black text-[#001c24]">G</div>
                <div>
                  <p className="text-sm font-bold text-white">Guestly Admin</p>
                  <p className="text-xs text-white/40">Control Panel</p>
                </div>
              </div>
              <button
                onClick={() => sidebar?.setOpenMobile(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
              >
                <Icon name="x" className="h-5 w-5 text-white/50" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-4">
              {navContent}
            </div>
            <div className="border-t border-white/5 px-3 py-3">
              <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lime/20 text-xs font-bold text-lime">A</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-white">Administrator</p>
                  <p className="text-xs text-white/40">Active Session</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
