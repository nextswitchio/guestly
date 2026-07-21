"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { Shield, X, Eye, User, BarChart3, LogOut, Menu, Headset, Handshake, TrendingUp, DollarSign, Store, PanelLeft } from "lucide-react";
import NotificationBell from "@/components/notifications/NotificationBell";
import { clearAllCookies } from "@/lib/clearCookies";
import { SkipLinks } from "@/components/ui/SkipLinks";

const NAV_ITEMS = [
  { href: "/influencer/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/influencer/dashboard/profile", label: "Profile", icon: User },
  { href: "/influencer/dashboard/collaborations", label: "Collaborations", icon: Handshake },
  { href: "/influencer/dashboard/analytics", label: "Analytics", icon: TrendingUp },
  { href: "/influencer/dashboard/earnings", label: "Earnings", icon: DollarSign },
  { href: "/influencer/dashboard/marketplace", label: "Marketplace", icon: Store },
  { href: "/support", label: "Support", icon: Headset },
];

function InfluencerSidebar() {
  const pathname = usePathname();
  const sidebar = useSidebar();
  const open = sidebar?.open ?? false;
  const toggleSidebar = sidebar?.toggleSidebar ?? (() => {});
  const router = useRouter();

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md border border-gray-100 md:hidden"
      >
        <Menu className="h-5 w-5 text-dark" />
      </button>

      {open && <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={toggleSidebar} />}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-100 shadow-sm transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex h-16 items-center gap-2 px-6 border-b border-gray-100">
          <Link href="/" className="flex items-center">
            <img src="/assets/logo-dark.svg" alt="Guestly" className="h-6" />
          </Link>
          <span className="ml-2 rounded-full bg-lime/10 px-2.5 py-0.5 text-xs font-semibold text-dark">Influencer</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-lime/10 text-dark font-semibold"
                    : "text-gray-500 hover:bg-gray-50 hover:text-dark"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-100 p-3">
          <button
            onClick={() => { clearAllCookies(); router.push("/"); }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-dark transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

export default function InfluencerDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/influencer";

  if (isLanding) return <>{children}</>;

  return (
    <SidebarProvider>
      <InfluencerDashboardShell>{children}</InfluencerDashboardShell>
    </SidebarProvider>
  );
}

function InfluencerDashboardShell({ children }: { children: React.ReactNode }) {
  const sidebar = useSidebar();
  const collapsed = sidebar ? !sidebar.open : false;
  const [identityStatus, setIdentityStatus] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    fetch("/api/identity")
      .then((r) => r.json())
      .then((d) => {
        if (d.verification) {
          setIdentityStatus(d.verification.status);
          setShowBanner(d.verification.status !== "verified");
        }
      })
      .catch((err) => console.error("Failed to fetch identity status:", err));
  }, []);

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <SkipLinks />
      <InfluencerSidebar />
      <div className={`flex flex-1 flex-col min-w-0 transition-[margin,width] duration-300 ${collapsed ? "md:ml-16 md:w-[calc(100%-4rem)]" : "md:ml-64 md:w-[calc(100%-16rem)]"}`}>
        <header className="flex h-16 items-center justify-between gap-4 border-b border-gray-100 bg-white px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => sidebar?.setOpenMobile(true)} className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 md:hidden">
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold text-dark">Influencer Dashboard</h1>
          </div>
          <NotificationBell />
        </header>

        {showBanner && identityStatus !== "verified" && (
          <div className="mx-6 mt-4 flex items-center gap-3 rounded-xl bg-amber-50 border border-amber-200 px-5 py-3.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100">
              <Shield className="h-4 w-4 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-amber-800">
                {identityStatus === "pending" ? "Identity verification pending" : identityStatus === "rejected" ? "Identity verification rejected" : "Verify your identity"}
              </p>
              <p className="text-xs text-amber-600">Complete verification to build trust with organizers</p>
            </div>
            <button onClick={() => setShowBanner(false)} className="flex h-6 w-6 items-center justify-center rounded-md text-amber-500 hover:bg-amber-100">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <main id="main-content" tabIndex={-1} className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
