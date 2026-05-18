"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";

function LayoutDashboard({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  );
}
function MailIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" />
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
function PackageIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16.5 9.4 7.55 4.24" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.29 7 12 12 20.71 7" /><line x1="12" y1="22" x2="12" y2="12" />
    </svg>
  );
}
function CrownIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" /><path d="M3 20h18" />
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
function ShieldIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function LogoutIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
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

type NavLink = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
};

const mainLinks: NavLink[] = [
  { href: "/vendor/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/vendor/invitations", label: "Invitations", icon: MailIcon },
  { href: "/vendor/payments", label: "Payments", icon: WalletIcon },
  { href: "/vendor/service-profiles", label: "Service Profiles", icon: PackageIcon },
];

const systemLinks: NavLink[] = [
  { href: "/vendor/subscription", label: "Subscription", icon: CrownIcon },
  { href: "/vendor/identity", label: "Identity", icon: ShieldIcon },
  { href: "/vendor/profile", label: "Profile", icon: SettingsIcon },
];

export default function VendorSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const sidebar = useSidebar();
  const collapsed = sidebar ? !sidebar.open : false;
  const mobileOpen = sidebar?.openMobile ?? false;
  const [subscription, setSubscription] = useState<{ plan: string; expiresAt: number } | null>(null);

  useEffect(() => {
    fetch("/api/vendor/subscription")
      .then(r => r.json())
      .then(d => setSubscription(d.subscription || null))
      .catch(() => {});
  }, []);

  const isPremium = subscription && subscription.expiresAt > Date.now();

  React.useEffect(() => {
    sidebar?.setOpenMobile(false);
  }, [pathname, sidebar]);

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  function NavItem({ link }: { link: NavLink }) {
    const active = isActive(link.href, link.exact);
    return (
      <Link
        href={link.href}
        title={collapsed ? link.label : undefined}
        className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-150 min-h-[44px] ${
          collapsed ? "justify-center" : ""
        } ${
          active
            ? "bg-lime/15 text-white font-semibold"
            : "text-white/70 hover:bg-white/5 hover:text-white"
        }`}
      >
        {active && !collapsed && (
          <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-lime" />
        )}
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all ${
          active
            ? "bg-lime/20 text-lime"
            : "bg-white/5 text-white/50 group-hover:bg-white/10 group-hover:text-white"
        }`}>
          <link.icon className="h-4 w-4" />
        </span>
        {!collapsed && (
          <span className="flex-1 truncate">{link.label}</span>
        )}
      </Link>
    );
  }

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => sidebar?.setOpenMobile(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 flex h-full flex-col border-r border-white/5 bg-[#0D1821] transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className={`flex h-16 items-center border-b border-white/5 ${collapsed ? "justify-center px-0" : "px-4"}`}>
          <Link href="/vendor/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-sm font-black text-white">
              G
            </div>
            {!collapsed && <span className="text-base font-bold text-white">Guestly</span>}
          </Link>
        </div>

        {!collapsed && !isPremium && (
          <div className="mx-2 mt-3">
            <Link
              href="/vendor/subscription"
              className="flex items-center gap-2 rounded-lg bg-lime/10 border border-lime/20 px-3 py-2 text-xs text-lime hover:bg-lime/20 transition-colors"
            >
              <span className="flex-1 font-semibold text-white">Free plan</span>
              <span className="bg-dark text-white px-2 py-0.5 rounded text-[10px] font-bold">Upgrade</span>
            </Link>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-white/40">Vendor</p>
          {mainLinks.map((link) => <NavItem key={link.href} link={link} />)}
          {!collapsed && <div className="pt-3"><p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-white/40">Settings</p></div>}
          {systemLinks.map((link) => <NavItem key={link.href} link={link} />)}
        </nav>

        <div className="border-t border-white/5 p-2">
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              router.push("/");
            }}
            title={collapsed ? "Sign Out" : undefined}
            className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-150 min-h-[44px] w-full ${
              collapsed ? "justify-center" : ""
            } text-white/70 hover:bg-white/5 hover:text-white`}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/50 group-hover:bg-white/10 group-hover:text-white transition-all">
              <LogoutIcon className="h-4 w-4" />
            </span>
            {!collapsed && <span className="flex-1 truncate text-left">Sign Out</span>}
          </button>
        </div>

        {mobileOpen && (
          <button
            onClick={() => sidebar?.setOpenMobile(false)}
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg text-white/50 hover:bg-white/5 hover:text-white md:hidden"
          >
            <XIcon className="h-5 w-5" />
          </button>
        )}
      </aside>
    </>
  );
}
