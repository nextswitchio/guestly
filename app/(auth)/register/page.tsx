"use client";
import React from "react";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [role, setRole] = React.useState<"attendee" | "organiser">("attendee");
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
        body: JSON.stringify({ name, email, password, role }),
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
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-xl font-bold tracking-tight text-neutral-900">Create your account</h1>
        <p className="mt-1 text-sm text-neutral-500">Join Guestly and start exploring events</p>
      </div>

      {/* Role toggle */}
      <div className="flex rounded-lg bg-neutral-100 p-1">
        {(["attendee", "organiser"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`flex-1 rounded-md py-2 text-xs font-semibold transition-all duration-200 ${role === r
                ? "bg-white text-neutral-900 shadow-sm ring-1 ring-black/5"
                : "text-neutral-500 hover:bg-white/50 hover:text-neutral-700"
              }`}
          >
            {r === "attendee" ? "Attendee" : "Organiser"}
          </button>
        ))}
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
          label="Full name"
          name="name"
          autoComplete="name"
          placeholder="Jane Doe"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          required
        />
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
        <Input
          label="Password"
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          required
        />
        <Input
          label="Confirm password"
          type="password"
          name="confirm-password"
          autoComplete="new-password"
          placeholder="••••••••"
          value={confirm}
          onChange={(e) => setConfirm(e.currentTarget.value)}
          required
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account\u2026" : "Create Account"}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-xs text-neutral-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary-600 hover:text-primary-700">
          Sign in
        </Link>
      </p>
    </div>
  );
}

