import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Avatar from "@/components/ui/Avatar";
import { useSidebar } from "@/components/ui/sidebar";

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
function ChevronDownIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function DashboardTopBar() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [role, setRole] = React.useState<string | null>(null);
  const profileRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const sidebar = useSidebar();
  const collapsed = sidebar ? !sidebar.open : false;
  const headerLayout = collapsed ? "md:ml-16 md:w-[calc(100%-4rem)]" : "md:ml-64 md:w-[calc(100%-16rem)]";

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { setRole(d?.ok ? d.role : null); })
      .catch(() => { });
  }, []);

  React.useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { setRole(d?.ok ? d.role : null); })
      .catch(() => { });
  }, [pathname]);

  React.useEffect(() => {
    function handler(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setRole(null);
    setProfileOpen(false);
    if (role === "vendor") router.replace("/");
    else router.replace("/login");
  }

  return (
    <header className={`sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm transition-[margin,width] duration-200 ease-linear ${headerLayout}`}>
      <div className="flex h-14 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-xl font-extrabold tracking-tight text-neutral-900">
            Sundays.
          </Link>
          <span className="hidden text-sm font-semibold text-neutral-900 md:inline">My Task</span>
        </div>

        <div className="hidden flex-1 justify-center md:flex">
          <div className="relative w-full max-w-xl">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              <SearchIcon />
            </span>
            <input
              ref={inputRef}
              placeholder="Search or type a command"
              className="h-10 w-full rounded-full border border-neutral-200 bg-white pl-10 pr-14 text-sm text-neutral-900 shadow-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-500/30"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] font-medium text-neutral-500">
              ⌘ F
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="relative flex h-9 w-9 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700" aria-label="Notifications">
            <BellIcon />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary-500" />
          </button>
          {role ? (
            <div ref={profileRef} className="relative hidden md:block">
              <button onClick={() => setProfileOpen((v) => !v)} className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-neutral-100">
                <Avatar name={role === "organiser" ? "Organiser" : role === "vendor" ? "Vendor" : "Attendee"} size={28} />
                <ChevronDownIcon className={`h-3.5 w-3.5 text-neutral-500 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg">
                  <div className="border-b border-neutral-100 px-3 py-2">
                    <div className="text-sm font-medium text-neutral-900">{role === "organiser" ? "Organiser" : role === "vendor" ? "Vendor" : "Attendee"}</div>
                    <div className="text-xs text-neutral-500">Logged in</div>
                  </div>
                  <Link href={role === "organiser" ? "/dashboard" : role === "vendor" ? "/vendor" : "/attendee"} className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50" onClick={() => setProfileOpen(false)}>
                    Dashboard
                  </Link>
                  <Link href="/wallet" className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50" onClick={() => setProfileOpen(false)}>
                    Wallet
                  </Link>
                  <div className="border-t border-neutral-100">
                    <button onClick={handleLogout} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-warning-700 hover:bg-warning-50">
                      Log out
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
        </div>
      </div>
      <div className="h-0.5 w-full bg-gradient-to-r from-primary-200 via-primary-100 to-transparent" />
    </header>
  );
}
