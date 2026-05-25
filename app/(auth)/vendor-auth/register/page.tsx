"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { SignupForm } from "@/components/auth/SignupForm";
import { useToast } from "@/components/ui/ToastProvider";

export default function VendorRegisterPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (data: any) => {
    setLoading(true);
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
        addToast(result.error || "Registration failed. Please try again.", { type: "error" });
        setLoading(false);
      }
    } catch {
      addToast("Something went wrong. Please try again.", { type: "error" });
      setLoading(false);
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
      <SignupForm onSubmit={handleRegister} loginHref="/vendor-auth/login" loading={loading} />
    </motion.div>
  );
}
