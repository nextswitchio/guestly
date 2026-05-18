'use client';

import { useEffect, useState } from 'react';
import PromoCodeManager from '@/components/marketing/PromoCodeManager';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function PromoCodesPage() {
  const [organizerId, setOrganizerId] = useState<string>('');

  useEffect(() => {
    const cookies = document.cookie.split(";");
    const userIdCookie = cookies.find((c) => c.trim().startsWith("user_id="));
    if (userIdCookie) {
      setOrganizerId(userIdCookie.split("=")[1]);
    }
  }, []);

  if (!organizerId) {
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-lime border-t-lime" /></div>;
  }

  return (
    <ProtectedRoute allowRoles={['organiser']}>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Promo Codes</h1>
          <p className="text-neutral-500 mt-1">Create and manage discount codes for your events</p>
        </div>
        <PromoCodeManager organizerId={organizerId} />
      </div>
    </ProtectedRoute>
  );
}
