"use client";
import React from "react";
import { SidebarProvider, useSidebar, SidebarTrigger } from "@/components/ui/sidebar";
import AttendeeSidebar from "@/components/layout/AttendeeSidebar";
import { useRouter } from "next/navigation";

function AttendeeTopBar() {
  const sidebar = useSidebar();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-neutral-200">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 hidden md:flex z-50">
        <SidebarTrigger className="border border-neutral-200 bg-white shadow-sm" />
      </div>
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => sidebar?.setOpenMobile(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <img src="/assets/logo-dark.svg" alt="Guestly" className="h-4" />
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={() => router.push("/attendee/notifications")}
            className="relative h-8 w-8 rounded-lg text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 flex items-center justify-center transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

export default function AttendeeLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AttendeeLayoutInner>{children}</AttendeeLayoutInner>
    </SidebarProvider>
  );
}

function AttendeeLayoutInner({ children }: { children: React.ReactNode }) {
  const sidebar = useSidebar();
  const collapsed = sidebar ? !sidebar.open : false;

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <AttendeeSidebar />
      <div className={`public-light flex flex-1 flex-col min-w-0 transition-[margin,width] duration-300 ${collapsed ? 'md:ml-16 md:w-[calc(100%-4rem)]' : 'md:ml-64 md:w-[calc(100%-16rem)]'}`}>
        <AttendeeTopBar />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
