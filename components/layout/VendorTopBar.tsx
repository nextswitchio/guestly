"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useSidebar, SidebarTrigger } from "@/components/ui/sidebar";
import NotificationBell from "@/components/notifications/NotificationBell";
import { clearAllCookies } from "@/lib/clearCookies";

export default function VendorTopBar() {
  const router = useRouter();
  const sidebar = useSidebar();
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [vendorName, setVendorName] = React.useState("Vendor");

  React.useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => setVendorName(d.user?.name || "Vendor")).catch(() => {});
  }, []);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    clearAllCookies();
    window.location.href = "/vendor-auth/login";
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-neutral-200">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 hidden md:flex z-50">
        <SidebarTrigger className="border border-neutral-200 bg-white shadow-sm" />
      </div>
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => sidebar?.setOpenMobile(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-sm font-bold text-neutral-900">Guestly</span>
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <NotificationBell />
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 transition-colors hover:bg-neutral-50"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-dark/10 text-xs font-bold text-dark">
                {vendorName.charAt(0).toUpperCase()}
              </span>
              <span className="hidden text-sm font-medium text-neutral-700 md:inline">{vendorName}</span>
              <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-neutral-200 bg-white shadow-lg z-50">
                  <div className="border-b border-neutral-100 p-3">
                    <p className="text-sm font-semibold text-neutral-900">{vendorName}</p>
                    <p className="text-xs text-neutral-500">Vendor Account</p>
                  </div>
                  <div className="p-2">
                    {[
                      { label: "Profile", href: "/vendor/profile" },
                      { label: "Subscription", href: "/vendor/subscription" },
                      { label: "Notifications", href: "/vendor/notifications" },
                    ].map(item => (
                      <button
                        key={item.href}
                        onClick={() => { setShowUserMenu(false); router.push(item.href); }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-neutral-100 p-2">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
