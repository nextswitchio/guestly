"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState<"attendee" | "organiser">("attendee");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = (await res.json()) as { ok: boolean; role: "attendee" | "organiser"; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "Invalid credentials. Please try again.");
        return;
      }
      if (data.role === "organiser") router.replace("/dashboard");
      else router.replace("/attendee");
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
        <h1 className="text-xl font-bold tracking-tight text-neutral-900">Welcome back</h1>
        <p className="mt-1 text-sm text-neutral-500">Sign in to your Guestly account</p>
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

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-xs text-red-600">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={submit} className="flex flex-col gap-5">
        <Input
          label="Email"
          type="email"
          name="email"
          autoComplete="username"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          required
        />
        <div>
          <Input
            label="Password"
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            required
          />
          <div className="mt-1.5 text-right">
            <Link
              href="/forgot-password"
              className="text-xs text-primary-600 hover:text-primary-700"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in\u2026" : "Sign in"}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-xs text-neutral-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-primary-600 hover:text-primary-700">
          Create one
        </Link>
      </p>
    </div>
  );
}
