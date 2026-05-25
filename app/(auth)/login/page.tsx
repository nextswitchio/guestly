"use client";
import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { SigninForm } from "@/components/auth/SignInForm";
import { useToast } from "@/components/ui/ToastProvider";

function redirectForRole(role: string | undefined, router: ReturnType<typeof useRouter>) {
  if (role === "organiser" || role === "organizer") router.replace("/dashboard");
  else if (role === "vendor") router.replace("/vendor/dashboard");
  else if (role === "affiliate") router.replace("/affiliate/dashboard");
  else if (role === "admin") router.replace("/admin");
  else router.replace("/attendee");
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data: { email: string; password: string }) => {
    setLoading(true);
    const role = searchParams.get("role") || "attendee";
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password, role }),
      });
      const result = await res.json();
      if (!res.ok || !result.ok) {
        addToast(result.error || "Login failed. Please try again.", { type: "error" });
        setLoading(false);
        return;
      }
      redirectForRole(result.role, router);
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
