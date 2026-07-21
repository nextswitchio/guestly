"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { clearAllCookies } from "@/lib/clearCookies";

// ── Page title map ─────────────────────────────────────────────────────────
const PAGE_TITLES: Record<string, string> = {
  "/admin":               "Dashboard",
  "/admin/users":         "Users",
  "/admin/affiliates":    "Affiliates",
  "/admin/analytics":     "Analytics",
  "/admin/organizers":    "Organizers",
  "/admin/vendors":       "Vendors",
  "/admin/events":        "Events",
  "/admin/featured":      "Featured",
  "/admin/moderation":    "Moderation",
  "/admin/settlements":   "Settlements",
  "/admin/commissions":   "Commissions",
  "/admin/disputes":      "Disputes",
  "/admin/blog":          "Blog",
  "/admin/announcements": "Announcements",
  "/admin/notifications": "Notifications",
  "/admin/seo":           "SEO",
  "/admin/fraud":         "Fraud Detection",
  "/admin/audit-logs":    "Audit Logs",
  "/admin/support":       "Support",
  "/admin/api-keys":      "API Keys",
  "/admin/webhooks":      "Webhooks",
  "/admin/feature-flags": "Feature Flags",
  "/admin/cache":         "Cache",
  "/admin/settings":      "Settings",
};

function getPageTitle(pathname: string): string {
  // Exact match first
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  // Prefix match
  const match = Object.keys(PAGE_TITLES)
    .sort((a, b) => b.length - a.length)
    .find((key) => pathname.startsWith(key));
  return match ? PAGE_TITLES[match] : "Admin";
}

export default function AdminTopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [, setNotifOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [adminName, setAdminName] = React.useState("Administrator");
  const [openTickets, setOpenTickets] = React.useState(0);
  const profileRef = React.useRef<HTMLDivElement>(null);

  const pageTitle = getPageTitle(pathname);

  React.useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => {
        if (!r.ok) {
          // Token expired or invalid - redirect to login
          clearAllCookies();
          window.location.href = "/admin/login";
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (d?.ok && d.user?.display_name) setAdminName(d.user.display_name);
      })
      .catch(() => {
        // Network error - redirect to login
        clearAllCookies();
        window.location.href = "/admin/login";
      });
  }, []);

  React.useEffect(() => {
    fetch("/api/admin/support/tickets", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.data)) {
          const open = d.data.filter((t: { status?: string }) => t.status === "open").length;
          setOpenTickets(open);
        }
      })
      .catch(() => {});
  }, []);

  React.useEffect(() => {
    function handler(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    clearAllCookies();
    window.location.href = "/admin/login";
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-neutral-200 bg-white/95 backdrop-blur-sm px-4 sm:px-6">
      {/* Sidebar toggle */}
      <div className="relative -ml-2">
        <SidebarTrigger className="border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 shadow-sm" />
      </div>

      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-neutral-900 truncate">{pageTitle}</h1>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Link
          href="/admin/notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
          aria-label="Notifications"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          {openTickets > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {openTickets > 99 ? "99+" : openTickets}
            </span>
          )}
        </Link>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors hover:bg-neutral-100"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-lime/20 text-xs font-bold text-[#001c24]">
              {adminName.charAt(0).toUpperCase()}
            </span>
            <span className="hidden text-xs font-medium text-neutral-700 sm:block max-w-[120px] truncate">
              {adminName}
            </span>
            <svg className={`h-3.5 w-3.5 text-neutral-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-neutral-200 bg-white py-1 shadow-lg z-50">
              <div className="border-b border-neutral-100 px-3 py-2.5">
                <p className="text-xs font-semibold text-neutral-900">{adminName}</p>
                <p className="text-[11px] text-neutral-500">Administrator</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Sign Out
        </Link>
            </div>
          )}
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-lime/30 via-lime/20 to-transparent" />
    </header>
  );
}
