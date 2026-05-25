'use client';

import { useState } from 'react';
import { ArrowLeft, Shield, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/ToastProvider';

export default function AdminForgotPasswordPage() {
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSent(true);
      } else {
        const data = await response.json();
        addToast(data.error || 'Failed to send reset email', { type: 'error' });
      }
    } catch {
      addToast('Network error. Please try again.', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">Reset Access Key</h1>
          <p className="text-sm text-slate-400 mt-2">
            Enter your admin email to receive reset instructions
          </p>
        </div>

        <Card className="p-8 bg-[#12121a] border-slate-800">
          {sent ? (
            <div className="text-center py-6">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Email Sent!</h3>
              <p className="text-sm text-slate-400 mb-6">
                If an admin account exists with that email, you will receive reset instructions.
              </p>
              <Link
                href="/admin/login"
                className="text-sm font-medium text-primary-500 hover:text-primary-400"
              >
                Back to Admin Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Admin Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@guestly.com"
                required
                className="bg-[#1a1a24] border-slate-700"
              />

              <Button type="submit" className="w-full" loading={loading}>
                Send Reset Instructions
              </Button>
            </form>
          )}
        </Card>

        <div className="mt-8 text-center">
          <Link
            href="/admin/login"
            className="text-xs font-bold text-slate-500 hover:text-slate-300 uppercase tracking-[0.2em] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 inline mr-1" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
