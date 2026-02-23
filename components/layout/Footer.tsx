import React from "react";
import Link from "next/link";

const footerLinks = {
  discover: [
    { href: "/explore", label: "Explore Events" },
    { href: "/search", label: "Search" },
    { href: "/city/Lagos", label: "Events in Lagos" },
    { href: "/city/Abuja", label: "Events in Abuja" },
    { href: "/city/Accra", label: "Events in Accra" },
    { href: "/city/Nairobi", label: "Events in Nairobi" },
  ],
  organise: [
    { href: "/dashboard", label: "Organiser Dashboard" },
    { href: "/dashboard/events/new", label: "Create Event" },
    { href: "/dashboard/analytics", label: "Analytics" },
    { href: "/dashboard/merch", label: "Merchandise" },
  ],
  account: [
    { href: "/login", label: "Log in" },
    { href: "/register", label: "Sign up" },
    { href: "/wallet", label: "Wallet" },
    { href: "/wallet/savings", label: "Event Savings" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="container py-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-xs font-bold text-white">G</div>
              <span className="text-base font-bold tracking-tight text-neutral-900">Guestly</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-neutral-500">
              Discover, attend, and organise unforgettable events across Africa.
            </p>
          </div>

          {/* Discover */}
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">Discover</div>
            <ul className="flex flex-col gap-2">
              {footerLinks.discover.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-neutral-600 transition-colors hover:text-neutral-900">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Organise */}
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">Organise</div>
            <ul className="flex flex-col gap-2">
              {footerLinks.organise.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-neutral-600 transition-colors hover:text-neutral-900">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">Account</div>
            <ul className="flex flex-col gap-2">
              {footerLinks.account.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-neutral-600 transition-colors hover:text-neutral-900">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-neutral-100 pt-6 sm:flex-row">
          <div className="text-xs text-neutral-400">&copy; {new Date().getFullYear()} Guestly. All rights reserved.</div>
          <div className="flex gap-4">
            <Link href="#" className="text-xs text-neutral-400 hover:text-neutral-600">Privacy</Link>
            <Link href="#" className="text-xs text-neutral-400 hover:text-neutral-600">Terms</Link>
            <Link href="#" className="text-xs text-neutral-400 hover:text-neutral-600">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
