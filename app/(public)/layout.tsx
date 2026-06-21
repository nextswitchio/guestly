"use client";
import React from "react";
import TopNav from "@/components/layout/TopNav";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import SkipLinks from "@/components/ui/SkipLinks";
import "leaflet/dist/leaflet.css";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SkipLinks />
      <TopNav />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
