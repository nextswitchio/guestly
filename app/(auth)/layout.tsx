import React from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Left branding panel — hidden on mobile */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-neutral-900 p-10 lg:flex">
        {/* Gradient orbs */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-100 w-100 rounded-full bg-primary-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-primary-400/15 blur-3xl" />

        {/* Logo */}
        <Link href="/" className="relative z-10 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-sm font-bold text-white">
            G
          </div>
          <span className="text-lg font-bold tracking-tight text-white">Guestly</span>
        </Link>

        {/* Tagline */}
        <div className="relative z-10 max-w-sm">
          <h2 className="text-2xl font-bold leading-snug text-white">
            Discover &amp; organise unforgettable events across Africa
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            Buy tickets, save events, track your wallet — all in one place.
          </p>
        </div>

        <p className="relative z-10 text-xs text-neutral-500">
          &copy; {new Date().getFullYear()} Guestly
        </p>
      </div>

      {/* Right content panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-neutral-50 px-4 py-10">
        {/* Mobile logo */}
        <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-sm font-bold text-white">
            G
          </div>
          <span className="text-lg font-bold tracking-tight text-neutral-900">Guestly</span>
        </Link>

        <main className="w-full max-w-md rounded-2xl border border-neutral-100 bg-white p-8 shadow-xl ring-1 ring-neutral-900/5">
          {children}
        </main>
      </div>
    </div>
  );
}

