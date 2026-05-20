"use client";
import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { SigninForm } from "@/components/auth/SignInForm";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data: { email: string; password: string }) => {
    setError("");
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
        setError(result.error || "Login failed. Please try again.");
        setLoading(false);
        return;
      }
      if (role === "organiser") {
        router.replace("/dashboard");
      } else {
        router.replace("/attendee");
      }
    } catch {
      setError("Something went wrong. Please try again.");
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
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--color-primary-500)] border-t-transparent" />
          <p className="mt-4 text-sm text-neutral-600">Signing you in...</p>
        </div>
      ) : (
        <SigninForm onSubmit={handleLogin} />
      )}
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
