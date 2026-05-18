'use client';

import { useEffect, useState } from 'react';
import PromoCodeManager from '@/components/marketing/PromoCodeManager';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function PromoCodesPage() {
  const [organizerId, setOrganizerId] = useState<string>('');

  useEffect(() => {
    // Get user ID from cookies
    const cookies = document.cookie.split(";");
    const userIdCookie = cookies.find((c) => c.trim().startsWith("user_id="));
    
    if (userIdCookie) {
      const id = userIdCookie.split("=")[1];
      setOrganizerId(id);
    }
  }, []);

  if (!organizerId) {
    return <div>Loading...</div>;
  }

  return (
    <ProtectedRoute allowRoles={['organiser']}>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Promo Codes</h1>
        <PromoCodeManager organizerId={organizerId} />
      </div>
    </ProtectedRoute>
  );
}
