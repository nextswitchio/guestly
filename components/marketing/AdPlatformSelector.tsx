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
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    features: ['Detailed targeting', 'Instagram placement', 'Retargeting'],
  },
  {
    id: 'google' as const,
    name: 'Google Ads',
    description: 'Show ads on Google Search and Display Network',
    icon: 'search',
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    features: ['Search ads', 'Display network', 'YouTube ads'],
  },
  {
    id: 'tiktok' as const,
    name: 'TikTok Ads',
    description: 'Engage younger audiences on TikTok',
    icon: 'video',
    color: 'text-gray-900 dark:text-white',
    bgColor: 'bg-gray-50 dark:bg-gray-800',
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
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
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
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-500'
                  : 'hover:border-gray-300 dark:hover:border-gray-600'
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
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {platform.description}
                </p>
                <div className="space-y-1">
                  {platform.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center justify-center gap-1 text-xs text-gray-500"
                    >
                      <Icon name="check" className="w-3 h-3 text-success-500" />
                      {feature}
                    </div>
                  ))}
                </div>
                {isSelected && (
                  <div className="mt-3 flex items-center justify-center gap-1 text-primary-600 dark:text-primary-400 font-medium text-sm">
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
        <Card className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start gap-3">
            <span className="text-xl"><AlertTriangle className="h-4 w-4 inline-block" /></span>
            <div className="text-sm text-yellow-900 dark:text-yellow-100">
              <p className="font-medium">Select a platform to continue</p>
              <p className="mt-1">Choose the advertising platform that best fits your target audience.</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
