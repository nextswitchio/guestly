"use client";
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import TopNav from "@/components/layout/TopNav";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import { usePathname } from "next/navigation";

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const unprotected = pathname === "/vendor/login" || pathname === "/vendor/register";
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <TopNav />
      {unprotected ? (
        <main className="container flex-1 py-8">{children}</main>
      ) : (
        <ProtectedRoute allowRoles={["vendor"]}>
          <main className="container flex-1 py-8">{children}</main>
        </ProtectedRoute>
      )}
      <Footer />
      <BottomNav />
    </div>
  );
}
