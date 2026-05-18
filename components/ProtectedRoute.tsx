"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface Props {
  children: React.ReactNode;
  allowRoles?: Array<"attendee" | "organiser" | "vendor" | "admin">;
}

export function ProtectedRoute({ children, allowRoles }: Props) {
  const router = useRouter();
  const [allowed, setAllowed] = React.useState(false);
  React.useEffect(() => {
    async function check() {
      const res = await fetch("/api/auth/me", { method: "GET", credentials: "include" });
      if (!res.ok) {
        if (allowRoles?.includes("admin")) router.replace("/admin/login");
        else if (allowRoles?.includes("vendor")) router.replace("/vendor/dashboard");
        else router.replace("/login");
        return;
      }
      const data = (await res.json()) as { ok: boolean; role?: "attendee" | "organiser" | "vendor" | "admin" };
      if (!data.ok) {
        if (allowRoles?.includes("admin")) router.replace("/admin/login");
        else if (allowRoles?.includes("vendor")) router.replace("/vendor/dashboard");
        else router.replace("/login");
        return;
      }
      if (allowRoles && data.role && !allowRoles.includes(data.role)) {
        if (data.role === "admin") router.replace("/admin");
        else if (data.role === "organiser") router.replace("/dashboard");
        else if (data.role === "vendor") router.replace("/vendor/dashboard");
        else router.replace("/attendee");
        return;
      }
      setAllowed(true);
    }
    check();
  }, [router, allowRoles]);
  if (!allowed) return null;
  return <>{children}</>;
}

export default ProtectedRoute;
