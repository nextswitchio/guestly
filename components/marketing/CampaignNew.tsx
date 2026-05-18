'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CampaignBuilder from './CampaignBuilder';
import type { Campaign } from '@/lib/marketing';

export default function CampaignNew() {
  const router = useRouter();
  const [organizerId] = useState('org_123');

  const handleComplete = (campaign: Campaign) => {
    router.push('/dashboard/marketing/campaigns');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <CampaignBuilder
      organizerId={organizerId}
      onComplete={handleComplete}
      onCancel={handleCancel}
    />
  );
}
