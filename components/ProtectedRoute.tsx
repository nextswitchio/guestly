"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";

interface Props {
  children: React.ReactNode;
  allowRoles?: Array<"attendee" | "organiser" | "organizer" | "vendor" | "admin" | "affiliate" | "influencer">;
}

export function ProtectedRoute({ children, allowRoles }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [allowed, setAllowed] = React.useState(false);
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    // Prevent running on auth pages to avoid loops
    const authPaths = ["/admin/login", "/admin/forgot-password", "/login", "/register"];
    if (authPaths.some(p => pathname.startsWith(p))) {
      setAllowed(true);
      setChecked(true);
      return;
    }

    async function check() {
      try {
        const res = await fetch("/api/auth/me", { method: "GET", credentials: "include", cache: "no-store" });
        if (!res.ok) {
          if (allowRoles?.includes("admin")) router.replace("/admin/login");
          else if (allowRoles?.includes("vendor")) router.replace("/vendor-auth/login");
          else router.replace("/login");
          return;
        }
        const data = (await res.json()) as { ok: boolean; role?: "attendee" | "organiser" | "organizer" | "vendor" | "admin" | "affiliate" };
        if (!data.ok) {
          if (allowRoles?.includes("admin")) router.replace("/admin/login");
          else if (allowRoles?.includes("vendor")) router.replace("/vendor-auth/login");
          else router.replace("/login");
          return;
        }
        if (allowRoles && data.role && !allowRoles.includes(data.role)) {
          let target = "/attendee";
          if (data.role === "admin") target = "/admin";
          else if (data.role === "organiser" || data.role === "organizer") target = "/organizer/dashboard";
          else if (data.role === "vendor") target = "/vendor/dashboard";
          // Avoid redirect loop if already on the target page
          if (pathname !== target) router.replace(target);
          else setAllowed(true);
          return;
        }
        setAllowed(true);
      } catch {
        // Network error - redirect to login
        if (allowRoles?.includes("admin")) router.replace("/admin/login");
        else router.replace("/login");
      } finally {
        setChecked(true);
      }
    }
    check();
  }, [router, allowRoles, pathname]);

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--surface-bg,#fff)]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-lime border-t-transparent" />
      </div>
    );
  }

  if (!allowed) return null;
  return <>{children}</>;
}

export default ProtectedRoute;
