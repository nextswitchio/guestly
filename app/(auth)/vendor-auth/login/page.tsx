"use client";
import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { SigninForm } from "@/components/auth/SignInForm";

function VendorLoginContent() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleLogin = async (data: { email: string; password: string }) => {
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password, role: "vendor" }),
      });
      const result = await res.json();
      if (!res.ok || !result.ok) {
        setError(result.error || "Login failed. Please try again.");
        return;
      }
      router.replace("/vendor/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <motion.div
      key="vendor-signin"
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
      <SigninForm onSubmit={handleLogin} signupHref="/vendor-auth/register" />
    </motion.div>
  );
}

export default function VendorLoginPage() {
  return (
    <Suspense fallback={<div className="w-full" />}>
      <VendorLoginContent />
    </Suspense>
  );
}
