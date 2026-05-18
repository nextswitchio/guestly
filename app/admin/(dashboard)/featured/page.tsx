import React from 'react';
import FeaturedPlacementManager from '@/components/admin/FeaturedPlacementManager';

export default function AdminFeaturedPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Featured Event Placements</h1>
        <p className="text-[var(--foreground-muted)] mt-1">
          Manage featured event placements and sponsorship revenue
        </p>
      </div>
      
      <FeaturedPlacementManager />
    </div>
  );
}