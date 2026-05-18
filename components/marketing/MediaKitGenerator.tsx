'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';

interface MediaKitAsset {
  type: 'image' | 'logo' | 'video' | 'document';
  name: string;
  url: string;
  size: string;
  dimensions?: string;
}

interface MediaKitData {
  eventName: string;
  eventDescription: string;
  eventDate: string;
  eventLocation: string;
  organizerName: string;
  organizerBio: string;
  assets: MediaKitAsset[];
  socialHandles: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
  statistics: {
    expectedAttendance: number;
    pastEventCount: number;
    totalAttendees: number;
  };
  copyTemplates: {
    headline: string;
    shortDescription: string;
    socialCaption: string;
    emailTemplate: string;
  };
  downloadUrl?: string;
}

interface MediaKitGeneratorProps {
  organizerId: string;
  eventId: string;
}

export function MediaKitGenerator({ organizerId, eventId }: MediaKitGeneratorProps) {
  const [mediaKit, setMediaKit] = useState<MediaKitData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);

  useEffect(() => {
    fetchMediaKit();
  }, [eventId]);

  const fetchMediaKit = async () => {
    try {
      const response = await fetch(`/api/influencers/media-kit/${eventId}`);
      if (response.ok) {
        const data = await response.json();
        setMediaKit(data);
        // Select all assets by default
        setSelectedAssets(data.assets?.map((a: MediaKitAsset) => a.url) || []);
      }
    } catch (error) {
      console.error('Failed to fetch media kit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateKit = async () => {
    setGenerating(true);
    try {
      const response = await fetch(`/api/influencers/media-kit/${eventId}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedAssets }),
      });

      if (response.ok) {
        const data = await response.json();
        setMediaKit(prev => (prev ? { ...prev, downloadUrl: data.downloadUrl } : null));
      }
    } catch (error) {
      console.error('Failed to generate media kit:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (mediaKit?.downloadUrl) {
      window.open(mediaKit.downloadUrl, '_blank');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const toggleAsset = (url: string) => {
    setSelectedAssets(prev =>
      prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
    );
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'image':
        return 'image';
      case 'logo':
        return 'award';
      case 'video':
        return 'video';
      case 'document':
        return 'file-text';
      default:
        return 'file';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!mediaKit) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 text-center">No media kit data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Media Kit</h3>
            <p className="text-sm text-gray-600 mt-1">
              Professional promotional materials for partners and media
            </p>
          </div>
          <div className="flex gap-2">
            {mediaKit.downloadUrl && (
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 flex items-center gap-2"
              >
                <Icon name="download" className="w-4 h-4" />
                Download Kit
              </button>
            )}
            <button
              onClick={handleGenerateKit}
              disabled={generating || selectedAssets.length === 0}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Icon name="package" className="w-4 h-4" />
              {generating ? 'Generating...' : 'Generate Kit'}
            </button>
          </div>
        </div>

        {/* Event Info */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <div className="text-xs text-gray-600 mb-1">Event</div>
            <div className="text-sm font-medium text-gray-900">{mediaKit.eventName}</div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Date</div>
            <div className="text-sm font-medium text-gray-900">
              {new Date(mediaKit.eventDate).toLocaleDateString()}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Location</div>
            <div className="text-sm font-medium text-gray-900">{mediaKit.eventLocation}</div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Expected Attendance</div>
            <div className="text-sm font-medium text-gray-900">
              {mediaKit.statistics.expectedAttendance.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Assets */}
      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Media Assets</h4>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {mediaKit.assets.map((asset, index) => (
            <label
              key={index}
              className={`relative p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedAssets.includes(asset.url)
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedAssets.includes(asset.url)}
                onChange={() => toggleAsset(asset.url)}
                className="absolute top-3 right-3 w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={getAssetIcon(asset.type)} className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{asset.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{asset.size}</div>
                  {asset.dimensions && (
                    <div className="text-xs text-gray-500">{asset.dimensions}</div>
                  )}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Copy Templates */}
      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Copy Templates</h4>
        <div className="space-y-4">
          {/* Headline */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Headline</label>
              <button
                onClick={() => copyToClipboard(mediaKit.copyTemplates.headline)}
                className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                <Icon name="copy" className="w-3 h-3" />
                Copy
              </button>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-900">
              {mediaKit.copyTemplates.headline}
            </div>
          </div>

          {/* Short Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Short Description</label>
              <button
                onClick={() => copyToClipboard(mediaKit.copyTemplates.shortDescription)}
                className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                <Icon name="copy" className="w-3 h-3" />
                Copy
              </button>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-900">
              {mediaKit.copyTemplates.shortDescription}
            </div>
          </div>

          {/* Social Caption */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Social Media Caption</label>
              <button
                onClick={() => copyToClipboard(mediaKit.copyTemplates.socialCaption)}
                className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                <Icon name="copy" className="w-3 h-3" />
                Copy
              </button>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-900 whitespace-pre-wrap">
              {mediaKit.copyTemplates.socialCaption}
            </div>
          </div>

          {/* Email Template */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Email Template</label>
              <button
                onClick={() => copyToClipboard(mediaKit.copyTemplates.emailTemplate)}
                className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                <Icon name="copy" className="w-3 h-3" />
                Copy
              </button>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-900 whitespace-pre-wrap max-h-48 overflow-y-auto">
              {mediaKit.copyTemplates.emailTemplate}
            </div>
          </div>
        </div>
      </div>

      {/* Social Handles */}
      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Social Media</h4>
        <div className="space-y-2">
          {mediaKit.socialHandles.instagram && (
            <div className="flex items-center gap-3">
              <Icon name="instagram" className="w-5 h-5 text-pink-500" />
              <span className="text-sm text-gray-900">{mediaKit.socialHandles.instagram}</span>
            </div>
          )}
          {mediaKit.socialHandles.twitter && (
            <div className="flex items-center gap-3">
              <Icon name="twitter" className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-900">{mediaKit.socialHandles.twitter}</span>
            </div>
          )}
          {mediaKit.socialHandles.facebook && (
            <div className="flex items-center gap-3">
              <Icon name="facebook" className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-900">{mediaKit.socialHandles.facebook}</span>
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Organizer Statistics</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {mediaKit.statistics.pastEventCount}
            </div>
            <div className="text-xs text-gray-600 mt-1">Past Events</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {mediaKit.statistics.totalAttendees.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600 mt-1">Total Attendees</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {mediaKit.statistics.expectedAttendance.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600 mt-1">Expected Attendance</div>
          </div>
        </div>
      </div>
    </div>
  );
}
