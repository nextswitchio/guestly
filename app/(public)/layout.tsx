"use client";
import React from "react";
import TopNav from "@/components/layout/TopNav";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <TopNav />
      <main className="flex-1">{children}</main>
      <Footer />
      <BottomNav />
    </div>
  );
}

