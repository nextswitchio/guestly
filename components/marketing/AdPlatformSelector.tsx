'use client';
import { AlertTriangle } from 'lucide-react';

import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';

interface AdPlatformSelectorProps {
  selectedPlatform: 'facebook' | 'google' | 'tiktok' | '';
  onChange: (platform: 'facebook' | 'google' | 'tiktok') => void;
}

const platforms = [
  {
    id: 'facebook' as const,
    name: 'Facebook Ads',
    description: 'Reach users on Facebook and Instagram',
    icon: 'facebook',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    features: ['Detailed targeting', 'Instagram placement', 'Retargeting'],
  },
  {
    id: 'google' as const,
    name: 'Google Ads',
    description: 'Show ads on Google Search and Display Network',
    icon: 'search',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    features: ['Search ads', 'Display network', 'YouTube ads'],
  },
  {
    id: 'tiktok' as const,
    name: 'TikTok Ads',
    description: 'Engage younger audiences on TikTok',
    icon: 'video',
    color: 'text-neutral-900',
    bgColor: 'bg-neutral-50',
    features: ['In-feed ads', 'Branded effects', 'Viral potential'],
  },
];

export default function AdPlatformSelector({
  selectedPlatform,
  onChange,
}: AdPlatformSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Select Ad Platform</label>
        <p className="text-sm text-neutral-500 mb-4">
          Choose where you want to run your ad campaign
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {platforms.map((platform) => {
          const isSelected = selectedPlatform === platform.id;
          return (
            <Card
              key={platform.id}
              className={`p-4 cursor-pointer transition-all ${
                isSelected
                  ? 'border-lime bg-lime/10 ring-2 ring-lime'
                  : 'hover:border-neutral-300'
              }`}
              onClick={() => onChange(platform.id)}
            >
              <div className="text-center">
                <div
                  className={`flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-3 ${platform.bgColor}`}
                >
                  <Icon name={platform.icon as any} className={`w-8 h-8 ${platform.color}`} />
                </div>
                <h4 className="font-semibold mb-1">{platform.name}</h4>
                <p className="text-sm text-neutral-500 mb-3">
                  {platform.description}
                </p>
                <div className="space-y-1">
                  {platform.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center justify-center gap-1 text-xs text-neutral-500"
                    >
                      <Icon name="check" className="w-3 h-3 text-green-500" />
                      {feature}
                    </div>
                  ))}
                </div>
                {isSelected && (
                  <div className="mt-3 flex items-center justify-center gap-1 text-lime font-medium text-sm">
                    <Icon name="check-circle" className="w-4 h-4" />
                    Selected
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {!selectedPlatform && (
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <span className="text-xl"><AlertTriangle className="h-4 w-4 inline-block" /></span>
            <div className="text-sm text-amber-900">
              <p className="font-medium">Select a platform to continue</p>
              <p className="mt-1">Choose the advertising platform that best fits your target audience.</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
