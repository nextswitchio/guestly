'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Icon } from '@/components/ui/Icon';

interface ReferralLinkGeneratorProps {
  userId: string;
  eventId?: string;
}

export default function ReferralLinkGenerator({ userId, eventId }: ReferralLinkGeneratorProps) {
  const [selectedEventId, setSelectedEventId] = useState(eventId || '');
  const [referralLink, setReferralLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateLink = async () => {
    if (!selectedEventId) {
      alert('Please enter an event ID');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/referrals/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, eventId: selectedEventId }),
      });

      if (response.ok) {
        const data = await response.json();
        setReferralLink(data.referralLink.url);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to generate referral link');
      }
    } catch (error) {
      console.error('Failed to generate referral link:', error);
      alert('Failed to generate referral link');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareVia = (platform: string) => {
    const encodedUrl = encodeURIComponent(referralLink);
    const text = encodeURIComponent('Check out this event!');

    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${text}%20${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${text}`,
      email: `mailto:?subject=${text}&body=${encodedUrl}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank');
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Generate Referral Link</h3>

      <div className="space-y-4">
        {/* Event ID Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Enter Event ID"
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="flex-1"
          />
          <Button onClick={generateLink} disabled={loading || !selectedEventId}>
            {loading ? (
              <Icon name="loader" className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Icon name="link" className="w-5 h-5 mr-2" />
                Generate
              </>
            )}
          </Button>
        </div>

        {/* Generated Link */}
        {referralLink && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={referralLink}
                readOnly
                className="flex-1 font-mono text-sm"
              />
              <Button variant="outline" onClick={copyToClipboard}>
                <Icon name={copied ? 'check' : 'copy'} className="w-5 h-5" />
              </Button>
            </div>

            {/* Share Buttons */}
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Share via:</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareVia('whatsapp')}
                  className="flex items-center gap-2"
                >
                  <Icon name="message-circle" className="w-4 h-4 text-green-600" />
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareVia('facebook')}
                  className="flex items-center gap-2"
                >
                  <Icon name="facebook" className="w-4 h-4" />
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareVia('twitter')}
                  className="flex items-center gap-2"
                >
                  <Icon name="twitter" className="w-4 h-4" />
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareVia('email')}
                  className="flex items-center gap-2"
                >
                  <Icon name="mail" className="w-4 h-4 text-gray-600" />
                  Email
                </Button>
              </div>
            </div>

            {/* Success Message */}
            {copied && (
              <div className="flex items-center gap-2 text-sm text-success-500">
                <Icon name="check-circle" className="w-4 h-4" />
                <span>Link copied to clipboard!</span>
              </div>
            )}
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex gap-3">
            <Icon name="info" className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">Referral Tips</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Share your link on social media for maximum reach</li>
                <li>Personalize your message when sharing with friends</li>
                <li>Track your earnings in the stats section below</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
