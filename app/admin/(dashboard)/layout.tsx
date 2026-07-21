"use client";
import React from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminTopBar from "@/components/layout/AdminTopBar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { CurrencyProvider } from "@/lib/currency";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import SkipLinks from "@/components/ui/SkipLinks";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowRoles={["admin"]}>
      <CurrencyProvider>
        <SidebarProvider>
          <SkipLinks />
          <AdminShell>{children}</AdminShell>
        </SidebarProvider>
      </CurrencyProvider>
    </ProtectedRoute>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const sidebar = useSidebar();
  const collapsed = sidebar ? !sidebar.open : false;
  const offsets = collapsed
    ? "md:ml-16 md:w-[calc(100%-4rem)]"
    : "md:ml-64 md:w-[calc(100%-16rem)]";

  return (
    <div className="public-light min-h-screen bg-neutral-50">
      <AdminSidebar />
      <div className={`${offsets} transition-all duration-200 ease-linear`}>
        <AdminTopBar />
        <main id="main-content" tabIndex={-1} className="min-w-0 px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
