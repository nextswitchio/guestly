"use client";
import React from "react";
import DashboardTopBar from "@/components/layout/DashboardTopBar";
import Sidebar from "@/components/layout/Sidebar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardShell>{children}</DashboardShell>
    </SidebarProvider>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const sidebar = useSidebar();
  const collapsed = sidebar ? !sidebar.open : false;
  const offsets = collapsed ? "md:ml-16 md:w-[calc(100%-4rem)]" : "md:ml-64 md:w-[calc(100%-16rem)]";
  return (
    <div className="min-h-screen bg-neutral-50">
      <Sidebar />
      <DashboardTopBar />
      <main className={`min-w-0 px-4 py-6 sm:px-6 lg:px-8 ${offsets}`}>{children}</main>
    </div>
  );
}
