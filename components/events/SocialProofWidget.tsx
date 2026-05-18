'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';

interface SocialProofData {
  ticketsSold: number;
  totalCapacity: number;
  recentPurchases: Array<{
    name: string;
    city: string;
    timestamp: number;
  }>;
  averageRating: number;
  totalReviews: number;
  organizerStats: {
    totalEvents: number;
    totalAttendees: number;
    verified: boolean;
  };
}

interface SocialProofWidgetProps {
  eventId: string;
}

export function SocialProofWidget({ eventId }: SocialProofWidgetProps) {
  const [data, setData] = useState<SocialProofData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/social-proof/${eventId}`);
        if (res.ok) {
          setData(await res.json());
        }
      } catch (error) {
        console.error('Failed to fetch social proof data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, [eventId]);

  if (!data) return null;

  const percentageSold = (data.ticketsSold / data.totalCapacity) * 100;

  return (
    <div className="space-y-4">
      {/* Tickets Sold Counter */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Tickets Sold</p>
            <p className="text-2xl font-bold text-blue-600">
              {data.ticketsSold.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Capacity</p>
            <p className="text-lg font-semibold">{data.totalCapacity.toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(percentageSold, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {percentageSold.toFixed(1)}% sold
          </p>
        </div>
      </Card>

      {/* Reviews & Rating */}
      {data.totalReviews > 0 && (
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Icon
                  key={i}
                  name="star"
                  className={i < Math.round(data.averageRating) ? 'text-yellow-400 w-4 h-4' : 'text-gray-300 w-4 h-4'}
                />
              ))}
            </div>
            <span className="font-semibold">{data.averageRating.toFixed(1)}</span>
            <span className="text-sm text-gray-600">
              ({data.totalReviews} reviews)
            </span>
          </div>
        </Card>
      )}

      {/* Organizer Credibility */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <h4 className="font-semibold">Organizer</h4>
          {data.organizerStats.verified && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1">
              <Icon name="check" className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-600">Events Hosted</p>
            <p className="font-semibold">{data.organizerStats.totalEvents}</p>
          </div>
          <div>
            <p className="text-gray-600">Total Attendees</p>
            <p className="font-semibold">{data.organizerStats.totalAttendees.toLocaleString()}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
