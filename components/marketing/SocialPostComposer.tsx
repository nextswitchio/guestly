'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Input } from '@/components/ui/Input';
import { Icon } from '@/components/ui/Icon';

interface SocialPostComposerProps {
  eventId?: string;
  eventTitle?: string;
  eventImage?: string;
  onPost?: (result: any) => void;
  onCancel?: () => void;
}

type Platform = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok';

const platformLimits = {
  facebook: { chars: 63206, label: 'Facebook', icon: 'facebook' },
  instagram: { chars: 2200, label: 'Instagram', icon: 'instagram' },
  twitter: { chars: 280, label: 'Twitter / X', icon: 'twitter' },
  linkedin: { chars: 3000, label: 'LinkedIn', icon: 'linkedin' },
  tiktok: { chars: 2200, label: 'TikTok', icon: 'video' },
};

export default function SocialPostComposer({
  eventId,
  eventTitle,
  eventImage,
  onPost,
  onCancel,
}: SocialPostComposerProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['facebook', 'twitter']);
  const [content, setContent] = useState(
    eventTitle ? `Excited to announce: ${eventTitle}!\n\nGet your tickets now!` : ''
  );
  const [hashtags, setHashtags] = useState('#Events #Guestly');
  const [imageUrl, setImageUrl] = useState(eventImage || '');
  const [scheduleDate, setScheduleDate] = useState('');
  const [posting, setPosting] = useState(false);

  const togglePlatform = (platform: Platform) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const getCharacterCount = () => {
    const fullText = `${content}\n\n${hashtags}`.trim();
    return fullText.length;
  };

  const getCharacterLimit = () => {
    if (selectedPlatforms.length === 0) return 0;
    return Math.min(...selectedPlatforms.map((p) => platformLimits[p].chars));
  };

  const isOverLimit = () => {
    const limit = getCharacterLimit();
    return limit > 0 && getCharacterCount() > limit;
  };

  const handlePost = async () => {
    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform');
      return;
    }

    if (isOverLimit()) {
      alert('Post exceeds character limit for selected platforms');
      return;
    }

    try {
      setPosting(true);
      const fullContent = `${content}\n\n${hashtags}`.trim();

      const response = await fetch('/api/social/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platforms: selectedPlatforms,
          content: fullContent,
          imageUrl: imageUrl || undefined,
          eventId: eventId || undefined,
          scheduledAt: scheduleDate ? new Date(scheduleDate).getTime() : undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onPost?.(data);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to post to social media');
      }
    } catch (error) {
      console.error('Failed to post:', error);
      alert('Failed to post to social media');
    } finally {
      setPosting(false);
    }
  };

  const charCount = getCharacterCount();
  const charLimit = getCharacterLimit();
  const overLimit = isOverLimit();

  return (
    <div className="space-y-6">
      {/* Platform Selection */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Select Platforms</h3>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(platformLimits) as Platform[]).map((platform) => {
            const config = platformLimits[platform];
            const selected = selectedPlatforms.includes(platform);
            return (
              <button
                key={platform}
                onClick={() => togglePlatform(platform)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  selected
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              >
                <Icon name={config.icon as any} className="w-4 h-4" />
                <span className="text-sm font-medium">{config.label}</span>
                {selected && <Icon name="check" className="w-4 h-4" />}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Content Editor */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Post Content</h3>
          <div className={`text-sm ${overLimit ? 'text-danger-500' : 'text-gray-500'}`}>
            {charCount} / {charLimit > 0 ? charLimit : '∞'} characters
          </div>
        </div>
        
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening with your event?"
          rows={6}
          className={overLimit ? 'border-danger-500' : ''}
        />

        <div className="mt-4">
          <Input
            label="Hashtags"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            placeholder="#Events #Guestly #YourCity"
          />
        </div>

        {overLimit && (
          <div className="mt-2 flex items-center gap-2 text-sm text-danger-500">
            <Icon name="alert-triangle" className="w-4 h-4" />
            <span>
              Post exceeds character limit for{' '}
              {selectedPlatforms
                .filter((p) => charCount > platformLimits[p].chars)
                .map((p) => platformLimits[p].label)
                .join(', ')}
            </span>
          </div>
        )}
      </Card>

      {/* Media */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Media</h3>
        <Input
          label="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
        {imageUrl && (
          <div className="mt-4">
            <img
              src={imageUrl}
              alt="Post preview"
              className="w-full max-w-md rounded-lg"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/600x400?text=Invalid+Image';
              }}
            />
          </div>
        )}
      </Card>

      {/* Scheduling */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Schedule</h3>
        <div className="flex gap-4">
          <Button
            variant={!scheduleDate ? 'primary' : 'outline'}
            onClick={() => setScheduleDate('')}
          >
            <Icon name="play" className="w-4 h-4 mr-2" />
            Post Now
          </Button>
          <Button
            variant={scheduleDate ? 'primary' : 'outline'}
            onClick={() => {
              if (!scheduleDate) {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(10, 0, 0, 0);
                setScheduleDate(tomorrow.toISOString().slice(0, 16));
              }
            }}
          >
            <Icon name="clock" className="w-4 h-4 mr-2" />
            Schedule
          </Button>
        </div>
        {scheduleDate && (
          <div className="mt-4">
            <Input
              type="datetime-local"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              label="Scheduled Date & Time"
            />
          </div>
        )}
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button variant="outline" onClick={onCancel} disabled={posting}>
            Cancel
          </Button>
        )}
        <Button onClick={handlePost} disabled={posting || selectedPlatforms.length === 0 || overLimit}>
          {posting ? (
            <>
              <Icon name="loader" className="w-5 h-5 mr-2 animate-spin" />
              Posting...
            </>
          ) : scheduleDate ? (
            <>
              <Icon name="clock" className="w-4 h-4 mr-2" />
              Schedule Post
            </>
          ) : (
            <>
              <Icon name="send" className="w-4 h-4 mr-2" />
              Post Now
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
