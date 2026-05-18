"use client";
import { useState, useEffect } from "react";
import VendorSidebar from "@/components/layout/VendorSidebar";
import VendorTopBar from "@/components/layout/VendorTopBar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import TopNav from "@/components/layout/TopNav";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/vendor";

  if (isLandingPage) {
    return (
      <div className="flex min-h-screen flex-col bg-dark">
        <TopNav />
        <main className="flex-1">{children}</main>
        <Footer />
        <BottomNav />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <VendorLayoutShell>{children}</VendorLayoutShell>
    </SidebarProvider>
  );
}

function VendorLayoutShell({ children }: { children: React.ReactNode }) {
  const sidebar = useSidebar();
  const collapsed = sidebar ? !sidebar.open : false;
  const [subscription, setSubscription] = useState<{ plan: string; expiresAt: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/vendor/subscription")
      .then(r => r.json())
      .then(d => { setSubscription(d.subscription || null); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const isPremium = subscription && subscription.expiresAt > Date.now();
  const daysRemaining = isPremium ? Math.ceil((subscription.expiresAt - Date.now()) / 86400000) : 0;

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <VendorSidebar />
      <div className={`public-light flex flex-1 flex-col min-w-0 transition-[margin,width] duration-300 ${collapsed ? 'md:ml-16 md:w-[calc(100%-4rem)]' : 'md:ml-64 md:w-[calc(100%-16rem)]'}`}>
        <VendorTopBar />
        {!loading && !isPremium && (
          <div className="mx-6 mt-4 flex items-center gap-3 rounded-xl bg-dark px-5 py-3.5 text-sm shadow-sm">
            <span className="flex-1 text-white/90">
              <span className="font-semibold text-white">Free plan.</span> Upgrade to unlock service profiles, featured placement, and advanced analytics.
            </span>
            <a href="/vendor/subscription" className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-lime px-4 py-2 text-xs font-bold text-dark hover:bg-lime-hover transition-colors">
              Upgrade
            </a>
          </div>
        )}
        {!loading && isPremium && daysRemaining <= 7 && (
          <div className="mx-6 mt-4 flex items-center gap-3 rounded-xl bg-dark px-5 py-3.5 text-sm shadow-sm">
            <span className="flex-1 text-white/90">
              <span className="font-semibold text-white">Premium plan.</span> {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} remaining.
            </span>
            <a href="/vendor/subscription" className="shrink-0 rounded-lg bg-white px-4 py-2 text-xs font-bold text-dark hover:bg-white/90 transition-colors">
              Renew
            </a>
          </div>
        )}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
