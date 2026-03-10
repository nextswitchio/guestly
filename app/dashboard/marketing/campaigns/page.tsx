'use client';

import CampaignDashboard from '@/components/marketing/CampaignDashboard';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function CampaignsPage() {
  return (
    <ProtectedRoute allowRoles={['organiser']}>
      <div className="p-6">
        <CampaignDashboard />
      </div>
    </ProtectedRoute>
  );
}
