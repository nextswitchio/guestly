'use client';

import ReferralDashboard from '@/components/marketing/ReferralDashboard';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ReferralsPage() {
  return (
    <ProtectedRoute allowRoles={['attendee']}>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">My Referrals</h1>
        <ReferralDashboard />
      </div>
    </ProtectedRoute>
  );
}
