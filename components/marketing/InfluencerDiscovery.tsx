'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';

interface SocialPlatform {
  platform: 'instagram' | 'twitter' | 'tiktok' | 'youtube';
  handle: string;
  followers: number;
}

interface Influencer {
  id: string;
  displayName: string;
  username: string;
  avatar: string;
  bio: string;
  locationCity: string;
  locationCountry: string;
  interests: string[];
  socialPlatforms: SocialPlatform[];
  totalFollowers: number;
  averageReach: number;
  engagementRate: number;
  verified: boolean;
  website: string;
  createdAt: string;
}

interface InfluencerDiscoveryProps {
  organizerId: string;
  onInvite: (influencerId: string, influencerName: string) => void;
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
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (filters.platform !== 'all') params.set('platform', filters.platform);
      if (filters.minFollowers) params.set('min_followers', filters.minFollowers);
      if (filters.maxFollowers) params.set('max_followers', filters.maxFollowers);
      if (filters.niche !== 'all') params.set('niche', filters.niche);
      if (filters.location !== 'all') params.set('location', filters.location);
      
      const response = await fetch(`/api/influencers/discover?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch influencers');
      }
      
      const data = await response.json();
      
      if (data.users && Array.isArray(data.users)) {
        setInfluencers(data.users);
      } else {
        setInfluencers([]);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setError('Failed to search for influencers. Please try again.');
      setInfluencers([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-search when filters change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (filters.platform !== 'all' || filters.minFollowers || filters.maxFollowers || 
          filters.niche !== 'all' || filters.location !== 'all') {
        handleSearch();
      }
    }, 500);
    
    return () => clearTimeout(debounceTimer);
  }, [filters]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, string> = {
      instagram: 'instagram',
      twitter: 'twitter',
      tiktok: 'music',
      youtube: 'youtube',
    };
    return icons[platform] || 'user';
  };

  const getPrimaryPlatform = (influencer: Influencer) => {
    if (influencer.socialPlatforms && influencer.socialPlatforms.length > 0) {
      // Return the platform with most followers
      return influencer.socialPlatforms.reduce((prev, current) => 
        (prev.followers > current.followers) ? prev : current
      );
    }
    return { platform: 'user', handle: '', followers: 0 };
  };

  return (
    <div className="bg-white rounded-2xl shadow">
      {/* Header */}
      <div className="p-6 border-b border-neutral-200">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Discover Influencers</h3>

        {/* Search Bar */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, username, or niche..."
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-lime/20 focus:border-lime"
              onKeyPress={e => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2 bg-lime text-dark rounded-lg hover:bg-lime/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 mb-4">
            <Icon name="alert-triangle" className="w-4 h-4 text-red-600" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <select
            value={filters.platform}
            onChange={e => setFilters({ ...filters, platform: e.target.value })}
            className="px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-lime/20 focus:border-lime"
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
            className="px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-lime/20 focus:border-lime"
          />

          <input
            type="number"
            value={filters.maxFollowers}
            onChange={e => setFilters({ ...filters, maxFollowers: e.target.value })}
            placeholder="Max followers"
            className="px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-lime/20 focus:border-lime"
          />

          <select
            value={filters.niche}
            onChange={e => setFilters({ ...filters, niche: e.target.value })}
            className="px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-lime/20 focus:border-lime"
          >
            <option value="all">All Niches</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="entertainment">Entertainment</option>
            <option value="tech">Tech</option>
            <option value="business">Business</option>
            <option value="food">Food & Dining</option>
            <option value="sports">Sports</option>
            <option value="travel">Travel</option>
          </select>

          <select
            value={filters.location}
            onChange={e => setFilters({ ...filters, location: e.target.value })}
            className="px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-lime/20 focus:border-lime"
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
        {loading && influencers.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse flex gap-4 p-4 border border-neutral-200 rounded-lg">
                <div className="w-16 h-16 bg-neutral-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
                  <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : influencers.length > 0 ? (
          <div className="space-y-4">
            {influencers.map(influencer => {
              const primaryPlatform = getPrimaryPlatform(influencer);
              
              return (
                <div
                  key={influencer.id}
                  className="flex items-start gap-4 p-4 border border-neutral-200 rounded-lg hover:border-lime transition-colors"
                >
                  <div className="relative">
                    <div className="w-16 h-16 bg-neutral-200 rounded-full overflow-hidden">
                      {influencer.avatar && (
                        <img src={influencer.avatar} alt={influencer.displayName} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-white">
                      <Icon name={getPlatformIcon(primaryPlatform.platform) as any} className="w-3 h-3 text-neutral-500" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-base font-semibold text-gray-900">{influencer.displayName}</h4>
                      {influencer.verified && (
                        <Icon name="check-circle" className="w-4 h-4 text-lime" />
                      )}
                    </div>
                    <p className="text-sm text-neutral-500 mb-2">@{influencer.username}</p>
                    <div className="flex items-center gap-4 text-sm text-neutral-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Icon name="users" className="w-4 h-4" />
                        {formatNumber(influencer.totalFollowers)} followers
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="trending-up" className="w-4 h-4" />
                        {influencer.engagementRate}% engagement
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="map-pin" className="w-4 h-4" />
                        {influencer.locationCity || influencer.locationCountry || 'N/A'}
                      </span>
                    </div>
                    {influencer.interests && influencer.interests.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {influencer.interests.slice(0, 3).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                        {influencer.interests.length > 3 && (
                          <span className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded">
                            +{influencer.interests.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                    <p className="text-sm text-neutral-500 mt-2 line-clamp-2">{influencer.bio}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="text-right">
                      <div className="text-sm font-semibold text-neutral-900">
                        {formatNumber(influencer.averageReach)}
                      </div>
                      <div className="text-xs text-neutral-500">avg. reach</div>
                    </div>
                    <button
                      onClick={() => onInvite(influencer.id, influencer.displayName)}
                      className="px-4 py-2 bg-lime text-dark text-sm rounded-lg hover:bg-lime/80"
                    >
                      Invite
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Icon name="search" className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
            <p className="text-neutral-500 mb-2">No influencers found</p>
            <p className="text-sm text-neutral-400">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
