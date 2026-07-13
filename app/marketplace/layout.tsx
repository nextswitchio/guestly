"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [dashboardLink, setDashboardLink] = useState("/login");

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.ok && d.user?.role) {
          const role = d.user.role;
          if (role === "organiser" || role === "organizer") setDashboardLink("/organizer/dashboard");
          else if (role === "vendor") setDashboardLink("/vendor/dashboard");
          else if (role === "admin") setDashboardLink("/admin");
          else if (role === "affiliate") setDashboardLink("/affiliate/dashboard");
          else setDashboardLink("/attendee");
        }
      })
      .catch(() => {});
  }, []);

  const navLinks = [
    { href: "/marketplace", label: "Browse", exact: true },
    { href: "/marketplace/messages", label: "Messages", exact: false },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-50 bg-[#001c24] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/marketplace" className="flex items-center">
                <img src="/assets/logo.svg" alt="Guestly" className="h-6" />
              </Link>
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => {
                  const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                        isActive
                          ? "text-dark bg-lime"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={dashboardLink}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
        <div className="h-0.5 w-full bg-gradient-to-r from-lime/40 via-lime/20 to-transparent" />
      </header>
      <main>{children}</main>
    </div>
  );
}
