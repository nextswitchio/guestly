'use client';
import { Check, Star } from 'lucide-react';

import { Card } from '@/components/ui/Card';

interface OrganizerStats {
  name: string;
  verified: boolean;
  totalEvents: number;
  totalAttendees: number;
  averageRating: number;
  memberSince: number;
}

interface OrganizerCredibilityProps {
  stats: OrganizerStats;
}

export function OrganizerCredibility({ stats }: OrganizerCredibilityProps) {
  const memberYears = Math.floor((Date.now() - stats.memberSince) / (365 * 24 * 60 * 60 * 1000));

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold">{stats.name}</h3>
          <p className="text-sm text-gray-600">Event Organizer</p>
        </div>
        {stats.verified && (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full flex items-center gap-1">
            <span><Check className="h-4 w-4 inline-block" /></span> Verified
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{stats.totalEvents}</p>
          <p className="text-xs text-gray-600 mt-1">Events Hosted</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-purple-600">
            {stats.totalAttendees.toLocaleString()}
          </p>
          <p className="text-xs text-gray-600 mt-1">Total Attendees</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-sm ${
                  i < Math.round(stats.averageRating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                <Star className="h-4 w-4 inline-block" />
              </span>
            ))}
          </div>
          <span className="text-sm font-semibold">{stats.averageRating.toFixed(1)}</span>
        </div>
        <p className="text-xs text-gray-600">
          Member for {memberYears} {memberYears === 1 ? 'year' : 'years'}
        </p>
      </div>
    </Card>
  );
}
