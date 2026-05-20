"use client";

import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-24">
      {/* 404 Graphic */}
      <div className="mb-8 text-center">
        <div className="relative mb-4">
          <span className="text-9xl font-black tracking-tighter text-slate-200 dark:text-slate-800">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-black tracking-tight text-lime">
              404
            </span>
          </div>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          Page Not Found
        </h1>
        <p className="mx-auto max-w-md text-lg text-slate-500 dark:text-slate-400">
          The event you&apos;re looking for might have ended, been moved, or
          never existed. Let&apos;s find you something amazing instead.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-lime px-6 py-3 font-semibold text-slate-900 transition-all hover:bg-lime-hover hover:-translate-y-0.5 active:translate-y-0"
        >
          <Home className="h-4 w-4" />
          Go Home
        </Link>
        <Link
          href="/explore"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 hover:-translate-y-0.5 active:translate-y-0 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-750"
        >
          <Search className="h-4 w-4" />
          Explore Events
        </Link>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-medium text-slate-500 transition-all hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>
      </div>

      {/* Helpful Links */}
      <div className="mt-12 rounded-2xl border border-slate-100 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
        <h3 className="mb-3 text-sm font-semibold text-slate-500 uppercase tracking-wide dark:text-slate-400">
          Popular Pages
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Link
            href="/near"
            className="rounded-lg bg-white p-3 text-center text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-lime/10 hover:text-lime dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-lime/20"
          >
            Events Near Me
          </Link>
          <Link
            href="/vendors"
            className="rounded-lg bg-white p-3 text-center text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-lime/10 hover:text-lime dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-lime/20"
          >
            Vendors
          </Link>
          <Link
            href="/wallet"
            className="rounded-lg bg-white p-3 text-center text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-lime/10 hover:text-lime dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-lime/20"
          >
            My Wallet
          </Link>
          <Link
            href="/support"
            className="rounded-lg bg-white p-3 text-center text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-lime/10 hover:text-lime dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-lime/20"
          >
            Support
          </Link>
        </div>
      </div>
    </div>
  );
}
