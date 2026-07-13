"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function LayoutIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
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
function PackageIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
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
function SettingsIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
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
function XIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function MenuIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
function SearchIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function BellIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
function ChevronDownIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
function ShieldIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

type NavLink = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  badge?: string;
};

const mainLinks: NavLink[] = [
  { href: "/affiliate/dashboard", label: "Dashboard", icon: LayoutIcon, exact: true },
  { href: "/affiliate/dashboard/collaborations", label: "Collaborations", icon: UsersIcon, badge: "New" },
  { href: "/affiliate/dashboard/events", label: "Events", icon: CalendarIcon },
  { href: "/affiliate/dashboard/materials", label: "Promo Materials", icon: PackageIcon },
];
const analyticsLinks: NavLink[] = [
  { href: "/affiliate/dashboard/performance", label: "Performance", icon: BarChartIcon },
  { href: "/affiliate/dashboard/payouts", label: "Payouts", icon: WalletIcon },
];
const systemLinks: NavLink[] = [
  { href: "/affiliate/dashboard/settings", label: "Settings", icon: SettingsIcon },
];

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [identityStatus, setIdentityStatus] = React.useState<string | null>(null);
  const [showBanner, setShowBanner] = React.useState(false);
  const profileRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const offsets = collapsed ? "md:ml-16 md:w-[calc(100%-4rem)]" : "md:ml-64 md:w-[calc(100%-16rem)]";

  React.useEffect(() => {
    fetch('/api/identity')
      .then(r => r.json())
      .then(d => {
        if (d.verification) {
          setIdentityStatus(d.verification.status);
          setShowBanner(d.verification.status !== 'verified');
        } else {
          setShowBanner(true);
        }
      })
      .catch(() => setShowBanner(true));
  }, []);

  React.useEffect(() => {
    function handler(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [usePathname()]);

  return (
    <div className="public-light min-h-screen bg-neutral-50">
      {/* Desktop sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 hidden h-screen shrink-0 flex-col bg-neutral-900 border-r border-neutral-800 transition-all duration-200 ease-linear md:flex ${collapsed ? "w-16" : "w-64"}`}
      >
        <div className={`flex items-center border-b border-neutral-800 px-4 py-4 ${collapsed ? "flex-col gap-2" : "gap-3"}`}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lime shadow-md">
            <svg viewBox="0 0 460 460" fill="currentColor" className="h-5 w-5 text-dark"><path d="M301.517,113.577c-23.541,4.649-43.755,20.214-60.514,46.74-3.625,5.757-11.983,6.098-16.078.682-24.138-32.368-51.431-48.574-81.965-48.574-27.08,0-50.237,10.661-69.555,31.942-19.276,21.109-28.956,45.375-28.956,72.882,0,26.44,8.657,49.043,25.971,67.935,17.314,18.636,39.831,27.933,67.551,27.933,16.888,0,31.857-3.539,44.949-10.661,12.41-7.079,21.962-15.608,28.615-25.63,5.971-9.297,13.988-26.398,23.967-51.218,16.419-40.855,32.07-66.357,46.91-76.549,7.762-5.373,15.822-9.339,24.18-11.941,4.478-1.407,7.548-5.459,7.548-10.15v-2.9c0-6.653-6.098-11.77-12.623-10.491ZM142.661,264.159c-29.17,0-52.796-23.626-52.796-52.796s23.626-52.753,52.796-52.753,52.753,23.626,52.753,52.753-23.626,52.796-52.753,52.796ZM391.585,177.333c-16.206-15.31-34.501-22.986-54.928-22.986-13.092,0-26.398,4.137-39.917,12.325-13.561,8.231-28.317,32.837-44.266,73.905-14.884,37.912-30.833,63.116-47.934,75.526-6.183,4.435-12.922,8.103-20.171,10.875-4.051,1.578-6.738,5.501-6.738,9.894,0,5.971,4.904,10.704,10.534,10.704.895,0,1.834-.128,2.729-.384,24.862-6.866,45.972-24.991,63.372-54.331,5.8-9.766,19.617-10.832,26.952-2.132,16.333,19.361,35.566,29.042,57.785,29.042,22.389,0,40.727-8.743,54.928-26.27,14.414-17.783,21.621-37.187,21.621-58.254,0-23.285-7.975-42.603-23.967-57.913Z" /></svg>
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white tracking-tight">Guestly</p>
              <p className="text-xs text-neutral-400">Affiliate</p>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3">
          <nav className="flex flex-col gap-5">
            <NavSection links={mainLinks} title="Platform" abbr="P" collapsed={collapsed} />
            <NavSection links={analyticsLinks} title="Analytics" abbr="A" collapsed={collapsed} />
            <NavSection links={systemLinks} title="System" abbr="S" collapsed={collapsed} />
          </nav>
        </div>

        <div className="border-t border-neutral-800 px-3 py-3">
          {!collapsed ? (
            <div className="flex items-center gap-3 rounded-xl bg-neutral-800/50 px-3 py-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime/20 text-xs font-bold text-lime">A</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-white">Affiliate</p>
                <p className="text-xs text-neutral-400">Active</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lime/20 text-xs font-bold text-lime">A</span>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col bg-neutral-900 shadow-2xl md:hidden">
            <div className="flex h-16 items-center justify-between border-b border-neutral-800 px-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime"><svg viewBox="0 0 460 460" fill="currentColor" className="h-5 w-5 text-dark"><path d="M301.517,113.577c-23.541,4.649-43.755,20.214-60.514,46.74-3.625,5.757-11.983,6.098-16.078.682-24.138-32.368-51.431-48.574-81.965-48.574-27.08,0-50.237,10.661-69.555,31.942-19.276,21.109-28.956,45.375-28.956,72.882,0,26.44,8.657,49.043,25.971,67.935,17.314,18.636,39.831,27.933,67.551,27.933,16.888,0,31.857-3.539,44.949-10.661,12.41-7.079,21.962-15.608,28.615-25.63,5.971-9.297,13.988-26.398,23.967-51.218,16.419-40.855,32.07-66.357,46.91-76.549,7.762-5.373,15.822-9.339,24.18-11.941,4.478-1.407,7.548-5.459,7.548-10.15v-2.9c0-6.653-6.098-11.77-12.623-10.491ZM142.661,264.159c-29.17,0-52.796-23.626-52.796-52.796s23.626-52.753,52.796-52.753,52.753,23.626,52.753,52.753-23.626,52.796-52.753,52.796ZM391.585,177.333c-16.206-15.31-34.501-22.986-54.928-22.986-13.092,0-26.398,4.137-39.917,12.325-13.561,8.231-28.317,32.837-44.266,73.905-14.884,37.912-30.833,63.116-47.934,75.526-6.183,4.435-12.922,8.103-20.171,10.875-4.051,1.578-6.738,5.501-6.738,9.894,0,5.971,4.904,10.704,10.534,10.704.895,0,1.834-.128,2.729-.384,24.862-6.866,45.972-24.991,63.372-54.331,5.8-9.766,19.617-10.832,26.952-2.132,16.333,19.361,35.566,29.042,57.785,29.042,22.389,0,40.727-8.743,54.928-26.27,14.414-17.783,21.621-37.187,21.621-58.254,0-23.285-7.975-42.603-23.967-57.913Z" /></svg></div>
                <div>
                  <p className="text-sm font-bold text-white">Guestly</p>
                  <p className="text-xs text-neutral-400">Affiliate</p>
                </div>
              </div>
              <button onClick={() => setMobileOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-neutral-800 transition-colors">
                <XIcon className="h-5 w-5 text-neutral-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-4">
              <nav className="flex flex-col gap-5">
                <NavSection links={mainLinks} title="Platform" abbr="P" collapsed={false} />
                <NavSection links={analyticsLinks} title="Analytics" abbr="A" collapsed={false} />
                <NavSection links={systemLinks} title="System" abbr="S" collapsed={false} />
              </nav>
            </div>
            <div className="border-t border-neutral-800 px-4 py-3">
              <div className="flex items-center gap-3 rounded-xl bg-neutral-800/50 px-3 py-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lime/20 text-xs font-bold text-lime">A</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-white">Affiliate</p>
                  <p className="text-xs text-neutral-400">Active</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Top bar - starts beside sidebar on desktop */}
      <header className={`sticky top-0 z-30 w-full bg-white/95 backdrop-blur-sm border-b border-neutral-200 transition-[margin,width] duration-200 ease-linear ${offsets}`}>
        <div className="flex h-14 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 md:hidden">
              <MenuIcon />
            </button>
            <button onClick={() => setCollapsed(!collapsed)} className="hidden h-9 w-9 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 md:flex">
              <MenuIcon />
            </button>
            <span className="hidden text-sm font-semibold text-neutral-900 md:inline">Affiliate Portal</span>
          </div>

          <div className="hidden flex-1 justify-center md:flex">
            <div className="relative w-full max-w-sm">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                <SearchIcon />
              </span>
              <input
                ref={inputRef}
                placeholder="Search events or collaborations..."
                className="h-10 w-full rounded-full border border-neutral-200 bg-white pl-10 pr-14 text-sm text-neutral-900 shadow-sm outline-none transition focus:border-lime focus:ring-2 focus:ring-lime/20"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] font-medium text-neutral-500">
                ⌘ F
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative flex h-9 w-9 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700" aria-label="Notifications">
              <BellIcon />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-lime" />
            </button>
            <div ref={profileRef} className="relative hidden md:block">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-neutral-100"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-lime/20 text-xs font-bold text-lime">A</span>
                <ChevronDownIcon className={`h-3.5 w-3.5 text-neutral-500 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg">
                  <div className="border-b border-neutral-100 px-3 py-2">
                    <div className="text-sm font-medium text-neutral-900">Affiliate</div>
                    <div className="text-xs text-neutral-500">Active</div>
                  </div>
                  <Link href="/affiliate/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50" onClick={() => setProfileOpen(false)}>
                    Dashboard
                  </Link>
                  <Link href="/affiliate/dashboard/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50" onClick={() => setProfileOpen(false)}>
                    Settings
                  </Link>
                  <div className="border-t border-neutral-100">
                    <Link href="/" className="flex w-full items-center gap-2 px-3 py-2 text-sm text-amber-700 hover:bg-amber-50">
                      Log out
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Verification Banner */}
      {showBanner && (
        <div className={`sticky top-14 z-20 w-full transition-[margin,width] duration-200 ease-linear ${offsets}`}>
          <div className="flex items-center justify-between gap-4 bg-amber-50 border-b border-amber-200 px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                <ShieldIcon className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-800">
                  {identityStatus === 'pending' ? 'Identity verification pending' : identityStatus === 'rejected' ? 'Identity verification rejected' : 'Verify your identity'}
                </p>
                <p className="text-xs text-amber-600">
                  {identityStatus === 'pending' ? 'Your documents are under review' : identityStatus === 'rejected' ? 'Please resubmit your documents' : 'Complete verification to unlock higher commission rates'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link href="/affiliate/dashboard/settings" className="text-xs font-medium text-amber-700 hover:text-amber-900 underline">
                {identityStatus === 'rejected' ? 'Resubmit' : 'Verify now'}
              </Link>
              <button onClick={() => setShowBanner(false)} className="flex h-6 w-6 items-center justify-center rounded-md text-amber-500 hover:bg-amber-100">
                <XIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main id="main-content" className={`min-w-0 px-4 py-8 sm:px-6 lg:px-8 ${offsets} transition-all duration-200`} tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}

function NavSection({ links, title, abbr, collapsed }: { links: NavLink[]; title: string; abbr: string; collapsed: boolean }) {
  return (
    <div>
      {collapsed ? (
        <div className="mb-2 flex justify-center">
          <div className="flex h-5 w-5 items-center justify-center rounded-md border border-neutral-700 text-[9px] font-bold text-neutral-500">
            {abbr}
          </div>
        </div>
      ) : (
        <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
          {title}
        </p>
      )}
      <div className="flex flex-col gap-0.5">
        {links.map((link) => <NavItem key={link.href} link={link} collapsed={collapsed} />)}
      </div>
    </div>
  );
}

function NavItem({ link, collapsed }: { link: NavLink; collapsed: boolean }) {
  const pathname = usePathname();
  const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);

  return (
    <Link
      href={link.href}
      title={collapsed ? link.label : undefined}
      className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-150 min-h-[44px] ${collapsed ? "justify-center" : ""} ${
        active
          ? "bg-lime/10 text-lime font-semibold"
          : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
      }`}
    >
      {active && !collapsed && (
        <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-lime" />
      )}
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all ${
        active ? "bg-lime/20 text-lime" : "bg-neutral-800 text-neutral-500 group-hover:bg-neutral-700 group-hover:text-white"
      }`}>
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
      {collapsed && (
        <span className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-xl bg-neutral-800 border border-neutral-700 px-3 py-1.5 text-xs font-medium text-white shadow-xl group-hover:block z-50">
          {link.label}
        </span>
      )}
    </Link>
  );
}
