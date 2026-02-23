"use client";
import React from "react";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function VerifyEmailPage() {
  const [token, setToken] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Your email has been verified!");
      } else {
        setError(data.error || "Invalid or expired token.");
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
            <path d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-neutral-900">Verify your email</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Enter the verification token we sent to your inbox
        </p>
      </div>

      {/* Error / Success */}
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-xs text-red-600">{error}</div>
      )}
      {message && (
        <div className="flex flex-col items-center gap-3 rounded-lg bg-success-50 px-4 py-5 text-center">
          <svg className="h-8 w-8 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
          </svg>
          <p className="text-sm font-medium text-success-700">{message}</p>
          <Link href="/login" className="text-xs font-medium text-primary-600 hover:text-primary-700">
            Continue to sign in →
          </Link>
        </div>
      )}

      {/* Form */}
      {!message && (
        <form onSubmit={submit} className="flex flex-col gap-5">
          <Input
            label="Verification token"
            name="token"
            autoComplete="off"
            placeholder="Paste your token here"
            value={token}
            onChange={(e) => setToken(e.currentTarget.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Verifying\u2026" : "Verify Email"}
          </Button>
        </form>
      )}

      {/* Footer */}
      <p className="text-center text-xs text-neutral-500">
        Didn&apos;t receive a token?{" "}
        <button
          type="button"
          className="font-medium text-primary-600 hover:text-primary-700"
          onClick={() => alert("Resend flow not implemented yet.")}
        >
          Resend
        </button>
      </p>
    </div>
  );
}

