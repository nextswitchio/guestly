"use client";
import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("No verification token found in the link.");
      return;
    }

    fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setStatus("success");
          setMessage("Your email has been verified successfully!");
        } else {
          setStatus("error");
          setMessage(data.error || data.message || "Verification failed. The link may have expired.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      });
  }, [searchParams]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="font-dm max-w-md mx-auto text-center"
    >
      {status === "verifying" && (
        <div>
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="animate-spin w-8 h-8 text-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
          <h1 className="text-2xl font-medium text-dark mb-2">Verifying your email...</h1>
        </div>
      )}

      {status === "success" && (
        <div>
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-medium text-dark mb-2">Email Verified!</h1>
          <p className="text-[#4B5563] text-sm mb-8">{message}</p>
          <button
            onClick={() => router.replace("/login")}
            className="w-full px-7 py-3.5 bg-[#012E3B] text-white rounded-lg font-medium hover:bg-[#012E3B]/90 transition-colors"
          >
            Continue to Login
          </button>
        </div>
      )}

      {status === "error" && (
        <div>
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-medium text-dark mb-2">Verification Failed</h1>
          <p className="text-[#4B5563] text-sm mb-8">{message}</p>
          <button
            onClick={() => router.replace("/login")}
            className="w-full px-7 py-3.5 bg-[#012E3B] text-white rounded-lg font-medium hover:bg-[#012E3B]/90 transition-colors"
          >
            Back to Login
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="font-dm max-w-md mx-auto text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="animate-spin w-8 h-8 text-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        </div>
        <h1 className="text-2xl font-medium text-dark mb-2">Loading...</h1>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
