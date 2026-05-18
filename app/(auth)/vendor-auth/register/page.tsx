"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { SignupForm } from "@/components/auth/SignupForm";

export default function VendorRegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleRegister = async (data: any) => {
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          role: "vendor",
        }),
      });
      const result = await res.json();
      if (res.ok) {
        router.replace("/vendor-auth/login");
      } else {
        setError(result.error || "Registration failed. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <motion.div
      key="vendor-signup"
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
      <SignupForm onSubmit={handleRegister} loginHref="/vendor-auth/login" />
    </motion.div>
  );
}
