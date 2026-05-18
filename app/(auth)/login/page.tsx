"use client";
import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { SigninForm } from "@/components/auth/SignInForm";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  const handleLogin = async (data: { email: string; password: string }) => {
    setError("");
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
        return;
      }
      if (role === "organiser") {
        router.replace("/dashboard");
      } else {
        router.replace("/attendee");
      }
    } catch {
      setError("Something went wrong. Please try again.");
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
      <SigninForm onSubmit={handleLogin} />
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
