'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';

interface ContentDistributorProps {
  postId: string;
  onDistribute: (channels: string[]) => Promise<void>;
}

export function ContentDistributor({ postId, onDistribute }: ContentDistributorProps) {
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [isDistributing, setIsDistributing] = useState(false);

  const channels = [
    { id: 'email', name: 'Email Newsletter', icon: 'mail' },
    { id: 'facebook', name: 'Facebook', icon: 'facebook' },
    { id: 'twitter', name: 'Twitter', icon: 'twitter' },
    { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin' },
    { id: 'instagram', name: 'Instagram', icon: 'instagram' },
  ];

  const toggleChannel = (channelId: string) => {
    setSelectedChannels(prev =>
      prev.includes(channelId)
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    );
  };

  const handleDistribute = async () => {
    if (selectedChannels.length === 0) return;
    
    setIsDistributing(true);
    try {
      await onDistribute(selectedChannels);
    } finally {
      setIsDistributing(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Distribute Content</h3>
      
      <div className="space-y-3 mb-6">
        {channels.map(channel => (
          <label
            key={channel.id}
            className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <input
              type="checkbox"
              checked={selectedChannels.includes(channel.id)}
              onChange={() => toggleChannel(channel.id)}
              className="w-4 h-4"
            />
            <Icon name={channel.icon as any} className="w-5 h-5 text-gray-600" />
            <span className="font-medium">{channel.name}</span>
          </label>
        ))}
      </div>

      <Button
        onClick={handleDistribute}
        disabled={selectedChannels.length === 0 || isDistributing}
        className="w-full"
      >
        {isDistributing ? 'Distributing...' : `Distribute to ${selectedChannels.length} Channel${selectedChannels.length !== 1 ? 's' : ''}`}
      </Button>
    </Card>
  );
}
