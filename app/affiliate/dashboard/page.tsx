'use client';

import { useEffect, useState } from 'react';
import AffiliateDashboard from '@/components/marketing/AffiliateDashboard';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AffiliateDashboardPage() {
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user?.id) {
          setUserId(data.user.id);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <ProtectedRoute allowRoles={['attendee', 'organiser']}>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Affiliate Dashboard</h1>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : userId ? (
          <AffiliateDashboard userId={userId} />
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400">Unable to load dashboard</p>
        )}
      </div>
    </ProtectedRoute>
  );
}
