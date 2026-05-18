"use client";
import React from "react";
import { usePathname } from "next/navigation";
import TopNav from "@/components/layout/TopNav";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";

export default function OrganiserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/organiser";

  if (isLandingPage) {
    return (
      <div className="flex min-h-screen flex-col bg-[var(--surface-bg)]">
        <TopNav />
        <main className="flex-1">{children}</main>
        <Footer />
        <BottomNav />
      </div>
    );
  }

  // Dashboard layout will be handled separately or here if needed
  return <>{children}</>;
}
