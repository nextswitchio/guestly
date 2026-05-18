'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import type { Channel } from '@/lib/marketing';

interface ChannelSelectorProps {
  selectedChannels: Channel[];
  onChange: (channels: Channel[]) => void;
}

type ChannelType = Channel['type'];

interface ChannelOption {
  type: ChannelType;
  label: string;
  description: string;
  icon: string;
  color: string;
}

const channelOptions: ChannelOption[] = [
  {
    type: 'email',
    label: 'Email',
    description: 'Send email campaigns to your audience',
    icon: 'mail',
    color: 'text-blue-500',
  },
  {
    type: 'sms',
    label: 'SMS',
    description: 'Reach users via text messages',
    icon: 'message-square',
    color: 'text-green-500',
  },
  {
    type: 'whatsapp',
    label: 'WhatsApp',
    description: 'Send rich media messages on WhatsApp',
    icon: 'message-circle',
    color: 'text-green-600',
  },
  {
    type: 'push',
    label: 'Push Notifications',
    description: 'Send push notifications to app users',
    icon: 'bell',
    color: 'text-purple-500',
  },
  {
    type: 'facebook',
    label: 'Facebook',
    description: 'Post to Facebook pages and groups',
    icon: 'facebook',
    color: 'text-blue-600',
  },
  {
    type: 'twitter',
    label: 'Twitter',
    description: 'Tweet to your Twitter followers',
    icon: 'twitter',
    color: 'text-sky-500',
  },
  {
    type: 'linkedin',
    label: 'LinkedIn',
    description: 'Share on LinkedIn company pages',
    icon: 'linkedin',
    color: 'text-blue-700',
  },
  {
    type: 'instagram',
    label: 'Instagram',
    description: 'Post to Instagram feed and stories',
    icon: 'instagram',
    color: 'text-pink-500',
  },
  {
    type: 'tiktok',
    label: 'TikTok',
    description: 'Create TikTok videos and posts',
    icon: 'video',
    color: 'text-gray-900 dark:text-white',
  },
];

export default function ChannelSelector({ selectedChannels, onChange }: ChannelSelectorProps) {
  const isChannelSelected = (type: ChannelType) => {
    return selectedChannels.some((channel) => channel.type === type);
  };

  const toggleChannel = (type: ChannelType) => {
    if (isChannelSelected(type)) {
      onChange(selectedChannels.filter((channel) => channel.type !== type));
    } else {
      onChange([
        ...selectedChannels,
        {
          type,
          enabled: true,
          config: {},
        },
      ]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {selectedChannels.length} channel{selectedChannels.length !== 1 ? 's' : ''} selected
        </p>
        {selectedChannels.length > 0 && (
          <button
            onClick={() => onChange([])}
            className="text-sm text-primary-500 hover:text-primary-600"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {channelOptions.map((option) => {
          const selected = isChannelSelected(option.type);
          return (
            <Card
              key={option.type}
              className={`p-4 cursor-pointer transition-all ${
                selected
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              onClick={() => toggleChannel(option.type)}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                    selected ? 'bg-primary-100 dark:bg-primary-900/40' : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  <Icon name={option.icon as any} className={`w-5 h-5 ${option.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold">{option.label}</h4>
                    {selected && (
                      <Icon name="check-circle" className="w-5 h-5 text-primary-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {option.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Channel Configuration */}
      {selectedChannels.length > 0 && (
        <Card className="p-4 mt-6">
          <h4 className="font-semibold mb-3">Selected Channels</h4>
          <div className="space-y-2">
            {selectedChannels.map((channel) => {
              const option = channelOptions.find((opt) => opt.type === channel.type);
              if (!option) return null;
              return (
                <div
                  key={channel.type}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Icon name={option.icon as any} className={`w-5 h-5 ${option.color}`} />
                    <span className="font-medium">{option.label}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleChannel(channel.type);
                    }}
                    className="text-danger-500 hover:text-danger-600"
                  >
                    <Icon name="x" className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
