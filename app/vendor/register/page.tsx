"use client";
import React from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function VendorRegisterPage() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: "vendor" }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Account created! Check your email to verify.");
      } else {
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold tracking-tight text-neutral-900">Create your Vendor account</h1>
          <p className="mt-1 text-sm text-neutral-500">Join Guestly and reach event organisers</p>
        </div>
        {error && <div className="mb-4 rounded-md bg-red-50 p-3 text-xs text-red-600">{error}</div>}
        {message && <div className="mb-4 rounded-md bg-success-50 p-3 text-xs text-success-700">{message}</div>}
        <form onSubmit={submit} className="flex flex-col gap-4">
          <Input label="Business name" placeholder="Acme Security" value={name} onChange={(e) => setName(e.currentTarget.value)} required />
          <Input label="Email" type="email" placeholder="vendor@example.com" value={email} onChange={(e) => setEmail(e.currentTarget.value)} required />
          <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.currentTarget.value)} required />
          <Input label="Confirm password" type="password" placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.currentTarget.value)} required />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account…" : "Create Account"}
          </Button>
        </form>
        <p className="mt-4 text-center text-xs text-neutral-500">
          Already a vendor?{" "}
          <Link href="/vendor/login" className="font-medium text-primary-600 hover:text-primary-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
