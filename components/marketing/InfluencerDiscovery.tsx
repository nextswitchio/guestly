'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';

interface Influencer {
  id: string;
  name: string;
  username: string;
  avatar: string;
  platform: 'instagram' | 'twitter' | 'tiktok' | 'youtube';
  followers: number;
  engagementRate: number;
  niche: string[];
  location: string;
  averageReach: number;
  verified: boolean;
}

interface InfluencerDiscoveryProps {
  organizerId: string;
  onInvite: (influencerId: string) => void;
}

export function InfluencerDiscovery({ organizerId, onInvite }: InfluencerDiscoveryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    platform: 'all',
    minFollowers: '',
    maxFollowers: '',
    niche: 'all',
    location: 'all',
  });
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      // Mock search - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setInfluencers([
        {
          id: '1',
          name: 'Sarah Johnson',
          username: '@sarahjohnson',
          avatar: '/avatars/sarah.jpg',
          platform: 'instagram',
          followers: 125000,
          engagementRate: 4.2,
          niche: ['lifestyle', 'events', 'entertainment'],
          location: 'Lagos, Nigeria',
          averageReach: 52000,
          verified: true,
        },
        {
          id: '2',
          name: 'David Okonkwo',
          username: '@davidokonkwo',
          avatar: '/avatars/david.jpg',
          platform: 'twitter',
          followers: 89000,
          engagementRate: 3.8,
          niche: ['tech', 'events', 'business'],
          location: 'Nairobi, Kenya',
          averageReach: 34000,
          verified: false,
        },
      ]);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getPlatformIcon = (platform: string) => {
    const icons = {
      instagram: 'instagram',
      twitter: 'twitter',
      tiktok: 'music',
      youtube: 'youtube',
    };
    return icons[platform as keyof typeof icons] || 'user';
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Discover Influencers</h3>

        {/* Search Bar */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, username, or niche..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              onKeyPress={e => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <select
            value={filters.platform}
            onChange={e => setFilters({ ...filters, platform: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Platforms</option>
            <option value="instagram">Instagram</option>
            <option value="twitter">Twitter</option>
            <option value="tiktok">TikTok</option>
            <option value="youtube">YouTube</option>
          </select>

          <input
            type="number"
            value={filters.minFollowers}
            onChange={e => setFilters({ ...filters, minFollowers: e.target.value })}
            placeholder="Min followers"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />

          <input
            type="number"
            value={filters.maxFollowers}
            onChange={e => setFilters({ ...filters, maxFollowers: e.target.value })}
            placeholder="Max followers"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />

          <select
            value={filters.niche}
            onChange={e => setFilters({ ...filters, niche: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Niches</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="entertainment">Entertainment</option>
            <option value="tech">Tech</option>
            <option value="business">Business</option>
            <option value="food">Food & Dining</option>
          </select>

          <select
            value={filters.location}
            onChange={e => setFilters({ ...filters, location: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Locations</option>
            <option value="lagos">Lagos</option>
            <option value="abuja">Abuja</option>
            <option value="accra">Accra</option>
            <option value="nairobi">Nairobi</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="p-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse flex gap-4 p-4 border border-gray-200 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : influencers.length > 0 ? (
          <div className="space-y-4">
            {influencers.map(influencer => (
              <div
                key={influencer.id}
                className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
                    {influencer.avatar && (
                      <img src={influencer.avatar} alt={influencer.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-white">
                    <Icon name={getPlatformIcon(influencer.platform) as any} className="w-3 h-3 text-gray-600" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-base font-semibold text-gray-900">{influencer.name}</h4>
                    {influencer.verified && (
                      <Icon name="check-circle" className="w-4 h-4 text-primary-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{influencer.username}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <span className="flex items-center gap-1">
                      <Icon name="users" className="w-4 h-4" />
                      {formatNumber(influencer.followers)} followers
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="trending-up" className="w-4 h-4" />
                      {influencer.engagementRate}% engagement
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="map-pin" className="w-4 h-4" />
                      {influencer.location}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {influencer.niche.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatNumber(influencer.averageReach)}
                    </div>
                    <div className="text-xs text-gray-500">avg. reach</div>
                  </div>
                  <button
                    onClick={() => onInvite(influencer.id)}
                    className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
                  >
                    Invite
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Icon name="search" className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 mb-2">No influencers found</p>
            <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
