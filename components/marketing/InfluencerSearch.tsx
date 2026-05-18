'use client';
import { Check } from 'lucide-react';

import { useState } from 'react';
import Button from '@/components/ui/Button';

interface InfluencerSearchProps {
  organizerId: string;
}

interface Influencer {
  id: string;
  name: string;
  handle: string;
  platform: string;
  followers: number;
  engagementRate: number;
  location: string;
  niche: string[];
  averageViews: number;
  verified: boolean;
}

const mockInfluencers: Influencer[] = [
  {
    id: 'inf_1',
    name: 'Chioma Events',
    handle: '@chiomaevents',
    platform: 'Instagram',
    followers: 125000,
    engagementRate: 4.2,
    location: 'Lagos, Nigeria',
    niche: ['Events', 'Lifestyle', 'Entertainment'],
    averageViews: 15000,
    verified: true,
  },
  {
    id: 'inf_2',
    name: 'Kwame Lifestyle',
    handle: '@kwamelifestyle',
    platform: 'TikTok',
    followers: 250000,
    engagementRate: 6.8,
    location: 'Accra, Ghana',
    niche: ['Lifestyle', 'Music', 'Events'],
    averageViews: 45000,
    verified: true,
  },
];

export default function InfluencerSearch({ organizerId }: InfluencerSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    niche: '',
    minFollowers: 0,
    minEngagement: 0,
  });
  const [results, setResults] = useState<Influencer[]>(mockInfluencers);

  const handleSearch = () => {
    let filtered = mockInfluencers;

    if (searchTerm) {
      filtered = filtered.filter(
        (inf) =>
          inf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inf.handle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.location) {
      filtered = filtered.filter((inf) =>
        inf.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.niche) {
      filtered = filtered.filter((inf) =>
        inf.niche.some((n) => n.toLowerCase().includes(filters.niche.toLowerCase()))
      );
    }

    if (filters.minFollowers > 0) {
      filtered = filtered.filter((inf) => inf.followers >= filters.minFollowers);
    }

    if (filters.minEngagement > 0) {
      filtered = filtered.filter((inf) => inf.engagementRate >= filters.minEngagement);
    }

    setResults(filtered);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex gap-3">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name or handle..."
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Location"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
        />
        <input
          type="text"
          placeholder="Niche"
          value={filters.niche}
          onChange={(e) => setFilters({ ...filters, niche: e.target.value })}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
        />
        <input
          type="number"
          placeholder="Min Followers"
          value={filters.minFollowers || ''}
          onChange={(e) => setFilters({ ...filters, minFollowers: parseInt(e.target.value) || 0 })}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
        />
        <input
          type="number"
          placeholder="Min Engagement %"
          value={filters.minEngagement || ''}
          onChange={(e) =>
            setFilters({ ...filters, minEngagement: parseFloat(e.target.value) || 0 })
          }
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
        />
      </div>

      {/* Results */}
      <div className="space-y-4">
        {results.map((influencer) => (
          <div
            key={influencer.id}
            className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {influencer.name}
                  </h3>
                  {influencer.verified && (
                    <span className="text-blue-500"><Check className="h-4 w-4 inline-block" /></span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {influencer.handle} • {influencer.platform}
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {influencer.niche.map((n) => (
                    <span
                      key={n}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                    >
                      {n}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Followers</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {(influencer.followers / 1000).toFixed(0)}K
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Engagement</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {influencer.engagementRate}%
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Avg Views</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {(influencer.averageViews / 1000).toFixed(0)}K
                    </div>
                  </div>
                </div>
              </div>
              <Button size="sm">Invite</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
