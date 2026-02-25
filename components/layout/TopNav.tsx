"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Avatar from "@/components/ui/Avatar";

// ── Inline SVG icons ─────────────────────────────────────────────────────────

function SearchIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function BellIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
function MenuIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
function XIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function ChevronDownIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
function LogOutIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
function UserIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function WalletIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 10h20" />
    </svg>
  );
}

// ── Nav links ────────────────────────────────────────────────────────────────

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/search", label: "Search" },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [role, setRole] = React.useState<string | null>(null);
  const profileRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d?.ok) setRole(d.role); })
      .catch(() => { });
  }, []);

  React.useEffect(() => {
    function handler(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  React.useEffect(() => { setMobileOpen(false); }, [pathname]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setRole(null);
    setProfileOpen(false);
    router.replace("/login");
  }

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
        <div className="container flex h-14 items-center justify-between gap-4">
          {/* Left: Logo + Desktop links */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-xs font-bold text-white">G</div>
              <span className="text-base font-bold tracking-tight text-neutral-900">Guestly</span>
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              {publicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-3 py-1.5 text-sm transition-colors ${isActive(link.href)
                    ? "bg-primary-50 font-medium text-primary-700"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1">
            <Link
              href="/search"
              className="flex h-9 w-9 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 md:hidden"
              aria-label="Search"
            >
              <SearchIcon />
            </Link>
            <button
              className="relative flex h-9 w-9 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
              aria-label="Notifications"
            >
              <BellIcon />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary-500" />
            </button>

            {/* Desktop profile / auth */}
            {role ? (
              <div ref={profileRef} className="relative hidden md:block">
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-neutral-100"
                >
                  <Avatar name={role === "organiser" ? "Organiser" : role === "vendor" ? "Vendor" : "Attendee"} size={28} />
                  <ChevronDownIcon className={`h-3.5 w-3.5 text-neutral-500 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg">
                    <div className="border-b border-neutral-100 px-3 py-2">
                      <div className="text-sm font-medium text-neutral-900">{role === "organiser" ? "Organiser" : role === "vendor" ? "Vendor" : "Attendee"}</div>
                      <div className="text-xs text-neutral-500">Logged in</div>
                    </div>
                    <Link href={role === "organiser" ? "/dashboard" : role === "vendor" ? "/vendor/onboarding" : "/attendee"} className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50" onClick={() => setProfileOpen(false)}>
                      <UserIcon /> Dashboard
                    </Link>
                    <Link href="/wallet" className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50" onClick={() => setProfileOpen(false)}>
                      <WalletIcon /> Wallet
                    </Link>
                    <div className="border-t border-neutral-100">
                      <button onClick={handleLogout} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-warning-700 hover:bg-warning-50">
                        <LogOutIcon /> Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Link href="/login" className="rounded-md px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100">Log in</Link>
                <Link href="/register" className="rounded-md bg-primary-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-700">Sign up</Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="flex h-9 w-9 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100 md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide-out menu */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed right-0 top-0 z-50 flex h-full w-72 flex-col bg-white shadow-xl md:hidden">
            <div className="flex h-14 items-center justify-between border-b border-neutral-200 px-4">
              <span className="text-sm font-bold text-neutral-900">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-neutral-100">
                <XIcon className="h-5 w-5 text-neutral-600" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
              {publicLinks.map((link) => (
                <Link key={link.href} href={link.href} className={`rounded-md px-3 py-2.5 text-sm transition-colors ${isActive(link.href) ? "bg-primary-50 font-medium text-primary-700" : "text-neutral-700 hover:bg-neutral-100"}`}>{link.label}</Link>
              ))}
              <div className="my-2 border-t border-neutral-100" />
              {role ? (
                <>
                  <Link href={role === "organiser" ? "/dashboard" : role === "vendor" ? "/vendor/onboarding" : "/attendee"} className="rounded-md px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-100">Dashboard</Link>
                  <Link href="/wallet" className="rounded-md px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-100">Wallet</Link>
                  <button onClick={handleLogout} className="mt-auto rounded-md px-3 py-2.5 text-left text-sm text-warning-700 hover:bg-warning-50">Log out</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="rounded-md px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-100">Log in</Link>
                  <Link href="/register" className="rounded-md bg-primary-600 px-3 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700">Sign up</Link>
                </>
              )}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
