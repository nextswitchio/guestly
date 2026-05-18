'use client';

import CampaignDashboard from '@/components/marketing/CampaignDashboard';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function CampaignsPage() {
  return (
    <ProtectedRoute allowRoles={['organiser']}>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Campaigns</h1>
          <p className="text-neutral-500 mt-1">Manage and track your marketing campaigns</p>
        </div>
        <CampaignDashboard />
      </div>
    </ProtectedRoute>
  );
}
