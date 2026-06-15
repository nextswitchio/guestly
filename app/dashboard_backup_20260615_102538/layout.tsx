"use client";
import React from "react";
import DashboardTopBar from "@/components/layout/DashboardTopBar";
import Sidebar from "@/components/layout/Sidebar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import SkipLinks from "@/components/ui/SkipLinks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, X } from "lucide-react";
import { CurrencyProvider } from "@/lib/currency";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <CurrencyProvider>
      <SidebarProvider>
        <SkipLinks />
        <DashboardShell>{children}</DashboardShell>
      </SidebarProvider>
    </CurrencyProvider>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const sidebar = useSidebar();
  const collapsed = sidebar ? !sidebar.open : false;
  const offsets = collapsed ? "md:ml-16 md:w-[calc(100%-4rem)]" : "md:ml-64 md:w-[calc(100%-16rem)]";
  const [subActive, setSubActive] = React.useState<boolean | null>(null);
  const [identityStatus, setIdentityStatus] = React.useState<string | null>(null);
  const [showBanner, setShowBanner] = React.useState(true);
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

  React.useEffect(() => {
    fetch('/api/identity')
      .then(r => r.json())
      .then(d => {
        if (d.verification) {
          setIdentityStatus(d.verification.status);
          setShowBanner(d.verification.status !== 'verified');
        }
      })
      .catch(() => {});
  }, []);
  
  return (
    <div className="public-light min-h-screen bg-neutral-50">
      <Sidebar />
      <DashboardTopBar />
      {subActive === false && pathname !== "/organizer/dashboard/subscription" && (
        <div className={`px-4 sm:px-6 lg:px-8 ${offsets} transition-all duration-300`}>
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-dark px-5 py-3.5 text-sm shadow-sm">
            <span className="flex-1 text-white/90">
              <span className="font-semibold text-white">Free plan.</span> Upgrade to unlock marketing tools, advanced analytics, and priority support.
            </span>
            <Link href="/organizer/dashboard/subscription" className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-lime px-4 py-2 text-xs font-bold text-dark hover:bg-lime-hover transition-colors">
              Upgrade
            </Link>
          </div>
        </div>
      )}
      {showBanner && identityStatus !== 'verified' && pathname !== "/organizer/dashboard/settings" && (
        <div className={`px-4 sm:px-6 lg:px-8 ${offsets} transition-all duration-300`}>
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-amber-50 border border-amber-200 px-5 py-3.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100">
              <Shield className="h-4 w-4 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-amber-800">
                {identityStatus === 'pending' ? 'Identity verification pending' : identityStatus === 'rejected' ? 'Identity verification rejected' : 'Verify your identity'}
              </p>
              <p className="text-xs text-amber-600">
                {identityStatus === 'pending' ? 'Your documents are under review' : identityStatus === 'rejected' ? 'Please resubmit your documents' : 'Complete verification to build trust with attendees'}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link href="/organizer/dashboard/settings" className="text-xs font-medium text-amber-700 hover:text-amber-900 underline">
                {identityStatus === 'rejected' ? 'Resubmit' : 'Verify now'}
              </Link>
              <button onClick={() => setShowBanner(false)} className="flex h-6 w-6 items-center justify-center rounded-md text-amber-500 hover:bg-amber-100">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
      <main id="main-content" className={`min-w-0 px-4 py-8 sm:px-6 lg:px-8 ${offsets} transition-all duration-300 text-neutral-900`} tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
