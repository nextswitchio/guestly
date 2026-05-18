"use client";
import React from "react";
import DashboardTopBar from "@/components/layout/DashboardTopBar";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowRoles={["admin"]}>
      <SidebarProvider>
        <AdminShell>{children}</AdminShell>
      </SidebarProvider>
    </ProtectedRoute>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const sidebar = useSidebar();
  const collapsed = sidebar ? !sidebar.open : false;
  const offsets = collapsed ? "md:ml-16 md:w-[calc(100%-4rem)]" : "md:ml-64 md:w-[calc(100%-16rem)]";
  
  return (
    <div className="public-light min-h-screen bg-[var(--surface-bg)]">
      <AdminSidebar />
      <DashboardTopBar />
      <main className={`min-w-0 px-4 py-8 sm:px-6 lg:px-8 ${offsets} transition-all duration-300`}>
        {children}
      </main>
    </div>
  );
}
