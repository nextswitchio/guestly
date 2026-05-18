'use client';

import { useEffect, useState } from 'react';
import ReferralDashboard from '@/components/marketing/ReferralDashboard';

export default function ReferralsPage() {
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const cookies = document.cookie.split(";");
    const userIdCookie = cookies.find((c) => c.trim().startsWith("user_id="));

    if (userIdCookie) {
      const id = userIdCookie.split("=")[1];
      setUserId(id);
    }
  }, []);

  if (!userId) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse text-neutral-400">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">My Referrals</h1>
        <p className="mt-2 text-neutral-500">Invite friends and earn rewards</p>
      </div>
      <ReferralDashboard userId={userId} />
    </>
  );
}
