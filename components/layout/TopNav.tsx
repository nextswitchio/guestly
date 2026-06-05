"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LogOut, LayoutDashboard, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Button from "@/components/Button";
import { getImageSrc } from "@/utils/imageUtils";
import { clearAllCookies } from "@/lib/clearCookies";
import { MenuIcon } from "@/utils/icons";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Discover Events", href: "/explore" },
  { label: "Vendors", href: "/vendors" },
  { label: "Organisers", href: "/organisers" },
  { label: "Affiliate", href: "/affiliates" },
  { label: "Guestly Journal", href: "/blog" },
];

type UserInfo = {
  id: string;
  email: string;
  display_name?: string;
  avatar?: string;
  role: string;
};

export default function TopNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.ok && d.user) {
          setUser(d.user);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {}
    clearAllCookies();
    setUser(null);
    window.location.href = "/login";
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    switch (user.role) {
      case "admin": return "/admin";
      case "organiser": return "/dashboard";
      case "vendor": return "/vendor/dashboard";
      case "affiliate": return "/affiliate/dashboard";
      default: return "/attendee";
    }
  };

  const getProfileLink = () => {
    if (!user) return "/";
    switch (user.role) {
      case "admin": return "/admin/profile";
      case "vendor": return "/vendor/profile";
      case "affiliate": return "/affiliate/profile";
      default: return "/attendee/profile";
    }
  };

  const isActive = (href: string) => {
    if (!mounted) return false;
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const initials = user?.display_name
    ? user.display_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || "U";

  const avatarUrl = user?.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"}${user.avatar}`
    : null;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 w-full z-50 bg-dark/40 backdrop-blur-sm border-b border-[#0873AB] py-6"
    >
      <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="flex items-center gap-1">
              <img src={getImageSrc("logo.svg")} alt="" className="w-32" />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => {
              const active = isActive(link.href);
              return (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index + 0.3 }}
                >
                  <Link
                    href={link.href}
                    className={`text-xl transition-colors relative group ${
                      active ? "text-[#D4FF00]" : "text-white"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-[#D4FF00] transition-all duration-300 w-0 group-hover:w-full`}
                    />
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="h-10 w-24 animate-pulse rounded-lg bg-white/10" />
            ) : user ? (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 rounded-full bg-white/10 p-1 pr-3 hover:bg-white/20 transition-colors"
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-[#D4FF00] flex items-center justify-center text-dark text-xs font-bold">
                      {initials}
                    </div>
                  )}
                  <span className="text-sm font-medium text-white">{user.display_name || user.email}</span>
                  <svg className={`w-4 h-4 text-white transition-transform ${showDropdown ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-slate-100 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-900 truncate">{user.display_name || "User"}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href={getDashboardLink()}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          <LayoutDashboard size={16} />
                          Dashboard
                        </Link>
                        <Link
                          href={getProfileLink()}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          <User size={16} />
                          Profile
                        </Link>
                      </div>
                      <div className="border-t border-slate-100 py-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    onClick={() => router.push("/signup")}
                    variant="primary"
                  >
                    Sign Up
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button variant="white" onClick={() => router.push("/login")}>
                    Sign In
                  </Button>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white cursor-pointer"
          >
            {isOpen ? <X size={24} /> : <MenuIcon />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#0B1D2E]/95 backdrop-blur-lg border-t border-white/5 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link, index) => {
                const active = isActive(link.href);
                return (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                  >
                    <Link
                      href={link.href}
                      className={`block text-lg font-medium ${
                        active
                          ? "text-[#D4FF00]"
                          : "text-gray-300 hover:text-white"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}

              {loading ? (
                <div className="h-10 w-full animate-pulse rounded-lg bg-white/10" />
              ) : user ? (
                <div className="space-y-3 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-3 px-2 py-2">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-[#D4FF00] flex items-center justify-center text-dark text-sm font-bold">
                        {initials}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-white">{user.display_name || "User"}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href={getDashboardLink()}
                    className="block w-full rounded-lg bg-[#D4FF00] text-dark font-medium py-2.5 text-center text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href={getProfileLink()}
                    className="block w-full rounded-lg border border-white/20 text-white font-medium py-2.5 text-center text-sm hover:bg-white/10"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="block w-full rounded-lg border border-red-500/30 text-red-400 font-medium py-2.5 text-center text-sm hover:bg-red-500/10"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-3 pt-4">
                  <Button onClick={() => router.push("/signup")}>
                    Sign Up
                  </Button>
                  <Button
                    onClick={() => router.push("/login")}
                    variant="white"
                  >
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
