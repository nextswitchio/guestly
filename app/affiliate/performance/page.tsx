'use client';

import AffiliatePerformance from '@/components/marketing/AffiliatePerformance';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AffiliatePerformancePage() {
  return (
    <ProtectedRoute allowRoles={['attendee', 'organiser']}>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Performance Metrics</h1>
        <AffiliatePerformance />
      </div>
    </ProtectedRoute>
  );
}
