"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/marketplace" className="text-xl font-bold text-neutral-900">
                Guestly
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href="/marketplace"
                  className={`text-sm font-medium transition-colors ${pathname === "/marketplace" ? "text-blue-600" : "text-neutral-600 hover:text-neutral-900"}`}
                >
                  Browse
                </Link>
                <Link
                  href="/marketplace/messages"
                  className={`text-sm font-medium transition-colors ${pathname.startsWith("/marketplace/messages") ? "text-blue-600" : "text-neutral-600 hover:text-neutral-900"}`}
                >
                  Messages
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/attendee/dashboard"
                className="text-sm text-neutral-600 hover:text-neutral-900"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
