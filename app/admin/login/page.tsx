"use client";
import { ArrowLeft } from 'lucide-react';
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  React.useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me", { method: "GET" });
        if (res.ok) {
          const data = await res.json();
          if (data.user?.role === "admin") {
            router.replace("/admin");
          }
        }
      } catch {
        // Backend not available, skip auth check
      }
    }
    checkAuth();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error || "Invalid credentials");
        setLoading(false);
        return;
      }

      router.replace("/admin");
    } catch {
      setError("Connection failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--surface-bg)] px-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 h-[600px] w-[600px] rounded-full bg-primary-500/5 blur-[120px]" />
        <div className="absolute -bottom-1/4 -left-1/4 h-[600px] w-[600px] rounded-full bg-danger-500/5 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 group mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-lg font-black text-white shadow-xl shadow-primary-500/20 transition-transform group-hover:scale-105">
              G
            </div>
            <span className="text-2xl font-black tracking-tight text-[var(--foreground)] uppercase">Guestly Admin</span>
          </Link>
          <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">System Control</h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-2 font-medium">Enter your credentials to access the terminal.</p>
        </div>

        <Card className="p-8 border-[var(--surface-border)] shadow-2xl dark:bg-[var(--surface-card)]/50 dark:backdrop-blur-xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <Input
                label="Admin Identifier"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
                className="bg-[var(--surface-bg)]"
              />
              <div className="space-y-1">
                <Input
                  label="Secure Access Key"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  required
                  className="bg-[var(--surface-bg)]"
                />
                <div className="flex justify-end">
                  <Link 
                    href="/admin/forgot-password" 
                    className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-500 uppercase tracking-widest"
                  >
                    Reset Key
                  </Link>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-danger-50 p-3 text-xs font-bold text-danger-600 border border-danger-100">
                <Icon name="alert-circle" size={14} />
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="xl"
              className="w-full bg-primary-600 hover:bg-primary-700 shadow-xl shadow-primary-500/10"
              loading={loading}
              glow
            >
              Initialize Access
            </Button>

            <div className="flex items-center gap-2 rounded-xl bg-[var(--surface-bg)] p-4 text-[10px] font-bold text-[var(--foreground-subtle)] uppercase tracking-widest leading-tight">
              <Icon name="shield" size={14} className="text-success-500 shrink-0" />
              This is a restricted area. All access attempts are monitored and recorded.
            </div>
          </form>
        </Card>

        <div className="mt-8 text-center">
          <Link 
            href="/" 
            className="text-xs font-bold text-[var(--foreground-subtle)] hover:text-[var(--foreground)] uppercase tracking-[0.2em] transition-colors"
          >
           <ArrowLeft className="h-4 w-4 inline" /> Back to Public Terminal
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
