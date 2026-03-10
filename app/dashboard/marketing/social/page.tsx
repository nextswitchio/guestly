'use client';

import { useState, useEffect } from 'react';
import { SocialMediaConnector } from '@/components/marketing/SocialMediaConnector';
import SocialPostComposer from '@/components/marketing/SocialPostComposer';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card } from '@/components/ui/Card';

export default function SocialMediaPage() {
  const [organizerId, setOrganizerId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get organizer ID from auth
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
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowRoles={['organiser']}>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Social Media Management</h1>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Connected Accounts</h2>
          <SocialMediaConnector organizerId={organizerId} />
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Create Post</h2>
          <SocialPostComposer />
        </Card>
      </div>
    </ProtectedRoute>
  );
}
