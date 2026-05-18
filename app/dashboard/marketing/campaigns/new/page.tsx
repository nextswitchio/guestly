'use client';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import CampaignNew from '@/components/marketing/CampaignNew';

export default function NewCampaignPage() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          <Icon name="arrow-left" size={16} />
          Back
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Create Campaign</h1>
          <p className="text-neutral-500 mt-1">Set up a new marketing campaign</p>
        </div>
      </div>
      <CampaignNew />
    </div>
  );
}
