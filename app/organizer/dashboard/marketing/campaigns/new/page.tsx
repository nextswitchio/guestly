'use client';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import CampaignNew from '@/components/marketing/CampaignNew';

export default function NewCampaignPage() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button
          onClick={() => router.back()}
          variant="outline"
        >
          <Icon name="arrow-left" size={16} />
          Back
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Create Campaign</h1>
          <p className="text-neutral-500 mt-1">Set up a new marketing campaign</p>
        </div>
      </div>
      <CampaignNew />
    </div>
  );
}
