"use client";
import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { SigninForm } from "@/components/auth/SignInForm";
import { useToast } from "@/components/ui/ToastProvider";

function redirectForRole(role: string | undefined, redirectTo: string | null, router: ReturnType<typeof useRouter>) {
  if (redirectTo) {
    window.location.href = redirectTo;
    return;
  }
  if (role === "organiser" || role === "organizer") window.location.href = "/organizer/dashboard";
  else if (role === "vendor") window.location.href = "/vendor/dashboard";
  else if (role === "affiliate") window.location.href = "/affiliate/dashboard";
  else if (role === "admin") window.location.href = "/admin";
  else if (role === "attendee") window.location.href = "/attendee";
  else window.location.href = "/organizer/dashboard";
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data: { email: string; password: string }) => {
    setLoading(true);
    const urlRole = searchParams.get("role") || "attendee";
    const redirectTo = searchParams.get("redirect");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password, role: urlRole }),
      });
      const result = await res.json();
      if (!res.ok || !result.ok) {
        addToast(result.error || "Login failed. Please try again.", { type: "error" });
        setLoading(false);
        return;
      }
      redirectForRole(result.role || urlRole, redirectTo, router);
    } catch {
      addToast("Something went wrong. Please try again.", { type: "error" });
      setLoading(false);
    }
  };

  return (
    <motion.div
      key="signin"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <SigninForm onSubmit={handleLogin} loading={loading} />
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="w-full" />}>
      <LoginContent />
    </Suspense>
  );
}
