'use client';

import AffiliateDashboard from '@/components/marketing/AffiliateDashboard';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AffiliateDashboardPage() {
  return (
    <ProtectedRoute allowRoles={['attendee', 'organiser']}>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Affiliate Dashboard</h1>
        <AffiliateDashboard />
      </div>
    </ProtectedRoute>
  );
}
