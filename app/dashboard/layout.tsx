"use client";
import React from "react";
import DashboardTopBar from "@/components/layout/DashboardTopBar";
import Sidebar from "@/components/layout/Sidebar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import SkipLinks from "@/components/ui/SkipLinks";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SkipLinks />
      <DashboardShell>{children}</DashboardShell>
    </SidebarProvider>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const sidebar = useSidebar();
  const collapsed = sidebar ? !sidebar.open : false;
  const offsets = collapsed ? "md:ml-16 md:w-[calc(100%-4rem)]" : "md:ml-64 md:w-[calc(100%-16rem)]";
  const [subActive, setSubActive] = React.useState<boolean | null>(null);
  const pathname = usePathname();

  React.useEffect(() => {
    fetch("/api/organiser/subscription")
      .then((r) => r.json())
      .then((d) => {
        const active = d?.subscription && d.subscription.expiresAt > Date.now();
        setSubActive(!!active);
      })
      .catch(() => setSubActive(null));
  }, []);
  
  return (
    <div className="public-light min-h-screen bg-[var(--surface-bg)]">
      <Sidebar />
      <DashboardTopBar />
      {subActive === false && pathname !== "/dashboard/subscription" && (
        <div className={`px-4 sm:px-6 lg:px-8 ${offsets} transition-all duration-300`}>
          <div className="mb-4 flex items-center justify-between gap-4 rounded-xl border border-warning-200 bg-warning-50 px-4 py-3 text-sm text-warning-800 shadow-sm dark:border-warning-800 dark:bg-warning-900/20 dark:text-warning-200">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-medium">Your organiser account is inactive. Activate a subscription to continue using all features.</span>
            </div>
            <Link 
              href="/dashboard/subscription" 
              className="shrink-0 rounded-lg border border-warning-300 bg-white px-4 py-2 text-sm font-semibold text-warning-800 transition-all hover:bg-warning-100 hover:shadow-md dark:bg-warning-900 dark:border-warning-700 dark:text-warning-200 dark:hover:bg-warning-800"
            >
              Activate Now
            </Link>
          </div>
        </div>
      )}
      <main id="main-content" className={`min-w-0 px-4 py-8 sm:px-6 lg:px-8 ${offsets} transition-all duration-300`} tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
