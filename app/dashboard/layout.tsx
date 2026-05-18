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
    <div className="public-light min-h-screen bg-neutral-50">
      <Sidebar />
      <DashboardTopBar />
      {subActive === false && pathname !== "/dashboard/subscription" && (
        <div className={`px-4 sm:px-6 lg:px-8 ${offsets} transition-all duration-300`}>
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-dark px-5 py-3.5 text-sm shadow-sm">
            <span className="flex-1 text-white/90">
              <span className="font-semibold text-white">Free plan.</span> Upgrade to unlock marketing tools, advanced analytics, and priority support.
            </span>
            <Link href="/dashboard/subscription" className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-lime px-4 py-2 text-xs font-bold text-dark hover:bg-lime-hover transition-colors">
              Upgrade
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
