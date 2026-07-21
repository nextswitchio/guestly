"use client";
import { useState, useEffect } from "react";
import VendorSidebar from "@/components/layout/VendorSidebar";
import VendorTopBar from "@/components/layout/VendorTopBar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import TopNav from "@/components/layout/TopNav";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { SkipLinks } from "@/components/ui/SkipLinks";
import { Shield, X } from "lucide-react";

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/vendor";
  const isOnboarding = pathname === "/vendor/onboarding";

  if (isLandingPage || isOnboarding) {
    return (
      <>{children}</>
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
  const [identityStatus, setIdentityStatus] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/vendor/subscription")
      .then(r => r.json())
      .then(d => { setSubscription(d.subscription || null); })
      .catch((err) => console.error("Failed to fetch vendor subscription:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch('/api/identity')
      .then(r => r.json())
      .then(d => {
        if (d.verification) {
          setIdentityStatus(d.verification.status);
          setShowBanner(d.verification.status !== 'verified');
        }
      })
      .catch((err) => console.error("Failed to fetch identity status:", err));
  }, []);

  const isPremium = subscription && subscription.expiresAt > Date.now();
  const daysRemaining = isPremium ? Math.ceil((subscription.expiresAt - Date.now()) / 86400000) : 0;

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <SkipLinks />
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
        {showBanner && identityStatus !== 'verified' && (
          <div className="mx-6 mt-4 flex items-center gap-3 rounded-xl bg-amber-50 border border-amber-200 px-5 py-3.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100">
              <Shield className="h-4 w-4 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-amber-800">
                {identityStatus === 'pending' ? 'Identity verification pending' : identityStatus === 'rejected' ? 'Identity verification rejected' : 'Verify your identity'}
              </p>
              <p className="text-xs text-amber-600">
                {identityStatus === 'pending' ? 'Your documents are under review' : identityStatus === 'rejected' ? 'Please resubmit your documents' : 'Complete verification to receive event invitations'}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link href="/vendor/identity" className="text-xs font-medium text-amber-700 hover:text-amber-900 underline">
                {identityStatus === 'rejected' ? 'Resubmit' : 'Verify now'}
              </Link>
              <button onClick={() => setShowBanner(false)} className="flex h-6 w-6 items-center justify-center rounded-md text-amber-500 hover:bg-amber-100">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
        <main id="main-content" tabIndex={-1} className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
