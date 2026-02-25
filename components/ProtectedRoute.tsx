"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface Props {
  children: React.ReactNode;
  allowRoles?: Array<"attendee" | "organiser" | "vendor">;
}

export default function ProtectedRoute({ children, allowRoles }: Props) {
  const router = useRouter();
  const [allowed, setAllowed] = React.useState(false);
  React.useEffect(() => {
    async function check() {
      const res = await fetch("/api/auth/me", { method: "GET", credentials: "include" });
      if (!res.ok) {
        router.replace("/login");
        return;
      }
      const data = (await res.json()) as { ok: boolean; role?: "attendee" | "organiser" | "vendor" };
      if (!data.ok) {
        router.replace("/login");
        return;
      }
      if (allowRoles && data.role && !allowRoles.includes(data.role)) {
        if (data.role === "organiser") router.replace("/dashboard");
        else if (data.role === "vendor") router.replace("/vendor/onboarding");
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
