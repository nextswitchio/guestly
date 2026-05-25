'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Input } from '@/components/ui/Input';
import { Icon } from '@/components/ui/Icon';
import CloudinaryUploadField from '@/components/ui/CloudinaryUploadField';
import { useToast } from '@/components/ui/ToastProvider';

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
  const { addToast } = useToast();
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
      addToast('Please select at least one platform', { type: 'warning' });
      return;
    }

    if (isOverLimit()) {
      addToast('Post exceeds character limit for selected platforms', { type: 'warning' });
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
        addToast(error.error || 'Failed to post to social media', { type: 'error' });
      }
    } catch (error) {
      console.error('Failed to post:', error);
      addToast('Failed to post to social media', { type: 'error' });
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
                    ? 'border-lime bg-lime/10 text-lime'
                    : 'border-neutral-200 hover:border-neutral-300'
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
          <div className={`text-sm ${overLimit ? 'text-red-500' : 'text-neutral-500'}`}>
            {charCount} / {charLimit > 0 ? charLimit : '∞'} characters
          </div>
        </div>
        
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening with your event?"
          rows={6}
          className={overLimit ? 'border-red-500' : ''}
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
          <div className="mt-2 flex items-center gap-2 text-sm text-red-500">
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
        <CloudinaryUploadField
          label="Post Image"
          value={imageUrl}
          onChange={setImageUrl}
          folder="guestly/marketing/social"
          accept="image/*"
          placeholder="Upload post image"
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
        <Button onClick={handlePost} loading={posting} disabled={posting || selectedPlatforms.length === 0 || overLimit}>
          {scheduleDate ? (
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
