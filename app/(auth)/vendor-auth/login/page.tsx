"use client";
import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { SigninForm } from "@/components/auth/SignInForm";
import { useToast } from "@/components/ui/ToastProvider";

function VendorLoginContent() {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data: { email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password, role: "vendor" }),
      });
      const result = await res.json();
      if (!res.ok || !result.ok) {
        addToast(result.error || "Login failed. Please try again.", { type: "error" });
        setLoading(false);
        return;
      }
      router.replace("/vendor/dashboard");
    } catch {
      addToast("Something went wrong. Please try again.", { type: "error" });
      setLoading(false);
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
      <SigninForm onSubmit={handleLogin} signupHref="/vendor-auth/register" loading={loading} />
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
