'use client';

import { useState } from 'react';
import { Users, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/ToastProvider';

export default function AffiliateRegisterPage() {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: formData.name, email: formData.email, phone: formData.phone, password: formData.password, role: 'affiliate' }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const data = await response.json();
        addToast(data.error || 'Registration failed', { type: 'error' });
        setLoading(false);
      }
    } catch {
      addToast('Network error. Please try again.', { type: 'error' });
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <Card className="p-8 sm:p-12 max-w-md w-full text-center rounded-2xl border-neutral-200 shadow-sm">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Registration Successful!
          </h1>
          <p className="text-neutral-500 mb-6">
            Welcome to the Guestly Affiliate Program. Check your email for next steps.
          </p>
          <Button href="/affiliate-auth/login" className="w-full">
            Sign In to Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-lime/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-lime" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900">
            Join the Affiliate Program
          </h1>
          <p className="text-lg text-neutral-500 mt-2">
            Earn commission by referring events to your network
          </p>
        </div>

        <Card className="p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your full name"
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              required
            />
            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+234 800 000 0000"
              required
            />
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Create a strong password"
              required
            />

            <Button type="submit" className="w-full" loading={loading}>
              Create Affiliate Account
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-500">
              Already have an account?{' '}
              <Link href="/affiliate-auth/login" className="text-lime font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
