'use client';

import { useState, useEffect } from 'react';
import { SocialMediaConnector } from '@/components/marketing/SocialMediaConnector';
import SocialPostComposer from '@/components/marketing/SocialPostComposer';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function SocialMediaPage() {
  const [organizerId, setOrganizerId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.userId) {
          setOrganizerId(data.userId);
        }
      })
      .catch((error) => console.error('Failed to get user:', error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <ProtectedRoute allowRoles={['organiser']}>
        <div className="space-y-8">
          <div className="h-8 bg-neutral-200 rounded-xl w-1/3 animate-pulse" />
          <div className="h-64 bg-neutral-200 rounded-2xl animate-pulse" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowRoles={['organiser']}>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Social Media Management</h1>
          <p className="text-neutral-500 mt-1">Connect accounts and schedule posts across platforms</p>
        </div>
        
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Connected Accounts</h2>
          <SocialMediaConnector organizerId={organizerId} />
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Create Post</h2>
          <SocialPostComposer />
        </div>
      </div>
    </ProtectedRoute>
  );
}
