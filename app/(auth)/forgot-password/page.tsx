"use client";
import React from "react";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "If that email exists, we'll send a reset link.");
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-neutral-900">Reset your password</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      {/* Error / Success */}
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-xs text-red-600">{error}</div>
      )}
      {message && (
        <div className="rounded-lg bg-success-50 px-4 py-3 text-xs text-success-700">{message}</div>
      )}

      {/* Form */}
      <form onSubmit={submit} className="flex flex-col gap-5">
        <Input
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          required
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Sending\u2026" : "Send Reset Link"}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-xs text-neutral-500">
        Remember your password?{" "}
        <Link href="/login" className="font-medium text-primary-600 hover:text-primary-700">
          Sign in
        </Link>
      </p>
    </div>
  );
}

