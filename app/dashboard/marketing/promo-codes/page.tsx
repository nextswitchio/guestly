'use client';

import PromoCodeManager from '@/components/marketing/PromoCodeManager';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function PromoCodesPage() {
  return (
    <ProtectedRoute allowRoles={['organiser']}>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Promo Codes</h1>
        <PromoCodeManager />
      </div>
    </ProtectedRoute>
  );
}
